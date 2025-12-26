import { configureStore } from '@reduxjs/toolkit';
import { inventoryApi } from '../api/inventoryApi';
import { purchaseApi } from '../api/purchaseApi';
import { dashboardApi } from '../api/dashboardApi';

export const store = configureStore({
  reducer: {
    [inventoryApi.reducerPath]: inventoryApi.reducer,
    [purchaseApi.reducerPath]: purchaseApi.reducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      inventoryApi.middleware,
      purchaseApi.middleware,
      dashboardApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
