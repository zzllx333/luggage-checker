import React, { useState } from 'react';
import './LuggageChecker.css';

// Icons as SVG components
const CloseIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M36 12L12 36M12 12L36 36" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const MinusIcon = () => (
  <svg width="20" height="2" viewBox="0 0 20 2" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 1H20" stroke="#0F131A" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const PlusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 0V20M0 10H20" stroke="#0F131A" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 12L30 24L18 36" stroke="#919499" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const StarIcon = () => (
  <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 3L17.5 10.5H25L19 15L21.5 22.5L15 18L8.5 22.5L11 15L5 10.5H12.5L15 3Z" fill="#FFE033" stroke="#FFE033" strokeWidth="1.5"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="13.5" cy="13.5" r="13.5" fill="#22C55E"/>
    <path d="M8 13.5L12 17.5L19 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const HelpIcon = () => (
  <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="13" cy="13" r="11" stroke="#919499" strokeWidth="2"/>
    <path d="M10 10C10 8.34315 11.3431 7 13 7C14.6569 7 16 8.34315 16 10C16 11.5 14.5 12 13 13C12 13.5 12 14.5 12 15" stroke="#919499" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="12" cy="18" r="1" fill="#919499"/>
  </svg>
);

const LuggageIcon = () => (
  <img src="https://gw.alicdn.com/imgextra/i1/O1CN01cSdG8J24YAo4HySn5_!!6000000007402-2-tps-36-36.png" alt="行李空间" width="18" height="18" />
);

const CarIcon = () => (
  <img src="https://gw.alicdn.com/imgextra/i4/O1CN01xf4wrF1xYRjTOSm0q_!!6000000006455-2-tps-35-36.png" alt="车辆" width="18" height="18" />
);

function LuggageChecker() {
  const [luggage20, setLuggage20] = useState(0);
  const [luggage24, setLuggage24] = useState(0);
  const [luggage28, setLuggage28] = useState(0);
  const [activeTab, setActiveTab] = useState('luggage');

  const handleDecrement = (setter, value) => {
    if (value > 0) setter(value - 1);
  };

  const handleIncrement = (setter, value) => {
    setter(value + 1);
  };

  return (
    <div className="luggage-checker">
      {/* Background */}
      <div className="background-gradient"></div>

      {/* Header with close button */}
      <div className="header">
        <button className="close-btn" onClick={() => console.log('close')}>
          <CloseIcon />
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="tab-container">
        <div
          className={`tab-item ${activeTab === 'luggage' ? 'active' : ''}`}
          onClick={() => setActiveTab('luggage')}
        >
          <LuggageIcon />
          <span>行李空间</span>
        </div>
        <div
          className={`tab-item ${activeTab === 'car' ? 'active' : ''}`}
          onClick={() => setActiveTab('car')}
        >
          <CarIcon />
        </div>
      </div>

      {/* Car Info Label */}
      <div className="car-info-label">
        经济5座·后备箱尺寸参考凯美瑞同级别
      </div>

      {/* Car Image Section */}
      <div className="car-image-section">
        <div className="car-image-container">
          <img
            src="https://www.figma.com/api/mcp/asset/f6410ecd-dfbf-4e33-affa-5568e3a030b0"
            alt="车辆"
            className="car-image"
          />
          {/* Dimension Labels */}
          <div className="dimension-label dimension-top">180cm</div>
          <div className="dimension-label dimension-middle">46cm</div>
          <div className="dimension-label dimension-bottom">126cm</div>
          {/* Outline overlays */}
          <img
            src="https://www.figma.com/api/mcp/asset/65897d86-65c2-4b7a-87fb-524fbef7335d"
            alt=""
            className="outline-line outline-1"
          />
          <img
            src="https://www.figma.com/api/mcp/asset/0e82773a-1488-495d-8782-14a5dd731035"
            alt=""
            className="outline-line outline-2"
          />
        </div>
      </div>

      {/* Status Results */}
      <div className="status-results">
        <CheckIcon />
        <div className="status-text">
          <div className="status-main">
            <span>后备箱正常可容纳 2件24寸行李箱</span>
            <HelpIcon />
          </div>
          <div className="status-sub">空间容量约230升</div>
        </div>
      </div>

      {/* Luggage Selector Card */}
      <div className="luggage-card">
        <h2 className="card-title">选择行李，估算是否能装下</h2>

        <div className="luggage-selector">
          {/* 20 inch */}
          <div className="luggage-item">
            <div className="luggage-image-container">
              <img
                src="https://www.figma.com/api/mcp/asset/fa0814ec-bcc9-43b1-b0c0-6f35dbe54b4f"
                alt="20寸行李箱"
                className="luggage-image"
              />
            </div>
            <div className="luggage-size">50×21×25(cm)</div>
            <div className="counter">
              <button
                className="counter-btn"
                onClick={() => handleDecrement(setLuggage20, luggage20)}
              >
                <MinusIcon />
              </button>
              <span className="counter-value">{luggage20}</span>
              <button
                className="counter-btn"
                onClick={() => handleIncrement(setLuggage20, luggage20)}
              >
                <PlusIcon />
              </button>
            </div>
          </div>

          {/* 24 inch */}
          <div className="luggage-item">
            <div className="luggage-image-container">
              <img
                src="https://www.figma.com/api/mcp/asset/ab740fe3-8668-4517-8c7b-6c665f31b96b"
                alt="24寸行李箱"
                className="luggage-image"
              />
            </div>
            <div className="luggage-size">65×42×48(cm)</div>
            <div className="counter">
              <button
                className="counter-btn"
                onClick={() => handleDecrement(setLuggage24, luggage24)}
              >
                <MinusIcon />
              </button>
              <span className="counter-value">{luggage24}</span>
              <button
                className="counter-btn"
                onClick={() => handleIncrement(setLuggage24, luggage24)}
              >
                <PlusIcon />
              </button>
            </div>
          </div>

          {/* 28 inch */}
          <div className="luggage-item">
            <div className="luggage-image-container">
              <img
                src="https://www.figma.com/api/mcp/asset/766b64b2-41e6-4a0e-b86b-4fa01ba3f835"
                alt="28寸行李箱"
                className="luggage-image"
              />
            </div>
            <div className="luggage-size">75×50×34(cm)</div>
            <div className="counter">
              <button
                className="counter-btn"
                onClick={() => handleDecrement(setLuggage28, luggage28)}
              >
                <MinusIcon />
              </button>
              <span className="counter-value">{luggage28}</span>
              <button
                className="counter-btn"
                onClick={() => handleIncrement(setLuggage28, luggage28)}
              >
                <PlusIcon />
              </button>
            </div>
          </div>
        </div>

        {/* AI Photo Feature */}
        <div className="photo-feature">
          <div className="photo-feature-left">
            <StarIcon />
            <span className="photo-feature-text">不知道行李尺寸，AI拍照识别</span>
          </div>
          <ArrowRightIcon />
        </div>
      </div>

      {/* Footer Notice */}
      <div className="footer-notice">
        计算结果依赖AI提供的后备箱数据，最终结果以实际服务车辆为准
      </div>

      {/* Home Indicator */}
      <div className="home-indicator"></div>
    </div>
  );
}

export default LuggageChecker;