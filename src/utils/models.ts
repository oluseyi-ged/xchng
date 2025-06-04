export interface WalletModel {
  currencyCode: string;
  balance: string;
  accountbalance: string;
  accountNumber: string;
  firstName: string;
  lastName: string;
  walletBalance: string;
  lastBalanceUpdate: string;
}

export interface QuickActionModel {
  id: number;
  title: string;
  body: string;
  bg: string;
  img: string;
  btn: string;
  currency: string;
}

export interface ProfileItemModel {
  title: string;
  body: string;
  name: string;
  icon: string;
}
export interface ProfileItemsModel {
  title: string;
  items: ProfileItemModel[];
}

export type SummaryRangesType =
  | 'TODAY'
  | 'THIS_WEEK'
  | 'THIS_MONTH'
  | 'THIS_YEAR'
  | 'CUSTOM'
  | 'LAST_WEEK'
  | 'LAST_7_DAYS'
  | '';

export type BeneModel = {
  name: string;
  account: string;
  xTag?: string;
  bankName: string;
  bankCode: string;
  clientId: string;
};
export type GetBeneResponse = {
  data: BeneModel[];
};

export type IdDocType = 'NIN' | 'BVN';

export interface UserIdModel {
  identificationNumber: string;
  type: IdDocType;
}

export interface ValidatePinModel {
  pin: string;
}

export type GenericResponseBody<T> = {
  message: string;
  success: boolean;
  statusCode: number;
  timestamp: number;
  data: T;
  totalCount?: number;
};

export type PayoutType =
  | 'SWAP'
  | 'PAYOUT'
  | 'PURCHASE_USD_ACCOUNT'
  | 'PURCHASE_GBP_ACCOUNT';

export interface InitTransactionModel {
  transactionType: PayoutType;
  sessionId: string;
  destinationName?: string;
  destinationBankCode?: string;
  destinationClientId?: string;
  destinationAccount?: string;
  destinationAccountId?: string;
}

export type FeesModel = {
  type: PayoutType;
  sourceCurrency?: string;
  amount?: number;
  rate?: number;
  destCurrency?: string;
};

export type TransactionModel = {
  startDate?: string;
  endDate?: string;
  pageNum?: number;
  pageSize?: number;
  status?: string;
  transactionType?: string;
};

export type WalletTransactionData = {
  reference: string;
  createdAt: string;
  updatedAt: string;
  transactionType: string;
  status: string;
  ownerId: string;
  destinationAmount: number;
  destinationCurrency: string;
  destinationWalletId: string;
  feeCurrency: string;
  fee: number;
  paymentChannel: string;
  rate: string;
  sourceAmount: string;
  sourceCurrency: string;
  sourceWalletId: null;
  title: string;
  sender: string;
  failureReason: string;
};

export type GetWalletTransactionsResponse = GenericResponseBody<
  WalletTransactionData[]
>;

export type StatusModel = {
  type: PayoutType;
  sourceCurrency?: string;
  amount?: number;
  rate?: number;
  destCurrency?: string;
};

export type TxnStatusModel = {
  status: string;
  paymentStatus: string;
  valueStatus: null;
  reference: string;
  failureReason: null;
};

export type GetTxnStatusResponse = GenericResponseBody<TxnStatusModel>;

export type RateReq = {
  buy: string;
  sell: string;
};

export type RateCalculateReq = {
  to: string;
  from: string;
  amount?: number | null;
  toAmount?: number | null;
};

export type RateModel = {
  rate: string;
};

export type GetAllRatesResponse = GenericResponseBody<RateModel[]>;

export type GetRateResponse = GenericResponseBody<RateModel[]>;

export type FeeModel = {
  id: string;
  type: string;
  amount: string;
  feeCurrency: string;
  from: string;
  to: string;
};

export type GetAllFeesResponse = GenericResponseBody<FeeModel[]>;

export interface AccInqReq {
  accNumber: number;
}

export interface GetWalletsReq {
  id: string;
}

export interface GetAccInfoReq {
  accNumber: number;
  code: number | string;
  type: string;
}

export type UsdAccountRequest = {
  agreementId: string;
  currencyCode: 'USD';
  idIssuingCountry: string;
  idExpiration: Date;
  expectedMonthlyPayments: number;
  idBase64ImageFront: string;
  idBase64ImageBack: string;
  proofOfAddressBase64File: string;
};

export type WalletCreationModel = {
  creationStatus: 'PENDING' | 'FAILED' | 'CREATED';
  currencyCode: string;
  failureReason: string | null;
};

export type UsdAccountModel = {
  currency: string;
  bank_name: string;
  bank_address: string;
  bank_account_number: string;
  bank_routing_number: string;
  bank_beneficiary_name: string;
  bank_beneficiary_address: string;
};
