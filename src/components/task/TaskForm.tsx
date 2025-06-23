import { useState, useEffect } from 'react';
import { Task } from './TaskCard';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Calendar as CalendarIcon } from 'lucide-react';

// 간단한 폼 상태 관리를 위한 기본 작업 객체
const emptyTask: Omit<Task, 'id'> = {
  title: '',
  description: '',
  priority: 'medium',
  status: 'pending',
  dueDate: new Date(),
  category: '일반',
};

interface TaskFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (task: Omit<Task, 'id'>, taskId?: string) => void;
  editingTask?: Task | null;
}

export function TaskForm({ open, onClose, onSave, editingTask }: TaskFormProps) {
  const [taskData, setTaskData] = useState<Omit<Task, 'id'>>({ ...emptyTask });
  const { toast } = useToast();
  
  // 편집 모드일 경우 폼 데이터 설정
  useEffect(() => {
    if (editingTask) {
      setTaskData({
        title: editingTask.title,
        description: editingTask.description,
        priority: editingTask.priority,
        status: editingTask.status,
        dueDate: editingTask.dueDate,
        category: editingTask.category,
      });
    } else {
      setTaskData({ ...emptyTask });
    }
  }, [editingTask, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 유효성 검사
    if (!taskData.title.trim()) {
      toast({
        title: "제목이 필요합니다",
        description: "작업 제목을 입력해주세요.",
        variant: "destructive",
      });
      return;
    }

    // 작업 저장
    onSave(taskData, editingTask?.id);
    
    // 성공 메시지
    toast({
      title: `작업이 ${editingTask ? '수정' : '생성'}되었습니다`,
      description: taskData.title,
    });
    
    // 폼 초기화 및 닫기
    setTaskData({ ...emptyTask });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{editingTask ? '작업 수정' : '새 작업 생성'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-2">
            <FormLabel>제목</FormLabel>
            <Input
              value={taskData.title}
              onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
              placeholder="작업 제목 입력..."
            />
          </div>
          
          <div className="space-y-2">
            <FormLabel>설명</FormLabel>
            <Textarea
              value={taskData.description}
              onChange={(e) => setTaskData({ ...taskData, description: e.target.value })}
              placeholder="작업 설명 입력..."
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <FormLabel>우선순위</FormLabel>
              <Select
                value={taskData.priority}
                onValueChange={(value: 'high' | 'medium' | 'low') => 
                  setTaskData({ ...taskData, priority: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">높음</SelectItem>
                  <SelectItem value="medium">중간</SelectItem>
                  <SelectItem value="low">낮음</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <FormLabel>상태</FormLabel>
              <Select
                value={taskData.status}
                onValueChange={(value: 'pending' | 'in-progress' | 'completed') => 
                  setTaskData({ ...taskData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">대기 중</SelectItem>
                  <SelectItem value="in-progress">진행 중</SelectItem>
                  <SelectItem value="completed">완료됨</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <FormLabel>마감일</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(taskData.dueDate, 'PPP', { locale: ko })}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={taskData.dueDate}
                    onSelect={(date) => date && setTaskData({ ...taskData, dueDate: date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <FormLabel>카테고리</FormLabel>
              <Input
                value={taskData.category}
                onChange={(e) => setTaskData({ ...taskData, category: e.target.value })}
                placeholder="카테고리 입력..."
              />
            </div>
          </div>
          
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              취소
            </Button>
            <Button type="submit">
              {editingTask ? '수정 완료' : '작업 생성'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}