import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {FeeModel, WalletTransactionData} from '@utils/models';

export interface TxnState {
  txnRef: string | null;
  total: number;
  receipt: WalletTransactionData | null;
  fees: FeeModel[] | null;
}

const initialState: TxnState = {
  txnRef: '',
  total: 0,
  receipt: null,
  fees: null,
};

const transactionSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    setTxnRef: (state, action: PayloadAction<string>) => {
      state.txnRef = action.payload;
    },
    setTxnInsight: (state, action: PayloadAction<number>) => {
      state.total = action.payload;
    },
    setTxnReceipt: (
      state,
      action: PayloadAction<WalletTransactionData | null>,
    ) => {
      state.receipt = action.payload;
    },
  },
});

const {reducer, actions} = transactionSlice;
export const {setTxnRef, setTxnInsight, setTxnReceipt} = actions;
export default reducer;
