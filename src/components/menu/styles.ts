import {RF} from '@helpers';
import {family} from '@theme';
import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  navText: {
    fontSize: RF(11),
    fontFamily: family.Regular,
    color: '#676D7E',
  },
  navActive: {
    fontSize: RF(11),
    fontFamily: family.Medium,
    color: '#1C1B1C',
  },
});

export default styles;
