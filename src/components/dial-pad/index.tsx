/* eslint-disable react-native/no-inline-styles */
import {SvgIcon, Text} from '@components';
import {useNavigation} from '@react-navigation/native';
import React, {FC} from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import styles from './styles';

interface Props {
  dialPadContent?: string[];
  dialPadSize?: number;
  dialPadTextSize?: number;
  value: string; // Generic value (PIN or amount)
  setValue: (value: string) => void; // Generic setter
  mode: 'pin' | 'amount'; // Mode to determine behavior
  pinLength?: number; // Required for PIN mode
  onPinComplete?: (value: string) => void;
  loading?: boolean;
}

export const DialpadKeypad: FC<Props> = ({
  dialPadContent = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'X'],
  dialPadSize = 80,
  dialPadTextSize,
  value,
  setValue,
  mode,
  pinLength = 4,
  onPinComplete,
  loading = false,
}) => {
  const navigation: any = useNavigation();

  const handlePress = (item: string) => {
    if (item === 'X') {
      const newValue = value.slice(0, -1);
      setValue(newValue);
    } else if (mode === 'pin') {
      if (item !== '.' && value.length < pinLength) {
        const newValue = value + item;
        setValue(newValue);
        if (newValue.length === pinLength && onPinComplete) {
          onPinComplete(newValue); // Pass the newValue directly
        }
      }
    } else if (mode === 'amount') {
      // Amount mode: allow numbers and one decimal point
      if (item === '.') {
        if (!value.includes('.') && value !== '') {
          setValue(value + item);
        }
      } else {
        // Prevent leading zeros unless followed by a decimal
        if (value === '0' && item !== '.') {
          setValue(item);
        } else {
          // Limit to two decimal places if decimal exists
          if (value.includes('.')) {
            const [, decimal] = value.split('.');
            if (decimal.length < 2) {
              setValue(value + item);
            }
          } else {
            setValue(value + item);
          }
        }
      }
    }
  };

  // Filter dialPadContent based on mode (exclude '.' for PIN)
  const content =
    mode === 'pin'
      ? dialPadContent.filter(item => item !== '.')
      : dialPadContent;

  return (
    <View>
      <FlatList
        data={content}
        numColumns={3}
        scrollEnabled={false}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={styles.dialBox}
        renderItem={({item}) => (
          <TouchableOpacity
            disabled={item === '' || loading} // Disable when loading
            onPress={() => handlePress(item)}>
            <View
              style={[
                {
                  backgroundColor: item === '' ? 'transparent' : '#fff',
                  width: dialPadSize,
                  height: dialPadSize,
                  opacity: loading ? 0.5 : 1, // Reduce opacity when loading
                },
                styles.dialPadContainer,
              ]}>
              {item === 'X' ? (
                <SvgIcon name={'close'} size={24} />
              ) : item === ';' ? (
                <SvgIcon name={'metrics'} size={24} />
              ) : (
                <Text
                  size={20}
                  color="#0F1545"
                  style={[{fontSize: dialPadTextSize}]}>
                  {item}
                </Text>
              )}
            </View>
          </TouchableOpacity>
        )}
      />

      {loading && (
        <View style={StyleSheet.absoluteFillObject}>
          <View
            style={{
              ...StyleSheet.absoluteFillObject,
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
            }}
          />
          <ActivityIndicator
            size="large"
            color="#0000ff"
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          />
        </View>
      )}
    </View>
  );
};
