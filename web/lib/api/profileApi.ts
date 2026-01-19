import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { UserProfile, UpdateOrganizationProfileDto } from '@/types';
import { getSessionWithRetry } from '@/lib/supabase';

const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const profileApi = createApi({
  reducerPath: 'profileApi',
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
  tagTypes: ['Profile'],
  endpoints: (builder) => ({
    getProfile: builder.query<UserProfile, void>({
      query: () => '/auth/profile',
      providesTags: ['Profile'],
    }),
    updateOrganizationProfile: builder.mutation<UserProfile, UpdateOrganizationProfileDto>({
      query: (data) => ({
        url: '/auth/profile',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Profile'],
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdateOrganizationProfileMutation,
} = profileApi;
