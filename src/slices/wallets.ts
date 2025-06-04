import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {BeneModel, WalletModel} from '@utils/models';

export interface WalletState {
  wallets: WalletModel[];
  beneficiaries: BeneModel[];
  refresh: boolean;
  usdSignature: string;
}

const initialState: WalletState = {
  wallets: [],
  beneficiaries: [],
  refresh: false,
  usdSignature: '',
};

const walletSlice = createSlice({
  name: 'wallets',
  initialState,
  reducers: {
    setWallets: (state, action: PayloadAction<any[]>) => {
      state.wallets = action.payload;
    },
    addWallet: (state, action: PayloadAction<any>) => {
      state.wallets.push(action.payload);
    },
    clearWallets: state => {
      state.wallets = [];
    },
    setBeneficiary: (state, action: PayloadAction<any[]>) => {
      state.beneficiaries = action.payload;
    },
    setRefresh: (state, action: PayloadAction<boolean>) => {
      state.refresh = action.payload;
    },
    setUsdSignature: (state, action: PayloadAction<string>) => {
      state.usdSignature = action.payload;
    },
  },
});

const {reducer, actions} = walletSlice;
export const {
  setWallets,
  addWallet,
  clearWallets,
  setBeneficiary,
  setRefresh,
  setUsdSignature,
} = actions;
export default reducer;
