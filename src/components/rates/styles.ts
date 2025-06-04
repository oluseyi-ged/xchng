import {HDP, RF} from '@helpers';
import {family} from '@theme';
import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  inputBox: {
    padding: HDP(20),
  },
  filterView: {},
  filterText: {
    fontFamily: family.Medium,
    fontSize: RF(18),
  },
  itemText: {
    fontSize: RF(12),
    color: '#000',
    fontFamily: family.Regular,
  },
});

export default styles;
