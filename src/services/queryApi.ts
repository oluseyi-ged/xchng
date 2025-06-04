import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react';
import {
  AccInqReq,
  GetAccInfoReq,
  GetAllFeesResponse,
  GetAllRatesResponse,
  GetBeneResponse,
  GetRateResponse,
  GetWalletTransactionsResponse,
  RateReq,
  TransactionModel,
} from '@utils/models';
import CryptoJS from 'crypto-js';
import {RootState} from 'store';

interface CustomErr {
  data: {
    error: string;
    message: any;
    statusCode: number;
  };
  status: number;
}

// secret key for HMAC
export const SECRET_KEY =
  'gh92ks11js33d4e29c4a8274d223d8dfc3f495768cb27d32a93f6b1df4f1f49a7c48dfcdd5768cb27d32a93f6';
/**
 * Generates a hash for GET requests using the base URL and a secret key.
 * @param url - The complete request URL (base URL + endpoint).
 * @param key - The secret key for hashing.
 * @returns The hash as a string.
 */
function calculateHash(url: string, key: string): string {
  const dataToHash = `${url}${key}`;
  const hmac = CryptoJS.HmacSHA256(dataToHash, key);
  return hmac.toString(CryptoJS.enc.Hex);
}

const baseUrl = 'https://dev-api.xchngfx.com';

export const queryApi = createApi({
  reducerPath: 'queryApi',
  baseQuery: fetchBaseQuery({
    baseUrl,
    credentials: 'include',
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
  }) as BaseQueryFn<string | FetchArgs, unknown, CustomErr, {}>,
  endpoints: builder => ({
    getProfile: builder.query<any, void>({
      query: () => ({
        url: `/customer-management/user/profile`,
      }),
    }),
    getKycStatus: builder.query<any, void>({
      query: () => ({
        url: `/customer-management/user/onboarding-status`,
      }),
    }),
    getUserWallets: builder.query<any, void>({
      query: () => ({
        // url: `/customer-management/wallets`,
        url: `/wallet-service/wallet/getuserwallets`,
      }),
    }),
    resendRegisterOtp: builder.query({
      query: ref => ({
        url: `/customer-management/user/sign-up/resend-phone-otp?ref=${ref}`,
      }),
    }),
    sendBvnOtp: builder.query({
      query: ref => ({
        url: `/customer-management/user/bvn/send-otp?type=${ref}`,
      }),
    }),
    resetPin: builder.query({
      query: ref => ({
        url: `/customer-management/user/reset-pin`,
      }),
    }),
    checkUserExist: builder.query<any, {username: string; countryCode: string}>(
      {
        query: ({username, countryCode}) => ({
          url: `/customer-management/user/user-exists?username=${username}&countryCode=${countryCode}`,
        }),
      },
    ),
    setup2fa: builder.query<any, {mode: string}>({
      query: ({mode}) => ({
        url: `/customer-management/user/set2FA?type=${mode}`,
      }),
    }),
    getFees: builder.query({
      query: () => ({
        url: `/transaction-service/fees`,
      }),
    }),
    txHistory: builder.query<
      any,
      {
        number: number;
        size: number;
        status: string;
        startDate: string;
        endDate: string; // Fixed typo here
        transactionType: string;
      }
    >({
      query: ({number, size, status, startDate, endDate, transactionType}) => ({
        url: `/transaction-service/transaction/history?pageNum=${number}&pageSize=${size}&status=${status}&startDate=${startDate}&endDate=${endDate}&transactionType=${transactionType}`,
      }),
    }),
    getOccupations: builder.query({
      query: () => ({
        url: `/customer-management/static/occupations`,
      }),
    }),
    getAllFees: builder.query<GetAllFeesResponse, null>({
      query: () => ({
        url: `/transaction-service/fees`,
        method: 'GET',
      }),
    }),
    getTxns: builder.query<GetWalletTransactionsResponse, TransactionModel>({
      query: params => ({
        url: `/transaction-service/transaction/history`,
        method: 'GET',
        params: {...params},
      }),
    }),
    getAllRates: builder.query<GetAllRatesResponse, null>({
      query: params => ({
        url: `/rate_service/rate/AllRate`,
        method: 'GET',
      }),
    }),
    getRate: builder.query<GetRateResponse, RateReq>({
      query: params => ({
        url: `/rate_service/rate/${params.buy}/${params.sell}`,
        method: 'GET',
      }),
    }),
    getAllBene: builder.query<GetBeneResponse, null>({
      query: () => ({
        url: `/customer-management/user/beneficiaries`,
      }),
    }),
    getMyWallets: builder.query<any, null>({
      query: ref => ({
        // url: `/wallet/user/${ref.id}`,
        url: `/wallet-service/wallet/getuserwallets`,
      }),
    }),
    getMyAcc: builder.query<any, AccInqReq>({
      query: ref => ({
        url: `/wallet-service/wallet/accountEnquiry/${ref.accNumber}`,
      }),
    }),
    getAccInq: builder.query<any, GetAccInfoReq>({
      query: ref => ({
        url: `/wallet-service/wallet/beneficiaryEnquiry/${ref.accNumber}/${ref.code}/${ref.type}`,
      }),
    }),
    getNgnBanks: builder.query<any, null>({
      query: () => ({
        url: `/wallet-service/wallet/banks`,
      }),
    }),
    getBeneficiaries: builder.query<any, null>({
      query: () => ({
        url: `/wallet-service/wallet/banks`,
      }),
    }),
  }),
});

export const {
  useGetAllBeneQuery,
  useGetAllFeesQuery,
  useGetAllRatesQuery,
  useGetTxnsQuery,
  useGetRateQuery,
  useGetFeesQuery,
  useGetProfileQuery,
  useLazyGetProfileQuery,
  useResendRegisterOtpQuery,
  useLazyResendRegisterOtpQuery,
  useCheckUserExistQuery,
  useLazySendBvnOtpQuery,
  useGetKycStatusQuery,
  useGetUserWalletsQuery,
  useLazyGetUserWalletsQuery,
  useLazyResetPinQuery,
  useLazySetup2faQuery,
  useLazyGetFeesQuery,
  useTxHistoryQuery,
  useGetOccupationsQuery,
  useLazyGetKycStatusQuery,
  useGetMyWalletsQuery,
  useGetMyAccQuery,
  useLazyGetAccInqQuery,
  useGetNgnBanksQuery,
} = queryApi;
