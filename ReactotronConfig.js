// ReactotronConfig.js
import Reactotron, { asyncStorage } from 'reactotron-react-native';
import { reactotronRedux } from 'reactotron-redux';

const reactotron = __DEV__
  ? Reactotron.configure({
      name: 'xchng Mobile App',
    })
      .useReactNative() // add all built-in react native plugins
      .use(asyncStorage())
      .use(
        reactotronRedux({
          except: [],
        }),
      )
      .connect()
  : null;

export default reactotron;
