/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
} from '@reduxjs/toolkit/dist/query/react';
import {
  BeneModel,
  FeesModel,
  InitTransactionModel,
  RateCalculateReq,
  UsdAccountRequest,
  UserIdModel,
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
 * Calculates an HMAC SHA-256 hash of the provided data.
 *
 * @param data - The string data to hash (usually the request payload).
 * @param key - The secret key used to generate the hash.
 * @returns The hexadecimal string representation of the HMAC.
 */
export function calculateHash(data: string, key: string): string {
  const hmac = CryptoJS.HmacSHA256(data, key);
  return hmac.toString(CryptoJS.enc.Hex);
}

const baseUrl = 'https://dev-api.xchngfx.com';

export const mutationApi = createApi({
  reducerPath: 'mutationApi',
  baseQuery: fetchBaseQuery({
    baseUrl,
    credentials: 'include',
    prepareHeaders: (headers, {getState}) => {
      const token = (getState() as RootState)?.token;
      headers.set('Accept', 'application/json');
      headers.set('Content-Type', 'application/json');

      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }) as BaseQueryFn<string | FetchArgs, unknown, CustomErr, {}>,
  endpoints: builder => ({
    login: builder.mutation<unknown, Record<string, unknown>>({
      query: body => {
        const payload = JSON.stringify(body);
        const hash = calculateHash(payload, SECRET_KEY);

        return {
          url: 'customer-management/auth/sign-in',
          method: 'POST',
          body,
          headers: {
            'Content-Type': 'application/json',
            'x-request-signature': hash, // Add hash to headers
          },
        };
      },
    }),
    factorLogin: builder.mutation<unknown, Record<string, unknown>>({
      query: body => {
        const payload = JSON.stringify(body);
        const hash = calculateHash(payload, SECRET_KEY);

        return {
          url: 'customer-management/auth/verify-login',
          method: 'POST',
          body,
          headers: {
            'Content-Type': 'application/json',
            'x-request-signature': hash, // Add hash to headers
          },
        };
      },
    }),
    signup: builder.mutation<unknown, Record<string, unknown>>({
      query: body => {
        const payload = JSON.stringify(body);
        const hash = calculateHash(payload, SECRET_KEY);

        return {
          url: 'customer-management/user/sign-up',
          method: 'POST',
          body,
          headers: {
            'Content-Type': 'application/json',
            'x-request-signature': hash, // Add hash to headers
          },
        };
      },
    }),
    updateProfile: builder.mutation<unknown, Record<string, unknown>>({
      query: body => {
        const payload = JSON.stringify(body);
        const hash = calculateHash(payload, SECRET_KEY);

        return {
          url: 'customer-management/user/profile',
          method: 'POST',
          body,
          headers: {
            'Content-Type': 'application/json',
            'x-request-signature': hash, // Add hash to headers
          },
        };
      },
    }),
    verifyPhone: builder.mutation<unknown, Record<string, unknown>>({
      query: body => {
        const payload = JSON.stringify(body);
        const hash = calculateHash(payload, SECRET_KEY);

        return {
          url: 'customer-management/user/sign-up/verify-phone',
          method: 'POST',
          body,
          headers: {
            'Content-Type': 'application/json',
            'x-request-signature': hash, // Add hash to headers
          },
        };
      },
    }),
    refreshToken: builder.mutation<unknown, Record<string, unknown>>({
      query: body => {
        const payload = JSON.stringify(body);
        const hash = calculateHash(payload, SECRET_KEY);

        return {
          url: 'customer-management/auth/refresh',
          method: 'POST',
          body,
          headers: {
            'Content-Type': 'application/json',
            'x-request-signature': hash, // Add hash to headers
          },
        };
      },
    }),
    resetPassword: builder.mutation<unknown, Record<string, unknown>>({
      query: body => {
        const payload = JSON.stringify(body);
        const hash = calculateHash(payload, SECRET_KEY);

        return {
          url: 'customer-management/user/reset-password',
          method: 'POST',
          body,
          headers: {
            'Content-Type': 'application/json',
            'x-request-signature': hash, // Add hash to headers
          },
        };
      },
    }),
    validateResetToken: builder.mutation<unknown, Record<string, unknown>>({
      query: body => {
        const payload = JSON.stringify(body);
        const hash = calculateHash(payload, SECRET_KEY);

        return {
          url: 'customer-management/user/reset-password/validate',
          method: 'POST',
          body,
          headers: {
            'Content-Type': 'application/json',
            'x-request-signature': hash, // Add hash to headers
          },
        };
      },
    }),
    validateBvnToken: builder.mutation<unknown, Record<string, unknown>>({
      query: body => {
        const payload = JSON.stringify(body);
        const hash = calculateHash(payload, SECRET_KEY);

        return {
          url: 'customer-management/user/bvn/otp/validate',
          method: 'POST',
          body,
          headers: {
            'Content-Type': 'application/json',
            'x-request-signature': hash, // Add hash to headers
          },
        };
      },
    }),
    resendValidateToken: builder.mutation<unknown, Record<string, unknown>>({
      query: body => {
        const payload = JSON.stringify(body);
        const hash = calculateHash(payload, SECRET_KEY);

        return {
          url: 'customer-management/user/reset-password/resend',
          method: 'POST',
          body,
          headers: {
            'Content-Type': 'application/json',
            'x-request-signature': hash, // Add hash to headers
          },
        };
      },
    }),
    createPassword: builder.mutation<unknown, Record<string, unknown>>({
      query: body => {
        const payload = JSON.stringify(body);
        const hash = calculateHash(payload, SECRET_KEY);

        return {
          url: 'customer-management/user/reset-password/create-password',
          method: 'POST',
          body,
          headers: {
            'Content-Type': 'application/json',
            'x-request-signature': hash, // Add hash to headers
          },
        };
      },
    }),
    createPin: builder.mutation<unknown, Record<string, unknown>>({
      query: body => {
        const payload = JSON.stringify(body);
        const hash = calculateHash(payload, SECRET_KEY);

        return {
          url: 'customer-management/user/create-pin',
          method: 'POST',
          body,
          headers: {
            'Content-Type': 'application/json',
            'x-request-signature': hash, // Add hash to headers
          },
        };
      },
    }),
    changePin: builder.mutation<unknown, Record<string, unknown>>({
      query: body => {
        const payload = JSON.stringify(body);
        const hash = calculateHash(payload, SECRET_KEY);

        return {
          url: 'customer-management/user/change-pin',
          method: 'POST',
          body,
          headers: {
            'Content-Type': 'application/json',
            'x-request-signature': hash, // Add hash to headers
          },
        };
      },
    }),
    changePassword: builder.mutation<unknown, Record<string, unknown>>({
      query: body => {
        const payload = JSON.stringify(body);
        const hash = calculateHash(payload, SECRET_KEY);

        return {
          url: 'customer-management/user/change-password',
          method: 'POST',
          body,
          headers: {
            'Content-Type': 'application/json',
            'x-request-signature': hash,
          },
        };
      },
    }),
    sendMailToken: builder.mutation<unknown, Record<string, unknown>>({
      query: body => {
        const payload = JSON.stringify(body);
        const hash = calculateHash(payload, SECRET_KEY);

        return {
          url: 'customer-management/user/sign-up/verify-email',
          method: 'POST',
          body,
          headers: {
            'Content-Type': 'application/json',
            'x-request-signature': hash, // Add hash to headers
          },
        };
      },
    }),
    validateMailToken: builder.mutation<unknown, Record<string, unknown>>({
      query: body => {
        const payload = JSON.stringify(body);
        const hash = calculateHash(payload, SECRET_KEY);

        return {
          url: 'customer-management/user/sign-up/validate-email',
          method: 'POST',
          body,
          headers: {
            'Content-Type': 'application/json',
            'x-request-signature': hash, // Add hash to headers
          },
        };
      },
    }),
    verifyLiveliness: builder.mutation<unknown, Record<string, unknown>>({
      query: body => {
        const payload = JSON.stringify(body);
        const hash = calculateHash(payload, SECRET_KEY);

        return {
          url: 'customer-management/user/liveliness',
          method: 'POST',
          body,
          headers: {
            'Content-Type': 'application/json',
            'x-request-signature': hash, // Add hash to headers
          },
        };
      },
    }),
    createWallets: builder.mutation<unknown, Record<string, unknown>>({
      query: body => {
        const payload = JSON.stringify(body);
        const hash = calculateHash(payload, SECRET_KEY);

        return {
          url: 'customer-management/wallets',
          method: 'POST',
          body,
          headers: {
            'Content-Type': 'application/json',
            'x-request-signature': hash, // Add hash to headers
          },
        };
      },
    }),
    createTag: builder.mutation<unknown, Record<string, unknown>>({
      query: body => {
        const payload = JSON.stringify(body);
        const hash = calculateHash(payload, SECRET_KEY);

        return {
          url: 'customer-management/user/tag',
          method: 'POST',
          body,
          headers: {
            'Content-Type': 'application/json',
            'x-request-signature': hash, // Add hash to headers
          },
        };
      },
    }),
    validateResetPin: builder.mutation<unknown, Record<string, unknown>>({
      query: body => {
        const payload = JSON.stringify(body);
        const hash = calculateHash(payload, SECRET_KEY);

        return {
          url: 'customer-management/user/validate-reset-pin',
          method: 'POST',
          body,
          headers: {
            'Content-Type': 'application/json',
            'x-request-signature': hash, // Add hash to headers
          },
        };
      },
    }),
    validatePin: builder.mutation<unknown, any>({
      query: body => {
        const payload = JSON.stringify(body);
        const hash = calculateHash(payload, SECRET_KEY);

        return {
          url: 'customer-management/user/validate-pin',
          method: 'POST',
          body,
          headers: {
            'Content-Type': 'application/json',
            'x-request-signature': hash, // Add hash to headers
          },
        };
      },
    }),
    updateAddress: builder.mutation<unknown, Record<string, unknown>>({
      query: body => {
        const payload = JSON.stringify(body);
        const hash = calculateHash(payload, SECRET_KEY);

        return {
          url: 'customer-management/user/validate-address',
          method: 'POST',
          body,
          headers: {
            'Content-Type': 'application/json',
            'x-request-signature': hash,
          },
        };
      },
    }),
    getFee: builder.mutation<any, FeesModel>({
      query: body => {
        const payload = JSON.stringify(body);
        const hash = calculateHash(payload, SECRET_KEY);

        return {
          url: 'transaction-service/fees/calculate',
          method: 'POST',
          body,
          headers: {
            'Content-Type': 'application/json',
            'x-request-signature': hash,
          },
        };
      },
    }),
    initTxn: builder.mutation<any, InitTransactionModel>({
      query: body => {
        const payload = JSON.stringify(body);
        const hash = calculateHash(payload, SECRET_KEY);

        return {
          url: 'transaction-service/transaction',
          method: 'POST',
          body,
          headers: {
            'Content-Type': 'application/json',
            'x-request-signature': hash, // Add hash to headers
          },
        };
      },
    }),
    getTxnStatus: builder.mutation<any, {reference: string}>({
      query: body => {
        const payload = JSON.stringify(body);
        const hash = calculateHash(payload, SECRET_KEY);

        return {
          url: 'transaction-service/transaction/status',
          method: 'POST',
          body,
          headers: {
            'Content-Type': 'application/json',
            'x-request-signature': hash,
          },
        };
      },
    }),
    calculateRate: builder.mutation<any, RateCalculateReq>({
      query: body => {
        const payload = JSON.stringify(body);
        const hash = calculateHash(payload, SECRET_KEY);

        return {
          url: '/rate_service/rate/calculateExchange',
          method: 'POST',
          body,
          headers: {
            'Content-Type': 'application/json',
            'x-request-signature': hash,
          },
        };
      },
    }),
    addBeneficiary: builder.mutation<any, BeneModel>({
      query: body => {
        const payload = JSON.stringify(body);
        const hash = calculateHash(payload, SECRET_KEY);

        return {
          url: `/customer-management/user/beneficiaries`,
          method: 'POST',
          body,
          headers: {
            'Content-Type': 'application/json',
            'x-request-signature': hash,
          },
        };
      },
    }),
    verifyId: builder.mutation<UserIdModel, any>({
      query: body => {
        const payload = JSON.stringify(body);
        const hash = calculateHash(payload, SECRET_KEY);

        return {
          url: 'customer-management/user/kyc-validation',
          method: 'POST',
          body,
          headers: {
            'Content-Type': 'application/json',
            'x-request-signature': hash, // Add hash to headers
          },
        };
      },
    }),
    removeBeneficiary: builder.mutation<any, {id: string}>({
      query: ({id}) => ({
        url: `/customer-management/user/beneficiaries?beneficiaryId=${id}`,
        method: 'DELETE',
      }),
    }),
    getUsdTAUrl: builder.mutation<any, null>({
      query: () => ({
        url: `/wallet-service/wallet/getTermsAndAgreementUrl`,
        method: 'POST',
      }),
    }),
    submitUsdReq: builder.mutation<any, UsdAccountRequest>({
      query: () => ({
        url: `/wallet-service/wallet/getTermsAndAgreementUrl`,
        method: 'POST',
      }),
    }),
  }),
});

export const {
  useVerifyIdMutation,
  useAddBeneficiaryMutation,
  useGetFeeMutation,
  useCalculateRateMutation,
  useGetTxnStatusMutation,
  useInitTxnMutation,
  useLoginMutation,
  useSignupMutation,
  useVerifyPhoneMutation,
  useRefreshTokenMutation,
  useResetPasswordMutation,
  useValidateResetTokenMutation,
  useResendValidateTokenMutation,
  useCreatePasswordMutation,
  useSendMailTokenMutation,
  useValidateMailTokenMutation,
  useUpdateProfileMutation,
  useValidateBvnTokenMutation,
  useVerifyLivelinessMutation,
  useCreateWalletsMutation,
  useCreatePinMutation,
  useChangePinMutation,
  useCreateTagMutation,
  useValidateResetPinMutation,
  useFactorLoginMutation,
  useValidatePinMutation,
  useUpdateAddressMutation,
  useChangePasswordMutation,
  useRemoveBeneficiaryMutation,
  useGetUsdTAUrlMutation,
  useSubmitUsdReqMutation,
} = mutationApi;
