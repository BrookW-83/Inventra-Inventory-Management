import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { AdminDashboardStats, AdminUser, UpdateUserDto } from '@/types';
import { getSessionWithRetry } from '@/lib/supabase';

const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: async (headers) => {
      const session = await getSessionWithRetry();
      if (session?.access_token) {
        headers.set('Authorization', `Bearer ${session.access_token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['AdminDashboard', 'AdminUsers'],
  endpoints: (builder) => ({
    getAdminDashboardStats: builder.query<AdminDashboardStats, void>({
      query: () => '/admin/dashboard/stats',
      providesTags: ['AdminDashboard'],
    }),
    getAllUsers: builder.query<AdminUser[], void>({
      query: () => '/admin/users',
      providesTags: ['AdminUsers'],
    }),
    getUserById: builder.query<AdminUser, string>({
      query: (id) => `/admin/users/${id}`,
      providesTags: ['AdminUsers'],
    }),
    updateUser: builder.mutation<AdminUser, { id: string; data: UpdateUserDto }>({
      query: ({ id, data }) => ({
        url: `/admin/users/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['AdminUsers'],
    }),
    deleteUser: builder.mutation<void, string>({
      query: (id) => ({
        url: `/admin/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['AdminUsers'],
    }),
  }),
});

export const {
  useGetAdminDashboardStatsQuery,
  useGetAllUsersQuery,
  useGetUserByIdQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = adminApi;
