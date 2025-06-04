import {Block} from '@components/block';
import {Button} from '@components/buttons';
import {DialpadKeypad} from '@components/dial-pad';
import {SizedBox} from '@components/sized-box';
import {Text} from '@components/text';
import {HDP} from '@helpers';
import {combineNumbers} from '@utils';
import React, {useEffect, useState} from 'react';
import {Dimensions, View} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import {RootState, useAppSelector} from 'store';
import styles from './styles';

interface RatesProps {
  setOrigin?: any;
  setBase?: any;
  setAmount?: any;
  send?: boolean;
  value?: number;
  close?: any;
}

const Rates: React.FC<RatesProps> = ({
  setOrigin = () => {},
  setBase = () => {},
  setAmount = () => {},
  send,
  value,
  close = () => {},
}) => {
  const [amt, setAmt] = useState<any>([]);
  const ratesArr: any = useAppSelector((state: RootState) => state.rates);

  const uniqueCurrencies = ratesArr.reduce((acc: any[], rate: any) => {
    if (!acc.some(obj => obj.key === rate.origin)) {
      acc.push({key: rate.origin, value: rate.origin});
    }
    if (!acc.some(obj => obj.key === rate.base)) {
      acc.push({key: rate.base, value: rate.base});
    }
    return acc;
  }, []);

  const dialPadContent = [
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    amt?.includes('.') ? '' : '.',
    0,
    'X',
  ];

  const {width} = Dimensions.get('window');
  const dialPadSize = width * 0.2;
  const dialPadTextSize = dialPadSize * 0.4;
  const currencies = uniqueCurrencies;
  const pinLength = 6;
  const pinContainerSize = width / 2;
  const pinSize = pinContainerSize / pinLength;
  const initNumber: any = combineNumbers(amt) || value;

  const [from, setFrom] = useState<any>(currencies[0]);
  const [to, setTo] = useState<any>(
    uniqueCurrencies.find(currency => currency.key === 'NGN'),
  );

  useEffect(() => {
    setOrigin(from);
    setBase(to);
    setAmount(initNumber);
  }, [from, to, initNumber]);

  const convert = ratesArr?.find(
    rate => rate?.origin === from?.value && rate?.base === to?.value,
  );

  return (
    <Block>
      <Block height={4} width={32} bg="#000" radius={8} alignSelf="center" />
      <SizedBox height={30} />

      <Text center h5 medium>
        {send ? 'Enter Amount to send' : 'Rate Calculator'}
      </Text>
      <SizedBox height={30} />
      <Block bg="#0C212F20" radius={8} style={styles.inputBox}>
        {send ? <Text p>You send:</Text> : null}
        <Block transparent row justifyContent="space-between">
          <Text h4>{amt?.length || initNumber > 0 ? initNumber : '0.00'}</Text>
          <View style={{width: width * 0.18}}>
            <Dropdown
              style={styles.filterView}
              selectedTextStyle={styles.filterText}
              data={currencies}
              search={false}
              labelField="value"
              valueField="value"
              placeholder={'From'}
              placeholderStyle={styles.filterText}
              value={from}
              itemTextStyle={styles.itemText}
              onChange={(item: any) => {
                setFrom(item);
                // setOrigin(item);
              }}
            />
          </View>
        </Block>
        <SizedBox height={15} />
        <SizedBox height={1} backgroundColor={'#000'} />
        <SizedBox height={15} />
        {send ? <Text p>They receive:</Text> : null}
        <Block transparent row justifyContent="space-between">
          <Text h4>{initNumber > 0 ? convert?.rate * initNumber : '0.00'}</Text>
          <View style={{width: width * 0.18}}>
            <Dropdown
              style={styles.filterView}
              selectedTextStyle={styles.filterText}
              data={currencies}
              search={false}
              labelField="value"
              valueField="value"
              placeholder={'To'}
              placeholderStyle={styles.filterText}
              value={to}
              itemTextStyle={styles.itemText}
              onChange={(item: any) => {
                setTo(item);
                // setBase(item);
              }}
            />
          </View>
        </Block>
      </Block>
      <SizedBox height={10} />
      <Text textAlign="right" style={{paddingHorizontal: HDP(20)}}>
        1 {convert?.origin} = {convert?.base} {convert?.rate}
      </Text>
      <SizedBox height={20} />
      <DialpadKeypad
        dialPadContent={dialPadContent}
        pinLength={pinLength}
        setCode={val => {
          setAmt(val);
          // setAmount(val);
        }}
        code={amt}
        dialPadSize={dialPadSize}
        dialPadTextSize={dialPadTextSize}
      />

      <Button
        title="Done"
        color="#151515"
        justifyContent="center"
        alignItems="center"
        onPress={close}
      />
    </Block>
  );
};

export default Rates;
