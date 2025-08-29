import React, { useState, useEffect } from 'react';

interface WechatTipProps {
  children: React.ReactNode;
}

export function WechatTip({ children }: WechatTipProps) {
  const [showTip, setShowTip] = useState(false);

  // 检测是否在微信环境中
  const isWechat = () => {
    const ua = navigator.userAgent.toLowerCase();
    return /micromessenger/i.test(ua);
  };

  // 检测是否在微信小程序中
  const isMiniProgram = () => {
    const ua = navigator.userAgent.toLowerCase();
    return /miniprogram/i.test(ua);
  };

  useEffect(() => {
    // 只在微信环境中显示提示，但不在小程序中显示
    if (isWechat() && !isMiniProgram()) {
      setShowTip(true);
    }
  }, []);

  const handleOpenInBrowser = () => {
    // 复制当前页面链接到剪贴板
    const currentUrl = window.location.href;
    
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(currentUrl).then(() => {
        alert('链接已复制到剪贴板，请在浏览器中粘贴打开');
      }).catch(() => {
        // 降级方案：显示链接让用户手动复制
        showUrlDialog(currentUrl);
      });
    } else {
      // 降级方案：显示链接让用户手动复制
      showUrlDialog(currentUrl);
    }
    
    setShowTip(false);
  };

  const showUrlDialog = (url: string) => {
    const message = `请复制以下链接在浏览器中打开：\n\n${url}`;
    alert(message);
  };

  const handleClose = () => {
    setShowTip(false);
  };

  if (!showTip) {
    return <>{children}</>;
  }

  return (
    <>
      {children}
      
      {/* 微信提示遮罩 */}
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
        <div className="bg-white rounded-lg max-w-sm w-full p-6 text-center">
          <div className="mb-4">
            <div className="text-4xl mb-2">🌐</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              为了更好的用户体验
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              建议您在浏览器中打开本页面，以获得完整的功能体验
            </p>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={handleOpenInBrowser}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              在浏览器中打开
            </button>
            
            <button
              onClick={handleClose}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors"
            >
              继续在微信中浏览
            </button>
          </div>
          
          <div className="mt-4 text-2xl text-gray-500 font-bold">
            <p>💡 提示：点击右上角 "···" → "在浏览器中打开"</p>
          </div>
        </div>
      </div>
    </>
  );
}