import { useState } from 'react';
import { Task, TaskCard } from './TaskCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Search, Filter } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  onCompleteTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onEditTask: (task: Task) => void;
}

export function TaskList({ tasks, onCompleteTask, onDeleteTask, onEditTask }: TaskListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // 고유 카테고리 목록 추출
  const categories = Array.from(new Set(tasks.map(task => task.category)));
  
  const filteredTasks = tasks.filter(task => {
    // 검색어 필터링
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // 상태 필터링
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    
    // 우선순위 필터링
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    
    // 카테고리 필터링
    const matchesCategory = categoryFilter === 'all' || task.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="작업 검색..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 items-center">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">필터:</span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
            <div className="space-y-1.5">
              <Label htmlFor="status-filter">상태</Label>
              <Select
                value={statusFilter}
                onValueChange={setStatusFilter}
              >
                <SelectTrigger id="status-filter">
                  <SelectValue placeholder="상태 선택" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="all">모든 상태</SelectItem>
                  <SelectItem value="pending">대기 중</SelectItem>
                  <SelectItem value="in-progress">진행 중</SelectItem>
                  <SelectItem value="completed">완료됨</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-1.5">
              <Label htmlFor="priority-filter">우선순위</Label>
              <Select
                value={priorityFilter}
                onValueChange={setPriorityFilter}
              >
                <SelectTrigger id="priority-filter">
                  <SelectValue placeholder="우선순위 선택" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="all">모든 우선순위</SelectItem>
                  <SelectItem value="high">높음</SelectItem>
                  <SelectItem value="medium">중간</SelectItem>
                  <SelectItem value="low">낮음</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-1.5">
              <Label htmlFor="category-filter">카테고리</Label>
              <Select
                value={categoryFilter}
                onValueChange={setCategoryFilter}
              >
                <SelectTrigger id="category-filter">
                  <SelectValue placeholder="카테고리 선택" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="all">모든 카테고리</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
      
      <div>
        <h2 className="font-semibold text-lg mb-3">작업 목록 ({filteredTasks.length})</h2>
        {filteredTasks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onComplete={onCompleteTask}
                onDelete={onDeleteTask}
                onEdit={onEditTask}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 border border-dashed rounded-lg">
            <p className="text-muted-foreground">표시할 작업이 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}