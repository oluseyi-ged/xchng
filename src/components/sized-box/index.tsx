/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View} from 'react-native';
/* ANCHOR SIZED BOX */
interface SizedBox {
  height?: number;
  width?: number;
  backgroundColor?: any;
  style?: any;
  flex?: number;
  borderColor?: string;
}
export const SizedBox = ({
  width,
  height,
  flex,
  backgroundColor,
  borderColor,
  style,
}: SizedBox) => {
  return (
    <View
      style={[
        {
          width,
          height,
          flex,
          backgroundColor,
        },
        style,
        // @ts-ignore
        borderColor && {borderWidth: 0.331, borderColor},
      ]}
    />
  );
};
