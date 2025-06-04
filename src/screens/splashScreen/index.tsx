/* eslint-disable @typescript-eslint/no-unused-vars */
import {Block, SvgIcon, Text} from '@components';
import {SCREEN_WEIGHT} from '@helpers';
import {useFocusEffect} from '@react-navigation/native';
import {color, family} from '@theme';
import React, {FC} from 'react';
import {View} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {SystemBars} from 'react-native-edge-to-edge';
import {RootState, useAppSelector} from 'store';
import style from './styles';

export const SplashScreen: FC = ({navigation}: any) => {
  const logged = useAppSelector<any>((store: RootState) => store.logged);

  useFocusEffect(
    React.useCallback(() => {
      setTimeout(() => {
        if (logged) {
          navigation.navigate('Home');
        } else {
          navigation.navigate('Walkthrough');
        }
      }, 3000);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  return (
    <View style={style.container}>
      <SystemBars style="light" />
      <SvgIcon
        name="logo-stroke"
        width={SCREEN_WEIGHT}
        height={400}
        containerStyle={{
          position: 'absolute',
          top: -40,
          alignSelf: 'center',
        }}
      />

      <Animatable.View
        animation="slideInDown"
        duration={2000}
        delay={500}
        style={style.textBoxShadow}>
        <Block bg={color.primary} style={style.textBox}>
          <Text style={style.splashText}>
            <Text fontFamily={family.Bold} color={color.secondary}>
              XCHNG
            </Text>{' '}
            is the leading financial platform in Nigeria, offering a range of
            services including remittance and currency exchange, among others.
          </Text>
        </Block>
      </Animatable.View>

      <Animatable.View animation="flash" direction="normal" duration={2000}>
        <Animatable.View animation="fadeIn" duration={2300}>
          <SvgIcon name="logo" size={56} />
        </Animatable.View>
      </Animatable.View>
    </View>
  );
};
