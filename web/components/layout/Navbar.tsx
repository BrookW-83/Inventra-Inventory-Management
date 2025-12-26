'use client';

import { UserMenu } from './UserMenu';
import { UserAvatar } from './UserAvatar';

export function Navbar() {
  return (
    <nav className="bg-card shadow-sm border-b border-border h-16 flex items-center justify-between px-8">
      <div className="flex items-center gap-4">
        <UserAvatar />
      </div>
      <div className="flex items-center">
        <UserMenu />
      </div>
    </nav>
  );
}
