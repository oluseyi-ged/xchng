/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/no-unstable-nested-components */
import {NavMenu} from '@components';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Home, Settings, Transactions} from '@screens';
import {Dimensions, View} from 'react-native';
import {RootState, useAppSelector} from 'store';
// import {RootState, useAppSelector} from 'store';
const {width, height} = Dimensions.get('window');

const Tabs = createBottomTabNavigator();

export const TabsStackScreens = () => {
  const {token} = useAppSelector<any>((store: RootState) => store);

  return (
    <View
      style={{
        width,
        height: height - 15,
      }}>
      <Tabs.Navigator
        tabBar={props => <NavMenu {...props} />}
        // @ts-ignore
        screenOptions={{
          headerShown: false,
          tabBarHideOnKeyboard: true,
          tabBarStyle: [
            {
              display: 'flex',
            },
            null,
          ],
        }}
        initialRouteName="Home">
        <Tabs.Screen name="Home" component={Home} />
        <Tabs.Screen name="Wallet" component={Home} />
        <Tabs.Screen name="Transactions" component={Transactions} />
        <Tabs.Screen name="Settings" component={Settings} />
      </Tabs.Navigator>
    </View>
  );
};
