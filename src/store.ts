import AsyncStorage from '@react-native-async-storage/async-storage';
import {configureStore} from '@reduxjs/toolkit';
import {setupListeners} from '@reduxjs/toolkit/dist/query/react';
import {mutationApi} from '@services/mutationApi';
import {queryApi} from '@services/queryApi';
import authReducer from '@slices/auth';
import loggedReducer from '@slices/logged';
import toastReducer from '@slices/toast';
import tokenReducer from '@slices/token';
import transactionsReducer from '@slices/transactions';
import walletsReducer from '@slices/wallets';
import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';
import {combineReducers} from 'redux';
import {persistReducer, persistStore} from 'redux-persist';
import thunkMiddleware from 'redux-thunk';
import reactotron from '../ReactotronConfig';

const reducers = combineReducers({
  token: tokenReducer,
  toast: toastReducer,
  auth: authReducer,
  wallets: walletsReducer,
  transactions: transactionsReducer,
  logged: loggedReducer,
  [queryApi.reducerPath]: queryApi.reducer,
  [mutationApi.reducerPath]: mutationApi.reducer,
});

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth', 'rates', 'token', 'logged'],
};

const persistedReducer = persistReducer(persistConfig, reducers);

const reactotronEnhancers: any = reactotron?.createEnhancer
  ? [reactotron.createEnhancer()]
  : [];

const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== 'production',
  enhancers: __DEV__ ? reactotronEnhancers : [],
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(thunkMiddleware, mutationApi.middleware, queryApi.middleware),
});

const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
setupListeners(store.dispatch);

export default store;
export {persistor};
