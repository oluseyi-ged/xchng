import {SizedBox} from '@components';
import {SvgIcon} from '@components/svg-icon';
import {Text} from '@components/text';
import {formatAmountInCurrency} from '@helpers';
import {family} from '@theme';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Dimensions} from 'react-native';
import {Block} from '../block';
import {ConverterInput} from './converter-input';

interface IConvert {
  amountIn: string;
  amountOut: string;
  setAmountIn: (value: string) => void;
  setAmountOut: (value: string) => void;
  activeCurrency: {abbreviation: string};
  activeOutCurrency: {abbreviation: string};
  balance: string;
  topLabel: string;
  bottomLabel: string;
  dark: boolean;
  gap: number;
  error?: string;
  rate?: number;
  setShowInputOptions?: any;
  setShowOutputOptions?: any;
  setActiveCurrency?: any;
  setActiveOutCurrency?: any;
  disabled?: boolean;
  fee?: any;
  onConversionStateChange?: (isConverting: boolean) => void;
}

const {width} = Dimensions.get('window');

export const Converter = ({
  amountIn,
  amountOut,
  setAmountIn,
  setAmountOut,
  activeCurrency,
  activeOutCurrency,
  balance,
  topLabel,
  bottomLabel,
  dark,
  gap = 0,
  error,
  setShowInputOptions,
  setShowOutputOptions,
  setActiveCurrency,
  setActiveOutCurrency,
  disabled,
  onConversionStateChange,
  rate,
  fee,
}: IConvert) => {
  const [localAmountIn, setLocalAmountIn] = useState(amountIn);
  const [localAmountOut, setLocalAmountOut] = useState(amountOut);
  const swapRate =
    activeCurrency?.abbreviation === activeOutCurrency?.abbreviation
      ? 1
      : Number(rate);
  const [countdown, setCountdown] = useState(30);
  const [apiError, setApiError] = useState('');
  const [isEditingOutput, setIsEditingOutput] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const inputRef = useRef<any>(null);
  const inputRef2 = useRef<any>(null);

  useEffect(() => {
    if (activeCurrency?.abbreviation === activeOutCurrency?.abbreviation) {
      setLocalAmountOut(localAmountIn);
      setAmountOut(localAmountIn);
      setIsConverting(false);
      onConversionStateChange?.(false);
    } else {
      setIsConverting(true);
      onConversionStateChange?.(true);
    }
  }, [
    activeCurrency?.abbreviation,
    activeOutCurrency?.abbreviation,
    localAmountIn,
    onConversionStateChange,
    setAmountOut,
  ]);

  useEffect(() => {
    if (swapRate && localAmountIn && !isEditingOutput) {
      const convertedAmount = (parseFloat(localAmountIn) / swapRate).toFixed(2);
      setLocalAmountOut(isNaN(Number(convertedAmount)) ? '' : convertedAmount);
      setAmountOut(isNaN(Number(convertedAmount)) ? '' : convertedAmount);
    } else if (!localAmountIn) {
      setLocalAmountOut('');
      setAmountOut('');
    }
  }, [
    activeCurrency,
    activeOutCurrency,
    swapRate,
    localAmountIn,
    setAmountOut,
    isEditingOutput,
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prevCountdown => {
        if (prevCountdown === 1) {
          return 30;
        }
        return prevCountdown - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleAmountInChange = useCallback(
    (value: string) => {
      setLocalAmountIn(value);
      setAmountIn(value);
      setIsEditingOutput(false);

      if (activeCurrency?.abbreviation === activeOutCurrency?.abbreviation) {
        setLocalAmountOut(value);
        setAmountOut(value);
      } else if (value && swapRate) {
        const convertedAmount = parseFloat(value) / swapRate;
        const formattedAmount = isNaN(convertedAmount)
          ? ''
          : convertedAmount.toFixed(2);
        setLocalAmountOut(formattedAmount);
        setAmountOut(formattedAmount);
      } else {
        setLocalAmountOut('');
        setAmountOut('');
      }
    },
    [swapRate, setAmountIn, setAmountOut, activeCurrency, activeOutCurrency],
  );

  const handleAmountOutChange = useCallback(
    (value: string) => {
      setLocalAmountOut(value);
      setAmountOut(value);
      setIsEditingOutput(true);

      if (activeCurrency?.abbreviation === activeOutCurrency?.abbreviation) {
        setLocalAmountIn(value);
        setAmountIn(value);
      } else if (value && swapRate) {
        const convertedAmount = parseFloat(value) * swapRate;
        const formattedAmount = isNaN(convertedAmount)
          ? ''
          : convertedAmount.toFixed(2);
        setLocalAmountIn(formattedAmount);
        setAmountIn(formattedAmount);
      } else {
        setLocalAmountIn('');
        setAmountIn('');
      }
    },
    [swapRate, setAmountIn, setAmountOut, activeCurrency, activeOutCurrency],
  );

  const handleSwapCurrencies = () => {
    const tempCurrency = activeCurrency;
    setActiveCurrency?.(activeOutCurrency);
    setActiveOutCurrency?.(tempCurrency);

    const tempAmount = localAmountIn;
    setLocalAmountIn(localAmountOut);
    setAmountIn(localAmountOut);
    setLocalAmountOut(tempAmount);
    setAmountOut(tempAmount);
  };

  return (
    <Block>
      <Block gap={6} style={{position: 'relative'}}>
        <ConverterInput
          amount={localAmountIn}
          setAmount={handleAmountInChange}
          activeCurrency={activeCurrency}
          setShowOptions={setShowInputOptions}
          label={topLabel}
          inputRef={inputRef}
          disabled={disabled}
          balance="100000"
        />

        <SvgIcon
          name="swap-toggle"
          size={40}
          style={{
            position: 'absolute',
            alignSelf: 'center',
            top: '50%',
            marginTop: -20,
            zIndex: 99999,
          }}
          onPress={handleSwapCurrencies}
        />

        <ConverterInput
          amount={localAmountOut}
          setAmount={handleAmountOutChange}
          activeCurrency={activeOutCurrency}
          setShowOptions={setShowOutputOptions}
          label={bottomLabel}
          inputRef={inputRef2}
          disabled={disabled}
        />
      </Block>

      <Block gap={12} style={{marginTop: 24}}>
        <Block align="flex-start" row gap={4}>
          <SvgIcon name="arrange" size={18} />
          <Block>
            <Text
              style={{letterSpacing: 2}}
              color="#1D2667"
              fontFamily={family.Light}>
              RATE
            </Text>
            <Text size={12} medium color="#1D2667">
              {activeCurrency?.abbreviation} {formatAmountInCurrency(swapRate)}{' '}
              ≈ {activeOutCurrency?.abbreviation} 1
            </Text>
          </Block>
        </Block>
        <SizedBox
          height={32}
          width={1}
          backgroundColor={'#C0C8FF'}
          style={{marginLeft: 10}}
        />

        <Block align="flex-start" row gap={4}>
          <SvgIcon name="discount" size={18} />
          <Block>
            <Text
              style={{letterSpacing: 2}}
              color="#1D2667"
              fontFamily={family.Light}>
              FEE (2%)
            </Text>
            <Text size={12} medium color="#1D2667">
              NGN {formatAmountInCurrency(fee || 0)}
            </Text>
          </Block>
        </Block>
      </Block>
    </Block>
  );
};
