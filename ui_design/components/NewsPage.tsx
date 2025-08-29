import { useState } from "react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { VoteButtons } from "./VoteButtons";
import { ShareButton } from "./ShareButton";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { CustomerServiceFloat } from "./CustomerServiceFloat";

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  image: string;
  publishTime: string;
}

export function NewsPage() {
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [votes, setVotes] = useState<Record<string, string>>({});

  const newsItems: NewsItem[] = [
    {
      id: "1",
      title: "比特币突破新高，市场情绪乐观",
      summary: "比特币价格创下历史新高，投资者情绪高涨，专家分析后市走势...",
      content: "比特币价格在今日突破了历史最高点，达到了$75,000的新高度。这一突破标志着加密货币市场的强劲复苏，投资者信心大幅提升。分析师认为，这次突破是由多重因素推动的，包括机构投资者的持续流入、监管环境的改善以及宏观经济的不确定性。未来几周，市场将密切关注比特币能否站稳这一价位，并继续向更高的目标进发。",
      image: "https://images.unsplash.com/photo-1639133893916-a711d8af8c0a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibG9ja2NoYWluJTIwY3J5cHRvY3VycmVuY3klMjBiaXRjb2lufGVufDF8fHx8MTc1NjM1NzI1N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      publishTime: "2小时前"
    },
    {
      id: "2",
      title: "以太坊2.0升级完成，性能大幅提升",
      summary: "以太坊网络成功完成重大升级，交易速度和能耗优化显著...",
      content: "以太坊网络今日宣布其2.0升级已全面完成，这次升级带来了显著的性能改进。新的共识机制使得网络的能耗降低了99%，同时交易处理速度提升了100倍。这一里程碑式的升级为DeFi和NFT应用提供了更好的基础设施支持，预计将推动整个生态系统的进一步发展。",
      image: "https://images.unsplash.com/photo-1695548487485-be21a55c1d78?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcnlwdG9jdXJyZW5jeSUyMG5ld3MlMjB0ZWNobm9sb2d5fGVufDF8fHx8MTc1NjM1NzI2Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      publishTime: "4小时前"
    },
    {
      id: "3",
      title: "央行数字货币试点范围扩大",
      summary: "多个国家央行宣布扩大数字货币试点，区块链技术应用加速...",
      content: "全球多个央行今日同时宣布扩大其央行数字货币(CBDC)的试点范围。中国、欧盟、日本等主要经济体都在加速推进数字货币的研发和测试。专家认为，这标志着全球金融体系正在经历一场深刻的数字化变革，传统货币体系将面临重大挑战和机遇。",
      image: "https://images.unsplash.com/photo-1668091818168-61a18ea51275?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFkaW5nJTIwZXhjaGFuZ2UlMjBmaW5hbmNlfGVufDF8fHx8MTc1NjM1NzI1OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      publishTime: "6小时前"
    }
  ];

  const handleVote = (newsId: string, vote: string) => {
    setVotes(prev => ({
      ...prev,
      [newsId]: vote
    }));
  };

  return (
    <div className="p-4 pb-20 space-y-4">
      <h1 className="mb-4">区块链资讯</h1>
      
      {newsItems.map((news) => (
        <Card 
          key={news.id} 
          className="cursor-pointer"
          onClick={() => setSelectedNews(news)}
        >
          <CardHeader className="pb-2">
            <ImageWithFallback 
              src={news.image}
              alt={news.title}
              className="w-full h-48 object-cover rounded-lg"
            />
          </CardHeader>
          <CardContent>
            <h3 className="mb-2">{news.title}</h3>
            <p className="text-muted-foreground mb-2">{news.summary}</p>
            <div className="flex justify-between items-center text-sm text-muted-foreground">
              <span>{news.publishTime}</span>
              <ShareButton title={news.title} />
            </div>
          </CardContent>
        </Card>
      ))}

      <Dialog open={!!selectedNews} onOpenChange={() => setSelectedNews(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedNews?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedNews && (
              <>
                <ImageWithFallback 
                  src={selectedNews.image}
                  alt={selectedNews.title}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <p>{selectedNews.content}</p>
                <div className="space-y-2">
                  <p className="text-sm">您对这条资讯的看法：</p>
                  <VoteButtons 
                    type="trend"
                    onVote={(vote) => handleVote(selectedNews.id, vote)}
                    userVote={votes[selectedNews.id]}
                  />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">{selectedNews.publishTime}</span>
                  <ShareButton title={selectedNews.title} />
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog></div>
      
      {/* 客服浮标 */}
      <CustomerServiceFloat />
    </div>
  );
}