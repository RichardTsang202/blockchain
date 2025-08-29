import { useState, useEffect } from 'react';

interface VoteStats {
  bullish: number;
  bearish: number;
  useful: number;
  useless: number;
}

interface UserVotes {
  [itemId: string]: string;
}

interface VoteData {
  [itemId: string]: VoteStats;
}

const VOTE_STATS_KEY = 'blockchain_news_vote_stats';
const USER_VOTES_KEY = 'blockchain_news_user_votes';

export function useVoteStats() {
  const [voteStats, setVoteStats] = useState<VoteData>({});
  const [userVotes, setUserVotes] = useState<UserVotes>({});

  // 从本地存储加载数据
  useEffect(() => {
    try {
      const savedStats = localStorage.getItem(VOTE_STATS_KEY);
      const savedUserVotes = localStorage.getItem(USER_VOTES_KEY);
      
      if (savedStats) {
        setVoteStats(JSON.parse(savedStats));
      }
      
      if (savedUserVotes) {
        setUserVotes(JSON.parse(savedUserVotes));
      }
    } catch (error) {
      console.error('加载投票数据失败:', error);
    }
  }, []);

  // 保存数据到本地存储
  const saveToStorage = (stats: VoteData, votes: UserVotes) => {
    try {
      localStorage.setItem(VOTE_STATS_KEY, JSON.stringify(stats));
      localStorage.setItem(USER_VOTES_KEY, JSON.stringify(votes));
    } catch (error) {
      console.error('保存投票数据失败:', error);
    }
  };

  // 投票函数
  const vote = (itemId: string, voteType: string) => {
    const previousVote = userVotes[itemId];
    
    // 如果用户之前已经投过票，先减去之前的投票
    let newStats = { ...voteStats };
    if (!newStats[itemId]) {
      newStats[itemId] = { bullish: 0, bearish: 0, useful: 0, useless: 0 };
    }
    
    if (previousVote) {
      newStats[itemId] = {
        ...newStats[itemId],
        [previousVote]: Math.max(0, newStats[itemId][previousVote as keyof VoteStats] - 1)
      };
    }
    
    // 如果点击的是同一个选项，则取消投票
    const newUserVotes = { ...userVotes };
    if (previousVote === voteType) {
      delete newUserVotes[itemId];
    } else {
      // 否则添加新的投票
      newStats[itemId] = {
        ...newStats[itemId],
        [voteType]: newStats[itemId][voteType as keyof VoteStats] + 1
      };
      newUserVotes[itemId] = voteType;
    }
    
    setVoteStats(newStats);
    setUserVotes(newUserVotes);
    saveToStorage(newStats, newUserVotes);
  };

  // 获取特定项目的投票统计
  const getStats = (itemId: string): VoteStats => {
    return voteStats[itemId] || { bullish: 0, bearish: 0, useful: 0, useless: 0 };
  };

  // 获取用户对特定项目的投票
  const getUserVote = (itemId: string): string | null => {
    return userVotes[itemId] || null;
  };

  // 获取投票总数
  const getTotalVotes = (itemId: string, type: 'trend' | 'useful'): number => {
    const stats = getStats(itemId);
    if (type === 'trend') {
      return stats.bullish + stats.bearish;
    }
    return stats.useful + stats.useless;
  };

  // 获取投票百分比
  const getVotePercentage = (itemId: string, voteType: string): number => {
    const stats = getStats(itemId);
    const voteCount = stats[voteType as keyof VoteStats];
    const total = voteType === 'bullish' || voteType === 'bearish' 
      ? stats.bullish + stats.bearish
      : stats.useful + stats.useless;
    
    return total > 0 ? Math.round((voteCount / total) * 100) : 0;
  };

  return {
    vote,
    getStats,
    getUserVote,
    getTotalVotes,
    getVotePercentage
  };
}