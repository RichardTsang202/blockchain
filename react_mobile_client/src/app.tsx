import { useState, useEffect } from "react";
import { BottomNavigation } from "./components/BottomNavigation";
import { NewsPage } from "./components/NewsPage";
import { KnowledgePage } from "./components/KnowledgePage";
import { KnowledgeDetailPage } from "./components/KnowledgeDetailPage";
import { ExchangePage } from "./components/ExchangePage";
import { WechatTip } from "./components/WechatTip";

export default function App() {
  const [activeTab, setActiveTab] = useState("news");
  const [currentView, setCurrentView] = useState("main");
  const [selectedKnowledgeId, setSelectedKnowledgeId] = useState<string | null>(null);

  // 监听路由变化（简单的哈希路由）
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#/knowledge/')) {
        const id = hash.split('/')[2];
        setSelectedKnowledgeId(id);
        setCurrentView("knowledge-detail");
        setActiveTab("knowledge");
      } else {
        setCurrentView("main");
        setSelectedKnowledgeId(null);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // 初始化检查

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleBack = () => {
    window.history.back();
  };

  const renderCurrentPage = () => {
    switch (activeTab) {
      case "news":
        return <NewsPage />;
      case "knowledge":
        return (
          <KnowledgePage 
            onKnowledgeSelect={(id) => {
              setSelectedKnowledgeId(id);
              setCurrentView("knowledge-detail");
              window.location.hash = `#/knowledge/${id}`;
            }} 
          />
        );
      case "exchange":
        return <ExchangePage />;
      default:
        return <NewsPage />;
    }
  };

  return (
    <WechatTip>
      <div className="h-screen bg-gray-50 overflow-hidden flex flex-col">
        {currentView === "main" ? (
          <>
            <div className="flex-1 overflow-hidden bg-white" style={{ paddingBottom: '80px' }}>
              {renderCurrentPage()}
            </div>
            <BottomNavigation 
              activeTab={activeTab} 
              onTabChange={setActiveTab} 
            />
          </>
        ) : currentView === "knowledge-detail" && selectedKnowledgeId ? (
          <div className="h-full bg-white">
            <KnowledgeDetailPage 
              knowledgeId={selectedKnowledgeId}
              onBack={handleBack}
            />
          </div>
        ) : null}
      </div>
    </WechatTip>
  );
}