import {RF, SCREEN_WEIGHT} from '@helpers';
import {color, family, palette} from '@theme';
import {Dimensions, StyleSheet} from 'react-native';

const {width} = Dimensions.get('window');

const style = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#05081A',
  },
  image: {
    marginVertical: 'auto',
  },
  splashText: {
    color: palette.offWhite,
    fontSize: RF(10),
    fontFamily: family.Regular,
    textAlign: 'center',
  },
  textBox: {
    borderWidth: 1,
    borderColor: palette.purpleFade,
    borderRadius: 8,
    paddingVertical: 17,
    paddingHorizontal: 27,
    width: SCREEN_WEIGHT * 0.9,
    marginLeft: -4,
    transform: [{translateY: -5}],
  },
  textBoxShadow: {
    backgroundColor: color.secondary,
    marginLeft: 20,
    borderRadius: 8,
    position: 'absolute',
    top: 100,
    width: SCREEN_WEIGHT * 0.9,
    transform: [{translateX: -5}],
  },
});

export default style;
