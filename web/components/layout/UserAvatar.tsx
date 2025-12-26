'use client';

import { useEffect, useMemo } from 'react';
import { useSession } from 'next-auth/react';

interface StoredUser {
  id?: string;
  name?: string;
  email?: string;
}

export function UserAvatar() {
  const { data: session } = useSession();

  useEffect(() => {
    if (!session?.user || typeof window === 'undefined') return;

    const snapshot: StoredUser = {
      id: session.user.id,
      name: session.user.name ?? session.user.email ?? 'User',
      email: session.user.email ?? undefined,
    };

    sessionStorage.setItem('user', JSON.stringify(snapshot));
  }, [session]);

  const fallbackUser = useMemo<StoredUser | null>(() => {
    if (session?.user) {
      return {
        id: session.user.id,
        name: session.user.name ?? session.user.email ?? 'User',
        email: session.user.email ?? undefined,
      };
    }

    if (typeof window === 'undefined') return null;
    const stored = sessionStorage.getItem('user');
    if (!stored) return null;
    try {
      return JSON.parse(stored) as StoredUser;
    } catch {
      return null;
    }
  }, [session]);

  const displayName = useMemo(() => {
    const source =
      fallbackUser?.name ||
      fallbackUser?.email?.split('@')[0] ||
      session?.user?.email?.split('@')[0] ||
      'User';

    const [firstName] = source.split(' ');
    return firstName || 'User';
  }, [fallbackUser, session]);

  const email = session?.user?.email || fallbackUser?.email || '';
  const initials = displayName.charAt(0).toUpperCase() || 'U';

  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-primary via-tertiary to-primary text-base font-semibold text-white shadow-lg shadow-primary/30">
          {initials}
        </div>
        <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card bg-emerald-500" />
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-semibold text-foreground">{displayName}</span>
        <span className="text-xs text-muted-foreground">{email || 'Active session'}</span>
      </div>
    </div>
  );
}
