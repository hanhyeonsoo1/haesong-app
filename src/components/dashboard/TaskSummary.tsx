import { Task } from '@/components/task/TaskCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Clock, AlertTriangle, ActivitySquare } from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip
} from 'recharts';

interface TaskSummaryProps {
  tasks: Task[];
}

export function TaskSummary({ tasks }: TaskSummaryProps) {
  // 작업 상태별 통계
  const pendingTasks = tasks.filter(task => task.status === 'pending').length;
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress').length;
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  
  // 우선순위별 통계
  const highPriorityTasks = tasks.filter(task => task.priority === 'high').length;
  const mediumPriorityTasks = tasks.filter(task => task.priority === 'medium').length;
  const lowPriorityTasks = tasks.filter(task => task.priority === 'low').length;
  
  // 빈 배열일 때 문구 표시
  if (tasks.length === 0) {
    return (
      <Card className="col-span-1 md:col-span-2">
        <CardHeader>
          <CardTitle>작업 요약</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-40">
          <p className="text-muted-foreground">표시할 작업이 없습니다. 새 작업을 추가해보세요!</p>
        </CardContent>
      </Card>
    );
  }

  // 차트 데이터
  const statusData = [
    { name: '대기 중', value: pendingTasks },
    { name: '진행 중', value: inProgressTasks },
    { name: '완료됨', value: completedTasks },
  ];

  const priorityData = [
    { name: '높음', value: highPriorityTasks },
    { name: '중간', value: mediumPriorityTasks },
    { name: '낮음', value: lowPriorityTasks },
  ];

  // 차트 색상
  const statusColors = ['#94a3b8', '#f59e0b', '#10b981'];
  const priorityColors = ['#ef4444', '#f59e0b', '#10b981'];
  
  // 완료율 계산
  const completionRate = tasks.length > 0 
    ? Math.round((completedTasks / tasks.length) * 100) 
    : 0;

  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader>
        <CardTitle>작업 요약</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">상태별 통계</h3>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="flex flex-col items-center justify-center space-y-1 p-2 bg-gray-50 rounded-md">
                <Clock className="h-5 w-5 text-slate-500" />
                <span className="text-2xl font-bold">{pendingTasks}</span>
                <span className="text-xs text-muted-foreground">대기 중</span>
              </div>
              <div className="flex flex-col items-center justify-center space-y-1 p-2 bg-gray-50 rounded-md">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                <span className="text-2xl font-bold">{inProgressTasks}</span>
                <span className="text-xs text-muted-foreground">진행 중</span>
              </div>
              <div className="flex flex-col items-center justify-center space-y-1 p-2 bg-gray-50 rounded-md">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-2xl font-bold">{completedTasks}</span>
                <span className="text-xs text-muted-foreground">완료됨</span>
              </div>
            </div>
            <div className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={60}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={statusColors[index % statusColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium">우선순위별 통계</h3>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="flex flex-col items-center justify-center space-y-1 p-2 bg-gray-50 rounded-md">
                <div className="h-5 w-5 rounded-full bg-red-500" />
                <span className="text-2xl font-bold">{highPriorityTasks}</span>
                <span className="text-xs text-muted-foreground">높음</span>
              </div>
              <div className="flex flex-col items-center justify-center space-y-1 p-2 bg-gray-50 rounded-md">
                <div className="h-5 w-5 rounded-full bg-amber-500" />
                <span className="text-2xl font-bold">{mediumPriorityTasks}</span>
                <span className="text-xs text-muted-foreground">중간</span>
              </div>
              <div className="flex flex-col items-center justify-center space-y-1 p-2 bg-gray-50 rounded-md">
                <div className="h-5 w-5 rounded-full bg-green-500" />
                <span className="text-2xl font-bold">{lowPriorityTasks}</span>
                <span className="text-xs text-muted-foreground">낮음</span>
              </div>
            </div>
            <div className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={priorityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={60}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {priorityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={priorityColors[index % priorityColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <ActivitySquare className="h-6 w-6 text-blue-500" />
            <div>
              <h4 className="text-sm font-medium">전체 진행률</h4>
              <p className="text-xs text-muted-foreground">총 {tasks.length}개 작업 중 {completedTasks}개 완료</p>
            </div>
          </div>
          <div className="text-2xl font-bold">{completionRate}%</div>
        </div>
      </CardContent>
    </Card>
  );
}