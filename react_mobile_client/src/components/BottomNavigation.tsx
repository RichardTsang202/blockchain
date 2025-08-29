import { Home, BookOpen, TrendingUp } from "lucide-react";

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  const tabs = [
    { id: "news", label: "资讯", icon: Home },
    { id: "knowledge", label: "知识", icon: BookOpen },
    { id: "exchange", label: "交易所", icon: TrendingUp },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t-4 border-blue-200 shadow-2xl" style={{ height: '80px' }}>
      <div className="flex safe-area-pb h-full">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center py-2 px-2 transition-all duration-300 relative ${
                isActive 
                  ? "text-blue-700" 
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              {/* 选中状态指示器 */}
              {isActive && (
                <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-12 h-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-lg"></div>
              )}
              
              {/* 图标容器 */}
              <div className={`p-3 rounded-2xl transition-all duration-300 ${
                isActive 
                  ? "bg-gradient-to-br from-blue-100 to-purple-100 shadow-lg transform scale-125 border-2 border-blue-300" 
                  : "hover:bg-gray-100 hover:scale-110"
              }`}>
                <Icon className="h-8 w-8 stroke-2" />
              </div>
              
              {/* 文字标签 */}
              <span className={`text-sm font-bold mt-1 transition-all duration-300 ${
                isActive ? "text-blue-700" : "text-gray-600"
              }`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}