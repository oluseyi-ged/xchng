import {HDP} from '@helpers';
import {Dimensions, StyleSheet} from 'react-native';

const {width, height} = Dimensions.get('window');

const style = StyleSheet.create({
  pageWrap: {
    height,
  },
  loginSpan: {
    textDecorationLine: 'underline',
  },
  pageHeader: {
    paddingHorizontal: HDP(26),
    paddingVertical: HDP(16),
  },
  formBox: {
    paddingHorizontal: HDP(24),
    paddingVertical: HDP(32),
    flexGrow: 1,
  },
  mailBox: {
    overflow: 'hidden',
    marginHorizontal: HDP(10),
    flexGrow: 0.9,
  },
  pinContainer: {
    width: width * 0.8,
    alignSelf: 'center',
  },
  pinCodeContainer: {
    width: HDP(72),
    height: HDP(72),
  },
  filledPinCodeContainer: {
    backgroundColor: '#F3F5FF',
    borderColor: '#C0C8FF',
  },
  activePinCodeContainer: {
    backgroundColor: '#F3F5FF',
  },
  pinCodeText: {
    fontSize: 50,
  },
  mailButton: {
    paddingHorizontal: 16,
  },
  currBlock: {
    paddingVertical: HDP(8),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
});

export default style;
