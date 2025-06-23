import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

// 거래처 타입
export interface Vendor {
  id: string;
  name: string;
  category: string;
  contactInfo?: string;
}

// 지출 항목 타입
export interface Expense {
  id: string;
  date: Date;
  amount: number;
  category: string; // '거래처', '공과금', '기타' 등
  vendorId?: string; // 거래처 관련 지출인 경우
  vendorName?: string; // 거래처 이름 (조회 용이성)
  description: string;
}

// 매출 항목 타입
export interface Revenue {
  id: string;
  date: Date;
  amount: number;
  category: string; // 매출 카테고리
  description: string;
}

// 재무 상태 인터페이스
interface FinanceState {
  // 데이터
  expenses: Expense[];
  revenues: Revenue[];
  vendors: Vendor[];
  expenseCategories: string[]; // 기본 지출 카테고리 목록
  revenueCategories: string[]; // 기본 매출 카테고리 목록

  // 거래처 관리
  addVendor: (vendor: Omit<Vendor, 'id'>) => void;
  updateVendor: (id: string, updatedVendor: Partial<Vendor>) => void;
  deleteVendor: (id: string) => void;
  
  // 지출 관리
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  updateExpense: (id: string, updatedExpense: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  
  // 매출 관리
  addRevenue: (revenue: Omit<Revenue, 'id'>) => void;
  updateRevenue: (id: string, updatedRevenue: Partial<Revenue>) => void;
  deleteRevenue: (id: string) => void;
  
  // 카테고리 관리
  addExpenseCategory: (category: string) => void;
  deleteExpenseCategory: (category: string) => void;
  addRevenueCategory: (category: string) => void;
  deleteRevenueCategory: (category: string) => void;
}

// 샘플 데이터
const sampleVendors: Vendor[] = [
  { id: uuidv4(), name: '국내 공급업체', category: '주요 거래처', contactInfo: '010-1234-5678' },
  { id: uuidv4(), name: '해외 공급업체', category: '주요 거래처', contactInfo: '+1-234-567-8900' },
  { id: uuidv4(), name: '물류 서비스', category: '서비스 제공업체', contactInfo: '02-345-6789' },
];

const sampleExpenses: Expense[] = [
  {
    id: uuidv4(),
    date: new Date('2025-06-20'),
    amount: 150000,
    category: '거래처',
    vendorId: sampleVendors[0].id,
    vendorName: sampleVendors[0].name,
    description: '원자재 구매'
  },
  {
    id: uuidv4(),
    date: new Date('2025-06-18'),
    amount: 80000,
    category: '공과금',
    description: '6월 전기요금'
  },
  {
    id: uuidv4(),
    date: new Date('2025-06-15'),
    amount: 200000,
    category: '거래처',
    vendorId: sampleVendors[1].id,
    vendorName: sampleVendors[1].name,
    description: '월간 서비스 이용료'
  }
];

const sampleRevenues: Revenue[] = [
  {
    id: uuidv4(),
    date: new Date('2025-06-22'),
    amount: 450000,
    category: '제품 판매',
    description: '온라인 판매'
  },
  {
    id: uuidv4(),
    date: new Date('2025-06-21'),
    amount: 350000,
    category: '서비스 제공',
    description: '컨설팅 서비스'
  },
  {
    id: uuidv4(),
    date: new Date('2025-06-19'),
    amount: 520000,
    category: '제품 판매',
    description: '오프라인 매장 판매'
  }
];

// 기본 카테고리 목록
const defaultExpenseCategories = ['거래처', '공과금', '인건비', '임대료', '기타'];
const defaultRevenueCategories = ['제품 판매', '서비스 제공', '이자 수입', '기타'];

export const useFinanceStore = create<FinanceState>()(
  persist(
    (set) => ({
      expenses: sampleExpenses,
      revenues: sampleRevenues,
      vendors: sampleVendors,
      expenseCategories: defaultExpenseCategories,
      revenueCategories: defaultRevenueCategories,
      
      // 거래처 관리
      addVendor: (vendor) => set((state) => ({
        vendors: [...state.vendors, { ...vendor, id: uuidv4() }]
      })),
      
      updateVendor: (id, updatedVendor) => set((state) => ({
        vendors: state.vendors.map((vendor) => 
          vendor.id === id ? { ...vendor, ...updatedVendor } : vendor
        ),
        // 연결된 지출 항목의 거래처 이름도 업데이트
        expenses: updatedVendor.name 
          ? state.expenses.map(expense => 
              expense.vendorId === id 
                ? { ...expense, vendorName: updatedVendor.name } 
                : expense
            )
          : state.expenses
      })),
      
      deleteVendor: (id) => set((state) => ({
        vendors: state.vendors.filter((vendor) => vendor.id !== id)
      })),
      
      // 지출 관리
      addExpense: (expense) => set((state) => ({
        expenses: [...state.expenses, { ...expense, id: uuidv4() }]
      })),
      
      updateExpense: (id, updatedExpense) => set((state) => ({
        expenses: state.expenses.map((expense) => 
          expense.id === id ? { ...expense, ...updatedExpense } : expense
        )
      })),
      
      deleteExpense: (id) => set((state) => ({
        expenses: state.expenses.filter((expense) => expense.id !== id)
      })),
      
      // 매출 관리
      addRevenue: (revenue) => set((state) => ({
        revenues: [...state.revenues, { ...revenue, id: uuidv4() }]
      })),
      
      updateRevenue: (id, updatedRevenue) => set((state) => ({
        revenues: state.revenues.map((revenue) => 
          revenue.id === id ? { ...revenue, ...updatedRevenue } : revenue
        )
      })),
      
      deleteRevenue: (id) => set((state) => ({
        revenues: state.revenues.filter((revenue) => revenue.id !== id)
      })),
      
      // 카테고리 관리
      addExpenseCategory: (category) => set((state) => ({
        expenseCategories: [...state.expenseCategories, category]
      })),
      
      deleteExpenseCategory: (category) => set((state) => ({
        expenseCategories: state.expenseCategories.filter((c) => c !== category)
      })),
      
      addRevenueCategory: (category) => set((state) => ({
        revenueCategories: [...state.revenueCategories, category]
      })),
      
      deleteRevenueCategory: (category) => set((state) => ({
        revenueCategories: state.revenueCategories.filter((c) => c !== category)
      })),
    }),
    {
      name: 'finance-storage', // localStorage에 저장될 키 이름
    }
  )
);