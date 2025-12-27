import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Purchase, CreatePurchaseDto } from '@/types';
import { getSessionWithRetry } from '@/lib/supabase';

const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const purchaseApi = createApi({
  reducerPath: 'purchaseApi',
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
  tagTypes: ['Purchase'],
  endpoints: (builder) => ({
    getPurchases: builder.query<Purchase[], void>({
      query: () => '/purchases',
      providesTags: ['Purchase'],
    }),
    getActivePurchases: builder.query<Purchase[], void>({
      query: () => '/purchases/active',
      providesTags: ['Purchase'],
    }),
    getPurchaseById: builder.query<Purchase, string>({
      query: (id) => `/purchases/${id}`,
      providesTags: ['Purchase'],
    }),
    createPurchase: builder.mutation<Purchase, CreatePurchaseDto>({
      query: (purchase) => ({
        url: '/purchases',
        method: 'POST',
        body: purchase,
      }),
      invalidatesTags: ['Purchase'],
    }),
    completePurchase: builder.mutation<Purchase, string>({
      query: (id) => ({
        url: `/purchases/${id}/complete`,
        method: 'POST',
      }),
      invalidatesTags: ['Purchase'],
    }),
    deletePurchase: builder.mutation<void, string>({
      query: (id) => ({
        url: `/purchases/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Purchase'],
    }),
  }),
});

export const {
  useGetPurchasesQuery,
  useGetActivePurchasesQuery,
  useGetPurchaseByIdQuery,
  useCreatePurchaseMutation,
  useCompletePurchaseMutation,
  useDeletePurchaseMutation,
} = purchaseApi;
