import { Clock, CheckCircle, AlertTriangle, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in-progress' | 'completed';
  dueDate: Date;
  category: string;
}

interface TaskCardProps {
  task: Task;
  onComplete: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onEdit: (task: Task) => void;
}

export function TaskCard({ task, onComplete, onDelete, onEdit }: TaskCardProps) {
  const priorityColors = {
    high: 'bg-destructive text-destructive-foreground',
    medium: 'bg-amber-500 text-white',
    low: 'bg-green-500 text-white',
  };

  const statusIcons = {
    pending: <Clock className="h-4 w-4" />,
    'in-progress': <AlertTriangle className="h-4 w-4" />,
    completed: <CheckCircle className="h-4 w-4" />,
  };

  const isCompleted = task.status === 'completed';

  return (
    <Card className={cn(
      "transition-all duration-200 hover:shadow-md",
      isCompleted && "opacity-70"
    )}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className={cn(
            "text-lg font-medium",
            isCompleted && "line-through decoration-gray-500"
          )}>
            {task.title}
          </CardTitle>
          <Badge className={priorityColors[task.priority]}>
            {task.priority === 'high' ? '높음' : task.priority === 'medium' ? '중간' : '낮음'}
          </Badge>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Badge variant="outline" className="gap-1 flex items-center">
            {statusIcons[task.status]}
            <span>
              {task.status === 'pending' 
                ? '대기 중' 
                : task.status === 'in-progress' 
                ? '진행 중' 
                : '완료됨'}
            </span>
          </Badge>
          <Badge variant="secondary" className="gap-1 flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            {format(task.dueDate, 'yyyy년 M월 d일', { locale: ko })}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-700">
          {task.description}
        </p>
        <div className="mt-2">
          <Badge variant="outline" className="mt-1">
            {task.category}
          </Badge>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-1">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => onEdit(task)}
          disabled={isCompleted}
        >
          수정
        </Button>
        <div className="flex gap-2">
          {!isCompleted && (
            <Button 
              variant="outline" 
              size="sm" 
              className="border-green-500 text-green-600 hover:bg-green-50"
              onClick={() => onComplete(task.id)}
            >
              완료
            </Button>
          )}
          <Button 
            variant="outline" 
            size="sm" 
            className="border-destructive text-destructive hover:bg-destructive/10"
            onClick={() => onDelete(task.id)}
          >
            삭제
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}