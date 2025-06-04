import {Block, SizedBox, SvgIcon, Text, TextInput} from '@components';
import {HDP, removeDialCode, RF} from '@helpers';
import {palette} from '@theme';
import React, {FC, useRef} from 'react';
import {SystemBars} from 'react-native-edge-to-edge';
import PhoneInput from 'react-native-phone-number-input';
import {RootState, useAppSelector} from 'store';
import styles from './styles';

export const Account: FC = ({navigation}: any) => {
  const phoneInput = useRef<PhoneInput>(null);
  const {auth} = useAppSelector<any>((store: RootState) => store.auth);

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
            Account Info
          </Text>
        </Block>
        <SizedBox width={40} />
      </Block>

      {/* Content */}
      <Block scrollIn bg={'#FAFAFF'} style={styles.formBox}>
        <Block>
          <SizedBox height={20} />

          {/* Tag Input */}
          <TextInput
            label="Full name"
            value={auth?.firstName + ' ' + auth?.lastName}
            editable={false}
          />
          <SizedBox height={16} />
          <TextInput label="Email" value={auth?.email} editable={false} />
          <SizedBox height={16} />
          <Text style={[styles.label]}>Phone Number*</Text>
          {/* @ts-ignore */}
          <PhoneInput
            ref={phoneInput}
            defaultValue={removeDialCode(auth?.phone)}
            defaultCode="NG"
            layout="first"
            disabled
            renderDropdownImage={<></>}
            flagButtonStyle={{width: '20%'}}
            containerStyle={{
              borderColor: '#E0E0E0',
              borderWidth: 1,
              borderRadius: 4,
              overflow: 'hidden',
              height: HDP(45),
              paddingVertical: 0,
            }}
            codeTextStyle={{
              fontSize: RF(10),
            }}
            textInputStyle={{
              fontSize: RF(10),
            }}
            textContainerStyle={{
              paddingVertical: 0,
            }}
          />
          <SizedBox height={16} />
          <TextInput label="DOB" value={''} editable={false} />
          <SizedBox height={16} />
          <TextInput label="Gender" value={''} editable={false} />
          <SizedBox height={16} />
          <TextInput
            label="Bank Verification Number (BVN)"
            value={''}
            editable={false}
          />
          <SizedBox height={16} />
        </Block>
      </Block>
    </Block>
  );
};
