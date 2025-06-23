import { useState, useMemo } from 'react';
import { useFinanceStore, Revenue, Expense } from '@/store/financeStore';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ArrowDownRight, TrendingUp, Calendar } from 'lucide-react';

export default function MonthlyReport() {
  const { revenues, expenses } = useFinanceStore();
  
  // 사용 가능한 년도-월 목록 생성
  const availableMonths = useMemo(() => {
    const monthsSet = new Set<string>();
    
    // 모든 수입과 지출의 날짜에서 YYYY-MM 형식으로 목록 생성
    [...revenues, ...expenses].forEach((item) => {
      const date = new Date(item.date);
      const year = date.getFullYear();
      const month = date.getMonth() + 1; // getMonth는 0부터 시작
      monthsSet.add(`${year}-${month.toString().padStart(2, '0')}`);
    });
    
    // 내림차순 정렬 (최근 월이 맨 앞에)
    return Array.from(monthsSet).sort().reverse();
  }, [revenues, expenses]);

  // 현재 선택된 월 (기본값: 가장 최근 월)
  const [selectedMonth, setSelectedMonth] = useState<string>(
    availableMonths[0] || '2025-06'
  );
  
  // 선택된 월의 데이터 계산
  const monthlyData = useMemo(() => {
    if (!selectedMonth) return null;
    
    const [year, month] = selectedMonth.split('-').map(Number);
    
    // 선택된 월에 해당하는 수입/지출 필터링
    const filteredRevenues = revenues.filter((item) => {
      const date = new Date(item.date);
      return date.getFullYear() === year && date.getMonth() + 1 === month;
    });
    
    const filteredExpenses = expenses.filter((item) => {
      const date = new Date(item.date);
      return date.getFullYear() === year && date.getMonth() + 1 === month;
    });
    
    // 카테고리별 합계 계산
    const revenueByCategory = filteredRevenues.reduce<Record<string, number>>((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + item.amount;
      return acc;
    }, {});
    
    const expenseByCategory = filteredExpenses.reduce<Record<string, number>>((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + item.amount;
      return acc;
    }, {});
    
    // 총액 계산
    const totalRevenue = filteredRevenues.reduce((sum, item) => sum + item.amount, 0);
    const totalExpense = filteredExpenses.reduce((sum, item) => sum + item.amount, 0);
    const profit = totalRevenue - totalExpense;
    
    // 일별 매출 데이터
    const dailyRevenues = filteredRevenues.reduce<Record<number, number>>((acc, item) => {
      const day = new Date(item.date).getDate();
      acc[day] = (acc[day] || 0) + item.amount;
      return acc;
    }, {});
    
    // 일별 지출 데이터
    const dailyExpenses = filteredExpenses.reduce<Record<number, number>>((acc, item) => {
      const day = new Date(item.date).getDate();
      acc[day] = (acc[day] || 0) + item.amount;
      return acc;
    }, {});
    
    // 최고 매출 일자 (단일 날짜)
    const maxRevenueDay = Object.entries(dailyRevenues)
      .sort(([, a], [, b]) => b - a)[0]?.[0] || '-';
    
    // 최고 지출 일자 (단일 날짜)
    const maxExpenseDay = Object.entries(dailyExpenses)
      .sort(([, a], [, b]) => b - a)[0]?.[0] || '-';
    
    return {
      filteredRevenues,
      filteredExpenses,
      revenueByCategory,
      expenseByCategory,
      totalRevenue,
      totalExpense,
      profit,
      profitMargin: totalRevenue > 0 ? (profit / totalRevenue) * 100 : 0,
      maxRevenueDay,
      maxExpenseDay,
      dailyRevenues,
      dailyExpenses
    };
  }, [selectedMonth, revenues, expenses]);

  // 숫자 포맷 함수
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(amount);
  };

  // 이전/다음 월 이동 함수
  const navigateMonth = (direction: 'prev' | 'next') => {
    const currentIndex = availableMonths.indexOf(selectedMonth);
    
    if (direction === 'prev' && currentIndex < availableMonths.length - 1) {
      setSelectedMonth(availableMonths[currentIndex + 1]);
    } else if (direction === 'next' && currentIndex > 0) {
      setSelectedMonth(availableMonths[currentIndex - 1]);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">월별 매출 및 순이익 보고서</h2>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => navigateMonth('prev')}
            disabled={availableMonths.indexOf(selectedMonth) === availableMonths.length - 1}
          >
            <span className="sr-only">이전 월</span>
            <span>◀</span>
          </Button>
          
          <Select
            value={selectedMonth}
            onValueChange={setSelectedMonth}
          >
            <SelectTrigger className="w-[180px]">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue placeholder="월 선택" />
            </SelectTrigger>
            <SelectContent>
              {availableMonths.map((month) => (
                <SelectItem key={month} value={month}>
                  {month.replace('-', '년 ')}월
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => navigateMonth('next')}
            disabled={availableMonths.indexOf(selectedMonth) === 0}
          >
            <span className="sr-only">다음 월</span>
            <span>▶</span>
          </Button>
        </div>
      </div>

      {!monthlyData ? (
        <div className="text-center py-8 text-gray-500">
          데이터가 없습니다.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* 총 매출 */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">총 매출</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">
                  {formatCurrency(monthlyData.totalRevenue)}
                </div>
                <div className="p-2 bg-green-50 text-green-600 rounded-full">
                  <ArrowUpRight size={20} />
                </div>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {monthlyData.filteredRevenues.length}건의 매출 기록
              </div>
            </CardContent>
          </Card>

          {/* 총 지출 */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">총 지출</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">
                  {formatCurrency(monthlyData.totalExpense)}
                </div>
                <div className="p-2 bg-red-50 text-red-600 rounded-full">
                  <ArrowDownRight size={20} />
                </div>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {monthlyData.filteredExpenses.length}건의 지출 기록
              </div>
            </CardContent>
          </Card>

          {/* 순이익 */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">순이익</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className={`text-2xl font-bold ${monthlyData.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(monthlyData.profit)}
                </div>
                <div className={`p-2 rounded-full ${monthlyData.profit >= 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                  <TrendingUp size={20} />
                </div>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                매출 대비 {monthlyData.profitMargin.toFixed(1)}% 
              </div>
            </CardContent>
          </Card>

          {/* 주요 정보 */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">하이라이트</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                <div className="flex items-center justify-between text-sm">
                  <span>최고 매출일:</span>
                  <span className="font-medium">
                    {monthlyData.maxRevenueDay !== '-' 
                      ? `${selectedMonth}-${monthlyData.maxRevenueDay}` 
                      : '-'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>최고 지출일:</span>
                  <span className="font-medium">
                    {monthlyData.maxExpenseDay !== '-' 
                      ? `${selectedMonth}-${monthlyData.maxExpenseDay}` 
                      : '-'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>최대 지출 카테고리:</span>
                  <span className="font-medium">
                    {Object.entries(monthlyData.expenseByCategory)
                      .sort(([, a], [, b]) => b - a)[0]?.[0] || '-'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 매출 카테고리 분석 */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">매출 카테고리 분석</CardTitle>
              <CardDescription>
                카테고리별 매출 구성
              </CardDescription>
            </CardHeader>
            <CardContent>
              {Object.keys(monthlyData.revenueByCategory).length > 0 ? (
                <div className="space-y-4">
                  {Object.entries(monthlyData.revenueByCategory)
                    .sort(([, a], [, b]) => b - a)
                    .map(([category, amount]) => (
                      <div key={category}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">{category}</span>
                          <span className="text-sm">{formatCurrency(amount)}</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ 
                              width: `${(amount / monthlyData.totalRevenue) * 100}%` 
                            }}
                          />
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  매출 데이터가 없습니다
                </div>
              )}
            </CardContent>
          </Card>

          {/* 지출 카테고리 분석 */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">지출 카테고리 분석</CardTitle>
              <CardDescription>
                카테고리별 지출 구성
              </CardDescription>
            </CardHeader>
            <CardContent>
              {Object.keys(monthlyData.expenseByCategory).length > 0 ? (
                <div className="space-y-4">
                  {Object.entries(monthlyData.expenseByCategory)
                    .sort(([, a], [, b]) => b - a)
                    .map(([category, amount]) => (
                      <div key={category}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">{category}</span>
                          <span className="text-sm">{formatCurrency(amount)}</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                          <div 
                            className="bg-red-500 h-2 rounded-full" 
                            style={{ 
                              width: `${(amount / monthlyData.totalExpense) * 100}%` 
                            }}
                          />
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  지출 데이터가 없습니다
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}