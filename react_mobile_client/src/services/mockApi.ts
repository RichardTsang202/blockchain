// 模拟API服务

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  imageUrl: string;
  publishTime: string;
  source: string;
  category: string;
  readCount: number;
  likeCount: number;
  commentCount: number;
  isLiked: boolean;
}

export interface KnowledgeItem {
  id: string;
  title: string;
  summary: string;
  image: string;
  publishTime: string;
  category: string;
  type: 'article' | 'video' | 'audio';
  duration?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  readCount: number;
  likeCount: number;
  isLiked: boolean;
  useful?: number;
  notUseful?: number;
}

export interface ExchangeItem {
  id: string;
  name: string;
  logo: string;
  description: string;
  type: 'centralized' | 'decentralized';
  rating: number;
  volume24h: string;
  tradingPairs: number;
  established: string;
  country: string;
  website: string;
  isVerified: boolean;
}

// 生成模拟新闻数据
function generateNewsItem(id: number): NewsItem {
  const categories = ['Bitcoin', 'Ethereum', 'DeFi', 'GameFi', 'Layer2', 'Oracle', 'Metaverse', 'Web3'];
  const sources = ['CoinDesk', 'Cointelegraph', '金色财经', '链闻', 'The Block'];
  
  // 预定义的5个具体资讯内容
  const predefinedNews = [
    {
      id: 'news-1',
      title: 'Bitcoin突破65000美元大关，创年内新高',
      summary: 'Bitcoin价格在机构投资者大量买入的推动下，成功突破65000美元关键阻力位，创下年内新高。分析师认为这轮上涨主要受益于美国现货ETF资金流入和减半预期。市场情绪乐观，多头力量强劲。',
      imageUrl: 'https://picsum.photos/400/240?random=1001',
      publishTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2小时前
      source: 'CoinDesk',
      category: 'Bitcoin',
      readCount: 15420,
      likeCount: 892,
      commentCount: 156,
      isLiked: false
    },
    {
      id: 'news-2',
      title: 'Ethereum 2.0质押总量突破3200万ETH',
      summary: 'Ethereum 2.0信标链质押总量已突破3200万ETH，占ETH总供应量的26.7%。质押收益率维持在3.2%左右，吸引了大量机构和个人投资者参与。这表明市场对以太坊长期发展前景充满信心。',
      imageUrl: 'https://picsum.photos/400/240?random=1002',
      publishTime: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4小时前
      source: '金色财经',
      category: 'Ethereum',
      readCount: 12350,
      likeCount: 567,
      commentCount: 89,
      isLiked: true
    },
    {
      id: 'news-3',
      title: 'Solana生态GameFi项目爆发式增长',
      summary: 'Solana生态系统GameFi项目数量激增，总用户数突破500万。主要受益于Star Atlas、Aurory等头部游戏的成功，以及新兴链游项目的快速发展。Solana凭借高性能和低手续费优势持续吸引游戏开发者。',
      imageUrl: 'https://picsum.photos/400/240?random=1003',
      publishTime: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6小时前
      source: 'The Block',
      category: 'GameFi',
      readCount: 8760,
      likeCount: 423,
      commentCount: 67,
      isLiked: false
    },
    {
      id: 'news-4',
      title: 'Chainlink预言机网络升级，提升数据安全性',
      summary: 'Chainlink发布重大网络升级，新增多重签名验证和去中心化数据源聚合功能。升级后的预言机网络将提供更安全、更可靠的链上数据服务，支持更多智能合约应用场景。',
      imageUrl: 'https://picsum.photos/400/240?random=1004',
      publishTime: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8小时前
      source: 'Cointelegraph',
      category: 'Oracle',
      readCount: 6890,
      likeCount: 334,
      commentCount: 45,
      isLiked: true
    },
    {
      id: 'news-5',
      title: 'Polygon网络交易量创新高，生态发展迅速',
      summary: 'Polygon作为以太坊扩容解决方案，其日交易量创下新高，达到180万笔交易。这标志着扩容技术的成熟和用户接受度的提高。低手续费和快速确认时间是其主要优势。',
      imageUrl: 'https://picsum.photos/400/240?random=1005',
      publishTime: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12小时前
      source: '链闻',
      category: 'Layer2',
      readCount: 9540,
      likeCount: 478,
      commentCount: 78,
      isLiked: false
    },
    {
      id: 'news-6',
      title: 'DeFi协议总锁仓量突破1000亿美元',
      summary: 'DeFi生态系统继续快速发展，总锁仓量(TVL)首次突破1000亿美元大关。Uniswap、Aave、Compound等头部协议贡献了主要份额，显示出去中心化金融的强劲增长势头。',
      imageUrl: 'https://picsum.photos/400/240?random=1006',
      publishTime: new Date(Date.now() - 16 * 60 * 60 * 1000).toISOString(), // 16小时前
      source: 'The Block',
      category: 'DeFi',
      readCount: 11200,
      likeCount: 645,
      commentCount: 92,
      isLiked: true
    },
    {
      id: 'news-7',
      title: 'Web3社交平台用户数量激增',
      summary: 'Web3社交平台如Lens Protocol、Farcaster等用户数量快速增长，月活跃用户突破500万。用户对数据所有权和隐私保护的需求推动了去中心化社交网络的发展。',
      imageUrl: 'https://picsum.photos/400/240?random=1007',
      publishTime: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(), // 20小时前
      source: 'Cointelegraph',
      category: 'Web3',
      readCount: 7890,
      likeCount: 412,
      commentCount: 58,
      isLiked: false
    },
    {
      id: 'news-8',
      title: 'Metaverse虚拟土地交易创新纪录',
      summary: 'The Sandbox和Decentraland等元宇宙平台的虚拟土地交易量创下新高，单日交易额超过2000万美元。知名品牌和机构纷纷入驻，推动虚拟房地产市场繁荣发展。',
      imageUrl: 'https://picsum.photos/400/240?random=1008',
      publishTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1天前
      source: '金色财经',
      category: 'Metaverse',
      readCount: 6540,
      likeCount: 298,
      commentCount: 41,
      isLiked: true
    }
  ];
  
  // 如果id在预定义范围内，返回具体内容
  if (id >= 1 && id <= 8) {
    return predefinedNews[id - 1];
  }
  
  // 否则返回生成的内容
  return {
    id: `news-${id}`,
    title: `区块链新闻标题 ${id} - ${categories[id % categories.length]}领域重大突破`,
    summary: `这是第${id}条新闻的摘要内容，详细介绍了${categories[id % categories.length]}领域的最新发展动态和技术创新。`,
    imageUrl: `https://picsum.photos/400/240?random=${id}`,
    publishTime: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    source: sources[id % sources.length],
    category: categories[id % categories.length],
    readCount: Math.floor(Math.random() * 10000) + 100,
    likeCount: Math.floor(Math.random() * 500) + 10,
    commentCount: Math.floor(Math.random() * 100) + 5,
    isLiked: Math.random() > 0.7
  };
}

