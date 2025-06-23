import { useState } from 'react';
import { useFinanceStore, Revenue } from '@/store/financeStore';
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
import { CalendarIcon, Pencil, Trash2, Plus } from 'lucide-react';
import { Textarea } from "@/components/ui/textarea";

export default function RevenueManager() {
  const { 
    revenues, 
    revenueCategories,
    addRevenue, 
    updateRevenue, 
    deleteRevenue,
    addRevenueCategory,
    deleteRevenueCategory
  } = useFinanceStore();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [currentRevenue, setCurrentRevenue] = useState<Revenue | null>(null);
  const [newCategory, setNewCategory] = useState('');
  
  const [newRevenue, setNewRevenue] = useState<Omit<Revenue, 'id'>>({
    date: new Date(),
    amount: 0,
    category: revenueCategories[0] || '기타',
    description: ''
  });

  const handleAddRevenue = () => {
    if (newRevenue.amount > 0) {
      addRevenue(newRevenue);
      setNewRevenue({
        date: new Date(),
        amount: 0,
        category: revenueCategories[0] || '기타',
        description: ''
      });
      setIsAddDialogOpen(false);
    }
  };

  const handleEditRevenue = () => {
    if (currentRevenue && currentRevenue.id) {
      updateRevenue(currentRevenue.id, currentRevenue);
      setIsEditDialogOpen(false);
    }
  };

  const handleDeleteRevenue = (id: string) => {
    if (confirm('이 매출 항목을 삭제하시겠습니까?')) {
      deleteRevenue(id);
    }
  };

  const startEdit = (revenue: Revenue) => {
    setCurrentRevenue({ ...revenue });
    setIsEditDialogOpen(true);
  };

  const handleAddCategory = () => {
    if (newCategory.trim() && !revenueCategories.includes(newCategory.trim())) {
      addRevenueCategory(newCategory.trim());
      setNewCategory('');
    }
  };

  const handleDeleteCategory = (category: string) => {
    if (confirm(`'${category}' 카테고리를 삭제하시겠습니까?`)) {
      deleteRevenueCategory(category);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(amount);
  };

  // 매출 데이터를 날짜별로 정렬
  const sortedRevenues = [...revenues].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">매출 관리</h2>
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
                <span>매출 추가</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>새 매출 기록</DialogTitle>
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
                        {newRevenue.date ? 
                          format(newRevenue.date, 'PPP', { locale: ko }) : 
                          "날짜 선택"
                        }
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={newRevenue.date}
                        onSelect={(date) => date && setNewRevenue({...newRevenue, date})}
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
                    value={newRevenue.amount || ''} 
                    onChange={(e) => setNewRevenue({...newRevenue, amount: Number(e.target.value)})}
                    placeholder="금액을 입력하세요"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="category">카테고리</Label>
                  <Select 
                    value={newRevenue.category}
                    onValueChange={(value) => setNewRevenue({...newRevenue, category: value})}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="카테고리 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {revenueCategories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">설명</Label>
                  <Textarea 
                    id="description" 
                    value={newRevenue.description} 
                    onChange={(e) => setNewRevenue({...newRevenue, description: e.target.value})}
                    placeholder="매출에 대한 설명을 입력하세요"
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">취소</Button>
                </DialogClose>
                <Button onClick={handleAddRevenue}>추가</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {revenues.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          등록된 매출 기록이 없습니다.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>날짜</TableHead>
                <TableHead>카테고리</TableHead>
                <TableHead>금액</TableHead>
                <TableHead>설명</TableHead>
                <TableHead className="w-[100px]">관리</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedRevenues.map((revenue) => (
                <TableRow key={revenue.id}>
                  <TableCell>{format(new Date(revenue.date), 'yyyy-MM-dd')}</TableCell>
                  <TableCell>{revenue.category}</TableCell>
                  <TableCell className="font-medium text-right">
                    {formatCurrency(revenue.amount)}
                  </TableCell>
                  <TableCell className="max-w-[300px] truncate">{revenue.description}</TableCell>
                  <TableCell className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => startEdit(revenue)}>
                      <Pencil size={16} />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteRevenue(revenue.id)}>
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
            <DialogTitle>매출 정보 수정</DialogTitle>
          </DialogHeader>
          {currentRevenue && (
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
                      {currentRevenue.date ? 
                        format(new Date(currentRevenue.date), 'PPP', { locale: ko }) : 
                        "날짜 선택"
                      }
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={new Date(currentRevenue.date)}
                      onSelect={(date) => date && setCurrentRevenue({...currentRevenue, date})}
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
                  value={currentRevenue.amount} 
                  onChange={(e) => setCurrentRevenue({
                    ...currentRevenue, 
                    amount: Number(e.target.value)
                  })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-category">카테고리</Label>
                <Select 
                  value={currentRevenue.category}
                  onValueChange={(value) => setCurrentRevenue({...currentRevenue, category: value})}
                >
                  <SelectTrigger id="edit-category">
                    <SelectValue placeholder="카테고리 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {revenueCategories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-description">설명</Label>
                <Textarea 
                  id="edit-description" 
                  value={currentRevenue.description} 
                  onChange={(e) => setCurrentRevenue({...currentRevenue, description: e.target.value})}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">취소</Button>
            </DialogClose>
            <Button onClick={handleEditRevenue}>저장</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 카테고리 관리 다이얼로그 */}
      <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>매출 카테고리 관리</DialogTitle>
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
              {revenueCategories.map((category) => (
                <div key={category} className="flex justify-between items-center p-2 border rounded">
                  <span>{category}</span>
                  {revenueCategories.length > 1 && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDeleteCategory(category)}
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