import {Text} from '@components/text';
import {HDP} from '@helpers';
import {palette} from '@theme';
import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';

interface SwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  activeColor?: string;
  inactiveColor?: string;
  thumbColor?: string;
  size?: 'small' | 'medium' | 'large';
  label?: string;
  labelPosition?: 'left' | 'right';
}

export const Switch: React.FC<SwitchProps> = ({
  value,
  onValueChange,
  disabled = false,
  activeColor = '#2563EB',
  inactiveColor = '#ccc',
  thumbColor = palette.white,
  size = 'small',
  label,
  labelPosition = 'right',
}) => {
  const switchSizes = {
    small: {width: 32, height: 20, thumbSize: 14},
    medium: {width: 40, height: 23, thumbSize: 18},
    large: {width: 50, height: 30, thumbSize: 22},
  };

  const {width, height, thumbSize} = switchSizes[size];
  const trackColor = value ? activeColor : inactiveColor;

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={disabled ? 1 : 0.7}
      onPress={() => (!disabled ? onValueChange(!value) : {})}>
      {label && labelPosition === 'left' ? (
        <Text style={styles.label}>{label}</Text>
      ) : null}
      <View
        style={[
          styles.track,
          {
            width,
            height,
            backgroundColor: trackColor,
            opacity: disabled ? 0.5 : 1,
          },
        ]}>
        <View
          style={[
            styles.thumb,
            {
              width: thumbSize,
              height: thumbSize,
              backgroundColor: thumbColor,
              transform: [{translateX: value ? width - thumbSize - 4 : 0}],
            },
          ]}
        />
      </View>
      {label && labelPosition === 'right' ? (
        <Text style={styles.label}>{label}</Text>
      ) : null}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: HDP(40),
    paddingHorizontal: HDP(8),
    paddingVertical: HDP(6),
  },
  track: {
    borderRadius: 999,
    justifyContent: 'center',
    padding: 2,
  },
  thumb: {
    borderRadius: 999,
  },
  label: {
    marginHorizontal: 8,
    fontSize: 16,
  },
});
