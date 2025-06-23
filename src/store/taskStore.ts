import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { Task } from '@/components/task/TaskCard';

interface TaskState {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (id: string, updatedTask: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  completeTask: (id: string) => void;
}

// 샘플 데이터
const sampleTasks: Task[] = [
  {
    id: uuidv4(),
    title: '프로젝트 계획서 작성',
    description: '다음 분기 프로젝트 계획서를 작성하고 팀과 공유해야 합니다.',
    priority: 'high',
    status: 'in-progress',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2일 후
    category: '업무',
  },
  {
    id: uuidv4(),
    title: '주간 회의 준비',
    description: '내일 주간 회의 자료를 준비하고 참석자들에게 의제를 공유합니다.',
    priority: 'medium',
    status: 'pending',
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1일 후
    category: '회의',
  },
  {
    id: uuidv4(),
    title: '운동 가기',
    description: '오후 7시에 헬스장에서 1시간 운동하기',
    priority: 'low',
    status: 'pending',
    dueDate: new Date(),
    category: '건강',
  },
  {
    id: uuidv4(),
    title: '식료품 쇼핑',
    description: '주중 식사를 위한 식료품 쇼핑하기',
    priority: 'medium',
    status: 'completed',
    dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1일 전
    category: '개인',
  },
  {
    id: uuidv4(),
    title: '프론트엔드 버그 수정',
    description: '사용자 프로필 페이지에서 발생하는 렌더링 문제 해결하기',
    priority: 'high',
    status: 'pending',
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3일 후
    category: '개발',
  }
];

export const useTaskStore = create<TaskState>()(
  persist(
    (set) => ({
      tasks: sampleTasks,
      
      addTask: (task) => set((state) => ({
        tasks: [...state.tasks, { ...task, id: uuidv4() }]
      })),
      
      updateTask: (id, updatedTask) => set((state) => ({
        tasks: state.tasks.map((task) => 
          task.id === id ? { ...task, ...updatedTask } : task
        )
      })),
      
      deleteTask: (id) => set((state) => ({
        tasks: state.tasks.filter((task) => task.id !== id)
      })),
      
      completeTask: (id) => set((state) => ({
        tasks: state.tasks.map((task) => 
          task.id === id ? { ...task, status: 'completed' } : task
        )
      })),
    }),
    {
      name: 'task-storage',
    }
  )
);