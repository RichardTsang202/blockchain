import React, { useState, useEffect } from 'react';

interface SwipeHintProps {
  show?: boolean;
  onDismiss?: () => void;
}

export function SwipeHint({ show = true, onDismiss }: SwipeHintProps) {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // 检查是否已经显示过提示
    const hasShownHint = localStorage.getItem('swipe-hint-shown');
    if (!hasShownHint && show) {
      const timer = setTimeout(() => {
        setVisible(true);
      }, 1000); // 延迟1秒显示
      
      return () => clearTimeout(timer);
    }
  }, [show]);

  const handleDismiss = () => {
    setVisible(false);
    setDismissed(true);
    localStorage.setItem('swipe-hint-shown', 'true');
    onDismiss?.();
  };

  useEffect(() => {
    if (visible) {
      // 5秒后自动隐藏
      const timer = setTimeout(() => {
        handleDismiss();
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!visible || dismissed) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-sm mx-auto shadow-xl animate-fade-in">
        <div className="text-center">
          <div className="text-2xl mb-4">👆</div>
          <h3 className="text-lg font-semibold mb-2 text-gray-800">
            滑动切换页面
          </h3>
          <p className="text-gray-600 mb-4 text-sm">
            左右滑动可以快速切换资讯、知识和交易所页面
          </p>
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
              <div className="w-6 h-2 bg-blue-500 rounded-full"></div>
              <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
          >
            我知道了
          </button>
        </div>
      </div>
    </div>
  );
}

// 添加CSS动画
const style = document.createElement('style');
style.textContent = `
  @keyframes fade-in {
    from {
      opacity: 0;
      transform: scale(0.9);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
  
  .animate-fade-in {
    animation: fade-in 0.3s ease-out;
  }
`;
document.head.appendChild(style);