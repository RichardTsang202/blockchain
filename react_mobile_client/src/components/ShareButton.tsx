import { Share2 } from "lucide-react";
import { Button } from "./ui/Button";

interface ShareButtonProps {
  title: string;
  url?: string;
}

export function ShareButton({ title, url }: ShareButtonProps) {
  const handleShare = async () => {
    const shareData = {
      title: title,
      url: url || window.location.href,
    };

    // 检查是否支持Web Share API
    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.log('分享被取消或失败:', error);
        // 如果分享失败，显示fallback
        showFallbackShare(shareData);
      }
    } else {
      // 不支持Web Share API时的fallback
      showFallbackShare(shareData);
    }
  };

  const showFallbackShare = (shareData: { title: string; url: string }) => {
    // 复制链接到剪贴板
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(shareData.url).then(() => {
        alert(`链接已复制到剪贴板\n标题：${shareData.title}\n链接：${shareData.url}`);
      }).catch(() => {
        alert(`分享内容：\n标题：${shareData.title}\n链接：${shareData.url}`);
      });
    } else {
      alert(`分享内容：\n标题：${shareData.title}\n链接：${shareData.url}`);
    }
  };

  return (
    <Button
      variant="default"
      size="default"
      onClick={handleShare}
      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
    >
      <Share2 className="w-5 h-5 mr-2" />
      <span className="text-2xl">分享</span>
    </Button>
  );
}