import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { DashboardStats } from '@/types';
import { getSessionWithRetry } from '@/lib/supabase';

const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const dashboardApi = createApi({
  reducerPath: 'dashboardApi',
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: async (headers) => {
      const session = await getSessionWithRetry();
      console.log('Dashboard API - Session:', session);
      if (session?.access_token) {
        console.log('Dashboard API - Setting Authorization header with token');
        headers.set('Authorization', `Bearer ${session.access_token}`);
      } else {
        console.warn('Dashboard API - No session or access token found!');
      }
      return headers;
    },
  }),
  tagTypes: ['Dashboard'],
  endpoints: (builder) => ({
    getDashboardStats: builder.query<DashboardStats, void>({
      query: () => '/dashboard/stats',
      providesTags: ['Dashboard'],
    }),
  }),
});

export const { useGetDashboardStatsQuery } = dashboardApi;
