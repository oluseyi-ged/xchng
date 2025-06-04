import {Block, SvgIcon, Text} from '@components';
import SvgIconContainer from '@components/svg-icon/SvgIconContainer';
import {HDP} from '@helpers';
import {family, palette} from '@theme';
import {formatNumberWithCommas} from '@utils';
import moment from 'moment';
import React from 'react';
import {StyleSheet} from 'react-native';

interface TransactionItemProps {
  txItem: {
    id: string;
    type: string;
    amount: number;
    currency: string;
    date: string;
    status: 'completed' | 'pending' | 'failed';
    details: Record<string, any>;
  };
}

export const TransactionItem: React.FC<TransactionItemProps> = ({txItem}) => {
  const getIconConfig = (type: string) => {
    const config = {
      swap: {
        name: 'swap',
        color: '#f4f4f4',
      },
      deposit: {
        name: 'inflow',
        color: '#F3F5FF',
      },
      default: {
        name: 'outflow',
        color: '#FDE7E8',
      },
    };

    return config[type.toLowerCase()] || config.default;
  };

  const iconConfig = getIconConfig(txItem?.type);

  return (
    <Block
      bg={palette.white}
      style={styles.txItemBox}
      row
      justify="space-between">
      <Block row gap={6}>
        <SvgIconContainer name={iconConfig.name} color={iconConfig.color} />

        <Block gap={5}>
          <Text textTransform="capitalize" color={'#0F1545'} size={14}>
            {txItem?.type}
          </Text>
          <Block align="center" row gap={5}>
            <Block
              style={{paddingHorizontal: 6, paddingVertical: 4}}
              radius={2}
              bg="#DADEFF">
              <Text textTransform="uppercase" color={'#1D2667'} size={12}>
                #{txItem?.id?.slice(0, 6)}{' '}
              </Text>
            </Block>
            <Text textTransform="none" color={'#676D7E'} size={10}>
              {moment(txItem?.date).format('DD MMM YYYY hh:mm A')}
            </Text>
          </Block>
        </Block>
      </Block>

      <Block gap={4}>
        <Text fontFamily={family.SemiBold} color={'#2A3147'} size={14}>
          {txItem?.type?.toLowerCase() === 'withdrawal' ? '-' : '+'}
          NGN {formatNumberWithCommas(txItem?.amount)}
        </Text>
        <Block justify="flex-end" alignItems="center" row gap={4}>
          <Block
            width={12}
            height={12}
            radius={1000}
            bg={
              txItem?.status === 'pending'
                ? '#FFBE3E'
                : txItem?.status === 'completed'
                ? '#2BB673'
                : 'red'
            }
          />
          <Text textTransform="capitalize" color={'#2A3147'} size={12}>
            {txItem?.status}
          </Text>
        </Block>
      </Block>
    </Block>
  );
};

export const ErrorInfo: React.FC<any> = ({message}) => {
  return (
    <Block row gap={12} bg="#FFF5F5" radius={4} style={styles.errorBox}>
      <SvgIcon name="error" size={26} />
      <Text fontFamily={family.Light} color="#66191D" size={12}>
        {message}
      </Text>
    </Block>
  );
};

export const styles = StyleSheet.create({
  txItemBox: {
    paddingTop: HDP(12),
    paddingBottom: HDP(14),
    paddingHorizontal: HDP(12),
    borderBottomWidth: 0.5,
    borderBottomColor: '#DADEFF',
  },
  errorBox: {
    borderWidth: 0.5,
    borderColor: '#FDE7E8',
    paddingVertical: HDP(8),
    paddingHorizontal: HDP(16),
    marginBottom: HDP(16),
  },
});
