/* eslint-disable @typescript-eslint/no-unused-vars */
import {XBg} from '@assets/images';
import {Block, Button, SizedBox, SvgIcon, Text, TextInput} from '@components';
import {
  HDP,
  maskPhoneNumber,
  OTP_TIMEOUT,
  RF,
  SCREEN_HEIGHT,
  triggerToast,
} from '@helpers';
import {useCountdown} from '@hooks/useCountDown';
import {useLazyResendRegisterOtpQuery} from '@services/queryApi';
import {setAuth} from '@slices/auth';
import {setToken} from '@slices/token';
import {color, family, palette} from '@theme';
import {Formik} from 'formik';
import React, {FC, useEffect, useRef, useState} from 'react';
import {SystemBars} from 'react-native-edge-to-edge';
import {OtpInput} from 'react-native-otp-entry';
import PhoneInput from 'react-native-phone-number-input';
import {
  useSendMailTokenMutation,
  useSignupMutation,
  useValidateMailTokenMutation,
  useVerifyPhoneMutation,
} from 'services/mutationApi';
import {useAppDispatch} from 'store';
import * as yup from 'yup';
import styles from './styles';

export const Signup: FC = ({navigation}: any) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const [onboardStep, setOnboardStep] = useState(0);
  const phoneInput = useRef<PhoneInput>(null);
  const [value, setValue] = useState('');
  const [formattedValue, setFormattedValue] = useState('');
  const [valid, setValid] = useState(false);
  const [otp, setOtp] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
  });

  // Countdown timer for OTP
  const {
    formattedTime,
    startCountdown,
    stopCountdown,
    resetCountdown,
    disabled,
  } = useCountdown(OTP_TIMEOUT);

  // API mutations
  const [
    signup,
    {data: signupData, isSuccess: isSignupSuccess, error: signupError},
  ]: any = useSignupMutation();

  const [
    verifyPhone,
    {
      isLoading: isVerifyPhoneLoading,
      isSuccess: isVerifyPhoneSuccess,
      error: verifyPhoneError,
    },
  ]: any = useVerifyPhoneMutation();
  const [sendMailToken]: any = useSendMailTokenMutation();
  const [
    validateMail,
    {
      isLoading: isValidateMailLoading,
      isSuccess: isValidateMailSuccess,
      error: validateMailError,
    },
  ]: any = useValidateMailTokenMutation();
  const [resendCode, {isError: resendFalse, error: resendError}] =
    useLazyResendRegisterOtpQuery();

  // Validation schema for personal info step
  const personalInfoSchema = yup.object().shape({
    firstName: yup
      .string()
      .required('First Name is required')
      .test(
        'no-leading-trailing-spaces',
        'First Name cannot start or end with a space',
        value => value !== undefined && value.trim() === value,
      )
      .test(
        'not-only-spaces',
        'First Name cannot be only spaces',
        value => value !== undefined && value.trim().length > 0,
      ),
    lastName: yup
      .string()
      .required('Last Name is required')
      .test(
        'no-leading-trailing-spaces',
        'Last Name cannot start or end with a space',
        value => value !== undefined && value.trim() === value,
      )
      .test(
        'not-only-spaces',
        'Last Name cannot be only spaces',
        value => value !== undefined && value.trim().length > 0,
      ),
    email: yup
      .string()
      .email('Invalid email format')
      .required('Email is required'),
  });

  // Validation schema for phone/password step
  const phonePasswordSchema = yup.object().shape({
    phone: yup.string().required('Phone number is required'),
    password: yup
      .string()
      .min(8, 'Password must be at least 8 characters')
      .matches(/[A-Z]/, 'Must contain an uppercase letter')
      .matches(/[a-z]/, 'Must contain a lowercase letter')
      .matches(/[0-9]/, 'Must contain a number')
      .matches(
        /[@$!%*?&^#_+=[\]{}|;:,.<>/\\]/,
        'Must contain a special character',
      )
      .required('Password is required'),
  });

  // Validation schema for OTP steps
  const otpSchema = yup.object().shape({
    otp: yup
      .string()
      .length(6, 'OTP must be 6 digits')
      .required('OTP is required'),
  });

  // Handle personal info submission
  const handlePersonalInfoSubmit = (values: any, {setSubmitting}: any) => {
    setLoading(true);
    setFormData(prev => ({
      ...prev,
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
    }));
    setEmail(values.email);
    setSubmitting(false);
    setLoading(false);
    setOnboardStep(1);
  };

  // Handle phone/password submission
  const handlePhonePasswordSubmit = async (
    values: any,
    {setSubmitting}: any,
  ) => {
    try {
      setLoading(true);
      setPhoneNumber(values.phone);

      // Combine all form data
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: values.phone,
        password: values.password,
        confirmPassword: values.password,
        onboardingChannel: 'MOBILE',
        countryCode: 'NG',
      };

      const res = await signup(payload).unwrap();

      setSubmitting(false);
      setLoading(false);
      setOnboardStep(2);
      startCountdown();
    } catch (error: any) {
      setSubmitting(false);
      setLoading(false);
      triggerToast(error?.data?.message || 'Signup failed', 'error', 'Error');
    }
  };

  // Handle phone OTP submission
  const handlePhoneOtpSubmit = async (values: any, {setSubmitting}: any) => {
    try {
      setLoading(true);

      // Verify phone OTP
      const verifyResponse = await verifyPhone({
        reference: signupData?.data,
        otp: Number(values.otp),
      }).unwrap();

      // Dispatch auth data (unwrap already ensures success)
      dispatch(setToken(verifyResponse.data.accessToken));
      dispatch(setAuth(verifyResponse.data));

      // Send email verification token
      await sendMailToken({email: email}).unwrap();

      // If we get here, both operations succeeded
      setSubmitting(false);
      setLoading(false);
      setOnboardStep(3); // Move to email OTP step
      resetCountdown();
      startCountdown();
    } catch (error: any) {
      setSubmitting(false);
      setLoading(false);
      triggerToast(
        error?.data?.message || error.message || 'Phone verification failed',
        'error',
        'Error',
      );
    }
  };

  // Handle email OTP submission
  const handleEmailOtpSubmit = async (values: any, {setSubmitting}: any) => {
    try {
      setLoading(true);

      await validateMail({
        email: email,
        otp: Number(values.otp),
      }).unwrap();

      setSubmitting(false);
      setLoading(false);

      navigation.replace('SuccessPage', {
        title: 'Account Created',
        description:
          'Your account has been successfully verified. Welcome aboard!',
        navRoute: 'Home',
      });
    } catch (error: any) {
      setSubmitting(false);
      setLoading(false);
      triggerToast(
        error?.data?.message || 'Email verification failed',
        'error',
        'Error',
      );
    }
  };

  // Resend OTP handler
  const resendOtp = async () => {
    if (disabled) {
      console.log('Please wait before resending');
      return;
    }

    try {
      resetCountdown();
      startCountdown();

      if (onboardStep === 2) {
        // Resend phone OTP
        await resendCode(signupData?.data).unwrap();
        console.log('OTP successfully sent.');
      } else if (onboardStep === 3) {
        // Resend email OTP
        await sendMailToken({email: email}).unwrap();
        console.log('Email OTP successfully sent.');
      }
    } catch (error: any) {
      console.log(error?.data?.message || 'Failed to resend OTP');
    }
  };

  // Check password strength and return requirements status
  const getPasswordRequirements = (password: string) => {
    return {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      specialChar: /[^A-Za-z0-9]/.test(password),
    };
  };

  // Clean up countdown on unmount
  useEffect(() => {
    return () => {
      stopCountdown();
    };
  }, []);

  return (
    <Block
      backgroundImage={XBg}
      backgroundScroll
      flex={1}
      style={styles.pageWrap}
      isScrollable={false}>
      <SystemBars style="light" />

      <Block
        style={{paddingHorizontal: HDP(34)}}
        align="center"
        row
        justifyContent="space-between">
        <SvgIcon name="logo-row" size={100} height={22} />
        <Text size={12} color={palette.white}>
          Existing user?{' '}
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
        height={onboardStep !== 3 ? SCREEN_HEIGHT * 0.15 : SCREEN_HEIGHT * 0.25}
      />
      <Block style={{paddingHorizontal: 33}}>
        <Text
          style={{
            width:
              onboardStep === 0 || onboardStep === 1
                ? '70%'
                : onboardStep === 2
                ? '80%'
                : '70%',
          }}
          size={30}
          fontFamily={family.Medium}
          color={palette.white}>
          {onboardStep === 0 || onboardStep === 1
            ? 'Create Account'
            : onboardStep === 2
            ? 'Verify Phone Number to Continue'
            : 'Verify Email OTP to Continue'}
        </Text>
        <Text size={12} color={palette.white}>
          {onboardStep === 0 || onboardStep === 1
            ? 'Join us and get started in just a few steps. Create your account now!'
            : onboardStep === 2
            ? `Please provide the 6-digit OTP code sent to ${maskPhoneNumber(
                phoneNumber,
              )}`
            : `Please provide the 6-digit OTP code sent to ${email}`}
        </Text>
      </Block>
      <SizedBox height={40} />

      {/* Personal Info Form */}
      {onboardStep === 0 && (
        <Formik
          initialValues={{
            firstName: '',
            lastName: '',
            email: '',
          }}
          validationSchema={personalInfoSchema}
          onSubmit={handlePersonalInfoSubmit}>
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
            isSubmitting,
          }) => (
            <Block scrollIn bg={'#FAFAFF'} radius={24} style={styles.formBox}>
              <Block height={'100%'} justifyContent="space-between">
                <Block>
                  <TextInput
                    onChangeText={handleChange('firstName')}
                    onBlur={handleBlur('firstName')}
                    placeholder="First name"
                    label="First name*"
                    error={touched.firstName && errors.firstName}
                    value={values.firstName}
                    autoCorrect={false}
                  />
                  <SizedBox height={5} />
                  <TextInput
                    onChangeText={handleChange('lastName')}
                    onBlur={handleBlur('lastName')}
                    placeholder="Last name"
                    label="Last name*"
                    error={touched.lastName && errors.lastName}
                    value={values.lastName}
                    autoCorrect={false}
                  />
                  <SizedBox height={5} />
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
                    title={'Proceed'}
                    onPress={handleSubmit}
                    loading={isSubmitting || loading}
                  />
                  <SizedBox height={5} />
                  <Text center size={12} color={palette.dark}>
                    By clicking the button above, understood and I agree to
                    XCHNG'S{' '}
                    <Text color={'#1A9459'} style={styles.loginSpan}>
                      Privacy Policy
                    </Text>{' '}
                    , and{' '}
                    <Text color={'#1A9459'} style={styles.loginSpan}>
                      Terms and conditions.
                    </Text>
                  </Text>
                </Block>
              </Block>
            </Block>
          )}
        </Formik>
      )}

      {/* Phone & Password Form */}
      {onboardStep === 1 && (
        <Formik
          initialValues={{
            phone: '',
            password: '',
          }}
          validationSchema={phonePasswordSchema}
          onSubmit={handlePhonePasswordSubmit}>
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
            isSubmitting,
          }) => {
            const passwordReqs = getPasswordRequirements(values.password);

            return (
              <Block scrollIn bg={'#FAFAFF'} radius={24} style={styles.formBox}>
                <Block height={'100%'} justifyContent="space-between">
                  <Block>
                    <Text style={[styles.label]}>Phone Number*</Text>
                    {/* @ts-ignore */}
                    <PhoneInput
                      ref={phoneInput}
                      defaultValue={values.phone}
                      defaultCode="NG"
                      layout="first"
                      onChangeText={text => {
                        setValue(text);
                        handleChange('phone')(text);
                        2;
                      }}
                      onChangeFormattedText={text => {
                        setFormattedValue(text);
                        handleChange('phone')(text);
                      }}
                      renderDropdownImage={<></>}
                      flagButtonStyle={{width: '20%'}}
                      containerStyle={{
                        borderColor: '#E0E0E0',
                        borderWidth: 1,
                        borderRadius: 4,
                        overflow: 'hidden',
                        height: HDP(45),
                        paddingVertical: 0,
                      }}
                      codeTextStyle={{
                        fontSize: RF(10),
                      }}
                      textInputStyle={{
                        fontSize: RF(10),
                      }}
                      textContainerStyle={{
                        paddingVertical: 0,
                      }}
                    />
                    {touched.phone && errors.phone && (
                      <Text
                        size={12}
                        center
                        color={palette.error}
                        style={{marginTop: 5}}>
                        {errors.phone}
                      </Text>
                    )}
                    <SizedBox height={24} />
                    <TextInput
                      onChangeText={handleChange('password')}
                      onBlur={handleBlur('password')}
                      placeholder="Enter Password"
                      label="Create Password*"
                      error={touched.password && errors.password}
                      value={values.password}
                      autoCorrect={false}
                      secureTextEntry
                      type="password"
                    />
                    <SizedBox height={5} />
                    <Block wrap="wrap" row gap={4}>
                      <Block
                        style={{padding: 8}}
                        bg={passwordReqs.length ? '#1A9459' : '#C9FFE5'}
                        radius={30}>
                        <Text
                          size={12}
                          color={
                            passwordReqs.length ? palette.white : '#05502C'
                          }>
                          8 characters
                        </Text>
                      </Block>
                      <Block
                        style={{padding: 8}}
                        bg={passwordReqs.uppercase ? '#1A9459' : '#C9FFE5'}
                        radius={30}>
                        <Text
                          size={12}
                          color={
                            passwordReqs.uppercase ? palette.white : '#05502C'
                          }>
                          An uppercase letter
                        </Text>
                      </Block>
                      <Block
                        style={{padding: 8}}
                        bg={passwordReqs.lowercase ? '#1A9459' : '#C9FFE5'}
                        radius={30}>
                        <Text
                          size={12}
                          color={
                            passwordReqs.lowercase ? palette.white : '#05502C'
                          }>
                          A lowercase letter
                        </Text>
                      </Block>
                      <Block
                        style={{padding: 8}}
                        bg={passwordReqs.number ? '#1A9459' : '#C9FFE5'}
                        radius={30}>
                        <Text
                          size={12}
                          color={
                            passwordReqs.number ? palette.white : '#05502C'
                          }>
                          A number
                        </Text>
                      </Block>
                      <Block
                        style={{padding: 8}}
                        bg={passwordReqs.specialChar ? '#1A9459' : '#C9FFE5'}
                        radius={30}>
                        <Text
                          size={12}
                          color={
                            passwordReqs.specialChar ? palette.white : '#05502C'
                          }>
                          A special character
                        </Text>
                      </Block>
                    </Block>
                  </Block>

                  <Block>
                    <Button
                      title={'Proceed'}
                      onPress={handleSubmit}
                      loading={isSubmitting || loading}
                      disabled={
                        !passwordReqs.length ||
                        !passwordReqs.uppercase ||
                        !passwordReqs.lowercase ||
                        !passwordReqs.number ||
                        !passwordReqs.specialChar
                      }
                    />
                    <SizedBox height={5} />
                    <Text center size={12} color={palette.dark}>
                      By clicking the button above, understood and I agree to
                      XCHNG'S{' '}
                      <Text color={'#1A9459'} style={styles.loginSpan}>
                        Privacy Policy
                      </Text>{' '}
                      , and{' '}
                      <Text color={'#1A9459'} style={styles.loginSpan}>
                        Terms and conditions.
                      </Text>
                    </Text>
                  </Block>
                </Block>
              </Block>
            );
          }}
        </Formik>
      )}

      {/* Phone OTP Form */}
      {onboardStep === 2 && (
        <Formik
          initialValues={{
            otp: '',
          }}
          validationSchema={otpSchema}
          onSubmit={handlePhoneOtpSubmit}>
          {({
            handleSubmit,
            values,
            errors,
            touched,
            setFieldValue,
            isSubmitting,
          }) => (
            <Block scrollIn bg={'#FAFAFF'} radius={24} style={styles.otpBox}>
              <Block height="100%" justifyContent="space-between">
                <Block>
                  <Block bg="#F3F5FF">
                    <SvgIcon name="mail-wait" size={200} />
                  </Block>
                  <SizedBox height={50} />
                  <Block>
                    <OtpInput
                      numberOfDigits={6}
                      focusColor="#C0C8FF"
                      autoFocus={true}
                      hideStick={false}
                      blurOnFilled={true}
                      disabled={isSubmitting || loading}
                      type="numeric"
                      secureTextEntry={true}
                      focusStickBlinkingDuration={500}
                      onTextChange={text => {
                        setFieldValue('otp', text);
                        setOtp(text);
                      }}
                      onFilled={text => {
                        setFieldValue('otp', text);
                        setOtp(text);
                      }}
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
                        center
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
                        color={'#1A9459'}
                        onPress={resendOtp}
                        style={styles.loginSpan}>
                        Resend code {formattedTime()}
                      </Text>
                    </Text>
                  </Block>
                </Block>

                <Block style={styles.mailButton}>
                  <Button
                    title={'Verify OTP'}
                    onPress={handleSubmit}
                    loading={isSubmitting || isVerifyPhoneLoading || loading}
                    disabled={!otp || otp.length < 6}
                  />
                </Block>
                <SizedBox />
              </Block>
            </Block>
          )}
        </Formik>
      )}

      {/* Email OTP Form */}
      {onboardStep === 3 && (
        <Formik
          initialValues={{
            otp: '',
          }}
          validationSchema={otpSchema}
          onSubmit={handleEmailOtpSubmit}>
          {({
            handleSubmit,
            values,
            errors,
            touched,
            setFieldValue,
            isSubmitting,
          }) => (
            <Block scrollIn bg={'#FAFAFF'} radius={24} style={styles.otpBox}>
              <SizedBox height={50} />
              <Block height="100%" justifyContent="space-between">
                <Block>
                  <OtpInput
                    numberOfDigits={6}
                    focusColor="#C0C8FF"
                    autoFocus={true}
                    hideStick={false}
                    blurOnFilled={true}
                    disabled={isSubmitting || loading}
                    type="numeric"
                    secureTextEntry={true}
                    focusStickBlinkingDuration={500}
                    onTextChange={text => {
                      setFieldValue('otp', text);
                      setOtp(text);
                    }}
                    onFilled={text => {
                      setFieldValue('otp', text);
                      setOtp(text);
                    }}
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
                      center
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
                      color={'#1A9459'}
                      onPress={resendOtp}
                      style={styles.loginSpan}>
                      Resend code {formattedTime()}
                    </Text>
                  </Text>
                </Block>

                <Block style={[styles.mailButton]}>
                  <Button
                    title={'Verify OTP'}
                    onPress={handleSubmit}
                    loading={isSubmitting || isValidateMailLoading || loading}
                    disabled={!otp || otp.length < 6}
                  />
                </Block>
                <SizedBox />
              </Block>
            </Block>
          )}
        </Formik>
      )}
    </Block>
  );
};
