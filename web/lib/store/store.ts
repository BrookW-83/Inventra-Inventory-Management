import { configureStore } from '@reduxjs/toolkit';
import { inventoryApi } from '../api/inventoryApi';
import { purchaseApi } from '../api/purchaseApi';
import { dashboardApi } from '../api/dashboardApi';
import { adminApi } from '../api/adminApi';
import { profileApi } from '../api/profileApi';
import { paymentApi } from '../api/paymentApi';

export const store = configureStore({
  reducer: {
    [inventoryApi.reducerPath]: inventoryApi.reducer,
    [purchaseApi.reducerPath]: purchaseApi.reducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
    [profileApi.reducerPath]: profileApi.reducer,
    [paymentApi.reducerPath]: paymentApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      inventoryApi.middleware,
      purchaseApi.middleware,
      dashboardApi.middleware,
      adminApi.middleware,
      profileApi.middleware,
      paymentApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
