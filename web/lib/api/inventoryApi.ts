import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { InventoryItem, CreateInventoryItemDto, UpdateInventoryItemDto } from '@/types';
import { supabase } from '@/lib/supabase';

const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const inventoryApi = createApi({
  reducerPath: 'inventoryApi',
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: async (headers) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.access_token) {
        headers.set('Authorization', `Bearer ${session.access_token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['InventoryItem'],
  endpoints: (builder) => ({
    getInventoryItems: builder.query<InventoryItem[], void>({
      query: () => '/inventoryitems',
      providesTags: ['InventoryItem'],
    }),
    getInventoryItemById: builder.query<InventoryItem, string>({
      query: (id) => `/inventoryitems/${id}`,
      providesTags: ['InventoryItem'],
    }),
    createInventoryItem: builder.mutation<InventoryItem, CreateInventoryItemDto>({
      query: (item) => ({
        url: '/inventoryitems',
        method: 'POST',
        body: item,
      }),
      invalidatesTags: ['InventoryItem'],
    }),
    updateInventoryItem: builder.mutation<InventoryItem, { id: string; item: UpdateInventoryItemDto }>({
      query: ({ id, item }) => ({
        url: `/inventoryitems/${id}`,
        method: 'PUT',
        body: item,
      }),
      invalidatesTags: ['InventoryItem'],
    }),
    removeInventoryQuantity: builder.mutation<
      InventoryItem,
      { id: string; body: { quantity: number; performedBy: string; reason?: string } }
    >({
      query: ({ id, body }) => ({
        url: `/inventoryitems/${id}/remove`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['InventoryItem'],
    }),
    deleteInventoryItem: builder.mutation<void, string>({
      query: (id) => ({
        url: `/inventoryitems/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['InventoryItem'],
    }),
  }),
});

export const {
  useGetInventoryItemsQuery,
  useGetInventoryItemByIdQuery,
  useCreateInventoryItemMutation,
  useUpdateInventoryItemMutation,
  useRemoveInventoryQuantityMutation,
  useDeleteInventoryItemMutation,
} = inventoryApi;
