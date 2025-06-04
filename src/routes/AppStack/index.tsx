/* eslint-disable @typescript-eslint/no-unused-vars */
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {TabsStackScreens} from '@routes/Tabs';
import {
  Account,
  AddressInfo,
  AddressKyc,
  ChangePassword,
  CreatePin,
  CreateTag,
  Kyc,
  PayAmount,
  PayBank,
  PayBeneficiary,
  PayTag,
  PersonalInfo,
  SuccessPage,
  SwapFunds,
} from '@screens';
import {ChangePin} from '@screens/change-pin';
import {useRefreshTokenMutation} from '@services/mutationApi';
import {setAuth} from '@slices/auth';
import {setLogged} from '@slices/logged';
import {setToken} from '@slices/token';
import base64 from 'base-64';
import {jwtDecode} from 'jwt-decode';
import React, {useEffect} from 'react';
import {Platform} from 'react-native';
import {RootState, useAppDispatch, useAppSelector} from 'store';

const AppStack = createNativeStackNavigator();
const AppStackScreens = ({navigation}) => {
  const dispatch = useAppDispatch();
  const [refreshUserToken, {data}]: any = useRefreshTokenMutation();
  const token = useAppSelector<any>((store: RootState) => store.token);

  if (Platform.OS !== 'web') {
    global.atob = base64.decode;
    global.btoa = base64.encode;
  }

  useEffect(() => {
    const checkSessionExpiry = () => {
      if (token) {
        try {
          // Improved token validation
          if (typeof token !== 'string' || token.split('.').length !== 3) {
            throw new Error('Invalid token format');
          }

          const decodedToken = jwtDecode<{exp: number}>(token);
          const expiresIn = decodedToken.exp * 1000;
          const currentTime = Date.now();

          // Handle case where token is already expired
          if (expiresIn <= currentTime) {
            throw new Error('Token already expired');
          }

          const timeLeft = expiresIn - currentTime;

          if (timeLeft <= 30000) {
            refreshUserToken()
              .unwrap()
              .then((res: any) => {
                if (res?.data?.accessToken) {
                  dispatch(setToken(res.data.accessToken));
                  dispatch(setLogged(true));
                } else {
                  throw new Error('Invalid refresh response');
                }
              })
              .catch((err: any) => {
                console.error('Refresh failed:', err.message);
                handleLogout();
              });
          }
        } catch (error) {
          console.error('Token check failed:', error.message);
          handleLogout();
        }
      } else {
        handleLogout();
      }
    };

    const handleLogout = () => {
      dispatch(setLogged(false));
      dispatch(setAuth({}));
      dispatch(setToken(null));
      setTimeout(() => {
        navigation.reset({
          index: 0,
          routes: [{name: 'SplashScreen'}],
        });
      }, 500);
    };

    const interval = setInterval(checkSessionExpiry, 10000);
    return () => clearInterval(interval);
  }, [token, refreshUserToken, navigation, dispatch]);

  return (
    <AppStack.Navigator initialRouteName={'AppHome'}>
      <AppStack.Screen
        name="AppHome"
        component={TabsStackScreens}
        options={{
          headerShown: false,
        }}
      />
      <AppStack.Screen
        name="Account"
        component={Account}
        options={{
          headerShown: false,
        }}
      />
      <AppStack.Screen
        name="AddressInfo"
        component={AddressInfo}
        options={{
          headerShown: false,
        }}
      />
      <AppStack.Screen
        name="SuccessPage"
        component={SuccessPage}
        options={{
          headerShown: false,
        }}
      />
      <AppStack.Screen
        name="CreatePin"
        component={CreatePin}
        options={{
          headerShown: false,
        }}
      />
      <AppStack.Screen
        name="CreateTag"
        component={CreateTag}
        options={{
          headerShown: false,
        }}
      />
      <AppStack.Screen
        name="PayTag"
        component={PayTag}
        options={{
          headerShown: false,
        }}
      />
      <AppStack.Screen
        name="PayBeneficiary"
        component={PayBeneficiary}
        options={{
          headerShown: false,
        }}
      />
      <AppStack.Screen
        name="PayBank"
        component={PayBank}
        options={{
          headerShown: false,
        }}
      />
      <AppStack.Screen
        name="PayAmount"
        component={PayAmount}
        options={{
          headerShown: false,
        }}
      />
      <AppStack.Screen
        name="ChangePassword"
        component={ChangePassword}
        options={{
          headerShown: false,
        }}
      />
      <AppStack.Screen
        name="ChangePin"
        component={ChangePin}
        options={{
          headerShown: false,
        }}
      />
      <AppStack.Screen
        name="Kyc"
        component={Kyc}
        options={{
          headerShown: false,
        }}
      />
      <AppStack.Screen
        name="AddressKyc"
        component={AddressKyc}
        options={{
          headerShown: false,
        }}
      />
      <AppStack.Screen
        name="PersonalInfo"
        component={PersonalInfo}
        options={{
          headerShown: false,
        }}
      />
      <AppStack.Screen
        name="SwapFunds"
        component={SwapFunds}
        options={{
          headerShown: false,
        }}
      />
    </AppStack.Navigator>
  );
};

export default AppStackScreens;
