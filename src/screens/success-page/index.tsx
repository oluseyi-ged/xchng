import {XBg} from '@assets/images';
import {Block, Button, SizedBox, SvgIcon, Text} from '@components';
import {SCREEN_WEIGHT} from '@helpers';
import {family, palette} from '@theme';
import React, {FC} from 'react';
import ConfettiCannon from 'react-native-confetti-cannon';
import {SystemBars} from 'react-native-edge-to-edge';
import styles from './styles';

export const SuccessPage: FC = ({navigation, route}: any) => {
  const {
    title = '',
    description = '',
    onPress = () => navigation.reset({index: 0, routes: [{name: 'Home'}]}),
    accessQuicks = false,
  } = route?.params || {};

  const quickOptions = [
    {id: 1, icon: 'inflow', title: 'Top up'},
    {id: 2, icon: 'outflow', title: 'Send'},
    {id: 3, icon: 'swap', title: 'Swap'},
  ];

  return (
    <Block
      backgroundScroll
      backgroundImage={XBg}
      flex={1}
      safe
      style={styles.pageWrap}>
      <ConfettiCannon
        count={200}
        origin={{x: SCREEN_WEIGHT / 2, y: 0}}
        fallSpeed={6000}
      />

      <SystemBars style="light" />

      <Block flex={0.6} />
      <Block>
        <SvgIcon name="success-illustration" height={187} width={250} />
        <SizedBox height={40} />
        <Text size={16} fontFamily={family.Bold} center color={palette.white}>
          {title}
        </Text>
        <SizedBox height={14} />
        <Text
          size={14}
          style={{width: '80%', alignSelf: 'center'}}
          fontFamily={family.Regular}
          center
          color={palette.white}>
          {description}
        </Text>
        <SizedBox height={72} />
        <Button
          title="Continue"
          style={{width: SCREEN_WEIGHT * 0.9, alignSelf: 'center'}}
          onPress={onPress}
        />
        {accessQuicks ? (
          <>
            <SizedBox height={18} />
            <Text size={12} center color={palette.white}>
              Quick Actions
            </Text>
            <SizedBox height={12} />
            <Block justify="center" row gap={8}>
              {quickOptions?.map(option => (
                <Block
                  key={option.id}
                  style={{borderWidth: 1, borderColor: '#303B89'}}
                  width={83}
                  height={65}
                  justify="center"
                  bg={'#FFFFFF1A'}
                  gap={10}
                  radius={6}>
                  <SvgIcon name={option?.icon} size={20} />
                  <Text size={12} center color={palette.white}>
                    {option?.title}
                  </Text>
                </Block>
              ))}
            </Block>
          </>
        ) : null}
      </Block>
    </Block>
  );
};
