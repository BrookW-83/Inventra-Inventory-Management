'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiHome, FiPackage, FiShoppingCart, FiFileText } from 'react-icons/fi';

export function Sidebar() {
  const pathname = usePathname();

  const links = [
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

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-card border-r border-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <h1 className="text-xl font-bold text-foreground">
          <span className="text-primary">Inventra</span>
        </h1>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;

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
      </nav>
    </aside>
  );
}
