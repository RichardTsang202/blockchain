import { Share2 } from "lucide-react";
import { Button } from "./ui/button";

interface ShareButtonProps {
  title: string;
  url?: string;
}

export function ShareButton({ title, url }: ShareButtonProps) {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: title,
        url: url || window.location.href,
      });
    } else {
      alert(`分享到微信：${title}`);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleShare}
      className="text-muted-foreground"
    >
      <Share2 className="w-4 h-4 mr-1" />
      分享
    </Button>
  );
}