import {SizedBox} from '@components';
import {HDP} from '@helpers';
import React, {FC, useState} from 'react';
import {
  ImageBackground,
  Keyboard,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-controller';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {getStatusBarHeight} from 'react-native-status-bar-height';

interface Props {
  flex?: ViewStyle['flex'];
  row?: boolean;
  justify?: ViewStyle['justifyContent'];
  justifyContent?: ViewStyle['justifyContent'];
  align?: ViewStyle['alignItems'];
  alignItems?: ViewStyle['alignItems'];
  alignSelf?: ViewStyle['alignSelf'];
  content?: ViewStyle['alignContent'];
  alignContent?: ViewStyle['alignContent'];
  wrap?: ViewStyle['flexWrap'];
  width?: ViewStyle['width'];
  height?: ViewStyle['height'];
  position?: ViewStyle['position'];
  top?: ViewStyle['top'];
  right?: ViewStyle['right'];
  gap?: number;
  bottom?: ViewStyle['bottom'];
  left?: ViewStyle['left'];
  color?: ViewStyle['backgroundColor'];
  outlined?: boolean;
  card?: boolean;
  radius?: ViewStyle['borderRadius'];
  overflow?: ViewStyle['overflow'];
  safe?: boolean;
  scroll?: boolean;
  scrollIn?: boolean;
  shadow?: {
    color?: ViewStyle['shadowColor'];
    offset?: ViewStyle['shadowOffset'];
    opacity?: ViewStyle['shadowOpacity'];
    radius?: ViewStyle['shadowRadius'];
  };
  children?: React.ReactNode;
  style?: any;
  bg?: string;
  onPress?: any;
  transparent?: boolean;
  refreshControl?: any;
  ref?: any;
  testID?: any;
  showScrollbar?: boolean;
  contentContainerStyle?: any;
  disabled?: boolean;
  isScrollable?: boolean;
  backgroundImage?: any;
  overlayColor?: string;
  backgroundScroll?: boolean;
  bounce?: boolean;
  activeOpacity?: number;
  scrollEventThrottle?: number;
}

export const Block: FC<Props> = ({
  children,
  style,
  flex,
  showScrollbar = false,
  row,
  justify,
  scrollIn,
  justifyContent,
  align,
  gap,
  alignItems,
  alignSelf,
  content,
  alignContent,
  wrap,
  width,
  height,
  position,
  top,
  right,
  bottom,
  left,
  onPress,
  color,
  outlined,
  card,
  radius,
  overflow,
  safe,
  scroll,
  shadow,
  bg,
  refreshControl,
  transparent = bg?.length ? false : true,
  testID,
  ref,
  contentContainerStyle,
  disabled,
  isScrollable = true,
  backgroundImage,
  overlayColor,
  backgroundScroll = false,
  bounce = false,
  activeOpacity,
  scrollEventThrottle,
  ...props
}) => {
  const blockStyle = StyleSheet.flatten([
    flex !== undefined && {flex},
    row && {flexDirection: 'row'},
    justify !== undefined && {justifyContent: justify},
    justifyContent !== undefined && {justifyContent},
    align !== undefined && {alignItems: align},
    alignItems !== undefined && {alignItems},
    alignSelf !== undefined && {alignSelf},
    content !== undefined && {alignContent: content},
    alignContent !== undefined && {alignContent},
    wrap !== undefined && {flexWrap: wrap},
    width !== undefined && {width},
    height !== undefined && {height},
    position !== undefined && {position},
    top !== undefined && {top},
    right !== undefined && {right},
    bottom !== undefined && {bottom},
    left !== undefined && {left},
    color !== undefined && {backgroundColor: color},
    gap !== undefined && {gap: HDP(gap)},
    outlined && {
      borderWidth: 1,
      borderColor: color,
      backgroundColor: 'transparent',
    },
    card && {
      backgroundColor: 'white',
      borderRadius: 16,
      padding: 10,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 7,
      },
      shadowOpacity: 0.07,
      shadowRadius: 4,
      elevation: 2,
    },
    radius !== undefined && {borderRadius: radius},
    bg !== undefined && !transparent && {backgroundColor: bg},
    overflow !== undefined && {overflow},
    shadow !== undefined && {...shadow},
    style,
  ]);

  const snapToOffsets = [125, 225, 325, 425, 525, 625];

  const [snapToOffsetsEnabled, setSnapToOffsetsEnabled] = useState(false);

  const insets = useSafeAreaInsets();
  const idleHeight = getStatusBarHeight();

  const backdropStyle = StyleSheet.create({
    backdrop: {
      flex: 1,
      backgroundColor: '#05081A',
      overflow: 'hidden',
      minHeight: height,
      paddingTop: HDP(insets.top),
    },
    overlay: {
      ...StyleSheet.absoluteFillObject,
    },
  });

  const renderContent = () => (
    <>
      {overlayColor ? (
        <TouchableOpacity
          disabled={!onPress || disabled}
          style={[backdropStyle.overlay, {backgroundColor: overlayColor}]}
          onPress={() => {
            Keyboard.dismiss();
            if (onPress) {
              onPress();
            }
          }}></TouchableOpacity>
      ) : null}
      <View testID={testID} ref={ref} style={[blockStyle]} {...props}>
        {children}
      </View>
    </>
  );

  if (backgroundImage) {
    const backgroundContent = (
      <ImageBackground
        source={backgroundImage}
        resizeMode="cover"
        style={[backdropStyle.backdrop, style]}>
        {renderContent()}
      </ImageBackground>
    );

    if (backgroundScroll) {
      return (
        <KeyboardAwareScrollView
          bottomOffset={50}
          contentContainerStyle={contentContainerStyle}
          disableScrollOnKeyboardHide={false}
          enabled={true}
          scrollEnabled={isScrollable}
          snapToOffsets={snapToOffsetsEnabled ? snapToOffsets : undefined}
          keyboardShouldPersistTaps="handled"
          automaticallyAdjustContentInsets={false}
          refreshControl={refreshControl}
          ref={ref}
          style={[blockStyle, {backgroundColor: bg || '#05081A'}]}
          showsVerticalScrollIndicator={showScrollbar}
          alwaysBounceVertical={bounce}
          bounces={bounce}
          scrollEventThrottle={scrollEventThrottle}
          testID="aware_scroll_view_container"
          {...props}>
          {backgroundContent}
          {/* <SizedBox height={100} /> */}
        </KeyboardAwareScrollView>
      );
    }

    return backgroundContent;
  }

  if (safe) {
    return (
      <View
        testID={testID}
        ref={ref}
        style={[
          {
            paddingTop: HDP(insets.top),
            flex: flex ?? 1,
            backgroundColor: bg,
          },
        ]}
        {...props}>
        <KeyboardAwareScrollView
          bottomOffset={50}
          contentContainerStyle={{flexGrow: 1}}
          disableScrollOnKeyboardHide={false}
          enabled={true}
          scrollEnabled={isScrollable}
          snapToOffsets={snapToOffsetsEnabled ? snapToOffsets : undefined}
          keyboardShouldPersistTaps="handled"
          automaticallyAdjustContentInsets={false}
          refreshControl={refreshControl}
          style={blockStyle}
          testID="aware_scroll_view_container"
          alwaysBounceVertical={bounce}
          bounces={bounce}
          showsVerticalScrollIndicator={false}
          {...props}>
          {children}
          <SizedBox height={100} />
        </KeyboardAwareScrollView>
      </View>
    );
  }

  if (scroll) {
    return (
      <View
        testID={testID}
        style={{flex: 1, backgroundColor: bg, paddingTop: HDP(insets.top)}}
        {...props}>
        <KeyboardAwareScrollView
          bottomOffset={50}
          contentContainerStyle={contentContainerStyle}
          disableScrollOnKeyboardHide={false}
          enabled={true}
          scrollEnabled={isScrollable}
          snapToOffsets={snapToOffsetsEnabled ? snapToOffsets : undefined}
          keyboardShouldPersistTaps="handled"
          automaticallyAdjustContentInsets={false}
          refreshControl={refreshControl}
          ref={ref}
          showsVerticalScrollIndicator={showScrollbar}
          style={blockStyle}
          testID="aware_scroll_view_container"
          scrollEventThrottle={scrollEventThrottle}
          alwaysBounceVertical={bounce}
          bounces={bounce}
          {...props}>
          {children}
          <SizedBox height={100} />
        </KeyboardAwareScrollView>
      </View>
    );
  }

  if (scrollIn) {
    return (
      <KeyboardAwareScrollView
        bottomOffset={50}
        contentContainerStyle={contentContainerStyle}
        disableScrollOnKeyboardHide={false}
        enabled={true}
        scrollEnabled={isScrollable}
        snapToOffsets={snapToOffsetsEnabled ? snapToOffsets : undefined}
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustContentInsets={false}
        refreshControl={refreshControl}
        style={blockStyle}
        testID="aware_scroll_view_container"
        {...props}>
        {children}
        <SizedBox height={100} />
      </KeyboardAwareScrollView>
    );
  }

  const handlePress = () => {
    Keyboard.dismiss();
    if (onPress) {
      onPress();
    }
  };

  if (!onPress) {
    return (
      <View testID={testID} ref={ref} style={blockStyle} {...props}>
        {children}
      </View>
    );
  }

  return (
    <TouchableOpacity
      hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
      testID={testID}
      ref={ref}
      disabled={disabled}
      onPress={handlePress}
      activeOpacity={activeOpacity}
      style={blockStyle}
      {...props}>
      {children}
    </TouchableOpacity>
  );
};
