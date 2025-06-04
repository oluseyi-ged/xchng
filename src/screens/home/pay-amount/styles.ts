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
  pageHeader: {
    paddingHorizontal: HDP(26),
    paddingVertical: HDP(16),
  },
  formBox: {
    paddingHorizontal: HDP(24),
    paddingVertical: HDP(32),
    height: height * 0.9,
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
    fontSize: RF(50),
  },
  mailButton: {
    paddingHorizontal: 16,
  },
  reviewBox: {
    position: 'relative',
    backgroundColor: '#F3F5FF',
    borderWidth: 1,
    borderColor: '#C0C8FF',
    padding: HDP(16),
    width: '90%',
    alignSelf: 'center',
    borderRadius: 8,
  },
  reviewFloater: {
    paddingHorizontal: HDP(10),
    paddingVertical: HDP(2),
    position: 'absolute',
    top: -10,
  },
});

export default style;
