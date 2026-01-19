import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { CreateCheckoutSessionResponse } from '@/types';
import { getSessionWithRetry } from '@/lib/supabase';

const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const paymentApi = createApi({
  reducerPath: 'paymentApi',
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
  tagTypes: ['Payment'],
  endpoints: (builder) => ({
    createCheckoutSession: builder.mutation<CreateCheckoutSessionResponse, string>({
      query: (purchaseId) => ({
        url: `/payment/create-checkout-session/${purchaseId}`,
        method: 'POST',
      }),
    }),
    getPaymentConfig: builder.query<{ publishableKey: string }, void>({
      query: () => '/payment/config',
    }),
  }),
});

export const {
  useCreateCheckoutSessionMutation,
  useGetPaymentConfigQuery,
} = paymentApi;
