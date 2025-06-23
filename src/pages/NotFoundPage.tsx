import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';
import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-gray-200">404</h1>
        <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-900">페이지를 찾을 수 없습니다</h2>
        <p className="mt-4 text-gray-500">
          요청하신 페이지가 존재하지 않거나 이동되었습니다.
        </p>
        <Link to="/">
          <Button className="mt-6 flex items-center gap-2">
            <Home className="h-4 w-4" />
            홈페이지로 돌아가기
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default NotFoundPage;