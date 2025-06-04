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
  fileContainer: {
    paddingVertical: HDP(12),
    paddingHorizontal: HDP(16),
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#1A9459',
    borderStyle: 'dashed',
  },
  uploadContainer: {
    paddingVertical: HDP(12),
    paddingHorizontal: HDP(16),
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#55555570',
    borderStyle: 'dashed',
    gap: 5,
  },
});

export default style;
