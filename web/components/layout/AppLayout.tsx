'use client';

import { usePathname } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Pages that should not show sidebar/navbar (public pages)
  const publicPages = ['/', '/auth/signin', '/auth/signup'];
  const isPublicPage = publicPages.includes(pathname || '');

  // If it's a public page, render without sidebar/navbar
  if (isPublicPage) {
    return <>{children}</>;
  }

  // Regular app layout with sidebar and navbar (for authenticated users)
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar />
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
