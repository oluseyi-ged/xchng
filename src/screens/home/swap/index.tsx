import {Block, BottomSheet, Button, SizedBox, SvgIcon, Text} from '@components';
import {Converter} from '@components/converter';
import {allCurrencies, extractErrors, HDP, SCREEN_WEIGHT} from '@helpers';
import {
  useCalculateRateMutation,
  useGetFeeMutation,
} from '@services/mutationApi';
import {palette} from '@theme';
import {RateCalculateReq, WalletModel} from '@utils/models';
import {useFormik} from 'formik';
import {debounce} from 'lodash';
import React, {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {SystemBars} from 'react-native-edge-to-edge';
import {RootState, useAppSelector} from 'store';
import styles from './styles';

export const SwapFunds: FC = ({navigation}: any) => {
  // State for UI elements that don't need formik
  const [showModal, setShowModal] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [showOptions2, setShowOptions2] = useState(false);
  const [rate, setRate] = useState(0);
  const [lastRateUpdate, setLastRateUpdate] = useState<number>(0);
  const [cachedRates, setCachedRates] = useState<{[key: string]: number}>({});

  const isUpdatingRef = useRef(false);
  const userWallets = useAppSelector<any>((store: RootState) => store.wallets);

  const [calcFee, {isLoading: loadingFee}] = useGetFeeMutation();
  const [getRateApi, {isLoading: loadingRate}] = useCalculateRateMutation();

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
    (item: WalletModel) => item.currencyCode === activeCurrency?.abbreviation,
  )[0]?.walletBalance;

  const topLabel = 'You Swap';
  const bottomLabel = 'You Receive';
  const dark = false;
  const gap = 0;

  // Formik setup
  const formik = useFormik({
    initialValues: {
      amountIn: '',
      amountOut: '',
      feeLog: {
        id: '',
        fee: '',
        totalAmount: '',
      },
    },
    onSubmit: () => {
      setTimeout(() => setShowModal(true), 300);
    },
  });

  const insufficient = useMemo(() => {
    return (
      (balance as number) <
        parseFloat(formik.values.amountIn) +
          (Number(formik.values.feeLog?.fee) || 0) &&
      parseFloat(formik.values.amountIn) > 0
    );
  }, [
    activeOutCurrency?.abbreviation,
    balance,
    formik.values.amountIn,
    formik.values.feeLog?.fee,
  ]);

  const getRateCacheKey = (from: string, to: string) => `${from}_${to}`;

  const calculateFee = useCallback(
    async (conversionRate: number) => {
      if (!formik.values.amountIn || parseFloat(formik.values.amountIn) <= 0) {
        formik.setFieldValue('feeLog', {
          id: '',
          fee: '',
          totalAmount: '',
        });
        return;
      }

      try {
        const res = await calcFee({
          type: 'SWAP',
          sourceCurrency: activeCurrency?.abbreviation,
          amount: parseFloat(formik.values.amountIn),
          destCurrency: activeOutCurrency?.abbreviation,
          rate: conversionRate,
        }).unwrap();

        formik.setFieldValue('feeLog', {
          id: res.data?.sessionId || '',
          fee: res.data?.feeApplied || '',
          totalAmount: res.data?.debitAmount || '',
        });
      } catch (e) {
        extractErrors(e).forEach(error => console.log(error));
      }
    },
    [
      activeCurrency?.abbreviation,
      activeOutCurrency?.abbreviation,
      formik.values.amountIn,
    ],
  );

  const updateAmounts = useCallback(
    (amount: number, direction: 'from' | 'to', conversionRate: number) => {
      if (isUpdatingRef.current || conversionRate <= 0) return;
      isUpdatingRef.current = true;

      try {
        if (direction === 'from') {
          const convertedAmount = amount * conversionRate;
          formik.setFieldValue('amountOut', convertedAmount.toFixed(2));
        } else {
          const convertedAmount = amount / conversionRate;
          const newAmountIn = convertedAmount.toFixed(2);

          // Only update if significantly different
          if (
            Math.abs(
              parseFloat(formik.values.amountIn || '0') -
                parseFloat(newAmountIn),
            ) > 0.01
          ) {
            formik.setFieldValue('amountIn', newAmountIn);
          }
        }
      } finally {
        isUpdatingRef.current = false;
      }
    },
    [formik.values.amountIn],
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
        const res = await getRateApi(payload as RateCalculateReq).unwrap();
        const conversionRate = res?.sellingRate;

        setCachedRates(prev => ({
          ...prev,
          [cacheKey]: conversionRate,
        }));
        setLastRateUpdate(now);
        setRate(conversionRate);
        await calculateFee(conversionRate);
        updateAmounts(amount, direction, conversionRate);
      } catch (e) {
        extractErrors(e).forEach(error => console.log(error));
      }
    },
    [
      activeCurrency?.abbreviation,
      activeOutCurrency?.abbreviation,
      cachedRates,
      lastRateUpdate,
      calculateFee,
      updateAmounts,
    ],
  );

  const debouncedCalculateRate = useMemo(
    () => debounce(calculateRate, 500),
    [calculateRate],
  );

  useEffect(() => {
    return () => {
      debouncedCalculateRate.cancel();
    };
  }, [debouncedCalculateRate]);

  const handleAmountChange = (value: string, field: 'in' | 'out') => {
    if (isUpdatingRef.current) return;

    // Input sanitization
    const sanitizedValue = value.replace(/[^0-9.]/g, '');
    const parts = sanitizedValue.split('.');
    if (parts.length > 2) return;

    if (sanitizedValue === '') {
      formik.setFieldValue('amountIn', '');
      formik.setFieldValue('amountOut', '');
      formik.setFieldValue('feeLog', {id: '', fee: '', totalAmount: ''});
      return;
    }

    if (field === 'in') {
      formik.setFieldValue('amountIn', sanitizedValue);
      const numValue = parseFloat(sanitizedValue);
      if (!isNaN(numValue)) {
        debouncedCalculateRate(numValue, 'from');
      }
    } else {
      formik.setFieldValue('amountOut', sanitizedValue);
      const numValue = parseFloat(sanitizedValue);
      if (!isNaN(numValue)) {
        debouncedCalculateRate(numValue, 'to');
      }
    }
  };

  useEffect(() => {
    if (parseFloat(formik.values.amountIn) > 0 && rate > 0) {
      calculateFee(rate);
    }
  }, [formik.values.amountIn, rate]);

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
          amountIn={formik.values.amountIn}
          amountOut={formik.values.amountOut}
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
          fee={formik.values.feeLog.fee}
          error={
            Number(formik.values.amountIn) > Number(balance)
              ? 'Amount entered exceeds available balance'
              : formik.touched.amountIn && formik.errors.amountIn
              ? formik.errors.amountIn
              : ''
          }
          setActiveCurrency={setActiveCurrency}
          setActiveOutCurrency={setActiveOutCurrency}
        />
      </Block>

      <Block
        bg="#FAFAFF"
        position="absolute"
        bottom={150}
        style={{paddingHorizontal: HDP(24), paddingVertical: HDP(20)}}
        width={SCREEN_WEIGHT}
        alignSelf="center">
        <Button title="Continue" onPress={formik.handleSubmit} />
      </Block>

      <BottomSheet
        show={showModal}
        modalStyle={{
          width: SCREEN_WEIGHT * 0.9,
        }}
        afterHide={() => setShowModal(false)}
        avoidKeyboard={true}
        content={
          <Block>
            <Text>New one</Text>
          </Block>
        }
      />
    </Block>
  );
};
