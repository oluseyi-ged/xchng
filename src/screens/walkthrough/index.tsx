/* eslint-disable @typescript-eslint/no-unused-vars */
import {Walk1, Walk2, Walk3} from '@assets/images';
import {Block, Button, SizedBox, SvgIcon, Text} from '@components';
import {HDP, SCREEN_WEIGHT} from '@helpers';
import {color, family, palette} from '@theme';
import React, {FC, useRef, useState} from 'react';
import {Animated, Dimensions, TouchableOpacity} from 'react-native';
import {SystemBars} from 'react-native-edge-to-edge';
import LinearGradient from 'react-native-linear-gradient';
import styles from './styles';

const {width} = Dimensions.get('window');

export const Walkthrough: FC = ({navigation}: any) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  const slideData = [
    {
      id: 1,
      image: Walk1,
      title: 'Safe and Secured\n Finances',
      description:
        'Safeguard your transactions with our advanced\n security features and fraud protection.',
    },
    {
      id: 2,
      image: Walk2,
      title: 'Real-time Currency\n Conversion',
      description:
        'Seamlessly switch between currencies with accurate\n exchange rates and zero hassle.',
    },
    {
      id: 3,
      image: Walk3,
      title: 'Swift and Instant\n Transactions',
      description:
        'Access your funds in real-time without waiting\n anytime, anywhere.',
    },
  ];

  const handleNext = () => {
    // Start animation
    fadeAnim.setValue(0);
    slideAnim.setValue(50);

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (currentSlide < slideData.length - 1) {
        setCurrentSlide(currentSlide + 1);
      } else {
        navigation.navigate('Auth');
      }
    });
  };

  const handleSkip = () => {
    navigation.navigate('Auth');
  };

  const isLastSlide = currentSlide === slideData.length - 1;

  const renderIndicators = () => {
    return (
      <Block
        row
        align="center"
        justify="center"
        style={styles.indicatorContainer}>
        {slideData.map((_, index) => (
          <Block
            key={index}
            style={[
              styles.indicator,
              {
                backgroundColor: index === currentSlide ? '#8591EF' : '#1D2667',
                width: (SCREEN_WEIGHT * 0.9) / slideData?.length,
              },
            ]}
          />
        ))}
      </Block>
    );
  };

  return (
    <Block flex={1} style={styles.pageWrap}>
      <SystemBars style="light" />
      {renderIndicators()}
      <SizedBox height={40} />
      <Block style={styles.imageContainer}>
        <Animated.Image
          source={slideData[currentSlide].image}
          style={[
            styles.walkImage,
            {
              opacity: fadeAnim,
              transform: [{translateX: slideAnim}],
            },
          ]}
        />
        <LinearGradient
          colors={['transparent', '#05081A', '#03040700']}
          locations={[0, isLastSlide ? 0.2 : 0.4, 1]}
          style={styles.gradientOverlay}
        />
      </Block>

      <Block bg="#090C26" style={styles.btmBox} position="absolute">
        <SizedBox height={56} />
        <Block
          alignSelf="center"
          bg="#1E213B"
          radius={100}
          style={styles.infoBox}>
          <Text size={14} center color={palette.white}>
            The leading financial platform in Nigeria 🚀
          </Text>
        </Block>
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{translateX: slideAnim}],
          }}>
          <Text
            center
            color={palette.white}
            fontFamily={family.Medium}
            size={32}>
            {slideData[currentSlide]?.title}
          </Text>
          <Text style={{marginTop: 12}} center size={14} color={palette.white}>
            {slideData[currentSlide]?.description}
          </Text>
        </Animated.View>
        <SizedBox height={50} />

        {isLastSlide ? (
          <Block>
            <Button
              onPress={handleNext}
              title="Get Started"
              iconName="arrow-right"
              style={{width: '80%', alignSelf: 'center'}}
            />
            <Text
              style={{marginTop: HDP(24)}}
              center
              size={12}
              color={palette.white}>
              Already have an account?{' '}
              <Text
                color={color.secondary}
                onPress={() => navigation.navigate('Auth', {screen: 'Login'})}
                style={styles.loginSpan}>
                Login here
              </Text>
            </Text>
          </Block>
        ) : (
          <Block row align="center" justify="space-between">
            <TouchableOpacity onPress={handleSkip}>
              <Text color={palette.white} size={16}>
                Skip
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleNext}>
              <SvgIcon name="continue" size={55} />
            </TouchableOpacity>
          </Block>
        )}

        <SizedBox height={50} />
      </Block>
    </Block>
  );
};