// 生成模拟知识数据
function generateKnowledgeItem(id: number): KnowledgeItem {
  const categories = ['基础概念', '技术分析', '投资策略', '安全防护', '项目分析'];
  const types: ('article' | 'video' | 'audio')[] = ['article', 'video', 'audio'];
  const difficulties: ('beginner' | 'intermediate' | 'advanced')[] = ['beginner', 'intermediate', 'advanced'];
  
  // 使用更复杂的ID生成策略，确保每篇文章ID唯一且稳定
  const baseId = id.toString();
  const categoryHash = categories[id % categories.length].split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const typeHash = types[id % types.length].split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const uniqueId = `knowledge-${baseId}-${categoryHash}-${typeHash}`;
  
  return {
    id: uniqueId,
    title: `区块链知识 ${id} - ${categories[id % categories.length]}详解`,
    summary: `深入浅出地讲解${categories[id % categories.length]}相关知识，帮助用户更好地理解区块链技术。`,
    image: `https://picsum.photos/400/240?random=${id + 1000}`,
    publishTime: `2024年${Math.floor(Math.random() * 12) + 1}月${Math.floor(Math.random() * 28) + 1}日`,
    category: categories[id % categories.length],
    type: types[id % types.length],
    duration: types[id % types.length] !== 'article' ? `${Math.floor(Math.random() * 30) + 5}分钟` : undefined,
    difficulty: difficulties[id % difficulties.length],
    readCount: Math.floor(Math.random() * 5000) + 50,
    likeCount: Math.floor(Math.random() * 300) + 5,
    isLiked: Math.random() > 0.8,
    useful: Math.floor(Math.random() * 50),
    notUseful: Math.floor(Math.random() * 10)
  };
}

