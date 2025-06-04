import {HDP} from '@helpers';
import {HS, VS} from '@utils/metrics';
import {Dimensions, StyleSheet} from 'react-native';

const {width, height} = Dimensions.get('window');

const style = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#004BFF30',
  },
  pageWrap: {
    flex: 1,
    height,
    justifyContent: 'space-between',
    backgroundColor: '#F0F0F0',
  },
  gif: {
    width: HS(240),
    height: VS(240),
    alignSelf: 'center',
  },
  btmBox: {
    paddingHorizontal: HDP(24),
    justifyContent: 'flex-end',
    paddingBottom: HDP(80),
  },
});

export default style;
