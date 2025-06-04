import {HDP} from '@helpers';
import {Dimensions, StyleSheet} from 'react-native';

const {width, height} = Dimensions.get('window');

const style = StyleSheet.create({
  tagBox: {
    paddingHorizontal: HDP(8),
    paddingVertical: HDP(6),
    gap: HDP(10),
  },
  copyBox: {
    paddingHorizontal: HDP(4),
    paddingVertical: HDP(3),
    gap: HDP(2),
  },
  bottomPage: {
    paddingHorizontal: HDP(24),
    paddingVertical: HDP(16),
    flexGrow: 1,
  },
  infoBox: {
    paddingVertical: HDP(14),
    paddingHorizontal: HDP(16),
  },
});

export default style;
