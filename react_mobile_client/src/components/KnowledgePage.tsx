import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader } from "./ui/Card";
import { Badge } from "./ui/Badge";
import { CustomerServiceFloat } from './CustomerServiceFloat';

import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { knowledgeApi } from '../services/mockApi';

// 类型映射函数
const getTypeDisplayName = (type: string) => {
  const typeMap: Record<string, string> = {
    'video': '视频',
    'audio': '音频', 
    'article': '文章'
  };
  return typeMap[type] || type;
};

interface KnowledgeItem {
  id: string;
  title: string;
  summary: string;
  type: string;
  category: string;
  image: string;
  publishTime: string;
  useful?: number;
  notUseful?: number;
  userVote?: 'useful' | 'notUseful';
}

interface KnowledgeCardProps {
  item: KnowledgeItem;
  onVote: (id: string, type: 'useful' | 'notUseful') => void;
  onClick: (item: KnowledgeItem) => void;
}

const KnowledgeCard: React.FC<KnowledgeCardProps> = ({ item, onVote, onClick }) => {
  const handleVote = (type: 'useful' | 'notUseful', e: React.MouseEvent) => {
    e.stopPropagation();
    onVote(item.id, type);
  };

  // 计算知识文章的基础投票数
  const calculateBaseVotes = () => {
    // 解析发布时间，计算距离现在的小时数
    const publishDate = new Date(item.publishTime.replace('年', '/').replace('月', '/').replace('日', ''));
    const now = new Date();
    const hoursDiff = Math.max(1, Math.floor((now.getTime() - publishDate.getTime()) / (1000 * 60 * 60)));
    
    // "有用"数 = 小时数 / 10
     const usefulCount = Math.max(1, Math.floor(hoursDiff / 10));
    
    // "无用"数 = "有用"数 * (0.01-0.1随机值)
    const randomMultiplier = 0.01 + Math.random() * 0.09;
    const uselessCount = Math.floor(usefulCount * randomMultiplier);
    
    return { useful: usefulCount, useless: uselessCount };
  };

  const baseVotes = calculateBaseVotes();

  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-shadow mb-4"
      onClick={() => onClick(item)}
    >
      <CardHeader className="pb-2">
        <img 
          src={item.image}
          alt={item.title}
          className="w-full h-48 rounded-lg object-cover"
        />
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="secondary" className="text-xl px-4 py-2">{getTypeDisplayName(item.type)}</Badge>
          <span className="text-2xl text-muted-foreground">{item.publishTime}</span>
        </div>
        <h3 className="mb-2 font-semibold text-4xl">{item.title}</h3>
        <p className="text-muted-foreground text-2xl mb-4">{item.summary}</p>
        
        {(item.useful !== undefined || item.notUseful !== undefined) && (
          <div className="flex items-center space-x-4 pt-3 border-t border-gray-100">
            <button
              onClick={(e) => handleVote('useful', e)}
              className={`flex items-center space-x-1 px-3 py-1 rounded-full text-2xl transition-colors ${
                item.userVote === 'useful'
                  ? 'bg-green-100 text-green-700'
                  : 'text-gray-600 hover:bg-green-50'
              }`}
            >
              <span>👍</span>
              <span>{baseVotes.useful + (item.useful || 0)}</span>
            </button>
            <button
              onClick={(e) => handleVote('notUseful', e)}
              className={`flex items-center space-x-1 px-3 py-1 rounded-full text-2xl transition-colors ${
                item.userVote === 'notUseful'
                  ? 'bg-red-100 text-red-700'
                  : 'text-gray-600 hover:bg-red-50'
              }`}
            >
              <span>👎</span>
              <span>{baseVotes.useless + (item.notUseful || 0)}</span>
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface KnowledgePageProps {
  onKnowledgeSelect?: (knowledgeId: string) => void;
}

export function KnowledgePage({ onKnowledgeSelect }: KnowledgePageProps) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedItem, setSelectedItem] = useState<KnowledgeItem | null>(null);
  const [votes, setVotes] = useState<Record<string, 'useful' | 'notUseful'>>({});
  const [knowledgeItems, setKnowledgeItems] = useState<KnowledgeItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [showAll, setShowAll] = useState(false);
  
  const categories = [
    { id: "all", name: "全部" },
    { id: "basic", name: "基础入门" },
    { id: "practical", name: "实战应用" },
    { id: "advanced", name: "深度研究" }
  ];
  
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await knowledgeApi.getKnowledge(1, 50);
      setKnowledgeItems(result.data);
    } catch (err) {
      setError(err as Error);
      console.error('加载知识数据失败:', err);
    } finally {
      setLoading(false);
    }
  }, [activeCategory]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleVote = (id: string, type: 'useful' | 'notUseful') => {
    setVotes(prev => ({ ...prev, [id]: type }));
  };

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setShowAll(false);
    fetchData();
  };

  const handleItemClick = (item: KnowledgeItem) => {
    setSelectedItem(item);
    onKnowledgeSelect?.(item.id);
  };

  const closeDetail = () => {
    setSelectedItem(null);
  };

  const handleRefresh = () => {
    setShowAll(false);
    fetchData();
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-200" style={{ paddingTop: 'env(safe-area-inset-top, 20px)' }}>
        <div className="px-4 py-4">
          <div className="text-center mb-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              知识分享
            </h1>
            <div className="flex justify-center mt-2">
              <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
            </div>
          </div>
        
          {/* 分类标签 */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all shadow-sm ${
                  activeCategory === category.id
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105"
                    : "bg-white text-gray-700 hover:bg-gray-50 hover:shadow-md border border-gray-200"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 知识列表 */}
      <div className="flex-1 overflow-y-auto">
        {error ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <div className="text-red-500 mb-2">⚠️</div>
            <p className="text-gray-600 mb-4">加载失败，请重试</p>
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              重新加载
            </button>
          </div>
        ) : loading ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
            <p className="text-gray-500">加载中...</p>
          </div>
        ) : knowledgeItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <p className="text-gray-500">暂无知识数据</p>
          </div>
        ) : (
          <div className="p-4 space-y-4">
            {(showAll ? knowledgeItems : knowledgeItems.slice(0, 5)).map((item) => {
              const itemWithVote = {
                ...item,
                userVote: votes[item.id]
              };
              
              return (
                <KnowledgeCard
                  key={item.id}
                  item={itemWithVote}
                  onVote={handleVote}
                  onClick={handleItemClick}
                />
              );
            })}
            {!showAll && knowledgeItems.length > 5 && (
              <div className="text-center py-4">
                <button
                  onClick={() => setShowAll(true)}
                  className="px-6 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                >
                  更多... ({knowledgeItems.length - 5} 条)
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 知识详情弹窗 */}
      {selectedItem && (
        <div className="fixed inset-0 bg-transparent flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">{selectedItem.title}</h3>
              <button
                onClick={closeDetail}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="secondary">{getTypeDisplayName(selectedItem.type)}</Badge>
                <span className="text-sm text-muted-foreground">{selectedItem.publishTime}</span>
              </div>
              
              <img 
                src={selectedItem.image}
                alt={selectedItem.title}
                className="w-full rounded-lg mb-4 object-cover"
              />
              
              <p className="text-gray-700 mb-4">{selectedItem.summary}</p>
              
              {(selectedItem.useful !== undefined || selectedItem.notUseful !== undefined) && (
                <div className="flex items-center space-x-4 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => handleVote(selectedItem.id, 'useful')}
                    className={`flex items-center space-x-1 px-4 py-2 rounded-full text-sm transition-colors ${
                      votes[selectedItem.id] === 'useful'
                        ? 'bg-green-100 text-green-700'
                        : 'text-gray-600 hover:bg-green-50'
                    }`}
                  >
                    <span>👍</span>
                    <span>有用 ({(() => {
                      const publishDate = new Date(selectedItem.publishTime.replace('年', '/').replace('月', '/').replace('日', ''));
                      const now = new Date();
                      const hoursDiff = Math.max(1, Math.floor((now.getTime() - publishDate.getTime()) / (1000 * 60 * 60)));
                      const baseUseful = Math.max(1, Math.floor(hoursDiff / 10));
                      return baseUseful + (selectedItem.useful || 0);
                    })()})</span>
                  </button>
                  <button
                    onClick={() => handleVote(selectedItem.id, 'notUseful')}
                    className={`flex items-center space-x-1 px-4 py-2 rounded-full text-sm transition-colors ${
                      votes[selectedItem.id] === 'notUseful'
                        ? 'bg-red-100 text-red-700'
                        : 'text-gray-600 hover:bg-red-50'
                    }`}
                  >
                    <span>👎</span>
                    <span>无用 ({(() => {
                      const publishDate = new Date(selectedItem.publishTime.replace('年', '/').replace('月', '/').replace('日', ''));
                      const now = new Date();
                      const hoursDiff = Math.max(1, Math.floor((now.getTime() - publishDate.getTime()) / (1000 * 60 * 60)));
                      const baseUseful = Math.max(1, Math.floor(hoursDiff / 10));
                      // 基于文章ID生成固定的随机数，使用更好的哈希算法
                      let hash = 0;
                      for (let i = 0; i < selectedItem.id.length; i++) {
                        const char = selectedItem.id.charCodeAt(i);
                        hash = ((hash << 5) - hash) + char;
                        hash = hash & hash; // 转换为32位整数
                      }
                      // 使用绝对值并映射到0.01-0.1范围
                      const normalizedHash = Math.abs(hash) % 10000;
                      const randomMultiplier = 0.01 + (normalizedHash / 10000) * 0.09;
                      const baseUseless = Math.floor(baseUseful * randomMultiplier);
                      return baseUseless + (selectedItem.notUseful || 0);
                    })()})</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* 客服浮标 */}
      <CustomerServiceFloat />
    </div>
  );
}