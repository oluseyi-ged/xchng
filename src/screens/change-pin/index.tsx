import {Block, Button, SizedBox, SvgIcon, Text} from '@components';
import {HDP, SCREEN_WEIGHT, triggerToast} from '@helpers';
import {useValidateResetPinMutation} from '@services/mutationApi';
import {family, palette} from '@theme';
import React, {FC, useState} from 'react';
import {SystemBars} from 'react-native-edge-to-edge';
import {OtpInput} from 'react-native-otp-entry';
import styles from './styles';

export const ChangePin: FC = ({navigation, route}: any) => {
  const {otp} = route?.params || {};
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [showNewPin, setShowNewPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);
  const [error, setError] = useState('');

  const [validateReset, {isLoading: isChangeLoad}]: any =
    useValidateResetPinMutation();

  const validatePin = (pin: string) => {
    // Check for empty pin
    if (!pin || pin.length < 4) {
      setError('PIN must be 4 digits');
      return false;
    }

    // Check for simple patterns
    const simplePatterns = ['0000', '1111', '1234', '4321'];
    if (simplePatterns.includes(pin)) {
      setError('PIN is too simple');
      return false;
    }

    // Check for birth year (1900-2023)
    const currentYear = new Date().getFullYear();
    const yearPattern = /^(19\d{2}|20[0-2]\d)$/;
    if (yearPattern.test(pin)) {
      setError('PIN cannot be a birth year');
      return false;
    }

    setError('');
    return true;
  };

  const handleSubmit = () => {
    // Validate pins
    if (!validatePin(newPin) || !validatePin(confirmPin)) {
      return;
    }

    // Check if pins match
    if (newPin !== confirmPin) {
      setError('PINs do not match');
      return;
    }

    validateReset({otp, pin: newPin, confirmPin})
      .unwrap()
      .then(() => {
        navigation.navigate('SuccessPage', {
          title: 'PIN Changed Successfully',
          description:
            'Your PIN has been successfully updated!\n You can now use it to securely transact on XCHNG.',
          navRoute: 'AppHome',
          accessQuicks: true,
        });
      })
      .catch((err: any) => {
        triggerToast(
          err?.data?.message || 'An error occurred',
          'error',
          'Error',
        );
      });
  };

  return (
    <Block
      bg="#05081A"
      safe
      flex={1}
      style={styles.pageWrap}
      isScrollable={false}>
      <SystemBars style="light" />
      {/* Header */}
      <Block
        style={styles.pageHeader}
        row
        justify="space-between"
        align="center">
        <SvgIcon name="back" size={40} onPress={() => navigation.goBack()} />
        <Block>
          <Text center size={16} color={palette.white}>
            Change Pin
          </Text>
        </Block>
        <SizedBox width={40} />
      </Block>
      <Block scrollIn bg={'#FAFAFF'} style={styles.formBox}>
        <Block flex={1}>
          <Block>
            <Block>
              <Text color="#4F4F4F" size={16}>
                New PIN *
              </Text>
              <SizedBox height={12} />
              <Block row gap={20} align="center">
                <OtpInput
                  numberOfDigits={4}
                  focusColor="#C0C8FF"
                  autoFocus={true}
                  hideStick={false}
                  blurOnFilled={true}
                  type="numeric"
                  secureTextEntry={!showNewPin}
                  focusStickBlinkingDuration={500}
                  onTextChange={setNewPin}
                  onFilled={setNewPin}
                  textInputProps={{
                    accessibilityLabel: 'New PIN',
                  }}
                  theme={{
                    containerStyle: styles.pinContainer,
                    pinCodeTextStyle: styles.pinCodeText,
                    pinCodeContainerStyle: styles.pinCodeContainer,
                    focusedPinCodeContainerStyle: styles.activePinCodeContainer,
                    filledPinCodeContainerStyle: styles.filledPinCodeContainer,
                  }}
                />
                <Text
                  onPress={() => setShowNewPin(!showNewPin)}
                  color="#2BB673"
                  fontFamily={family.Medium}>
                  {showNewPin ? 'Hide' : 'Show'}
                </Text>
              </Block>
            </Block>

            <SizedBox height={32} />

            <Block>
              <Text color="#4F4F4F" size={16}>
                Confirm PIN *
              </Text>
              <SizedBox height={12} />
              <Block row gap={20} align="center">
                <OtpInput
                  numberOfDigits={4}
                  focusColor="#C0C8FF"
                  hideStick={false}
                  blurOnFilled={true}
                  type="numeric"
                  secureTextEntry={!showConfirmPin}
                  focusStickBlinkingDuration={500}
                  onTextChange={setConfirmPin}
                  onFilled={setConfirmPin}
                  textInputProps={{
                    accessibilityLabel: 'Confirm PIN',
                  }}
                  theme={{
                    containerStyle: styles.pinContainer,
                    pinCodeTextStyle: styles.pinCodeText,
                    pinCodeContainerStyle: styles.pinCodeContainer,
                    focusedPinCodeContainerStyle: styles.activePinCodeContainer,
                    filledPinCodeContainerStyle: styles.filledPinCodeContainer,
                  }}
                />
                <Text
                  onPress={() => setShowConfirmPin(!showConfirmPin)}
                  color="#2BB673"
                  fontFamily={family.Medium}>
                  {showConfirmPin ? 'Hide' : 'Show'}
                </Text>
              </Block>
            </Block>

            {error ? (
              <>
                <SizedBox height={12} />
                <Text color="red" size={12}>
                  {error}
                </Text>
              </>
            ) : null}

            <SizedBox height={32} />

            <Block>
              <Text color="#05081A" fontFamily={family.Medium} size={12}>
                Transaction PIN criteria
              </Text>
              <SizedBox height={8} />
              <Text color="#05081A" fontFamily={family.Light} size={14}>
                1. Your PIN must not be your{' '}
                <Text color="#1A9459" fontFamily={family.Medium} size={14}>
                  year of birth
                </Text>
              </Text>
              <SizedBox height={8} />
              <Text color="#05081A" fontFamily={family.Light} size={14}>
                2. It must not be{' '}
                <Text color="#1A9459" fontFamily={family.Medium} size={14}>
                  0000
                </Text>{' '}
                or{' '}
                <Text color="#1A9459" fontFamily={family.Medium} size={14}>
                  1111
                </Text>
              </Text>
              <SizedBox height={8} />
              <Text color="#05081A" fontFamily={family.Light} size={14}>
                3. It must not be any easily{' '}
                <Text color="#1A9459" fontFamily={family.Medium} size={14}>
                  guessable pattern.
                </Text>
              </Text>
            </Block>
          </Block>
        </Block>
      </Block>

      <Block
        bg="#FAFAFF"
        position="absolute"
        bottom={150}
        style={{paddingHorizontal: HDP(24), paddingVertical: HDP(20)}}
        width={SCREEN_WEIGHT}
        alignSelf="center">
        <Button
          title={'Confirm'}
          onPress={handleSubmit}
          disabled={!newPin || !confirmPin}
          loading={isChangeLoad}
        />
      </Block>
    </Block>
  );
};
