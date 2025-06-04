import {HDP, RF} from '@helpers';
import {family, palette} from '@theme';
import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  modalView: {
    backgroundColor: '#fff',
    borderRadius: HDP(8),
    padding: HDP(24),
  },
  modalHeader: {
    fontSize: RF(20),
    fontFamily: family.Medium,
    color: palette.purple,
  },
  modalCTA: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
  },
  btn1: {
    fontSize: RF(14),
  },
  btn2: {
    fontSize: RF(14),
  },
});

export default styles;
