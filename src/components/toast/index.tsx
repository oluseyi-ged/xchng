import {Block, SizedBox, SvgIcon} from '@components';
import {Text} from '@components/text';
import {HDP} from '@helpers';
import {hideToast} from '@slices/toast';
import {palette} from '@theme';
import React, {useEffect} from 'react';
import {Animated, StyleSheet, TouchableWithoutFeedback} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from 'store';

const Toast = () => {
  const dispatch = useDispatch();
  const {isVisible, message, title, type} = useSelector(
    (state: RootState) => state.toast,
  );
  const slideAnim = new Animated.Value(-100);
  const insets = useSafeAreaInsets();

  const handleClose = () => {
    // First animate out
    Animated.timing(slideAnim, {
      toValue: -100,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      // Then dispatch hideToast after animation completes
      dispatch(hideToast());
    });
  };

  useEffect(() => {
    if (isVisible) {
      // Slide in from top
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();

      // Auto-hide after 7 seconds
      const timer = setTimeout(() => {
        handleClose();
      }, 7000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, dispatch]);

  if (!isVisible) return null;

  const backgroundColor = {
    success: '#3B9B7B',
    error: '#C43138',
    warning: '#FF9800',
  }[type];

  const iconName = {
    success: 'verify',
    error: 'caution',
    warning: 'warning',
  }[type];

  return (
    <TouchableWithoutFeedback onPress={handleClose}>
      <Animated.View
        style={[
          styles.container,
          {
            backgroundColor,
            transform: [{translateY: slideAnim}],
            top: insets.top + HDP(10),
          },
        ]}>
        <SvgIcon name={iconName || 'verify'} size={24} />
        <Block>
          <Text size={14} color={palette.white} bold>
            {title}
          </Text>
          <SizedBox height={3} />
          <Text style={{width: '98%'}} size={12} color={palette.white}>
            {message}
          </Text>
        </Block>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 20,
    right: 20,
    padding: 15,
    borderRadius: 8,
    alignItems: 'flex-start',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    gap: 8,
    flexDirection: 'row',
    zIndex: 999,
  },
  message: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default Toast;
