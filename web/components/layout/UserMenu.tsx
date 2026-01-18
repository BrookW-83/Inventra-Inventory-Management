'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { FiLogOut } from 'react-icons/fi';
import { supabase } from '@/lib/supabase';

export function UserMenu() {
  const router = useRouter();

  const handleLogout = async () => {
    // Clear session storage
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('refreshToken');
      sessionStorage.removeItem('user');
    }

    // Sign out from Supabase
    await supabase.auth.signOut();

    // Redirect to signin page
    router.push('/auth/signin');
    router.refresh();
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
