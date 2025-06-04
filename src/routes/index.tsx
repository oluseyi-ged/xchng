/* eslint-disable react-native/no-inline-styles */
import Toast from '@components/toast';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Onboarding, SplashScreen, Walkthrough} from '@screens';
import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import AppStackScreens from './AppStack';
import AuthStackScreens from './AuthStack';

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  return (
    <SafeAreaProvider style={{position: 'relative', flex: 1}}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="SplashScreen"
          screenOptions={{
            headerShown: false,
          }}>
          <Stack.Screen name="SplashScreen" component={SplashScreen} />
          <Stack.Screen name="Walkthrough" component={Walkthrough} />
          <Stack.Screen name="Onboarding" component={Onboarding} />
          <Stack.Screen name="Home" component={AppStackScreens} />
          <Stack.Screen name="Auth" component={AuthStackScreens} />
        </Stack.Navigator>
      </NavigationContainer>
      <Toast />
    </SafeAreaProvider>
  );
};

export default RootNavigator;
