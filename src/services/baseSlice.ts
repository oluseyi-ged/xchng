import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import {clearAuth} from '@slices/auth';
import {clearLogged, setLogged} from '@slices/logged';
import {clearToken} from '@slices/token';
import CryptoJS from 'crypto-js';
import {RootState} from 'store';

const baseUrl = 'https://dev-api.xchngfx.com';

export const SECRET_KEY =
  'gh92ks11js33d4e29c4a8274d223d8dfc3f495768cb27d32a93f6b1df4f1f49a7c48dfcdd5768cb27d32a93f6';

function calculateHash(url: string, key: string): string {
  const dataToHash = `${url}${key}`;
  const hmac = CryptoJS.HmacSHA256(dataToHash, key);
  return hmac.toString(CryptoJS.enc.Hex);
}

const baseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: (headers, {getState, endpoint}) => {
    const fullUrl = `${baseUrl}${endpoint}`;
    const hash = calculateHash(fullUrl, SECRET_KEY);
    const token = (getState() as RootState)?.token;
    headers.set('Accept', 'application/json');
    headers.set('Content-Type', 'application/json');
    headers.set('x-request-signature', hash);
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // 🚨 TODO: Implement toast notification for session expiry or idle timeout 🕒️ to enhance user experience
    // toast.error("Your session has expired, you have to log in to continue.");

    setTimeout(() => {
      api.dispatch(setLogged(false));

      api.dispatch(clearToken());
      api.dispatch(clearAuth());
      api.dispatch(clearLogged());

      // 🚨 TODO: Ensure it logs out after everything
      // logUserOut();

      // persistor.pause();
      // persistor.flush().then(() => {
      //   return persistor.purge();
      // });
    }, 20);
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: 'apiSlice',
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
});
