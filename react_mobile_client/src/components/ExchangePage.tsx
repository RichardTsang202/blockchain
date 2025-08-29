import { useState } from "react";
import { Card, CardContent, CardHeader } from "./ui/Card";
import { Badge } from "./ui/Badge";
import { Button } from "./ui/Button";
import { ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
import { CustomerServiceFloat } from './CustomerServiceFloat';

import { ShareButton } from "./ShareButton";

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
  type: 'centralized' | 'decentralized';
}

export function ExchangePage() {
  const [expandedExchange, setExpandedExchange] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<'centralized' | 'decentralized'>('centralized');

  const exchanges: Exchange[] = [
    {
      id: "1",
      name: "币安 (Binance)",
      image: "https://images.unsplash.com/photo-1639133893916-a711d8af8c0a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibG9ja2NoYWluJTIwY3J5cHRvY3VycmVuY3klMjBiaXRjb2lufGVufDF8fHx8MTc1NjM1NzI1N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      rating: "A+",
      website: "https://binance.com",
      summary: "全球最大的加密货币交易所",
      description: "币安是全球领先的区块链生态系统和加密货币基础设施提供商，拥有最大的数字货币交易量。平台提供超过600种加密货币的交易服务，支持现货交易、期货交易、期权交易等多种交易方式。币安以其高流动性、低手续费和丰富的产品线而闻名。",
      features: ["现货交易", "期货交易", "杠杆交易", "理财产品", "法币交易"],
      volume24h: "$15.2B",
      founded: "2017年",
      type: "centralized"
    },
    {
      id: "2",
      name: "欧易 (OKX)",
      image: "https://images.unsplash.com/photo-1668091818168-61a18ea51275?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFkaW5nJTIwZXhjaGFuZ2UlMjBmaW5hbmNlfGVufDF8fHx8MTc1NjM1NzI1OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      rating: "A",
      website: "https://okx.com",
      summary: "全面的数字资产交易平台",
      description: "OKX是一家全球性的加密货币交易所和Web3技术公司，为全球用户提供先进的金融服务。平台拥有强大的技术基础设施，支持高频交易和大额交易。除了基础的现货交易外，OKX还提供NFT、Web3钱包等创新服务。",
      features: ["现货交易", "合约交易", "NFT服务", "Web3钱包", "量化交易"],
      volume24h: "$8.7B",
      founded: "2017年",
      type: "centralized"
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
      founded: "2013年",
      type: "centralized"
    },
    {
      id: "4",
      name: "Uniswap",
      image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZWZpJTIwdW5pc3dhcCUyMGRlY2VudHJhbGl6ZWR8ZW58MXx8fHwxNzU2MzU3MjY1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      rating: "A",
      website: "https://uniswap.org",
      summary: "领先的去中心化交易协议",
      description: "Uniswap是以太坊上最大的去中心化交易所(DEX)，采用自动做市商(AMM)模式。用户可以直接从钱包进行交易，无需注册账户或KYC验证。Uniswap支持任何ERC-20代币的交易，并允许用户通过提供流动性来赚取手续费。",
      features: ["AMM交易", "流动性挖矿", "无需KYC", "去中心化治理", "跨链支持"],
      volume24h: "$1.2B",
      founded: "2018年",
      type: "decentralized"
    },
    {
      id: "5",
      name: "PancakeSwap",
      image: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYW5jYWtlc3dhcCUyMGRlZml8ZW58MXx8fHwxNzU2MzU3MjY3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      rating: "B+",
      website: "https://pancakeswap.finance",
      summary: "BSC链上的去中心化交易所",
      description: "PancakeSwap是币安智能链(BSC)上最大的去中心化交易所，提供低手续费的交易体验。除了基础的代币交换功能外，还提供流动性挖矿、质押、NFT市场等多种DeFi服务。平台以其可爱的煎饼主题和丰富的游戏化功能而受到用户喜爱。",
      features: ["低手续费交易", "流动性挖矿", "质押奖励", "NFT市场", "预测市场"],
      volume24h: "$800M",
      founded: "2020年",
      type: "decentralized"
    }
  ];

  const filteredExchanges = exchanges.filter(exchange => exchange.type === activeCategory);

  const toggleExpanded = (exchangeId: string) => {
    setExpandedExchange(expandedExchange === exchangeId ? null : exchangeId);
  };

  const openWebsite = (url: string, event: React.MouseEvent) => {
    event.stopPropagation();
    window.open(url, '_blank');
  };

  const handleCardClick = (exchangeId: string) => {
    toggleExpanded(exchangeId);
  };

  const handleButtonClick = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  const getRatingColor = (rating: string) => {
    if (rating.startsWith('A')) return 'bg-green-100 text-green-800';
    if (rating.startsWith('B')) return 'bg-blue-100 text-blue-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="h-full overflow-y-auto">
      {/* 头部 */}
      <div className="bg-gradient-to-r from-orange-50 to-red-50 border-b border-gray-200" style={{ paddingTop: 'env(safe-area-inset-top, 20px)' }}>
        <div className="px-4 py-6">
          <div className="text-center mb-3">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent">
              加密货币交易所
            </h1>
            <div className="flex justify-center mt-2">
              <div className="w-32 h-1 bg-gradient-to-r from-orange-600 to-red-600 rounded-full"></div>
            </div>
          </div>
          
          {/* 分类切换按钮 */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveCategory('centralized')}
              className={`flex-1 py-2 px-4 rounded-md text-xl font-medium transition-all ${
                activeCategory === 'centralized'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              中心化交易所
            </button>
            <button
              onClick={() => setActiveCategory('decentralized')}
              className={`flex-1 py-2 px-4 rounded-md text-xl font-medium transition-all ${
                activeCategory === 'decentralized'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              去中心化交易所
            </button>
          </div>
        </div>
      </div>
      
      {/* 内容区域 */}
      <div className="p-4 space-y-4">
      
      {filteredExchanges.map((exchange) => {
        const isExpanded = expandedExchange === exchange.id;
        
        return (
          <Card key={exchange.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleCardClick(exchange.id)}>
            <CardHeader className="pb-3">
              <div className="flex items-start gap-3">
                <img 
                  src={exchange.image}
                  alt={exchange.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xl font-bold">{exchange.name}</h3>
                    <Badge className={`${getRatingColor(exchange.rating)} text-lg px-3 py-1`}>
                      {exchange.rating}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-lg mb-2">{exchange.summary}</p>
                  <div className="flex items-center gap-4 text-base text-muted-foreground">
                    <span>24h交易量: {exchange.volume24h}</span>
                    <span>成立: {exchange.founded}</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <Button
                  variant="default"
                  size="sm"
                  onClick={(e) => {
                    handleButtonClick(e);
                    openWebsite(exchange.website, e);
                  }}
                  className="flex-1 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-lg py-3"
                >
                  <ExternalLink className="w-5 h-5 mr-2" />
                  访问官网
                </Button>
                <div onClick={handleButtonClick}>
                  <ShareButton 
                    title={`${exchange.name} - ${exchange.summary}`}
                    url={exchange.website}
                  />
                </div>
              </div>

              {isExpanded && (
                <div className="space-y-3 pt-3 border-t border-border">
                  <div>
                    <h4 className="mb-2 text-lg font-bold">详细介绍</h4>
                    <p className="text-base text-muted-foreground">{exchange.description}</p>
                  </div>
                  
                  <div>
                    <h4 className="mb-2 text-lg font-bold">主要功能</h4>
                    <div className="flex flex-wrap gap-2">
                      {exchange.features.map((feature, index) => (
                        <Badge key={index} variant="secondary" className="text-sm px-3 py-1">
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