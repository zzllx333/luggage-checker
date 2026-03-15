import React, { useState, useMemo } from 'react';
import './LuggageChecker.css';

// Icons as SVG components - 设计稿尺寸除以2
const CloseIcon = () => (
  <img src="https://gw.alicdn.com/imgextra/i1/O1CN01kzCU741W8LXJWkzvd_!!6000000002743-2-tps-48-48.png" alt="" width="24" height="24" />
);

const MinusIcon = ({ disabled }) => (
  <img
    src={disabled
      ? "https://gw.alicdn.com/imgextra/i3/O1CN012017Iz1gtebVl3opB_!!6000000004200-2-tps-84-84.png"
      : "https://gw.alicdn.com/imgextra/i3/O1CN01OfDnXd1y38Gj8UPQl_!!6000000006522-2-tps-84-84.png"
    }
    alt=""
    width="21"
    height="21"
  />
);

const PlusIcon = () => (
  <img
    src="https://gw.alicdn.com/imgextra/i3/O1CN01OfDnXd1y38Gj8UPQl_!!6000000006522-2-tps-84-84.png"
    alt=""
    width="21"
    height="21"
  />
);

const ArrowRightIcon = () => (
  <svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 12L30 24L18 36" stroke="#919499" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const StarIcon = () => (
  <img src="https://gw.alicdn.com/imgextra/i1/O1CN01iNAfgO1YIzynvTZoH_!!6000000003037-2-tps-30-30.png" alt="" width="15" height="15" />
);

// 能容纳 - 绿色对勾
const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="13.5" cy="13.5" r="13.5" fill="#22C55E"/>
    <path d="M8 13.5L12 17.5L19 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// 接近满载 - 橙色叹号
const WarningIcon = () => (
  <svg width="14" height="14" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="13.5" cy="13.5" r="13.5" fill="#FF9500"/>
    <path d="M13.5 8V14" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="13.5" cy="18.5" r="1.5" fill="white"/>
  </svg>
);

// 不能装下 - 红色叉号
const ErrorIcon = () => (
  <svg width="14" height="14" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="13.5" cy="13.5" r="13.5" fill="#FF3B30"/>
    <path d="M9 9L18 18M18 9L9 18" stroke="white" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const HelpIcon = () => (
  <svg width="13" height="13" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
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

// 行李箱体积计算（单位：升）
// 实际占用空间考虑了不规则形状和放置间隙
const LUGGAGE_VOLUME = {
  size20: 28,   // 20寸行李箱实际占用约28升
  size24: 68,   // 24寸行李箱实际占用约68升
  size28: 95,   // 28寸行李箱实际占用约95升
};

// 后备箱容量（凯美瑞同级别，单位：升）
const TRUNK_CAPACITY = 150;

// 状态类型
const STATUS = {
  OK: 'ok',           // 能容纳
  WARNING: 'warning', // 接近满载
  ERROR: 'error',     // 不能装下
};

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

  // 计算行李总体积和状态
  const { status, statusText, suggestion } = useMemo(() => {
    const volume =
      luggage20 * LUGGAGE_VOLUME.size20 +
      luggage24 * LUGGAGE_VOLUME.size24 +
      luggage28 * LUGGAGE_VOLUME.size28;

    const ratio = volume / TRUNK_CAPACITY;

    let status, statusText, suggestion;

    if (luggage20 === 0 && luggage24 === 0 && luggage28 === 0) {
      // 未选择行李
      status = STATUS.OK;
      statusText = '后备箱正常可容纳 2件24寸行李箱';
      suggestion = `后备箱容量约${TRUNK_CAPACITY}升`;
    } else if (ratio <= 0.96) {
      // 能容纳
      status = STATUS.OK;
      statusText = `后备箱正常可容纳当前选择的行李`;
      suggestion = `已使用${Math.round(ratio * 100)}%，剩余约${Math.round(TRUNK_CAPACITY - volume)}升空间`;
    } else if (ratio <= 1) {
      // 接近满载
      status = STATUS.WARNING;
      statusText = `后备箱接近满载，建议确认尺寸`;
      suggestion = `已使用${Math.round(ratio * 100)}%，空间较为紧张`;
    } else {
      // 不能装下
      status = STATUS.ERROR;
      statusText = '后备箱无法放下所有行李，建议升级更大车型';
      suggestion = `超出约${Math.round(volume - TRUNK_CAPACITY)}升，无法装下`;
    }

    return { totalVolume: volume, status, statusText, suggestion };
  }, [luggage20, luggage24, luggage28]);

  // 根据状态获取图标
  const StatusIcon = () => {
    switch (status) {
      case STATUS.WARNING:
        return <WarningIcon />;
      case STATUS.ERROR:
        return <ErrorIcon />;
      default:
        return <CheckIcon />;
    }
  };

  // 根据状态获取样式类名
  const getStatusClassName = () => {
    switch (status) {
      case STATUS.WARNING:
        return 'status-warning';
      case STATUS.ERROR:
        return 'status-error';
      default:
        return '';
    }
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
            src="https://gw.alicdn.com/imgextra/i2/O1CN01dQuxTn1mX6npB4T1y_!!6000000004963-2-tps-677-385.png"
            alt="车辆"
            className="car-image"
          />
        </div>
      </div>

      {/* Status Results */}
      <div className={`status-results ${getStatusClassName()}`}>
        <StatusIcon />
        <div className="status-text">
          <div className="status-main">
            <span>{statusText}</span>
            <HelpIcon />
          </div>
          <div className="status-sub">{suggestion}</div>
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
                className={`counter-btn ${luggage20 === 0 ? 'disabled' : ''}`}
                onClick={() => handleDecrement(setLuggage20, luggage20)}
              >
                <MinusIcon disabled={luggage20 === 0} />
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
                className={`counter-btn ${luggage24 === 0 ? 'disabled' : ''}`}
                onClick={() => handleDecrement(setLuggage24, luggage24)}
              >
                <MinusIcon disabled={luggage24 === 0} />
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
                className={`counter-btn ${luggage28 === 0 ? 'disabled' : ''}`}
                onClick={() => handleDecrement(setLuggage28, luggage28)}
              >
                <MinusIcon disabled={luggage28 === 0} />
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