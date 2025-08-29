import { useState } from "react";
import { MessageCircle, X } from "lucide-react";

interface CustomerServiceFloatProps {
  className?: string;
}

export function CustomerServiceFloat({ className = "" }: CustomerServiceFloatProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleFloatClick = () => {
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    try {
      await navigator.clipboard.writeText("miky51233");
      setShowConfirm(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (err) {
      console.error('复制失败:', err);
      // 降级方案：创建临时输入框
      const textArea = document.createElement('textarea');
      textArea.value = 'miky51233';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      
      setShowConfirm(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    }
  };

  const handleCancel = () => {
    setShowConfirm(false);
  };

  return (
    <>
      {/* 客服浮标 */}
      <div 
        className={`fixed bottom-24 right-4 z-50 ${className}`}
        onClick={handleFloatClick}
      >
        <div className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-3 shadow-lg cursor-pointer transition-all duration-200 hover:scale-110">
          <MessageCircle className="w-6 h-6" />
        </div>
      </div>

      {/* 确认对话框 */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">联系客服</h3>
              <button 
                onClick={handleCancel}
                className="p-1 h-auto text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <p className="text-gray-600 mb-6">
              是否复制客服微信号到剪贴板？
            </p>
            
            <div className="flex gap-3 justify-end">
              <button 
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                取消
              </button>
              <button 
                onClick={handleConfirm}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
              >
                确认复制
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 成功提示 */}
      {showSuccess && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-[70] bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg">
          微信号已复制到剪贴板：miky51233
        </div>
      )}
    </>
  );
}