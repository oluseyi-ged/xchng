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
  tagBox: {
    paddingHorizontal: HDP(8),
    paddingVertical: HDP(6),
    gap: HDP(10),
    borderWidth: 0.5,
    borderColor: '#7FFFC1',
  },
  copyBox: {
    paddingHorizontal: HDP(4),
    paddingVertical: HDP(3),
    gap: HDP(2),
  },
  listItem: {
    borderWidth: 0.5,
    borderColor: '#C0C8FF',
    paddingHorizontal: HDP(16),
    paddingVertical: HDP(12),
  },
});

export default style;
