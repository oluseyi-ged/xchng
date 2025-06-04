import {Block, SizedBox, SvgIcon, Text, TextInput} from '@components';
import {palette} from '@theme';
import React, {FC} from 'react';
import {SystemBars} from 'react-native-edge-to-edge';
import styles from './styles';

export const AddressInfo: FC = ({navigation}: any) => {
  return (
    <Block
      bg="#05081A"
      safe
      flex={1}
      style={styles.pageWrap}
      isScrollable={false}>
      <SystemBars style="light" />

      {/* Header */}
      <Block
        style={styles.pageHeader}
        row
        justify="space-between"
        align="center">
        <SvgIcon name="back" size={40} onPress={() => navigation.goBack()} />
        <Block>
          <Text center size={16} color={palette.white}>
            Address Info
          </Text>
        </Block>
        <SizedBox width={40} /> {/* Spacer for balance */}
      </Block>

      <Block scrollIn bg={'#FAFAFF'} style={styles.formBox}>
        <Block flex={1} justifyContent="space-between">
          <Block>
            <SizedBox height={40} />

            {/* Tag Input */}
            <TextInput
              label="Address"
              value={'549 ajose street ligali'}
              editable={false}
            />
            <SizedBox height={16} />
            <TextInput label="State" value={'Lagos'} editable={false} />
            <SizedBox height={16} />
            <TextInput label="City" value={'Ikorodu'} editable={false} />
            <SizedBox height={16} />
            <TextInput label="Zip code" value={'1234567'} editable={false} />
          </Block>
        </Block>
      </Block>
    </Block>
  );
};
