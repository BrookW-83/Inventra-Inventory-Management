'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiHome, FiPackage, FiShoppingCart, FiFileText, FiUsers } from 'react-icons/fi';
import { useProfile } from '@/hooks/useProfile';

interface NavLink {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export function Sidebar() {
  const pathname = usePathname();
  const { isAdmin, isLoading } = useProfile();

  const userLinks: NavLink[] = [
    {
      href: '/dashboard',
      label: 'Dashboard',
      icon: FiHome
    },
    {
      href: '/inventory',
      label: 'Inventory',
      icon: FiPackage
    },
    {
      href: '/purchases',
      label: 'Purchase',
      icon: FiShoppingCart
    },
    {
      href: '/image-recognition',
      label: 'Smart Logging',
      icon: FiFileText
    },
  ];

  const adminLinks: NavLink[] = [
    {
      href: '/admin',
      label: 'Dashboard',
      icon: FiHome
    },
    {
      href: '/admin/users',
      label: 'Organization Management',
      icon: FiUsers
    },
  ];

  const links = isAdmin ? adminLinks : userLinks;

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-card border-r border-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <h1 className="text-xl font-bold text-foreground">
          <span className="text-primary">Inventra</span>
          {isAdmin && <span className="text-muted-foreground text-sm ml-2">Admin</span>}
        </h1>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          </div>
        ) : (
          <ul className="space-y-2">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href ||
                (link.href !== '/admin' && link.href !== '/dashboard' && pathname.startsWith(link.href));

              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary/10 text-primary border-l-4 border-primary'
                        : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{link.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </nav>
    </aside>
  );
}
