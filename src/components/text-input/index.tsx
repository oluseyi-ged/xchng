/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
import {Block, SizedBox, SvgIcon, Text} from '@components';
// import {SvgIcon} from '@components/svg-icon';
import {HDP, RF} from '@helpers';
import React, {FC, useEffect, useState} from 'react';
import {TextInput as TN, View} from 'react-native';
import style from './styles';

interface Props {
  padding?: number;
  onSubmit?: () => void;
  // onPress?: () => void;
  onFocus?: () => void;
  onBlur?: (text?: string) => void;
  onChangeText?: any;
  onClear?: any;
  textAlignVertical?: 'auto' | 'top' | 'bottom' | 'center';
  value?: any;
  containerStyle?: any;
  inputStyle?: any;
  marginTop?: number;
  textAlign?: 'left' | 'right' | 'center';
  error?: string | boolean;
  editable?: boolean;
  maxLength?: number;
  placeholder?: any;
  inputErrMsg?: any;
  charLength?: any;
  multiline?: boolean;
  keyboardType?:
    | 'default'
    | 'email-address'
    | 'numeric'
    | 'phone-pad'
    | 'number-pad';
  textPaddingVertical?: number;
  bottomTitle?: string;
  rightIcon?: string;
  shouldFocus?: boolean;
  onTouchStart?: () => void;
  [x: string]: any;
  lessMargin?: boolean;
  isError?: boolean;
  label?: string;
  info?: string;
  type?: 'password' | 'text';
  iconName1?: string;
  iconName2?: string;
  iconSize1?: number;
  iconSize2?: number;
  onPress1?: any;
  onPress2?: any;
  placeholderTextColor?: string;
  numberOfLines?: number;
  innerStyle?: any;
  bordered?: boolean;
  white?: boolean;
  autoCorrect?: boolean;
  labelStyle?: any;
  firstText?: any;
  isAmount?: boolean;
  clearable?: boolean;
  successMsg?: string;
}
export const TextInput: FC<Props> = ({
  inputStyle,
  placeholder,
  placeholderTextColor = '#BABABB',
  keyboardType,
  onSubmit,
  onFocus,
  onBlur,
  editable,
  textAlign,
  textAlignVertical,
  multiline,
  refValue,
  value,
  maxLength,
  type,
  label,
  info,
  charLength = 0,
  onChangeText,
  iconName1,
  iconName2,
  isAmount,
  iconSize1,
  iconSize2,
  onPress1,
  onPress2,
  numberOfLines,
  innerStyle,
  bordered,
  shouldFocus,
  autoCorrect,
  white,
  error,
  labelStyle,
  firstText,
  clearable,
  onClear,
  successMsg,
}) => {
  const [focused, setFocused] = useState(false);
  const [valueText, setValueText] = useState(0);
  const [secure, setSecure] = useState(type === 'password' ? true : false);
  const [formattedValue, setFormattedValue] = useState(value);

  useEffect(() => {
    if (value) {
      setValueText(value.length);
    }
  }, [value]);

  const handleTextChange = inputText => {
    if (isAmount) {
      const numericText = inputText.replace(/[^0-9.]/g, '');
      const parts = numericText.split('.');
      if (parts?.length > 1) {
        const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        const formattedText = `${integerPart}.${parts[1]}`;
        setFormattedValue(formattedText);
        onChangeText(inputText);
      } else {
        const formattedText = numericText.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        setFormattedValue(formattedText);
        onChangeText(inputText);
      }
    } else {
      setFormattedValue(inputText);
      onChangeText(inputText);
    }
  };

  return (
    <View>
      <Text style={[style.label, labelStyle, white && {color: '#FA4A84'}]}>
        {label}
      </Text>

      <View
        style={[
          style.inputContainer,
          inputStyle,
          bordered && style.bordered,
          focused && {borderColor: '#A5B0FC', backgroundColor: '#F3F5FF'},
        ]}>
        <Block row>
          {iconName1 ? (
            <SvgIcon
              name={iconName1}
              size={iconSize1 || 20}
              onPress={onPress1}
              containerStyle={{marginRight: HDP(24)}}
            />
          ) : null}
          {firstText ? (
            <Text
              style={[
                {
                  color: bordered ? '#fff' : '#082932',
                  fontSize: RF(14),
                  paddingLeft: HDP(10),
                },
              ]}>
              {firstText}
            </Text>
          ) : null}
          <TN
            placeholder={placeholder}
            style={[
              {
                paddingLeft: 16,
                flex: 1,
                color: '#011A0E',
                fontSize: RF(10),
              },
              innerStyle,
            ]}
            placeholderTextColor={bordered ? '#EAFFD270' : placeholderTextColor}
            onFocus={() => {
              onFocus;
              setFocused(true);
            }}
            onBlur={() => {
              onBlur;
              setFocused(false);
            }}
            maxLength={maxLength}
            editable={editable}
            secureTextEntry={secure}
            textAlign={textAlign}
            textAlignVertical={textAlignVertical || 'top'}
            multiline={multiline}
            onSubmitEditing={onSubmit}
            ref={refValue}
            // onChangeText={onChangeText}
            onChangeText={text => {
              onChangeText && onChangeText(text);
              handleTextChange(text);
            }}
            // value={value}
            value={!formattedValue?.length ? value : formattedValue}
            // keyboardType={keyboardType}
            keyboardType={isAmount ? 'numeric' : keyboardType}
            autoCapitalize={'none'}
            numberOfLines={numberOfLines}
            autoFocus={shouldFocus}
            autoCorrect={autoCorrect}
          />
          {iconName2 ? (
            <SvgIcon
              name={iconName2}
              size={iconSize2 || 20}
              onPress={onPress2}
              containerStyle={{marginRight: HDP(24)}}
            />
          ) : null}
          {clearable && valueText > 0 ? (
            <>
              <SvgIcon name="check" size={iconSize2 || 16} />
              <SizedBox width={12} />
              <SvgIcon
                name="close"
                size={16}
                onPress={() => {
                  onClear();
                  setFormattedValue('');
                  setValueText(0);
                }}
              />
            </>
          ) : null}
        </Block>
      </View>
      {successMsg ? (
        <Block top={8} row alignItems="center" gap={5}>
          <SvgIcon name="verify-deep" size={20} />
          <Text color="#195742">{successMsg}</Text>
        </Block>
      ) : null}
      {info ? (
        <>
          <Text style={[style.info, white && {color: '#13556D'}]}>{info}</Text>
          <SizedBox height={8} />
        </>
      ) : null}
      {charLength > 0 ? (
        <Text style={[style.bvnLength]}>
          {valueText} /{charLength}
        </Text>
      ) : null}
      {error?.length ? (
        <>
          <Text style={[style.error]}>{error}</Text>
          <SizedBox height={10} />
        </>
      ) : (
        <SizedBox height={10} />
      )}
    </View>
  );
};
