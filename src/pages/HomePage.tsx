import FinanceLayout from "@/components/finance/FinanceLayout";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

export default function HomePage() {
  const { toast } = useToast();
  
  // 웰컴 메시지 표시
  useEffect(() => {
    toast({
      title: "매출 경리 관리 시스템이 준비되었습니다",
      description: "일별 매출, 지출 기록 및 월별 리포트를 관리할 수 있습니다.",
    });
  }, [toast]);

  return (
    <div className="min-h-screen bg-gray-50">
      <FinanceLayout />
    </div>
  );
}