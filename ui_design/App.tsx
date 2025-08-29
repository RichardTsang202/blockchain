import { useState, useEffect } from "react";
import { BottomNavigation } from "./components/BottomNavigation";
import { NewsPage } from "./components/NewsPage";
import { KnowledgePage } from "./components/KnowledgePage";
import { KnowledgeDetailPage } from "./components/KnowledgeDetailPage";
import { ExchangePage } from "./components/ExchangePage";

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

  const renderMainContent = () => {
    switch (activeTab) {
      case "news":
        return <NewsPage />;
      case "knowledge":
        return <KnowledgePage />;
      case "exchange":
        return <ExchangePage />;
      default:
        return <NewsPage />;
    }
  };

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {currentView === "main" ? (
        <>
          {renderMainContent()}
          <BottomNavigation 
            activeTab={activeTab} 
            onTabChange={setActiveTab} 
          />
        </>
      ) : currentView === "knowledge-detail" && selectedKnowledgeId ? (
        <KnowledgeDetailPage 
          knowledgeId={selectedKnowledgeId}
          onBack={handleBack}
        />
      ) : null}
    </div>
  );
}