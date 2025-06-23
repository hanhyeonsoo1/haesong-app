import { useState } from 'react';
import { useFinanceStore, Expense } from '@/store/financeStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { CalendarIcon, Pencil, Trash2, Plus, Filter } from 'lucide-react';
import { Textarea } from "@/components/ui/textarea";

export default function ExpenseManager() {
  const { 
    expenses, 
    vendors,
    expenseCategories,
    addExpense, 
    updateExpense, 
    deleteExpense,
    addExpenseCategory,
    deleteExpenseCategory
  } = useFinanceStore();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [currentExpense, setCurrentExpense] = useState<Expense | null>(null);
  const [newCategory, setNewCategory] = useState('');
  
  const [newExpense, setNewExpense] = useState<Omit<Expense, 'id'>>({
    date: new Date(),
    amount: 0,
    category: expenseCategories[0] || '기타',
    description: ''
  });

  // 필터링 상태
  const [categoryFilter, setCategoryFilter] = useState<string>('전체');
  const [vendorFilter, setVendorFilter] = useState<string>('전체');

  const handleAddExpense = () => {
    if (newExpense.amount > 0) {
      // 거래처 관련 지출인 경우, 거래처 이름도 함께 저장
      const vendorName = newExpense.vendorId 
        ? vendors.find(v => v.id === newExpense.vendorId)?.name 
        : undefined;
      
      addExpense({
        ...newExpense,
        vendorName
      });
      
      setNewExpense({
        date: new Date(),
        amount: 0,
        category: expenseCategories[0] || '기타',
        description: ''
      });
      setIsAddDialogOpen(false);
    }
  };

  const handleEditExpense = () => {
    if (currentExpense && currentExpense.id) {
      // 거래처 관련 지출인 경우, 거래처 이름도 함께 업데이트
      const updatedExpense = { ...currentExpense };
      
      if (updatedExpense.vendorId) {
        updatedExpense.vendorName = vendors.find(v => v.id === updatedExpense.vendorId)?.name;
      } else {
        updatedExpense.vendorName = undefined;
      }
      
      updateExpense(currentExpense.id, updatedExpense);
      setIsEditDialogOpen(false);
    }
  };

  const handleDeleteExpense = (id: string) => {
    if (confirm('이 지출 항목을 삭제하시겠습니까?')) {
      deleteExpense(id);
    }
  };

  const startEdit = (expense: Expense) => {
    setCurrentExpense({ ...expense });
    setIsEditDialogOpen(true);
  };

  const handleAddCategory = () => {
    if (newCategory.trim() && !expenseCategories.includes(newCategory.trim())) {
      addExpenseCategory(newCategory.trim());
      setNewCategory('');
    }
  };

  const handleDeleteCategory = (category: string) => {
    if (confirm(`'${category}' 카테고리를 삭제하시겠습니까?`)) {
      deleteExpenseCategory(category);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(amount);
  };

  // 지출 데이터에서 거래처 목록 추출 (필터링용)
  const uniqueVendorNames = Array.from(new Set(
    expenses
      .filter(expense => expense.vendorName)
      .map(expense => expense.vendorName as string)
  ));
  const vendorNames = ['전체', ...uniqueVendorNames];

  // 필터링된 지출 목록
  const filteredExpenses = expenses.filter(expense => {
    const matchesCategory = categoryFilter === '전체' || expense.category === categoryFilter;
    const matchesVendor = vendorFilter === '전체' || expense.vendorName === vendorFilter;
    return matchesCategory && matchesVendor;
  });

  // 지출 데이터를 날짜별로 정렬
  const sortedExpenses = [...filteredExpenses].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">지출 관리</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setIsCategoryDialogOpen(true)}
          >
            카테고리 관리
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-1">
                <Plus size={16} />
                <span>지출 추가</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>새 지출 기록</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="date">날짜</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {newExpense.date ? 
                          format(newExpense.date, 'PPP', { locale: ko }) : 
                          "날짜 선택"
                        }
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={newExpense.date}
                        onSelect={(date) => date && setNewExpense({...newExpense, date})}
                        locale={ko}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="amount">금액 (원)</Label>
                  <Input 
                    id="amount" 
                    type="number"
                    value={newExpense.amount || ''} 
                    onChange={(e) => setNewExpense({...newExpense, amount: Number(e.target.value)})}
                    placeholder="금액을 입력하세요"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="category">카테고리</Label>
                  <Select 
                    value={newExpense.category}
                    onValueChange={(value) => {
                      const updatedExpense = { ...newExpense, category: value };
                      
                      // 카테고리가 '거래처'가 아니면 거래처 정보 삭제
                      if (value !== '거래처') {
                        delete updatedExpense.vendorId;
                        delete updatedExpense.vendorName;
                      }
                      
                      setNewExpense(updatedExpense);
                    }}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="카테고리 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {expenseCategories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* 거래처 카테고리인 경우에만 거래처 선택 표시 */}
                {newExpense.category === '거래처' && (
                  <div className="grid gap-2">
                    <Label htmlFor="vendorId">거래처</Label>
                    <Select 
                      value={newExpense.vendorId}
                      onValueChange={(value) => setNewExpense({...newExpense, vendorId: value})}
                    >
                      <SelectTrigger id="vendorId">
                        <SelectValue placeholder="거래처 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {vendors.map((vendor) => (
                          <SelectItem key={vendor.id} value={vendor.id}>
                            {vendor.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                <div className="grid gap-2">
                  <Label htmlFor="description">설명</Label>
                  <Textarea 
                    id="description" 
                    value={newExpense.description} 
                    onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                    placeholder="지출에 대한 설명을 입력하세요"
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">취소</Button>
                </DialogClose>
                <Button onClick={handleAddExpense}>추가</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* 필터 컨트롤 */}
      <div className="flex flex-wrap gap-4 mb-4">
        <div className="flex items-center gap-2">
          <Filter size={16} />
          <span className="font-medium">필터:</span>
        </div>
        <div className="w-40">
          <Select 
            value={categoryFilter}
            onValueChange={setCategoryFilter}
          >
            <SelectTrigger>
              <SelectValue placeholder="카테고리 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="전체">전체 카테고리</SelectItem>
              {expenseCategories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {vendorNames.length > 1 && (
          <div className="w-40">
            <Select 
              value={vendorFilter}
              onValueChange={setVendorFilter}
            >
              <SelectTrigger>
                <SelectValue placeholder="거래처 선택" />
              </SelectTrigger>
              <SelectContent>
                {vendorNames.map((name) => (
                  <SelectItem key={name} value={name}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {expenses.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          등록된 지출 기록이 없습니다.
        </div>
      ) : sortedExpenses.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          필터 조건에 맞는 지출 기록이 없습니다.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>날짜</TableHead>
                <TableHead>카테고리</TableHead>
                <TableHead>거래처</TableHead>
                <TableHead>금액</TableHead>
                <TableHead>설명</TableHead>
                <TableHead className="w-[100px]">관리</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedExpenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell>{format(new Date(expense.date), 'yyyy-MM-dd')}</TableCell>
                  <TableCell>{expense.category}</TableCell>
                  <TableCell>{expense.vendorName || '-'}</TableCell>
                  <TableCell className="font-medium text-right">
                    {formatCurrency(expense.amount)}
                  </TableCell>
                  <TableCell className="max-w-[300px] truncate">{expense.description}</TableCell>
                  <TableCell className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => startEdit(expense)}>
                      <Pencil size={16} />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteExpense(expense.id)}>
                      <Trash2 size={16} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* 수정 다이얼로그 */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>지출 정보 수정</DialogTitle>
          </DialogHeader>
          {currentExpense && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-date">날짜</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {currentExpense.date ? 
                        format(new Date(currentExpense.date), 'PPP', { locale: ko }) : 
                        "날짜 선택"
                      }
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={new Date(currentExpense.date)}
                      onSelect={(date) => date && setCurrentExpense({...currentExpense, date})}
                      locale={ko}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-amount">금액 (원)</Label>
                <Input 
                  id="edit-amount"
                  type="number"
                  value={currentExpense.amount} 
                  onChange={(e) => setCurrentExpense({
                    ...currentExpense, 
                    amount: Number(e.target.value)
                  })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-category">카테고리</Label>
                <Select 
                  value={currentExpense.category}
                  onValueChange={(value) => {
                    const updatedExpense = { ...currentExpense, category: value };
                    
                    // 카테고리가 '거래처'가 아니면 거래처 정보 삭제
                    if (value !== '거래처') {
                      delete updatedExpense.vendorId;
                      delete updatedExpense.vendorName;
                    }
                    
                    setCurrentExpense(updatedExpense);
                  }}
                >
                  <SelectTrigger id="edit-category">
                    <SelectValue placeholder="카테고리 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {expenseCategories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* 거래처 카테고리인 경우에만 거래처 선택 표시 */}
              {currentExpense.category === '거래처' && (
                <div className="grid gap-2">
                  <Label htmlFor="edit-vendorId">거래처</Label>
                  <Select 
                    value={currentExpense.vendorId}
                    onValueChange={(value) => setCurrentExpense({...currentExpense, vendorId: value})}
                  >
                    <SelectTrigger id="edit-vendorId">
                      <SelectValue placeholder="거래처 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {vendors.map((vendor) => (
                        <SelectItem key={vendor.id} value={vendor.id}>
                          {vendor.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              <div className="grid gap-2">
                <Label htmlFor="edit-description">설명</Label>
                <Textarea 
                  id="edit-description" 
                  value={currentExpense.description} 
                  onChange={(e) => setCurrentExpense({...currentExpense, description: e.target.value})}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">취소</Button>
            </DialogClose>
            <Button onClick={handleEditExpense}>저장</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 카테고리 관리 다이얼로그 */}
      <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>지출 카테고리 관리</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex gap-2">
              <Input 
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="새 카테고리 이름"
              />
              <Button onClick={handleAddCategory}>추가</Button>
            </div>
            <div className="space-y-2">
              <Label>현재 카테고리</Label>
              {expenseCategories.map((category) => (
                <div key={category} className="flex justify-between items-center p-2 border rounded">
                  <span>{category}</span>
                  {expenseCategories.length > 1 && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDeleteCategory(category)}
                      disabled={category === '거래처'} // '거래처' 카테고리는 삭제 불가
                    >
                      <Trash2 size={16} />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button>완료</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}