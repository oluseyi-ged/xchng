import {HDP, RF} from '@helpers';
import {Dimensions, StyleSheet} from 'react-native';

const {width, height} = Dimensions.get('window');

const style = StyleSheet.create({
  pageWrap: {
    height,
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
  label: {
    fontSize: RF(11),
    color: '#4F4F4F',
    alignSelf: 'flex-start',
    marginBottom: 8,
  },

  pinContainer: {
    width: width * 0.7,
    alignSelf: 'center',
  },
  pinCodeContainer: {
    width: HDP(64),
    height: HDP(64),
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
});

export default style;
