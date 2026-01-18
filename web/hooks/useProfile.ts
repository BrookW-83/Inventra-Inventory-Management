'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { UserProfile, UserRole } from '@/types';

const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (!session?.access_token) {
          setIsLoading(false);
          return;
        }

        const response = await fetch(`${baseUrl}/auth/profile`, {
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setProfile({
            id: data.id,
            name: data.name,
            role: data.role as UserRole,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
          });
        } else {
          setError('Failed to fetch profile');
        }
      } catch (err) {
        setError('Error fetching profile');
      } finally {
        setIsLoading(false);
      }
    }

    fetchProfile();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      fetchProfile();
    });

    return () => subscription.unsubscribe();
  }, []);

  const isAdmin = profile?.role === UserRole.Admin;

  return { profile, isLoading, error, isAdmin };
}
