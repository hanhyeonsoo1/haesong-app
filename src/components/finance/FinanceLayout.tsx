import { useState, ReactNode } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import VendorManager from "./VendorManager";
import ExpenseManager from "./ExpenseManager";
import RevenueManager from "./RevenueManager";
import MonthlyReport from "./MonthlyReport";
import { Receipt, BadgeDollarSign, Users, BarChart3 } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface TabConfig {
  id: string;
  label: string;
  icon: ReactNode;
  component: ReactNode;
}

export default function FinanceLayout() {
  const [activeTab, setActiveTab] = useState<string>("report");
  const isMobile = useIsMobile();

  const tabs: TabConfig[] = [
    {
      id: "report",
      label: "매출 및 순익 리포트",
      icon: <BarChart3 size={16} />,
      component: <MonthlyReport />
    },
    {
      id: "revenue",
      label: "매출 관리",
      icon: <BadgeDollarSign size={16} />,
      component: <RevenueManager />
    },
    {
      id: "expense",
      label: "지출 관리",
      icon: <Receipt size={16} />,
      component: <ExpenseManager />
    },
    {
      id: "vendor",
      label: "거래처 관리",
      icon: <Users size={16} />,
      component: <VendorManager />
    }
  ];

  // 모바일 화면에서는 탭 목록을 스크롤 가능하게 함
  return (
    <div className="container py-4">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-center">매출 경리 관리 시스템</h1>
        <p className="text-muted-foreground text-center">일별 매출 기록, 지출 관리, 월별 분석을 한 곳에서</p>
      </div>

      {isMobile ? (
        // 모바일에서는 버튼 메뉴 형태로 제공
        <div className="space-y-4">
          <div className="flex overflow-x-auto p-1 space-x-2 pb-4 scrollbar-hide">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "outline"}
                className="flex-shrink-0"
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </Button>
            ))}
          </div>
          <div>
            {tabs.find(tab => tab.id === activeTab)?.component}
          </div>
        </div>
      ) : (
        // 데스크탑에서는 탭 형태로 제공
        <Tabs defaultValue="report" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-8">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2">
                {tab.icon}
                <span>{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
          {tabs.map((tab) => (
            <TabsContent key={tab.id} value={tab.id}>
              {tab.component}
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  );
}