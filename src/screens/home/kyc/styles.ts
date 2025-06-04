import {HDP} from '@helpers';
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
  stepItem: {
    paddingHorizontal: HDP(16),
    paddingVertical: HDP(17),
    borderRadius: HDP(8),
    borderWidth: 0.5,
    borderColor: '#EAEBF1',
  },
});

export default style;
