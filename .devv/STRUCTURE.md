# This file is only for editing file nodes, do not break the structure

/src
├── assets/          # 정적 리소스 디렉토리, 이미지 및 폰트와 같은 정적 파일 저장
│
├── components/      # 컴포넌트 디렉토리
│   ├── ui/          # 미리 설치된 shadcn/ui 컴포넌트, 필요하지 않은 경우 수정하거나 다시 작성하지 않음
│   ├── layout/      # Header, Footer 등의 레이아웃 컴포넌트
│   │   └── Header.tsx  # 메인 네비게이션 헤더 컴포넌트
│   └── finance/     # 재무 관리 관련 컴포넌트
│       ├── FinanceLayout.tsx # 재무 관리 시스템의 메인 레이아웃 및 탭 관리
│       ├── RevenueManager.tsx # 매출 관리 컴포넌트
│       ├── ExpenseManager.tsx # 지출 관리 컴포넌트
│       ├── VendorManager.tsx # 거래처 관리 컴포넌트
│       └── MonthlyReport.tsx # 월별 매출 및 순이익 보고서 컴포넌트
│
├── hooks/          # 커스텀 훅 디렉토리
│   ├── use-mobile.ts # 미리 설치된 모바일 감지 훅 (import { useIsMobile } from '@/hooks/use-mobile')
│   └── use-toast.ts  # 알림 표시를 위한 토스트 알림 시스템 훅 (import { useToast } from '@/hooks/use-toast')
│
├── lib/            # 유틸리티 라이브러리 디렉토리
│   └── utils.ts    # Tailwind 클래스명을 병합하는 cn 함수 등 유틸리티 함수
│
├── pages/          # React Router 구조 기반의 페이지 컴포넌트 디렉토리
│   ├── HomePage.tsx # 홈페이지 컴포넌트, 재무 관리 시스템의 메인 페이지로 활용
│   └── NotFoundPage.tsx # 404 오류 페이지 컴포넌트, 사용자가 존재하지 않는 경로에 접근할 때 표시
│
├── store/          # Zustand를 사용한 상태 관리 디렉토리
│   ├── taskStore.ts # 작업 관리 상태 스토어 (이전 코드)
│   └── financeStore.ts # 재무 관리 상태 스토어 (매출, 지출, 거래처 관리)
│
├── App.tsx         # 루트 컴포넌트, React Router 라우팅 시스템이 구성됨
│                   # 새로운 라우트 구성은 이 파일에 추가
│                   # 404 페이지 처리를 위한 catch-all 라우트(*) 포함
│
├── main.tsx        # 진입 파일, 루트 컴포넌트 렌더링 및 DOM에 마운트
│
├── index.css       # Tailwind 구성과 사용자 정의 스타일을 포함하는 전역 스타일 파일
│                   # 이 파일에서 테마 색상 및 디자인 시스템 변수를 수정
│
└── tailwind.config.js  # Tailwind CSS v3 구성 파일
                      # 테마 사용자 정의, 플러그인 및 콘텐츠 경로 포함
                      # shadcn/ui 테마 구성 포함 