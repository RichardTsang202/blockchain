import { useState } from "react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ShareButton } from "./ShareButton";
import { CustomerServiceFloat } from "./CustomerServiceFloat";

interface KnowledgeItem {
  id: string;
  title: string;
  summary: string;
  image: string;
  author: string;
  readTime: string;
}

export function KnowledgePage() {
  const [knowledgeItems] = useState<KnowledgeItem[]>([
    {
      id: "1",
      title: "区块链技术基础：从入门到精通",
      summary: "全面解析区块链技术原理，包括哈希函数、数字签名、共识机制等核心概念...",
      image: "https://images.unsplash.com/photo-1639133893916-a711d8af8c0a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibG9ja2NoYWluJTIwY3J5cHRvY3VycmVuY3klMjBiaXRjb2lufGVufDF8fHx8MTc1NjM1NzI1N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      author: "李博士",
      readTime: "15分钟阅读"
    },
    {
      id: "2",
      title: "DeFi投资指南：风险与机遇并存",
      summary: "深入分析去中心化金融的投资策略，帮助投资者识别风险和把握机会...",
      image: "https://images.unsplash.com/photo-1668091818168-61a18ea51275?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFkaW5nJTIwZXhjaGFuZ2UlMjBmaW5hbmNlfGVufDF8fHx8MTc1NjM1NzI1OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      author: "王老师",
      readTime: "20分钟阅读"
    },
    {
      id: "3",
      title: "NFT市场分析：数字艺术的未来",
      summary: "探索NFT市场的发展趋势，分析数字收藏品的价值评估方法...",
      image: "https://images.unsplash.com/photo-1755991698893-24ab0ddc82ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZHVjYXRpb24lMjBsZWFybmluZyUyMGtub3dsZWRnZXxlbnwxfHx8fDE3NTYzNTcyNjV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      author: "张教授",
      readTime: "12分钟阅读"
    }
  ]);

  const handleKnowledgeClick = (item: KnowledgeItem) => {
    window.location.hash = `#/knowledge/${item.id}`;
  };

  return (
    <div className="p-4 pb-20 space-y-4">
      <h1 className="mb-4">知识分享</h1>
      
      {knowledgeItems.map((item) => (
        <Card 
          key={item.id} 
          className="cursor-pointer"
          onClick={() => handleKnowledgeClick(item)}
        >
          <CardHeader className="pb-2">
            <ImageWithFallback 
              src={item.image}
              alt={item.title}
              className="w-full h-48 object-cover rounded-lg"
            />
          </CardHeader>
          <CardContent>
            <h3 className="mb-2">{item.title}</h3>
            <p className="text-muted-foreground mb-3">{item.summary}</p>
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                <span>作者：{item.author}</span>
                <span className="ml-3">{item.readTime}</span>
              </div>
              <ShareButton title={item.title} />
            </div>
          </CardContent>
        </Card>
      ))}
      
      {/* 客服浮标 */}
      <CustomerServiceFloat />
    </div>
  );
}