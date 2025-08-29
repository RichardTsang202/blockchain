import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";
import { VoteButtons } from "./VoteButtons";
import { ShareButton } from "./ShareButton";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface KnowledgeDetailPageProps {
  knowledgeId: string;
  onBack: () => void;
}

export function KnowledgeDetailPage({ knowledgeId, onBack }: KnowledgeDetailPageProps) {
  const [userVote, setUserVote] = useState<string | null>(null);

  const article = {
    id: knowledgeId,
    title: "区块链技术基础：从入门到精通",
    author: "李博士",
    publishTime: "2024年8月28日",
    readTime: "15分钟阅读",
    image: "https://images.unsplash.com/photo-1639133893916-a711d8af8c0a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibG9ja2NoYWluJTIwY3J5cHRvY3VycmVuY3klMjBiaXRjb2lufGVufDF8fHx8MTc1NjM1NzI1N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    content: `引言

区块链技术作为一项革命性的创新，正在改变着我们对数据存储、交易验证和去中心化系统的理解。本文将深入探讨区块链的核心概念和技术原理。

什么是区块链？

区块链是一种分布式账本技术，它将数据以"区块"的形式链接起来，形成一个不可篡改的数据链。每个区块包含：

• 时间戳：记录区块创建的时间
• 交易数据：存储在该区块中的所有交易信息
• 哈希值：区块的唯一标识符
• 前一个区块的哈希值：确保链的连续性

核心技术组件

1. 哈希函数
哈希函数是区块链安全性的基础，它将任意长度的输入转换为固定长度的输出。常用的哈希算法包括SHA-256。

2. 数字签名
数字签名确保交易的真实性和不可否认性。通过公钥和私钥的配对，可以验证交易的发起者。

3. 共识机制
共识机制是区块链网络中所有节点就网络状态达成一致的方法。主要类型包括：
• 工作量证明（PoW）
• 权益证明（PoS）
• 委托权益证明（DPoS）

应用场景

区块链技术在多个领域都有广泛的应用前景：

1. 加密货币：比特币、以太坊等数字货币
2. 供应链管理：追踪产品从生产到消费的全过程
3. 身份验证：去中心化的身份管理系统
4. 智能合约：自动执行的合约条款

总结

区块链技术虽然还在发展初期，但其潜力巨大。随着技术的不断成熟和应用场景的扩展，区块链将在未来的数字经济中发挥越来越重要的作用。

学习区块链技术需要循序渐进，从基础概念开始，逐步深入到具体的技术实现和应用开发。`
  };

  const handleVote = (vote: string) => {
    setUserVote(vote);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 bg-background border-b border-border p-4 flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <span>知识文章</span>
      </div>

      <div className="p-4 pb-20">
        <article className="space-y-4">
          <ImageWithFallback 
            src={article.image}
            alt={article.title}
            className="w-full h-48 object-cover rounded-lg"
          />
          
          <div>
            <h1 className="mb-3">{article.title}</h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
              <span>{article.publishTime}</span>
              <span>{article.readTime}</span>
            </div>
          </div>

          <div className="prose prose-sm max-w-none space-y-3">
            {article.content.split('\n\n').map((paragraph, index) => (
              <p key={index} className="mb-3">{paragraph}</p>
            ))}
          </div>

          <div className="border-t border-border pt-6 space-y-3">
            <p>这篇文章对您是否有帮助？</p>
            <VoteButtons 
              type="useful"
              onVote={handleVote}
              userVote={userVote}
            />
          </div>

          <div className="flex justify-center">
            <ShareButton title={article.title} />
          </div>
        </article>
      </div>
    </div>
  );
}