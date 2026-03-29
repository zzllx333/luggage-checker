import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { recognizeLuggage, compressImage } from '../../services/visionService';
import './PhotoCapture.css';

// 返回按钮图标
const BackIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// 相片导入图标
const PhotoImportIcon = () => (
  <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="5" width="20" height="16" rx="2" stroke="white" strokeWidth="2"/>
    <circle cx="9" cy="12" r="2" stroke="white" strokeWidth="1.5"/>
    <path d="M3 17L7 13L11 17L17 11L23 17" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// 正确图标
const CheckIcon = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="7.5" cy="7.5" r="7.5" fill="#22C55E"/>
    <path d="M4.5 7.5L6.5 9.5L10.5 5.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// 模拟图库数据 - 使用真实的行李图片
const MOCK_GALLERY = [
  {
    id: 1,
    // 登机箱
    image: 'https://images.unsplash.com/photo-1547949003-9792a18a2601?w=450&h=800&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1547949003-9792a18a2601?w=400&h=400&fit=crop',
    result: {
      type: '登机箱',
      dimensions: { length: 50, width: 35, height: 22 },
      volume: 38,
      confidence: 0.95
    }
  },
  {
    id: 2,
    // 行李箱
    image: 'https://images.unsplash.com/photo-1581553680321-4fffae59fccd?w=450&h=800&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1581553680321-4fffae59fccd?w=400&h=400&fit=crop',
    result: {
      type: '行李箱',
      dimensions: { length: 65, width: 42, height: 48 },
      volume: 68,
      confidence: 0.93
    }
  },
  {
    id: 3,
    // 大行李箱
    image: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=450&h=800&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=400&h=400&fit=crop',
    result: {
      type: '大行李箱',
      dimensions: { length: 75, width: 50, height: 34 },
      volume: 95,
      confidence: 0.96
    }
  },
  {
    id: 4,
    // 双肩背包
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=450&h=800&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
    result: {
      type: '双肩背包',
      dimensions: { length: 45, width: 30, height: 18 },
      volume: 24,
      confidence: 0.92
    }
  },
  {
    id: 5,
    // 旅行背包
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=450&h=800&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
    result: {
      type: '旅行背包',
      dimensions: { length: 55, width: 35, height: 25 },
      volume: 48,
      confidence: 0.88
    }
  },
  {
    id: 6,
    // 手提旅行袋
    image: 'https://images.unsplash.com/photo-1606503825008-909a67e63c3d?w=450&h=800&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1606503825008-909a67e63c3d?w=400&h=400&fit=crop',
    result: {
      type: '手提旅行袋',
      dimensions: { length: 48, width: 28, height: 26 },
      volume: 35,
      confidence: 0.90
    }
  }
];

const PhotoCapture = () => {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const photoRef = useRef(null);
  const streamRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [showGallery, setShowGallery] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // 启动相机
  useEffect(() => {
    startCamera();
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      setStream(mediaStream);
      streamRef.current = mediaStream;
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error('无法访问相机:', err);
      alert('无法访问相机，请确保已授权相机权限');
    }
  };

  // 拍照并自动开始识别
  const takePhoto = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const photoData = canvas.toDataURL('image/jpeg', 0.8);
    setPhoto(photoData);

    // 停止相机
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }

    // 开始识别
    await startRecognition(photoData);
  };

  // 从模拟图库选择
  const handleGallerySelect = async (item) => {
    setShowGallery(false);
    setPhoto(item.image);

    // 停止相机
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }

    // 模拟扫描动画后显示结果
    setScanning(true);
    setTimeout(() => {
      setResult(item.result);
      setScanning(false);
    }, 2000);
  };

  // 开始识别
  const startRecognition = async (photoData) => {
    setScanning(true);
    setResult(null);
    setError(null);

    try {
      // 压缩图片以加快上传速度
      const compressedPhoto = await compressImage(photoData, 800, 0.8);

      // 调用 AI 识别
      const recognitionResult = await recognizeLuggage(compressedPhoto);

      setResult(recognitionResult);
    } catch (err) {
      console.error('识别失败:', err);
      setError('识别失败，请重试');
    } finally {
      setScanning(false);
    }
  };

  // 重拍
  const retakePhoto = () => {
    setPhoto(null);
    setResult(null);
    setError(null);
    startCamera();
  };

  // 确认结果 - 带过渡动画
  const confirmResult = () => {
    if (!result || isAnimating) return;

    // 开始动画
    setIsAnimating(true);

    // 动画持续 400ms，完成后导航
    setTimeout(() => {
      // 生成唯一ID，用于防止重复添加
      const photoId = Date.now() + '-' + Math.random().toString(36).substr(2, 9);

      navigate('/luggage-checker', {
        state: {
          photoLuggage: {
            image: photo,
            type: result.type,
            dimensions: `${result.dimensions.length}×${result.dimensions.width}×${result.dimensions.height}(cm)`,
            volume: result.volume
          },
          photoId: photoId
        }
      });
    }, 400);
  };

  // 关闭页面
  const handleClose = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    navigate('/luggage-checker');
  };

  return (
    <div className="photo-capture">
      {/* Header */}
      <div className="photo-header">
        <button className="close-btn" onClick={handleClose}>
          <BackIcon />
        </button>
      </div>

      {/* Camera / Photo View */}
      <div className="camera-container">
        {!photo ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="camera-video"
            />
            <div className="camera-hint">对准行李拍照，自动识别</div>
          </>
        ) : (
          <>
            <img src={photo} alt="拍摄的照片" className="captured-photo" />
            {/* 扫描动画遮罩 */}
            {scanning && (
              <div className="scan-overlay">
                <div className="scan-line"></div>
              </div>
            )}
            {/* 识别完成后的渐变蒙层 */}
            {result && !scanning && (
              <div className="result-gradient-overlay"></div>
            )}
          </>
        )}
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>

      {/* Error Message */}
      {error && (
        <div className="error-message">
          <span>{error}</span>
        </div>
      )}

      {/* Recognition Result - 识别结果展示 */}
      {result && !scanning && (
        <div className="recognition-result">
          <div className="result-info">
            <div className="info-row">
              <span className="info-label">识别尺寸</span>
              <span className="info-value">
                <span className="info-unit">约</span>
                <span className="info-number">{result.dimensions.length}×{result.dimensions.width}×{result.dimensions.height}</span>
                <span className="info-unit">cm</span>
              </span>
            </div>
            <div className="info-row">
              <span className="info-label">预计占用容量</span>
              <span className="info-value">
                <span className="info-number">{result.volume}</span>
                <span className="info-unit">升</span>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons - 确认和重拍 */}
      {result && !scanning && (
        <div className="action-buttons">
          <button className="action-btn retake-action-btn" onClick={retakePhoto}>
            重拍
          </button>
          <button className="action-btn confirm-action-btn" onClick={confirmResult}>
            确认
          </button>
        </div>
      )}

      {/* Capture Button */}
      {!photo && !result && (
        <div className="capture-section">
          <button className="capture-btn" onClick={takePhoto}>
            <div className="capture-btn-inner"></div>
          </button>
        </div>
      )}

      {/* Photo Import Button - 右下角相册导入 */}
      {!photo && !result && (
        <button className="photo-import-btn" onClick={() => setShowGallery(true)}>
          <PhotoImportIcon />
        </button>
      )}

      {/* 模拟图库弹窗 */}
      {showGallery && (
        <div className="gallery-modal">
          <div className="gallery-header">
            <span className="gallery-title">选择图片</span>
            <button className="gallery-close" onClick={() => setShowGallery(false)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6L18 18" stroke="#000" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
          <div className="gallery-grid">
            {MOCK_GALLERY.map((item) => (
              <div
                key={item.id}
                className="gallery-item"
                onClick={() => handleGallerySelect(item)}
              >
                <img src={item.thumbnail} alt={item.result.type} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 过渡动画层 - 照片缩小到缩略图 */}
      {isAnimating && (
        <div className="transition-overlay">
          <img
            src={photo}
            alt="过渡动画"
            className="transition-photo"
          />
        </div>
      )}
    </div>
  );
};

export default PhotoCapture;