import {HDP, RF} from '@helpers';
import {family} from '@theme';
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
  error: {
    fontSize: RF(10),
    color: 'red',
    fontFamily: family.Regular,
    alignSelf: 'flex-start',
    marginTop: HDP(5),
  },
});

export default style;
