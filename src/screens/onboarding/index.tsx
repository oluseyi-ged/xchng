/* eslint-disable @typescript-eslint/no-unused-vars */
import {LogoGif} from '@assets/images';
import {Block, Button, SizedBox, Text} from '@components';
import {palette} from '@theme';
import React, {FC} from 'react';
import {Dimensions, Image, TouchableOpacity, View} from 'react-native';
import {SystemBars} from 'react-native-edge-to-edge';
import {useAppDispatch} from 'store';
import styles from './styles';

export const Onboarding: FC = ({navigation}: any) => {
  const dispatch = useAppDispatch();
  const width = Dimensions.get('window').width;

  return (
    <Block safe style={styles.pageWrap}>
      <SystemBars style="light" />
      <View style={{flex: 0.2}} />
      <Image source={LogoGif} style={[styles.gif]} />
      <Block style={styles.btmBox} flex={0.5}>
        <Text h4 medium>
          Welcome!
        </Text>
        <SizedBox height={32} />
        <Button
          radius={128}
          onPress={() => navigation.navigate('Auth')}
          justifyContent="center"
          alignItems="center"
          color={palette.purple}
          title="Sign up"
        />
        <SizedBox height={10} />
        <TouchableOpacity
          onPress={() => navigation.navigate('Auth', {screen: 'Login'})}>
          <Text center p>
            Already have an account? <Text color={palette.purple}>Login.</Text>
          </Text>
        </TouchableOpacity>
      </Block>
    </Block>
  );
};
