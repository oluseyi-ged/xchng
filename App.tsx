import RootNavigator from '@routes';
import React from 'react';
import {LogBox} from 'react-native';
import 'react-native-gesture-handler';
import {KeyboardProvider} from 'react-native-keyboard-controller';
import {Provider} from 'react-redux';
import {persistStore} from 'redux-persist';
import {PersistGate} from 'redux-persist/integration/react';
import store from 'store';

let persistor = persistStore(store);
let NativeDevSettings;

LogBox.ignoreAllLogs();

const App = () => {
  return (
    <>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <KeyboardProvider>
            <RootNavigator />
          </KeyboardProvider>
        </PersistGate>
      </Provider>
    </>
  );
};

export default App;
