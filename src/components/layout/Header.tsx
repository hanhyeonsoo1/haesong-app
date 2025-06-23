import { useState } from 'react';
import { Menu, X, Home, Calendar, Settings, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

interface NavItem {
  name: string;
  href: string;
  icon: JSX.Element;
}

const navItems: NavItem[] = [
  { name: '홈', href: '/', icon: <Home className="h-5 w-5" /> },
  { name: '일정', href: '/calendar', icon: <Calendar className="h-5 w-5" /> },
  { name: '통계', href: '/analytics', icon: <BarChart3 className="h-5 w-5" /> },
  { name: '설정', href: '/settings', icon: <Settings className="h-5 w-5" /> },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <header className="bg-white shadow-sm">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <a href="/" className="-m-1.5 p-1.5">
            <span className="text-xl font-bold text-primary">작업관리</span>
          </a>
        </div>
        <div className="flex lg:hidden">
          <Button
            variant="ghost"
            className="-m-2.5 rounded-md p-2.5"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="h-6 w-6" aria-hidden="true" />
          </Button>
        </div>
        <div className="hidden lg:flex lg:gap-x-12">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="flex items-center gap-2 text-sm font-semibold leading-6 text-gray-900 hover:text-primary"
            >
              {item.icon}
              {item.name}
            </a>
          ))}
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <Button>
            새 작업 추가
          </Button>
        </div>
      </nav>

      {/* 모바일 메뉴 */}
      {isMobile && mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-white">
          <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <a href="/" className="-m-1.5 p-1.5">
                <span className="text-xl font-bold text-primary">작업관리</span>
              </a>
              <Button
                variant="ghost"
                className="-m-2.5 rounded-md p-2.5"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X className="h-6 w-6" aria-hidden="true" />
              </Button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  {navItems.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="flex items-center gap-3 -mx-3 rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                    >
                      {item.icon}
                      {item.name}
                    </a>
                  ))}
                </div>
                <div className="py-6">
                  <Button className="w-full">
                    새 작업 추가
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}