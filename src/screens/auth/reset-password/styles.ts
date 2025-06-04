import {HDP, RF} from '@helpers';
import {Dimensions, StyleSheet} from 'react-native';

const {width, height} = Dimensions.get('window');

const style = StyleSheet.create({
  pageWrap: {
    height,
  },
  loginSpan: {
    textDecorationLine: 'underline',
  },
  formBox: {
    paddingHorizontal: HDP(24),
    paddingVertical: HDP(32),
    marginHorizontal: HDP(10),
    flexGrow: 0.9,
  },
  mailBox: {
    overflow: 'hidden',
    marginHorizontal: HDP(10),
    flexGrow: 0.9,
  },
  shortBox: {
    overflow: 'hidden',
    marginHorizontal: HDP(10),
    flexGrow: 0.9,
  },
  pinContainer: {
    width: width * 0.8,
    alignSelf: 'center',
  },
  pinCodeContainer: {
    width: HDP(50),
    height: HDP(50),
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
  label: {
    fontSize: RF(11),
    color: '#4F4F4F',
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
});

export default style;
