/* eslint-disable @typescript-eslint/no-unused-vars */
import {XBg} from '@assets/images';
import {Block, Button, SizedBox, SvgIcon, Text, TextInput} from '@components';
import {
  checkPassword,
  extractErrors,
  HDP,
  maskEmail,
  OTP_TIMEOUT,
  passwordRules,
  SCREEN_HEIGHT,
  triggerToast,
} from '@helpers';
import {useCountdown} from '@hooks/useCountDown';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {color, family, palette} from '@theme';
import {Formik} from 'formik';
import React, {FC, useEffect, useRef, useState} from 'react';
import {SystemBars} from 'react-native-edge-to-edge';
import {OtpInput} from 'react-native-otp-entry';
import {
  useCreatePasswordMutation,
  useResendValidateTokenMutation,
  useResetPasswordMutation,
  useValidateResetTokenMutation,
} from 'services/mutationApi';
import * as yup from 'yup';
import styles from './styles';

export const ResetPassword: FC = ({navigation}: any) => {
  const formRef = useRef<any>(null);
  const [onboardStep, setOnboardStep] = useState(2);
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState<string | null>(null);
  const [resetRef, setResetRef] = useState<string | null>(null);

  const [resetPassword, {isLoading, isSuccess, isError, error}] =
    useResetPasswordMutation();
  const [
    validateResetToken,
    {
      data,
      isLoading: validateLoad,
      isSuccess: validateTrue,
      isError: validateFalse,
      error: validateErr,
    },
  ] = useValidateResetTokenMutation();
  const [resendValidateToken, {isError: resendFalse, error: resendErr}] =
    useResendValidateTokenMutation();
  const [
    createPassword,
    {
      isLoading: createLoading,
      isSuccess: createSuccess,
      isError: createError,
      error: createErr,
    },
  ] = useCreatePasswordMutation();

  const {
    formattedTime,
    startCountdown,
    stopCountdown,
    resetCountdown,
    disabled,
  } = useCountdown(OTP_TIMEOUT);

  // Validation schemas
  const emailSchema = yup.object().shape({
    email: yup.string().email('Invalid email').required('Email is required'),
  });

  const otpSchema = yup.object().shape({
    otp: yup
      .string()
      .length(6, 'OTP must be 6 digits')
      .required('OTP is required'),
  });

  const passwordSchema = yup.object().shape({
    password: yup
      .string()
      .min(8, 'Password must be at least 8 characters')
      .matches(/[A-Z]/, 'Must contain an uppercase letter')
      .matches(/[a-z]/, 'Must contain a lowercase letter')
      .matches(/[0-9]/, 'Must contain a number')
      .matches(/[@$!%*?&]/, 'Must contain a special character')
      .required('Password is required'),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password')], 'Passwords must match')
      .required('Confirm password is required'),
  });

  // Load email from AsyncStorage on mount
  useEffect(() => {
    const loadEmail = async () => {
      const storedEmail = await AsyncStorage.getItem('email');
      setEmail(storedEmail);
    };
    loadEmail();
  }, []);

  // Handle email submission
  const handleEmailSubmit = async (values: any, {setSubmitting}: any) => {
    await resetPassword(values);
    setEmail(values.email);
    await AsyncStorage.setItem('email', values.email);
    setSubmitting(false);
  };

  // Handle OTP submission
  const handleOtpSubmit = async (values: any, {setSubmitting}: any) => {
    await validateResetToken({
      username: formRef?.current?.values?.email || email,
      otp: Number(values.otp),
    })
      .unwrap()
      .then((response: any) => {
        setResetRef(response?.data);
        AsyncStorage.removeItem('email');
      });
    setSubmitting(false);
  };

  // Handle password submission
  const handlePasswordSubmit = async (values: any, {setSubmitting}: any) => {
    await createPassword({
      password: values.password,
      confirmPassword: values.confirmPassword,
      reference: resetRef ?? '',
    });
    setSubmitting(false);
  };

  // Handle OTP resend
  const handleResendOtp = async () => {
    if (!disabled) {
      await resendValidateToken({
        username: formRef?.current?.values?.email || email,
      });
      setTimeout(() => {
        resetCountdown();
      }, 100);
    }
  };

  // Handle API responses for email submission
  useEffect(() => {
    if (isSuccess) {
      setOnboardStep(1);
    }
    if (isError && error && 'status' in error) {
      extractErrors(error).forEach((err: any) =>
        triggerToast(err?.data?.message, 'error', 'Error'),
      );
    }
  }, [isSuccess, isError, error]);

  // Handle API responses for OTP validation
  useEffect(() => {
    if (validateTrue) {
      setOnboardStep(2);
    }
    if (validateFalse && validateErr && 'status' in validateErr) {
      extractErrors(validateErr).forEach((err: any) =>
        triggerToast(err?.data?.message, 'error', 'Error'),
      );
    }
  }, [validateTrue, validateFalse, validateErr]);

  // Handle API responses for OTP resend
  useEffect(() => {
    if (resendFalse && resendErr && 'status' in resendErr) {
      extractErrors(resendErr).forEach((err: any) =>
        triggerToast(err?.data?.message, 'error', 'Error'),
      );
    }
  }, [resendFalse, resendErr]);

  // Handle API responses for password creation
  useEffect(() => {
    if (createSuccess) {
      navigation.navigate('SuccessPage', {
        title: 'Password Reset Successful',
        description:
          'Your password has been reset successfully. You can now log in using your new password.',
        navRoute: 'Login',
      });
    }
    if (createError && createErr && 'status' in createErr) {
      extractErrors(createErr).forEach((err: any) =>
        triggerToast(err?.data?.message, 'error', 'Error'),
      );
    }
  }, [createSuccess, createError, createErr]);

  // Start/stop countdown for OTP step
  useEffect(() => {
    if (onboardStep === 1) {
      startCountdown();
    }
    return () => {
      stopCountdown();
    };
  }, [onboardStep]);

  return (
    <Block
      backgroundImage={XBg}
      flex={1}
      backgroundScroll
      style={styles.pageWrap}>
      <SystemBars style="light" />

      <Block
        style={{paddingHorizontal: HDP(34)}}
        align="center"
        row
        justifyContent="space-between">
        <SvgIcon name="logo-row" size={100} height={22} />
        <Text size={12} color={palette.white}>
          Remember password?{' '}
          <Text
            fontFamily={family.Bold}
            color={color.secondary}
            onPress={() => navigation.navigate('Auth', {screen: 'Login'})}
            style={styles.loginSpan}>
            Login
          </Text>
        </Text>
      </Block>

      <SizedBox
        height={onboardStep === 0 ? SCREEN_HEIGHT * 0.25 : SCREEN_HEIGHT * 0.15}
      />
      <Block style={{paddingHorizontal: 33}}>
        <Text
          style={{
            width: onboardStep === 0 ? '70%' : '80%',
          }}
          size={30}
          fontFamily={family.Medium}
          color={palette.white}>
          {onboardStep === 0
            ? 'Verify Your Email to Continue'
            : onboardStep === 1
            ? 'Enter OTP'
            : 'Create New Password'}
        </Text>
        <Text
          style={{
            width:
              onboardStep === 0 ? '90%' : onboardStep === 1 ? '90%' : '70%',
          }}
          size={12}
          color={palette.white}>
          {onboardStep === 0
            ? "Enter the email address associated with your account, and we'll send you a code."
            : onboardStep === 1
            ? `Please provide the 6-digit OTP code we sent to ${maskEmail(
                formRef?.current?.values?.email || email,
              )}`
            : 'Choose a new password and confirm it to complete the reset.'}
        </Text>
      </Block>
      <SizedBox height={40} />

      {/* Email Form */}
      {onboardStep === 0 && (
        <Formik
          innerRef={formRef}
          initialValues={{email: ''}}
          validationSchema={emailSchema}
          onSubmit={handleEmailSubmit}>
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
            isSubmitting,
          }) => (
            <Block bg={palette.white} radius={24} style={styles.formBox}>
              <Block flex={1} justifyContent="space-between">
                <Block>
                  <TextInput
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                    placeholder="Email address"
                    label="Email Address*"
                    error={touched.email && errors.email}
                    value={values.email}
                    autoCorrect={false}
                    keyboardType="email-address"
                  />
                </Block>

                <Block>
                  <Button
                    title="Verify Email Address"
                    onPress={handleSubmit}
                    loading={isSubmitting || isLoading}
                  />
                  <SizedBox height={10} />
                  <Text
                    size={12}
                    center
                    color={palette.dark}
                    onPress={() =>
                      navigation.navigate('Auth', {screen: 'Login'})
                    }>
                    Remember password?{' '}
                    <Text fontFamily={family.Bold} color={palette.green}>
                      Login here
                    </Text>
                  </Text>
                </Block>
              </Block>
            </Block>
          )}
        </Formik>
      )}

      {/* OTP Form */}
      {onboardStep === 1 && (
        <Formik
          initialValues={{otp: ''}}
          validationSchema={otpSchema}
          onSubmit={handleOtpSubmit}>
          {({
            handleSubmit,
            values,
            errors,
            touched,
            setFieldValue,
            isSubmitting,
          }) => (
            <Block bg={palette.white} radius={24} style={styles.mailBox}>
              <Block flex={1} justifyContent="space-between">
                <Block bg="#F3F5FF">
                  <SvgIcon name="mail-wait" size={200} />
                </Block>

                <Block>
                  <OtpInput
                    numberOfDigits={6}
                    focusColor="#C0C8FF"
                    autoFocus={true}
                    hideStick={false}
                    blurOnFilled={true}
                    disabled={isSubmitting || validateLoad}
                    type="numeric"
                    secureTextEntry={true}
                    focusStickBlinkingDuration={500}
                    onTextChange={text => {
                      setFieldValue('otp', text);
                      setOtp(text);
                    }}
                    onFilled={text => setFieldValue('otp', text)}
                    textInputProps={{
                      accessibilityLabel: 'One-Time Password',
                    }}
                    textProps={{
                      accessibilityRole: 'text',
                      accessibilityLabel: 'OTP digit',
                      allowFontScaling: false,
                    }}
                    theme={{
                      containerStyle: styles.pinContainer,
                      pinCodeTextStyle: styles.pinCodeText,
                      pinCodeContainerStyle: styles.pinCodeContainer,
                      focusedPinCodeContainerStyle:
                        styles.activePinCodeContainer,
                      filledPinCodeContainerStyle:
                        styles.filledPinCodeContainer,
                    }}
                  />
                  {touched.otp && errors.otp && (
                    <Text
                      size={12}
                      color={palette.error}
                      style={{marginTop: 5}}>
                      {errors.otp}
                    </Text>
                  )}
                  <SizedBox height={16} />
                  <Text center size={12} color={palette.dark}>
                    Didn't receive code?{' '}
                    <Text
                      fontFamily={family.Bold}
                      color={disabled ? palette.chalice : '#1A9459'}
                      onPress={disabled ? undefined : handleResendOtp}
                      style={styles.loginSpan}>
                      {disabled ? `(${formattedTime()})` : 'Resend code'}
                    </Text>
                  </Text>
                </Block>

                <Block style={styles.mailButton}>
                  <Button
                    title="Continue"
                    onPress={handleSubmit}
                    loading={isSubmitting || validateLoad}
                  />
                </Block>
                <SizedBox />
              </Block>
            </Block>
          )}
        </Formik>
      )}

      {/* Password Form */}
      {onboardStep === 2 && (
        <Formik
          initialValues={{
            password: '',
            confirmPassword: '',
            reference: resetRef ?? '',
          }}
          validationSchema={passwordSchema}
          onSubmit={handlePasswordSubmit}>
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
            isSubmitting,
          }) => (
            <Block bg={palette.white} radius={24} style={styles.formBox}>
              <Block flex={1} justifyContent="space-between">
                <Block>
                  <TextInput
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                    placeholder="New Password"
                    label="New Password*"
                    error={touched.password && errors.password}
                    value={values.password}
                    autoCorrect={false}
                    secureTextEntry
                    type="password"
                  />
                  <SizedBox height={0} />
                  <Text size={12} color={palette.dark}>
                    Password must match:
                  </Text>
                  <Block wrap="wrap" row gap={4} style={{marginVertical: 8}}>
                    {passwordRules.map(
                      (rule: {name: string; body: string}, id: number) => (
                        <Block
                          key={id}
                          style={{padding: 8}}
                          bg={
                            checkPassword(rule.name, values.password)
                              ? '#1A9459'
                              : '#C9FFE5'
                          }
                          radius={30}>
                          <Text
                            size={12}
                            color={
                              checkPassword(rule.name, values.password)
                                ? palette.white
                                : '#05502C'
                            }>
                            {rule.body}
                          </Text>
                        </Block>
                      ),
                    )}
                  </Block>
                  <SizedBox height={8} />

                  <TextInput
                    onChangeText={handleChange('confirmPassword')}
                    onBlur={handleBlur('confirmPassword')}
                    placeholder="Confirm Password"
                    label="Confirm New Password*"
                    error={touched.confirmPassword && errors.confirmPassword}
                    value={values.confirmPassword}
                    autoCorrect={false}
                    secureTextEntry
                    type="password"
                  />
                </Block>

                <Block>
                  <Button
                    title="Reset Password"
                    onPress={handleSubmit}
                    loading={isSubmitting || createLoading}
                  />
                </Block>
              </Block>
            </Block>
          )}
        </Formik>
      )}
    </Block>
  );
};