// 生成模拟交易所数据
function generateExchangeItem(id: number): ExchangeItem {
  const names = ['Binance', 'Coinbase', 'Kraken', 'Uniswap', 'SushiSwap', 'PancakeSwap', 'Huobi', 'OKX', 'KuCoin', 'Gate.io'];
  const countries = ['Malta', 'USA', 'Singapore', 'Japan', 'South Korea', 'UK', 'Canada'];
  const types: ('centralized' | 'decentralized')[] = ['centralized', 'decentralized'];
  
  return {
    id: `exchange-${id}`,
    name: `${names[id % names.length]} ${id > names.length ? `Pro ${Math.floor(id / names.length)}` : ''}`,
    logo: `https://picsum.photos/64/64?random=${id + 2000}`,
    description: `全球领先的数字资产交易平台，提供安全、稳定、高效的交易服务。`,
    type: types[id % 2],
    rating: Math.round((Math.random() * 2 + 3) * 10) / 10, // 3.0-5.0
    volume24h: `$${(Math.random() * 10000000000).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`,
    tradingPairs: Math.floor(Math.random() * 500) + 50,
    established: `${2010 + Math.floor(Math.random() * 14)}`,
    country: countries[id % countries.length],
    website: `https://${names[id % names.length].toLowerCase()}.com`,
    isVerified: Math.random() > 0.3
  };
}

// 模拟网络延迟
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// 原始新闻API函数（不带缓存）
const _getNews = async (page: number, pageSize: number = 20): Promise<{
  data: NewsItem[];
  hasNextPage: boolean;
  totalCount: number;
}> => {
  // 模拟网络延迟
  await delay(Math.random() * 1000 + 500);
  
  const totalCount = 1000; // 模拟总共1000条新闻
  const startIndex = (page - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalCount);
  
  const data = [];
  for (let i = startIndex; i < endIndex; i++) {
    data.push(generateNewsItem(i + 1));
  }
  
  return {
    data,
    hasNextPage: endIndex < totalCount,
    totalCount
  };
};

// 新闻API
export const newsApi = {
  getNews: _getNews
};

// 原始知识API函数（不带缓存）
const _getKnowledge = async (page: number, pageSize: number = 20): Promise<{
  data: KnowledgeItem[];
  hasNextPage: boolean;
  totalCount: number;
}> => {
  await delay(Math.random() * 800 + 400);
  
  const totalCount = 500; // 模拟总共500条知识
  const startIndex = (page - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalCount);
  
  const data = [];
  for (let i = startIndex; i < endIndex; i++) {
    data.push(generateKnowledgeItem(i + 1));
  }
  
  return {
    data,
    hasNextPage: endIndex < totalCount,
    totalCount
  };
};

// 知识API
export const knowledgeApi = {
  getKnowledge: _getKnowledge
};

// 原始交易所API函数（不带缓存）
const _getExchanges = async (page: number, pageSize: number = 20, type?: 'centralized' | 'decentralized'): Promise<{
  data: ExchangeItem[];
  hasNextPage: boolean;
  totalCount: number;
}> => {
  await delay(Math.random() * 600 + 300);
  
  const totalCount = 200; // 模拟总共200个交易所
  const startIndex = (page - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalCount);
  
  let data = [];
  for (let i = startIndex; i < endIndex; i++) {
    data.push(generateExchangeItem(i + 1));
  }
  
  // 根据类型过滤
  if (type) {
    data = data.filter(item => item.type === type);
  }
  
  return {
    data,
    hasNextPage: endIndex < totalCount,
    totalCount: type ? Math.floor(totalCount / 2) : totalCount
  };
};

// 交易所API
export const exchangeApi = {
  getExchanges: _getExchanges
};

// 错误模拟（用于测试错误处理）
export const simulateError = (probability: number = 0.1): boolean => {
  return Math.random() < probability;
};