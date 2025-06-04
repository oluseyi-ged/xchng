import {Text} from '@components/text';
import {HDP} from '@helpers';
import {family, palette} from '@theme';
import getSymbolFromCurrency from 'currency-symbol-map';
import React, {FC} from 'react';
import {
  Dimensions,
  Platform,
  StyleSheet,
  TextInput as TInput,
} from 'react-native';
import {Block} from '../../block';
import {SvgIcon} from '../../svg-icon';

interface Props {
  amount?: string;
  setAmount?: (value: string) => void;
  activeCurrency?: any;
  setShowOptions: (value: boolean) => void;
  balance?: string;
  label?: string;
  dark?: boolean;
  disabled?: boolean;
  errorNote?: string;
  isAmount?: boolean;
  inputRef?: any;
}

export const ConverterInput: FC<Props> = ({
  amount,
  setAmount,
  activeCurrency,
  setShowOptions,
  balance,
  label,
  dark,
  disabled,
  errorNote,
  inputRef,
  isAmount = true,
}) => {
  const handleAmountChange = (value: string) => {
    let numericValue = value.replace(/[^0-9.]/g, ''); // Remove non-numeric characters except for the decimal
    // Check if the input starts with '0' and has more than one character
    if (
      numericValue.length > 1 &&
      numericValue.startsWith('0') &&
      !numericValue.startsWith('0.')
    ) {
      numericValue = numericValue.replace(/^0+/, ''); // Remove leading zero if the second character is not a decimal
    }

    const parts = numericValue.split('.');
    const sanitizedValue =
      parts.length > 2 ? parts[0] + '.' + parts[1] : numericValue;

    if (setAmount) {
      setAmount(sanitizedValue);
    } else {
      console.warn('setAmount is undefined in AmountInput component');
    }
  };

  // Format the integer part with commas and leave the fractional part untouched
  const formattedAmount =
    isAmount && amount
      ? (() => {
          const numericAmount = parseFloat(amount); // Convert the amount to a number
          if (isNaN(numericAmount) || amount === '') {
            return '';
          } // Handle NaN or empty input case
          if (amount === '.') {
            return '0.';
          } // Handle case when input is just '.'
          const [integerPart, decimalPart] = amount.split('.');
          const formattedInteger = integerPart.replace(
            /\B(?=(\d{3})+(?!\d))/g,
            ',',
          ); // Add commas to integer part
          return decimalPart !== undefined
            ? `${formattedInteger}.${decimalPart}` // If there's a decimal part, add it back without formatting
            : formattedInteger; // If no decimal part, return only the formatted integer part
        })()
      : ''; // Return 0 if amount is falsy

  const {width} = Dimensions.get('window');

  return (
    <>
      <Block
        activeOpacity={1}
        onPress={() => inputRef?.current?.focus()}
        bg={'#F3F5FF'}
        radius={24}
        height={90}
        style={styles.inputBox}
        row
        align="center"
        justify="space-between">
        <Block style={balance?.length ? {paddingTop: 10} : undefined}>
          <Text
            color={'#4F4F4F'}
            size={14}
            style={{bottom: Platform.OS === 'ios' ? 10 : 0}}>
            {label} {'\u00A0'.repeat(10)}
          </Text>
          <TInput
            ref={inputRef}
            keyboardType="decimal-pad"
            placeholder="0.00"
            style={[
              styles.amountStyle,
              dark && {color: '#fff'},
              {
                width: balance?.length ? width * 0.4 : width * 0.5,
                bottom: 5,
                // justifyContent: 'center'
              },
            ]}
            placeholderTextColor={dark ? '#ffffff50' : '#887f94'}
            value={formattedAmount}
            onChangeText={handleAmountChange}
            editable={!disabled}
            maxLength={15}
          />
        </Block>
        <Block justify="center">
          {balance?.length ? (
            <Block style={styles.balanceBox} bg="#EEFFF7">
              <Text color={'#1A9459'} size={10}>
                Acc balance :
                {getSymbolFromCurrency(activeCurrency?.abbreviation)}{' '}
                {isNaN(parseFloat(balance))
                  ? '0'
                  : Number(balance)?.toLocaleString()}
              </Text>
            </Block>
          ) : null}
          <Block
            disabled={disabled}
            onPress={() => setShowOptions(true)}
            style={[styles.currPicker]}
            bg={palette.white}
            gap={8}
            height={40}
            alignItems="center"
            row>
            <SvgIcon
              name={activeCurrency?.abbreviation?.toLowerCase()}
              size={20}
            />
            <Text color="#14290A" medium>
              {activeCurrency?.abbreviation}
            </Text>
            <SvgIcon name={'caret-down'} size={20} />
          </Block>
        </Block>
      </Block>
      {errorNote?.length ? (
        <Block
          gap={5}
          alignItems="center"
          row
          justify="flex-end"
          style={{paddingTop: 10}}>
          <SvgIcon name="warning" size={16} />
          <Text>{errorNote}</Text>
        </Block>
      ) : null}
    </>
  );
};

const styles = StyleSheet.create({
  inputBox: {
    paddingLeft: 24,
    paddingRight: 16,
    borderWidth: 0.5,
    borderColor: '#DADEFF',
    zIndex: -1,
    // paddingBottom: 10
  },
  currPicker: {
    padding: 8,
    borderRadius: 500,
    alignSelf: 'flex-end',
    borderWidth: 0.5,
    borderColor: '#8591EF',
  },
  amountStyle: {
    fontSize: 24,
    fontFamily: family.SemiBold,
  },
  balanceBox: {
    borderColor: '#2BB673',
    borderWidth: 0.3,
    borderRadius: HDP(30),
    paddingVertical: HDP(5),
    paddingHorizontal: HDP(8),
    marginBottom: HDP(5),
  },
});
