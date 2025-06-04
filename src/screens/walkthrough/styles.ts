import {HDP, SCREEN_HEIGHT, SCREEN_WEIGHT} from '@helpers';
import {color} from '@theme';
import {Platform, StyleSheet} from 'react-native';

const style = StyleSheet.create({
  pageWrap: {
    backgroundColor: color.primary,
  },
  walkImage: {
    width: SCREEN_WEIGHT * 0.8,
    height: SCREEN_HEIGHT * 0.7,
    alignSelf: 'center',
    resizeMode: 'contain',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
  },
  gradientOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '60%',
  },
  btmBox: {
    width: SCREEN_WEIGHT,
    bottom: 0,
    height: SCREEN_HEIGHT * 0.45,
    // flex: 0.5,
    zIndex: 999,
    borderTopWidth: 1,
    borderTopColor: '#1D2667',
    paddingHorizontal: HDP(40),
  },
  infoBox: {
    borderWidth: 1,
    borderColor: '#4D65AB',
    marginBottom: HDP(24),
    paddingHorizontal: HDP(16),
    paddingVertical: HDP(2),
  },
  indicatorContainer: {
    backgroundColor: '#1D2667',
    borderRadius: 8,
    height: HDP(5),
    marginTop: HDP(Platform.OS === 'ios' ? 70 : 60),
    width: SCREEN_WEIGHT * 0.9,
    alignSelf: 'center',
  },
  indicator: {
    height: HDP(5),
    borderRadius: 8,
  },
  loginSpan: {
    textDecorationLine: 'underline',
  },
});

export default style;
