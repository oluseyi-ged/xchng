import {LazyImage} from '@components/lazy-image';
import {Text} from '@components/text';
import {HDP, RF} from '@helpers';
import {useNavigation} from '@react-navigation/native';
import {family} from '@theme';
import React from 'react';
import {StyleSheet, TextStyle, TouchableOpacity, View} from 'react-native';

const PROFILE_SIZE = HDP(180);
const LARGE_SIZE = HDP(90);
const MEDIUM_SIZE = HDP(65);
const SMALL_SIZE = HDP(50);
const LITTLE_SIZE = HDP(40);
const MINI_SIZE = HDP(24);
const INITIALS_BG_COLOR = '#F3F5FF';

interface AvatarProps {
  textStyle?: TextStyle;
  style?: any;
  url?: string;
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'repeat' | 'center';
  size?: 'large' | 'medium' | 'small' | 'tiny' | 'profile' | 'mini';
  shape?: 'square' | 'circle' | 'round';
  onPress?: () => void;
  name?: string;
  id?: number;
  nav?: boolean;
  role?: string;
  showOrg?: boolean;
  type?: string;
  bg?: string;
}

export const Avatar = ({
  textStyle,
  style,
  url = '',
  resizeMode = 'cover',
  size = 'medium',
  shape = 'square',
  onPress,
  name,
  id,
  bg,
  nav = false,
}: AvatarProps) => {
  const navigation = useNavigation<any>();

  const handlePress = () => {
    if (nav) {
      navigation.push('Profile', {id});
    } else if (onPress) {
      onPress();
    }
  };

  const nameToUse = name ?? 'Anon';
  const initials = nameToUse
    ?.split(' ')
    ?.map(word => word.charAt(0))
    ?.join('')
    ?.toUpperCase();

  if (
    url === 'null' ||
    url === 'undefined' ||
    url === null ||
    url === undefined ||
    !url?.length ||
    url === '' ||
    typeof url !== 'string'
  ) {
    return (
      <>
        <TouchableOpacity
          onPress={handlePress}
          style={[
            styles.container,
            sizeStyle[size],
            shapeStyle(shape, size),
            style,
            styles.initialsContainer,
            {backgroundColor: bg},
          ]}>
          <Text
            style={[
              styles.initialsText,
              size === 'tiny' && {
                fontSize: RF(10),
              },
              textStyle,
            ]}>
            {initials}
          </Text>
        </TouchableOpacity>
      </>
    );
  }

  return (
    <>
      <TouchableOpacity onPress={handlePress}>
        {url && typeof url === 'string' && url.trim() !== '' ? (
          <LazyImage
            containerStyle={[sizeStyle[size], shapeStyle(shape, size), style]}
            url={url}
            resizeMode={resizeMode}
          />
        ) : (
          <View
            style={[
              styles.container,
              sizeStyle[size],
              shapeStyle(shape, size),
              style,
              styles.initialsContainer,
            ]}>
            <Text
              style={[
                styles.initialsText,
                size === 'tiny' && {
                  fontSize: RF(10),
                },
                textStyle,
              ]}>
              {initials}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </>
  );
};

const sizeStyle = StyleSheet.create({
  profile: {
    height: PROFILE_SIZE,
    width: PROFILE_SIZE,
  },
  large: {
    height: LARGE_SIZE,
    width: LARGE_SIZE,
  },
  medium: {
    height: MEDIUM_SIZE,
    width: MEDIUM_SIZE,
  },

  small: {
    height: SMALL_SIZE,
    width: SMALL_SIZE,
  },
  tiny: {
    height: LITTLE_SIZE,
    width: LITTLE_SIZE,
  },
  mini: {
    height: MINI_SIZE,
    width: MINI_SIZE,
  },
});

const shapeStyle = (shape, size) => {
  switch (shape) {
    case 'circle':
      return {borderRadius: 0.5 * sizeStyle[size].height, overflow: 'hidden'};
    case 'round':
      return {borderRadius: 0.25 * sizeStyle[size].height, overflow: 'hidden'};
    default:
      return {borderRadius: 0};
  }
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  initialsContainer: {
    backgroundColor: INITIALS_BG_COLOR,
  },
  initialsText: {
    color: '#1D2667',
    fontFamily: family.Bold,
    fontSize: RF(16),
  },
  locView: {
    flexDirection: 'row',
    gap: HDP(8),
  },
  nameBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: HDP(14),
  },
});
