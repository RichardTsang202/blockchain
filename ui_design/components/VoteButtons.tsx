import { TrendingUp, TrendingDown, ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "./ui/button";

interface VoteButtonsProps {
  type: "trend" | "useful";
  onVote: (vote: string) => void;
  userVote?: string | null;
}

export function VoteButtons({ type, onVote, userVote }: VoteButtonsProps) {
  if (type === "trend") {
    return (
      <div className="flex gap-2">
        <Button
          variant={userVote === "bullish" ? "default" : "outline"}
          size="sm"
          onClick={() => onVote("bullish")}
          className="flex-1"
        >
          <TrendingUp className="w-4 h-4 mr-1" />
          看涨
        </Button>
        <Button
          variant={userVote === "bearish" ? "destructive" : "outline"}
          size="sm"
          onClick={() => onVote("bearish")}
          className="flex-1"
        >
          <TrendingDown className="w-4 h-4 mr-1" />
          看跌
        </Button>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <Button
        variant={userVote === "useful" ? "default" : "outline"}
        size="sm"
        onClick={() => onVote("useful")}
        className={`flex-1 transition-all ${
          userVote === "useful" 
            ? "bg-green-600 hover:bg-green-700 text-white border-green-600" 
            : "hover:bg-green-50 hover:border-green-300"
        }`}
      >
        <ThumbsUp className="w-4 h-4 mr-1" />
        有用
      </Button>
      <Button
        variant={userVote === "useless" ? "default" : "outline"}
        size="sm"
        onClick={() => onVote("useless")}
        className={`flex-1 transition-all ${
          userVote === "useless" 
            ? "bg-red-600 hover:bg-red-700 text-white border-red-600" 
            : "hover:bg-red-50 hover:border-red-300"
        }`}
      >
        <ThumbsDown className="w-4 h-4 mr-1" />
        无用
      </Button>
    </div>
  );
}