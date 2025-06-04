import {Block, Button, SizedBox, SvgIcon, Text} from '@components';
import {Converter} from '@components/converter';
import {allCurrencies, extractErrors, HDP, SCREEN_WEIGHT} from '@helpers';
import {
  useCalculateRateMutation,
  useGetFeeMutation,
} from '@services/mutationApi';
import {useLazyGetUserWalletsQuery} from '@services/queryApi';
import {palette} from '@theme';
import {RateCalculateReq, WalletModel} from '@utils/models';
import getSymbolFromCurrency from 'currency-symbol-map';
import {debounce} from 'lodash';
import React, {FC, useCallback, useEffect, useMemo, useState} from 'react';
import {SystemBars} from 'react-native-edge-to-edge';
import {RootState, useAppDispatch, useAppSelector} from 'store';
import styles from './styles';

export const SwapFunds: FC = ({navigation}: any) => {
  const [amountIn, setAmountIn] = useState('');
  const [amountOut, setAmountOut] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const [showOptions2, setShowOptions2] = useState(false);
  const [rate, setRate] = useState(0);
  const [feeLog, setFeeLog] = useState({
    id: '',
    fee: '',
    totalAmount: '',
  });
  const [lastEdited, setLastEdited] = useState<'in' | 'out' | null>(null);
  const [lastRateUpdate, setLastRateUpdate] = useState<number>(0);
  const [cachedRates, setCachedRates] = useState<{[key: string]: number}>({});

  const currency = 'NGN';
  const userWallets = useAppSelector<any>((store: RootState) => store.wallets);
  const dispatch = useAppDispatch();

  const [getAllWallets] = useLazyGetUserWalletsQuery();
  const [calcFee, {isLoading: loadingFee}] = useGetFeeMutation();
  const [getRate, {isLoading: loadingRate}] = useCalculateRateMutation();

  const initialCurrency = 'NGN';
  const initial = initialCurrency?.length ? initialCurrency : 'USD';

  const [activeCurrency, setActiveCurrency] = useState<any>({
    abbreviation: initial,
  });

  const [activeOutCurrency, setActiveOutCurrency] = useState(() => {
    const randomOtherCurrency =
      allCurrencies
        .filter(item => item.abbreviation !== activeCurrency?.abbreviation)
        .sort(() => Math.random() - 0.5)[0]?.abbreviation || 'USD';
    return {abbreviation: randomOtherCurrency};
  });

  const balance = (userWallets?.wallets ?? []).filter(
    (item: WalletModel) =>
      item.currencyCode === activeOutCurrency?.abbreviation,
  )[0]?.walletBalance;

  const topLabel = 'You Swap';
  const bottomLabel = 'You Receive';
  const dark = false;
  const gap = 0;
  const minAmount = 500;

  const insufficient = useMemo(() => {
    return (
      (balance as number) < parseFloat(amountIn) + (Number(feeLog?.fee) || 0) &&
      parseFloat(amountIn) > 0
    );
  }, [activeOutCurrency?.abbreviation, balance, amountIn, feeLog?.fee]);

  const getRateCacheKey = (from: string, to: string) => `${from}_${to}`;

  const calculateFee = useCallback(
    (amount: number, conversionRate: number) => {
      calcFee({
        type: 'SWAP',
        sourceCurrency: activeCurrency?.abbreviation,
        amount: amount,
        destCurrency: activeOutCurrency?.abbreviation,
        rate: conversionRate,
      })
        .unwrap()
        .then(res => {
          setFeeLog({
            id: res.data?.sessionId || '',
            fee: res.data?.feeApplied || '',
            totalAmount: res.data?.debitAmount || '',
          });
        })
        .catch(e => {
          console.error('Fee Calculation Error:', e);
          extractErrors(e).forEach(error => console.log(error));
        });
    },
    [activeCurrency?.abbreviation, activeOutCurrency?.abbreviation],
  );

  const updateAmounts = useCallback(
    (amount: number, direction: 'from' | 'to', conversionRate: number) => {
      console.log(
        `updateAmounts: direction=${direction}, amount=${amount}, conversionRate=${conversionRate}`,
      );
      if (direction === 'from') {
        const convertedAmount = amount * conversionRate;
        setAmountOut(convertedAmount.toFixed(2).toString());
        calculateFee(amount, conversionRate); // Only calculate fee when amountIn changes
      } else {
        const convertedAmount = amount / conversionRate;
        setAmountIn(convertedAmount.toFixed(2).toString());
        // Do not calculate fee when amountOut changes
      }
    },
    [calculateFee],
  );

  const calculateRate = useCallback(
    async (amount: number, direction: 'from' | 'to') => {
      const now = Date.now();
      const cacheKey = getRateCacheKey(
        activeCurrency?.abbreviation,
        activeOutCurrency?.abbreviation,
      );

      if (cachedRates[cacheKey] && now - lastRateUpdate < 60000) {
        const conversionRate = cachedRates[cacheKey];
        updateAmounts(amount, direction, conversionRate);
        return;
      }

      const payload =
        direction === 'from'
          ? {
              from: activeCurrency?.abbreviation,
              to: activeOutCurrency?.abbreviation,
              amount,
            }
          : {
              from: activeCurrency?.abbreviation,
              to: activeOutCurrency?.abbreviation,
              toAmount: amount,
            };

      try {
        const res = await getRate(payload as RateCalculateReq).unwrap();
        const conversionRate = res?.sellingRate;

        setCachedRates(prev => ({
          ...prev,
          [cacheKey]: conversionRate,
        }));
        setLastRateUpdate(now);
        setRate(conversionRate);

        updateAmounts(amount, direction, conversionRate);
      } catch (e) {
        console.error('Rate Calculation Error:', e);
        extractErrors(e).forEach(error => console.log(error));
      }
    },
    [
      activeCurrency?.abbreviation,
      activeOutCurrency?.abbreviation,
      cachedRates,
      lastRateUpdate,
      updateAmounts,
    ],
  );

  const debouncedCalculateRate = useCallback(
    debounce((amount: number, direction: 'from' | 'to') => {
      if (amount > 0) {
        calculateRate(amount, direction);
      }
    }, 500),
    [calculateRate],
  );

  useEffect(() => {
    return () => {
      debouncedCalculateRate.cancel();
    };
  }, [debouncedCalculateRate]);

  const handleAmountChange = (value: string, field: 'in' | 'out') => {
    console.log(
      `handleAmountChange: field=${field}, value=${value}, lastEdited=${lastEdited}`,
    );
    if (field === 'in') {
      setAmountIn(value);
      setLastEdited('in');
      const numValue = parseFloat(value);
      if (!isNaN(numValue) && numValue > 0) {
        debouncedCalculateRate(numValue, 'from');
      } else {
        setAmountOut('');
      }
    } else {
      setAmountOut(value);
      setLastEdited('out');
      const numValue = parseFloat(value);
      if (!isNaN(numValue) && numValue > 0) {
        debouncedCalculateRate(numValue, 'to');
      } else {
        setAmountIn('');
      }
    }
  };

  useEffect(() => {
    const cacheKey = getRateCacheKey(
      activeCurrency?.abbreviation,
      activeOutCurrency?.abbreviation,
    );

    if (!cachedRates[cacheKey] || Date.now() - lastRateUpdate > 60000) {
      calculateRate(1, 'from');
      return;
    }

    if (lastEdited === 'in' && parseFloat(amountIn) > 0 && rate > 0) {
      updateAmounts(
        parseFloat(amountIn),
        'from',
        cachedRates[cacheKey] || rate,
      );
    } else if (lastEdited === 'out' && parseFloat(amountOut) > 0 && rate > 0) {
      updateAmounts(parseFloat(amountOut), 'to', cachedRates[cacheKey] || rate);
    }
  }, [
    activeCurrency?.abbreviation,
    activeOutCurrency?.abbreviation,
    cachedRates,
    lastRateUpdate,
    rate,
    updateAmounts,
  ]);

  useEffect(() => {
    if (activeOutCurrency.abbreviation === activeCurrency.abbreviation) {
      const newRandomCurrency =
        allCurrencies
          .filter(item => item.abbreviation !== activeCurrency.abbreviation)
          .sort(() => Math.random() - 0.5)[0]?.abbreviation || 'USD';
      setActiveOutCurrency({abbreviation: newRandomCurrency});
    }
  }, [activeCurrency.abbreviation]);

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <Block
      bg="#05081A"
      safe
      flex={1}
      style={styles.pageWrap}
      isScrollable={false}>
      <SystemBars style="light" />

      <Block
        style={styles.pageHeader}
        row
        justify="space-between"
        align="center">
        <SvgIcon name="back" size={40} onPress={handleBack} />
        <Block>
          <Text center size={16} color={palette.white}>
            Swap Money
          </Text>
        </Block>
        <SizedBox width={40} />
      </Block>

      <Block scrollIn bg={'#FAFAFF'} style={styles.formBox}>
        <Text medium size={24} color={'#0F1545'}>
          Swap Money
        </Text>

        <SizedBox height={40} />

        <Converter
          amountIn={amountIn}
          amountOut={amountOut}
          setAmountIn={(value: string) => handleAmountChange(value, 'in')}
          setAmountOut={(value: string) => handleAmountChange(value, 'out')}
          activeCurrency={activeCurrency}
          activeOutCurrency={activeOutCurrency}
          setShowInputOptions={setShowOptions}
          setShowOutputOptions={setShowOptions2}
          balance={balance}
          topLabel={topLabel}
          bottomLabel={bottomLabel}
          dark={dark}
          gap={gap}
          rate={rate}
          fee={feeLog.fee}
          error={
            Number(amountIn) > Number(balance)
              ? 'Amount entered exceeds available balance'
              : Number(amountIn) > 0 && Number(amountIn) < minAmount
              ? `Minimum amount to convert for ${
                  activeCurrency?.abbreviation
                } is ${getSymbolFromCurrency(
                  activeCurrency?.abbreviation,
                )}${minAmount}`
              : ''
          }
          setActiveCurrency={setActiveCurrency}
          setActiveOutCurrency={setActiveOutCurrency}
        />

        <Block style={{marginTop: 20}}>
          <Text>Debug Information:</Text>
          <Text>Rate: {rate}</Text>
          <Text>
            Last Updated: {new Date(lastRateUpdate).toLocaleTimeString()}
          </Text>
          <Text>Fee: {feeLog.fee}</Text>
          <Text>Total Amount: {feeLog.totalAmount}</Text>
          <Text>Session ID: {feeLog.id}</Text>
        </Block>
      </Block>

      <Block
        bg="#FAFAFF"
        position="absolute"
        bottom={150}
        style={{paddingHorizontal: HDP(24), paddingVertical: HDP(20)}}
        width={SCREEN_WEIGHT}
        alignSelf="center">
        <Button title="Continue" />
      </Block>
    </Block>
  );
};
