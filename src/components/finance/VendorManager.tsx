import { useState } from 'react';
import { useFinanceStore, Vendor } from '@/store/financeStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { Pencil, Trash2, Plus } from 'lucide-react';

export default function VendorManager() {
  const { vendors, addVendor, updateVendor, deleteVendor } = useFinanceStore();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentVendor, setCurrentVendor] = useState<Vendor | null>(null);
  const [newVendor, setNewVendor] = useState({
    name: '',
    category: '주요 거래처',
    contactInfo: ''
  });

  const handleAddVendor = () => {
    if (newVendor.name.trim()) {
      addVendor(newVendor);
      setNewVendor({ name: '', category: '주요 거래처', contactInfo: '' });
      setIsAddDialogOpen(false);
    }
  };

  const handleEditVendor = () => {
    if (currentVendor && currentVendor.id) {
      updateVendor(currentVendor.id, currentVendor);
      setIsEditDialogOpen(false);
    }
  };

  const handleDeleteVendor = (id: string) => {
    if (confirm('이 거래처를 삭제하시겠습니까?')) {
      deleteVendor(id);
    }
  };

  const startEdit = (vendor: Vendor) => {
    setCurrentVendor({ ...vendor });
    setIsEditDialogOpen(true);
  };

  // 거래처 분류 옵션
  const categoryOptions = [
    '주요 거래처', '서비스 제공업체', '공급업체', '기타'
  ];

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">거래처 관리</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-1">
              <Plus size={16} />
              <span>거래처 추가</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>새 거래처 추가</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">거래처명</Label>
                <Input 
                  id="name" 
                  value={newVendor.name} 
                  onChange={(e) => setNewVendor({...newVendor, name: e.target.value})}
                  placeholder="거래처 이름을 입력하세요"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">분류</Label>
                <Select 
                  value={newVendor.category}
                  onValueChange={(value) => setNewVendor({...newVendor, category: value})}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="분류 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="contactInfo">연락처</Label>
                <Input 
                  id="contactInfo" 
                  value={newVendor.contactInfo} 
                  onChange={(e) => setNewVendor({...newVendor, contactInfo: e.target.value})}
                  placeholder="담당자 연락처를 입력하세요"
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">취소</Button>
              </DialogClose>
              <Button onClick={handleAddVendor}>추가</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {vendors.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          등록된 거래처가 없습니다. 거래처를 추가해주세요.
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>거래처명</TableHead>
              <TableHead>분류</TableHead>
              <TableHead>연락처</TableHead>
              <TableHead className="w-[100px]">관리</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vendors.map((vendor) => (
              <TableRow key={vendor.id}>
                <TableCell>{vendor.name}</TableCell>
                <TableCell>{vendor.category}</TableCell>
                <TableCell>{vendor.contactInfo || '-'}</TableCell>
                <TableCell className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => startEdit(vendor)}>
                    <Pencil size={16} />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteVendor(vendor.id)}>
                    <Trash2 size={16} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* 수정 다이얼로그 */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>거래처 정보 수정</DialogTitle>
          </DialogHeader>
          {currentVendor && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">거래처명</Label>
                <Input 
                  id="edit-name" 
                  value={currentVendor.name} 
                  onChange={(e) => setCurrentVendor({...currentVendor, name: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-category">분류</Label>
                <Select 
                  value={currentVendor.category}
                  onValueChange={(value) => setCurrentVendor({...currentVendor, category: value})}
                >
                  <SelectTrigger id="edit-category">
                    <SelectValue placeholder="분류 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-contactInfo">연락처</Label>
                <Input 
                  id="edit-contactInfo" 
                  value={currentVendor.contactInfo || ''} 
                  onChange={(e) => setCurrentVendor({...currentVendor, contactInfo: e.target.value})}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">취소</Button>
            </DialogClose>
            <Button onClick={handleEditVendor}>저장</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}