import {HDP, RF} from '@helpers';
import {family, palette} from '@theme';
import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    height: HDP(45),
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 4,
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
  bordered: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: palette.mutedGreen,
  },
  bvnLength: {
    position: 'absolute',
    bottom: HDP(-5),
    right: 0,
    fontSize: RF(8),
    color: palette.grey,
  },
  info: {
    fontSize: RF(10),
    color: '#4C4D4D',
    fontFamily: family.Regular,
    alignSelf: 'flex-start',
  },
});

export default styles;
