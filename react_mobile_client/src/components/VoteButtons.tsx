import { TrendingUp, TrendingDown, ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "./ui/Button";

interface VoteButtonsProps {
  type: "trend" | "useful";
  onVote: (vote: string) => void;
  userVote?: string | null;
  stats?: {
    bullish: number;
    bearish: number;
    useful: number;
    useless: number;
  };
  showStats?: boolean;
  // 新增：用于显示计算后的投票数量
  calculatedStats?: {
    bullish: number;
    bearish: number;
  };
  // 新增：发布时间，用于计算知识文章的基础投票数
  publishTime?: string;
  // 新增：文章ID，用于生成固定的随机数
  itemId?: string;
}

export function VoteButtons({ type, onVote, userVote, stats, showStats = false, calculatedStats, publishTime, itemId }: VoteButtonsProps) {
  // 计算知识文章的基础投票数
  const calculateKnowledgeBaseStats = () => {
    if (type !== 'useful' || !publishTime) return { useful: 0, useless: 0 };
    
    // 解析发布时间，计算距离现在的小时数
    const publishDate = new Date(publishTime.replace('年', '/').replace('月', '/').replace('日', ''));
    const now = new Date();
    const hoursDiff = Math.max(1, Math.floor((now.getTime() - publishDate.getTime()) / (1000 * 60 * 60)));
    
    // "有用"数 = 小时数 / 10
    const usefulCount = Math.max(1, Math.floor(hoursDiff / 10));
    
    // "无用"数 = "有用"数 * (0.01-0.1固定随机值)
    let randomMultiplier = 0.05; // 默认值
    if (itemId) {
      // 基于文章ID生成固定的随机数，使用更好的哈希算法
      let hash = 0;
      for (let i = 0; i < itemId.length; i++) {
        const char = itemId.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // 转换为32位整数
      }
      // 使用绝对值并映射到0.01-0.1范围
      const normalizedHash = Math.abs(hash) % 10000;
      randomMultiplier = 0.01 + (normalizedHash / 10000) * 0.09; // 生成0.01-0.1之间的固定随机数
    }
    const uselessCount = Math.floor(usefulCount * randomMultiplier);
    
    return { useful: usefulCount, useless: uselessCount };
  };
  
  const knowledgeBaseStats = calculateKnowledgeBaseStats();
  const getVoteCount = (voteType: string) => {
    // 对于趋势投票，使用计算后的数据加上实际投票数
    if (type === 'trend' && calculatedStats) {
      const baseCount = calculatedStats[voteType as keyof typeof calculatedStats] || 0;
      const actualVotes = stats ? (stats[voteType as keyof typeof stats] || 0) : 0;
      return baseCount + actualVotes;
    }
    
    // 对于知识文章投票，使用基础统计数据加上实际投票数
    if (type === 'useful' && publishTime) {
      const baseCount = knowledgeBaseStats[voteType as keyof typeof knowledgeBaseStats] || 0;
      const actualVotes = stats ? (stats[voteType as keyof typeof stats] || 0) : 0;
      return baseCount + actualVotes;
    }
    
    if (!stats) return 0;
    return stats[voteType as keyof typeof stats] || 0;
  };

  const getTotalVotes = () => {
    if (type === 'trend' && calculatedStats) {
      const baseBullish = calculatedStats.bullish || 0;
      const baseBearish = calculatedStats.bearish || 0;
      const actualBullish = stats ? (stats.bullish || 0) : 0;
      const actualBearish = stats ? (stats.bearish || 0) : 0;
      return baseBullish + baseBearish + actualBullish + actualBearish;
    }
    
    if (type === 'useful' && publishTime) {
      const baseUseful = knowledgeBaseStats.useful || 0;
      const baseUseless = knowledgeBaseStats.useless || 0;
      const actualUseful = stats ? (stats.useful || 0) : 0;
      const actualUseless = stats ? (stats.useless || 0) : 0;
      return baseUseful + baseUseless + actualUseful + actualUseless;
    }
    
    if (!stats) return 0;
    if (type === 'trend') {
      return stats.bullish + stats.bearish;
    }
    return stats.useful + stats.useless;
  };

  const getPercentage = (voteType: string) => {
    const total = getTotalVotes();
    const count = getVoteCount(voteType);
    return total > 0 ? Math.round((count / total) * 100) : 0;
  };
  if (type === "trend") {
    return (
      <div className="flex gap-2">
        <Button
          variant={userVote === "bullish" ? "default" : "outline"}
          size="sm"
          onClick={() => onVote("bullish")}
          className={`flex-1 flex flex-col items-center py-3 min-h-[60px] ${
            userVote === "bullish"
              ? "bg-green-500 hover:bg-green-600 text-white"
              : "hover:bg-green-50 hover:text-green-600 hover:border-green-300"
          }`}
        >
          <div className="flex items-center text-2xl">
            <TrendingUp className="w-8 h-8 mr-2" />
            看涨
          </div>
          {showStats && (
            <div className="text-xl mt-1 opacity-75">
              {getVoteCount('bullish')}票 ({getPercentage('bullish')}%)
            </div>
          )}
        </Button>
        <Button
          variant={userVote === "bearish" ? "default" : "outline"}
          size="sm"
          onClick={() => onVote("bearish")}
          className={`flex-1 flex flex-col items-center py-3 min-h-[60px] ${
            userVote === "bearish"
              ? "bg-red-500 hover:bg-red-600 text-white"
              : "hover:bg-red-50 hover:text-red-600 hover:border-red-300"
          }`}
        >
          <div className="flex items-center text-2xl">
            <TrendingDown className="w-8 h-8 mr-2" />
            看跌
          </div>
          {showStats && (
            <div className="text-xl mt-1 opacity-75">
              {getVoteCount('bearish')}票 ({getPercentage('bearish')}%)
            </div>
          )}
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
        className={`flex-1 flex flex-col items-center py-3 min-h-[60px] transition-all ${
          userVote === "useful" 
            ? "bg-green-600 hover:bg-green-700 text-white border-green-600" 
            : "hover:bg-green-50 hover:border-green-300"
        }`}
      >
        <div className="flex items-center text-2xl">
          <ThumbsUp className="w-8 h-8 mr-2" />
          有用
        </div>
        {showStats && (
          <div className="text-xl mt-1 opacity-75">
            {getVoteCount('useful')}票 ({getPercentage('useful')}%)
          </div>
        )}
      </Button>
      <Button
        variant={userVote === "useless" ? "default" : "outline"}
        size="sm"
        onClick={() => onVote("useless")}
        className={`flex-1 flex flex-col items-center py-3 min-h-[60px] transition-all ${
          userVote === "useless" 
            ? "bg-red-600 hover:bg-red-700 text-white border-red-600" 
            : "hover:bg-red-50 hover:border-red-300"
        }`}
      >
        <div className="flex items-center text-2xl">
          <ThumbsDown className="w-8 h-8 mr-2" />
          无用
        </div>
        {showStats && (
          <div className="text-xl mt-1 opacity-75">
            {getVoteCount('useless')}票 ({getPercentage('useless')}%)
          </div>
        )}
      </Button>
    </div>
  );
}