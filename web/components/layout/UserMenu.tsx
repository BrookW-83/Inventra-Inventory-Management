'use client';

import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { FiLogOut } from 'react-icons/fi';

export function UserMenu() {
  const handleLogout = () => {
    // Clear session storage
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('refreshToken');
      sessionStorage.removeItem('user');
    }

    // Sign out from NextAuth and redirect to signin
    signOut({ callbackUrl: '/auth/signin', redirect: true });
  };

  return (
    <Button
      variant="default"
      size="sm"
      onClick={handleLogout}
      className="gap-2"
    >
      <FiLogOut className="w-4 h-4" />
      Logout
    </Button>
  );
}
