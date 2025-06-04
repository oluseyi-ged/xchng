import {HDP, RF} from '@helpers';
import {family, palette} from '@theme';
import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  containerCommonStyle: {
    backgroundColor: 'red',
    paddingVertical: HDP(18),
    width: '100%',
    borderRadius: HDP(100),
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },

  textCommonStyle: {
    color: palette.textWhite,
    fontSize: RF(12),
    fontFamily: family.Medium,
  },

  borderStyle: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderRadius: HDP(8),
    borderColor: '#24B467',
  },
  borderTextStyle: {
    color: palette.purple,
    fontSize: RF(14),
    fontFamily: family.Regular,
  },
  iconContainer: {
    marginRight: HDP(5),
  },
  secondaryStyle: {
    backgroundColor: palette.purpleFade,
    borderWidth: 1,
    borderRadius: HDP(6),
    borderColor: palette.borderGreen,
  },
});

export default styles;
