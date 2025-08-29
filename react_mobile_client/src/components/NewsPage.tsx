import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader } from './ui/Card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/Dialog';
import { VoteButtons } from './VoteButtons';
import { ShareButton } from './ShareButton';
import { CustomerServiceFloat } from './CustomerServiceFloat';

import { useVoteStats } from '../hooks/useVoteStats';
import { newsApi, NewsItem } from '../services/mockApi';
import { RefreshCw, Eye, Heart } from 'lucide-react';

interface NewsCardProps {
  item: NewsItem;
  onLike: (id: string) => void;
  onSelect: (item: NewsItem) => void;
  calculateReadCount: (publishTime: string, originalReadCount: number, hasUserViewed?: boolean) => string;
  calculateLikeCount: (publishTime: string, isLiked: boolean) => string;
}

function NewsCard({ item, onLike, onSelect, calculateReadCount, calculateLikeCount }: NewsCardProps) {
  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return '刚刚';
    if (diffInHours < 24) return `${diffInHours}小时前`;
    return `${Math.floor(diffInHours / 24)}天前`;
  };

  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-shadow duration-200"
      onClick={() => onSelect(item)}
    >
      <CardHeader className="pb-2">
        <img 
          src={item.imageUrl}
          alt={item.title}
          className="w-full h-48 rounded-lg object-cover"
        />

      </CardHeader>
      <CardContent>
        <h3 className="font-semibold text-4xl mb-2 line-clamp-2">
          {item.title}
        </h3>
        
        <p className="text-gray-600 text-2xl mb-3 line-clamp-2">
          {item.summary}
        </p>
        
        <div className="flex items-center justify-end text-xl text-gray-500 mb-3">
          <span>{formatTime(item.publishTime)}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-2xl text-gray-500">
            <div className="flex items-center space-x-1">
              <Eye className="w-8 h-8" />
              <span>{calculateReadCount(item.publishTime, item.readCount, false)}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onLike(item.id);
              }}
              className={`flex items-center space-x-1 px-2 py-1 rounded text-xl ${
                item.isLiked ? 'text-red-500' : 'text-gray-500'
              }`}
            >
              <Heart className={`w-8 h-8 ${item.isLiked ? 'fill-current' : ''}`} />
              <span>{calculateLikeCount(item.publishTime, item.isLiked)}</span>
            </button>
            <div className="[&_span]:text-2xl">
              <ShareButton title={item.title} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function NewsPage() {
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const { vote, getStats, getUserVote, getTotalVotes } = useVoteStats();
  const [newsData, setNewsData] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [viewedNews, setViewedNews] = useState<Set<string>>(new Set());

  // 计算观看量：年份 * 发布时间（小时）作为基数
  const calculateReadCount = (publishTime: string, originalReadCount: number, hasUserViewed: boolean = false) => {
    const date = new Date(publishTime);
    const year = date.getFullYear();
    const hours = date.getHours() + 1; // 避免0小时
    const baseCount = year * hours;
    const finalCount = baseCount + (hasUserViewed ? 1 : 0);
    
    if (finalCount >= 100000) {
      return '10万+';
    }
    return finalCount.toLocaleString();
  };

  // 计算点赞数：10 * 发布时间（小时）作为基数
  const calculateLikeCount = (publishTime: string, isLiked: boolean) => {
    const date = new Date(publishTime);
    const hours = date.getHours() + 1; // 避免0小时
    const baseCount = 10 * hours;
    const finalCount = baseCount + (isLiked ? 1 : 0);
    
    if (finalCount >= 10000) {
      return '1万+';
    }
    return finalCount.toLocaleString();
  };

  // 计算看涨投票数（点赞数的3-8倍）
  const calculateBullishVotes = (likeCount: number, newsId: string): number => {
    // 使用newsId作为种子，确保同一条资讯的倍数保持一致
    const seed = newsId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const multiplier = 3 + (seed % 6); // 3-8倍
    return Math.floor(likeCount * multiplier);
  };

  // 计算看跌投票数（看涨量的0.5-0.8倍）
  const calculateBearishVotes = (bullishCount: number, newsId: string): number => {
    // 使用newsId作为种子，确保同一条资讯的比例保持一致
    const seed = newsId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const ratio = 0.5 + ((seed % 31) / 100); // 0.5-0.8倍
    return Math.floor(bullishCount * ratio);
  };

  // 获取新闻数据
  const fetchNews = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await newsApi.getNews(1, 50);
      setNewsData(response.data);
    } catch (err) {
      setError(err as Error);
      console.error('加载新闻失败:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 初始化加载数据
  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  const handleVote = (newsId: string, voteType: string) => {
    vote(newsId, voteType);
  };

  const handleLike = useCallback((newsId: string) => {
    setNewsData(prevData => 
      prevData.map(item => 
        item.id === newsId 
          ? { 
              ...item, 
              isLiked: !item.isLiked
            }
          : item
      )
    );
    
    // 同步更新selectedNews状态
    if (selectedNews && selectedNews.id === newsId) {
      setSelectedNews(prev => prev ? {
        ...prev,
        isLiked: !prev.isLiked
      } : null);
    }
  }, [selectedNews]);

  const handleRefresh = useCallback(async () => {
    setShowAll(false);
    await fetchNews();
  }, [fetchNews]);

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200" style={{ paddingTop: 'env(safe-area-inset-top, 20px)' }}>
        <div className="px-4 py-6">
          <div className="text-center mb-3">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              区块链资讯
            </h1>
            <div className="flex justify-center mt-2">
              <div className="w-32 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* 内容区域 */}
      <div className="flex-1 px-4 pb-24 overflow-y-auto">
        {error ? (
          <div className="text-center py-8">
            <p className="text-red-500 mb-4">加载失败: {error.message}</p>
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              重试
            </button>
          </div>
        ) : isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-gray-500 mt-2">加载中...</p>
          </div>
        ) : newsData.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            暂无资讯数据
          </div>
        ) : (
          <div className="space-y-4">
            {(showAll ? newsData : newsData.slice(0, 5)).map((item) => (
          <NewsCard
            key={item.id}
            item={item}
            onLike={handleLike}
            onSelect={(news) => {
              setSelectedNews(news);
              setViewedNews(prev => new Set([...prev, news.id]));
            }}
            calculateReadCount={calculateReadCount}
            calculateLikeCount={calculateLikeCount}
          />
        ))}
            {!showAll && newsData.length > 5 && (
              <div className="text-center py-4">
                <button
                  onClick={() => setShowAll(true)}
                  className="px-6 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                >
                  更多... ({newsData.length - 5} 条)
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 详情弹窗 */}
      <Dialog open={!!selectedNews} onOpenChange={() => setSelectedNews(null)}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-left text-4xl font-bold pr-12">{selectedNews?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedNews && (
              <>
                <img 
                  src={selectedNews.imageUrl}
                  alt={selectedNews.title}
                  className="w-full h-48 rounded-lg object-cover"
                />
                <div className="space-y-3">
                  <div className="flex items-center justify-end text-2xl text-gray-500">
                    <span>{new Date(selectedNews.publishTime).toLocaleString()}</span>
                  </div>
                  
                  <p className="text-gray-700 leading-relaxed text-3xl">
                    {selectedNews.summary}
                  </p>
                  
                  <div className="flex items-center space-x-4 text-2xl text-gray-500 py-2 border-t border-b">
                    <div className="flex items-center space-x-1">
                      <Eye className="w-8 h-8" />
                      <span>{calculateReadCount(selectedNews.publishTime, selectedNews.readCount, viewedNews.has(selectedNews.id))}</span>
                    </div>
                    <button
                      onClick={() => handleLike(selectedNews.id)}
                      className={`flex items-center space-x-1 transition-colors duration-200 hover:scale-105 ${
                        selectedNews.isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-400'
                      }`}
                    >
                      <Heart className={`w-8 h-8 ${selectedNews.isLiked ? 'fill-current' : ''}`} />
                      <span>{calculateLikeCount(selectedNews.publishTime, selectedNews.isLiked)}</span>
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <p className="text-2xl font-medium">您对这条资讯的看法：</p>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleVote(selectedNews.id, 'bullish')}
                      className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all duration-200 ${
                        getUserVote(selectedNews.id) === 'bullish'
                          ? 'bg-green-500 text-white border-green-500'
                          : 'bg-white text-green-600 border-green-500 hover:bg-green-50'
                      }`}
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <span className="font-medium text-2xl">📈 看涨</span>
                      </div>
                      <div className="text-xl mt-1">
                        {(() => {
                          const likeCountStr = calculateLikeCount(selectedNews.publishTime, selectedNews.isLiked);
                          const likeCount = parseInt(likeCountStr.replace(/[^0-9]/g, '')) || 0;
                          const bullishVotes = calculateBullishVotes(likeCount, selectedNews.id);
                          const actualStats = getStats(selectedNews.id);
                          const total = bullishVotes + actualStats.bullish;
                          const bearishTotal = calculateBearishVotes(bullishVotes, selectedNews.id) + actualStats.bearish;
                          const percentage = (total + bearishTotal) > 0 ? Math.round((total / (total + bearishTotal)) * 100) : 0;
                          return `${total.toLocaleString()} (${percentage}%)`;
                        })()} 
                      </div>
                    </button>
                    
                    <button
                      onClick={() => handleVote(selectedNews.id, 'bearish')}
                      className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all duration-200 ${
                        getUserVote(selectedNews.id) === 'bearish'
                          ? 'bg-red-500 text-white border-red-500'
                          : 'bg-white text-red-600 border-red-500 hover:bg-red-50'
                      }`}
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <span className="font-medium text-2xl">📉 看跌</span>
                      </div>
                      <div className="text-xl mt-1">
                        {(() => {
                          const likeCountStr = calculateLikeCount(selectedNews.publishTime, selectedNews.isLiked);
                          const likeCount = parseInt(likeCountStr.replace(/[^0-9]/g, '')) || 0;
                          const bullishVotes = calculateBullishVotes(likeCount, selectedNews.id);
                          const bearishVotes = calculateBearishVotes(bullishVotes, selectedNews.id);
                          const actualStats = getStats(selectedNews.id);
                          const total = bearishVotes + actualStats.bearish;
                          const bullishTotal = bullishVotes + actualStats.bullish;
                          const percentage = (total + bullishTotal) > 0 ? Math.round((total / (total + bullishTotal)) * 100) : 0;
                          return `${total.toLocaleString()} (${percentage}%)`;
                        })()} 
                      </div>
                    </button>
                  </div>
                </div>
                
                <div className="flex justify-center pt-4">
                  <div className="[&_span]:text-2xl">
                    <ShareButton title={selectedNews.title} />
                  </div>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
      
      {/* 客服浮标 */}
      <CustomerServiceFloat />
    </div>
  );
}