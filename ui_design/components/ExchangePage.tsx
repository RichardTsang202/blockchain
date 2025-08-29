import { useState } from "react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { CustomerServiceFloat } from "./CustomerServiceFloat";

interface Exchange {
  id: string;
  name: string;
  image: string;
  rating: string;
  website: string;
  summary: string;
  description: string;
  features: string[];
  volume24h: string;
  founded: string;
}

export function ExchangePage() {
  const [expandedExchange, setExpandedExchange] = useState<string | null>(null);

  const exchanges: Exchange[] = [
    {
      id: "1",
      name: "币安 (Binance)",
      image: "https://images.unsplash.com/photo-1639133893916-a711d8af8c0a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibG9ja2NoYWluJTIwY3J5cHRvY3VycmVuY3klMjBiaXRjb2lufGVufDF8fHx8MTc1NjM1NzI1N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      rating: "A+",
      website: "https://binance.com",
      summary: "全球最大的加密货币交易所",
      description: "币安是全球领先的区块链生态系统和加密货币基础设施提供商，拥有最大的数字货币交易量。平台提供超过600种加密货币的交易服务，支持现货交易、期货交易、期权交易等多种交易方式。币安以其高流动性、低手续费和丰富的产品线而闻名。",
      features: ["现货交易", "期货交易", "杠杆交易", "理财产品", "NFT市场"],
      volume24h: "$15.2B",
      founded: "2017年"
    },
    {
      id: "2",
      name: "欧易 (OKX)",
      image: "https://images.unsplash.com/photo-1668091818168-61a18ea51275?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFkaW5nJTIwZXhjaGFuZ2UlMjBmaW5hbmNlfGVufDF8fHx8MTc1NjM1NzI1OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      rating: "A",
      website: "https://okx.com",
      summary: "全面的数字资产交易平台",
      description: "OKX是一家全球性的加密货币交易所和Web3技术公司，为全球用户提供先进的金融服务。平台拥有强大的技术基础设施，支持高频交易和大额交易。除了基础的现货交易外，OKX还提供DeFi、NFT、Web3钱包等创新服务。",
      features: ["现货交易", "合约交易", "DeFi服务", "Web3钱包", "量化交易"],
      volume24h: "$8.7B",
      founded: "2017年"
    },
    {
      id: "3",
      name: "火币 (Huobi)",
      image: "https://images.unsplash.com/photo-1695548487485-be21a55c1d78?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcnlwdG9jdXJyZW5jeSUyMG5ld3MlMjB0ZWNobm9sb2d5fGVufDF8fHx8MTc1NjM1NzI2Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      rating: "B+",
      website: "https://huobi.com",
      summary: "老牌数字货币交易平台",
      description: "火币是全球知名的数字资产交易平台之一，成立于2013年，是行业内的老牌交易所。平台以安全稳定著称，拥有完善的风控体系和用户保护机制。火币在全球多个国家和地区都有业务布局，为用户提供本地化的服务。",
      features: ["现货交易", "合约交易", "ETF产品", "法币交易", "矿池服务"],
      volume24h: "$3.2B",
      founded: "2013年"
    }
  ];

  const toggleExpanded = (exchangeId: string) => {
    setExpandedExchange(expandedExchange === exchangeId ? null : exchangeId);
  };

  const openWebsite = (url: string) => {
    window.open(url, '_blank');
  };

  const getRatingColor = (rating: string) => {
    if (rating.startsWith('A')) return 'bg-green-100 text-green-800';
    if (rating.startsWith('B')) return 'bg-blue-100 text-blue-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="p-4 pb-20 space-y-4">
      <h1 className="mb-4">加密货币交易所</h1>
      
      {exchanges.map((exchange) => {
        const isExpanded = expandedExchange === exchange.id;
        
        return (
          <Card key={exchange.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start gap-3">
                <ImageWithFallback 
                  src={exchange.image}
                  alt={exchange.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 style={{fontSize: '1.25rem'}}>{exchange.name}</h3>
                    <Badge className={getRatingColor(exchange.rating)} style={{fontSize: '1rem'}}>
                      {exchange.rating}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mb-2" style={{fontSize: '1rem'}}>{exchange.summary}</p>
                  <div className="flex items-center gap-4 text-muted-foreground" style={{fontSize: '0.95rem'}}>
                    <span>24h交易量: {exchange.volume24h}</span>
                    <span>成立: {exchange.founded}</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openWebsite(exchange.website)}
                  className="flex-1"
                >
                  <ExternalLink className="w-4 h-4 mr-1" />
                  访问官网
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleExpanded(exchange.id)}
                  className="px-3"
                >
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </Button>
              </div>

              {isExpanded && (
                <div className="space-y-3 pt-3 border-t border-border">
                  <div>
                    <h4 className="mb-2" style={{fontSize: '1.1rem'}}>详细介绍</h4>
                    <p className="text-muted-foreground" style={{fontSize: '1rem'}}>{exchange.description}</p>
                  </div>
                  
                  <div>
                    <h4 className="mb-2" style={{fontSize: '1.1rem'}}>主要功能</h4>
                    <div className="flex flex-wrap gap-1">
                      {exchange.features.map((feature, index) => (
                        <Badge key={index} variant="secondary" style={{fontSize: '0.95rem'}}>
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
    
    {/* 客服浮标 */}
    <CustomerServiceFloat />
  </div>
);
}