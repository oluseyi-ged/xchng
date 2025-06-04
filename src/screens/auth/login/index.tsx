/* eslint-disable @typescript-eslint/no-unused-vars */
import {XBg} from '@assets/images';
import {Block, Button, SizedBox, SvgIcon, Text, TextInput} from '@components';
import {HDP, maskEmail, SCREEN_HEIGHT, triggerToast} from '@helpers';
import {setAuth} from '@slices/auth';
import {setLogged} from '@slices/logged';
import {setToken} from '@slices/token';
import {color, family, palette} from '@theme';
import * as EmailValidator from 'email-validator';
import {Formik} from 'formik';
import React, {FC, useState} from 'react';
import {SystemBars} from 'react-native-edge-to-edge';
import {OtpInput} from 'react-native-otp-entry';
import {useDispatch} from 'react-redux';
import {useFactorLoginMutation, useLoginMutation} from 'services/mutationApi';
import {persistor} from 'store';
import * as yup from 'yup';
import styles from './styles';

export const Login: FC = ({navigation}: any) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [loginStep, setLoginStep] = useState(0);
  const [email, setEmail] = useState('');
  const [logError, setLogError] = useState('');
  const [logValues, setLogValues] = useState<any>(null);
  const [otp, setOtp] = useState('');

  const [login, {isLoading: loginLoading}]: any = useLoginMutation();
  const [factorLogin, {isLoading: factorLoading}]: any =
    useFactorLoginMutation();

  const initialValues = {
    username: '',
    password: '',
    countryCode: 'NG',
  };

  const schemaCheck = yup.object().shape({
    username: yup
      .string()
      .required('Username is required')
      .test(
        'email',
        'Invalid username. Please enter a valid email or phone number.',
        (value: any) => {
          const isEmail = EmailValidator.validate(value);
          const isPhone =
            /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(value);
          return isEmail || isPhone;
        },
      ),
    password: yup
      .string()
      .required('Password is required')
      .min(8, 'Password must be at least 8 characters'),
  });

  const handleSubmit = async (values: any, {setSubmitting}: any) => {
    try {
      setLoading(true);

      if (loginStep === 0) {
        setLogValues(values);
        setEmail(values.username);

        await persistor.purge();
        await persistor.flush();

        const result = await login({
          username: values.username,
          password: values.password,
          countryCode: 'NG',
        }).unwrap();

        if (result.message === 'OTP_REQUIRED') {
          setLoginStep(1);
        } else {
          dispatch(setToken(result.data.accessToken));
          dispatch(setAuth(result.data));
          dispatch(setLogged(true));
          navigation.navigate('Home');
        }
      } else {
        if (otp.length !== 6) {
          setLogError('OTP must be 6 digits');
          setLoading(false);
          setSubmitting(false);
          return;
        }

        const result = await factorLogin({
          username: logValues.username,
          code: Number(otp),
          countryCode: 'NG',
        }).unwrap();

        dispatch(setToken(result.data.accessToken));
        dispatch(setAuth(result.data));
        dispatch(setLogged(true));
        navigation.navigate('Home');
      }
    } catch (error: any) {
      if (error.data?.message) {
        triggerToast(error.data.message, 'error', 'Error');
      } else {
        triggerToast('An error occurred during login', 'error', 'Error');
      }
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

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
          New user?{' '}
          <Text
            color={color.secondary}
            fontFamily={family.Bold}
            onPress={() => navigation.navigate('Auth', {screen: 'Signup'})}
            style={styles.loginSpan}>
            Sign up
          </Text>
        </Text>
      </Block>

      <SizedBox height={SCREEN_HEIGHT * 0.15} />
      <Block style={{paddingHorizontal: 33}}>
        <Text
          style={{width: loginStep === 0 ? '60%' : '70%'}}
          size={30}
          fontFamily={family.Medium}
          color={palette.white}>
          {loginStep === 0
            ? 'Welcome Back to XCHNG!'
            : 'Verify Login OTP to Continue'}
        </Text>
        <Text size={12} color={palette.white}>
          {loginStep === 0
            ? 'Please sign in to continue where you left off.'
            : `Please provide the 6-digit OTP code we sent to ${maskEmail(
                email,
              )}`}
        </Text>
      </Block>
      <SizedBox height={40} />

      <Formik
        initialValues={initialValues}
        validationSchema={schemaCheck}
        onSubmit={handleSubmit}>
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
          isSubmitting,
        }) => (
          <>
            {loginStep === 0 ? (
              <Block scrollIn bg={'#FAFAFF'} radius={24} style={styles.formBox}>
                <Block height="100%" justifyContent="space-between">
                  <Block>
                    <TextInput
                      onChangeText={handleChange('username')}
                      onBlur={handleBlur('username')}
                      placeholder="Email or phone number"
                      label="Username*"
                      error={touched.username && errors.username}
                      value={values.username}
                      autoCorrect={false}
                      keyboardType="email-address"
                    />
                    <SizedBox height={5} />
                    <TextInput
                      onChangeText={handleChange('password')}
                      onBlur={handleBlur('password')}
                      type="password"
                      placeholder="Password"
                      label="Password*"
                      error={touched.password && errors.password}
                      value={values.password}
                      autoCorrect={false}
                      secureTextEntry
                    />

                    <SizedBox height={5} />

                    <Text size={12} color={palette.dark}>
                      Forgot password?{' '}
                      <Text
                        color={'#1A9459'}
                        onPress={() =>
                          navigation.navigate('Auth', {screen: 'ResetPassword'})
                        }
                        style={styles.loginSpan}>
                        Reset here
                      </Text>
                    </Text>
                  </Block>

                  <Block>
                    {logError && (
                      <Text color="red" size={12} style={{marginBottom: 10}}>
                        {logError}
                      </Text>
                    )}
                    <Button
                      title={'Login'}
                      onPress={handleSubmit}
                      loading={isSubmitting || loading || loginLoading}
                    />
                  </Block>
                </Block>
              </Block>
            ) : (
              <Block scrollIn bg={'#FAFAFF'} radius={24} style={styles.otpBox}>
                <Block height="100%" justifyContent="space-between">
                  <Block>
                    <Block bg="#F3F5FF">
                      <SvgIcon name="mail-wait" size={180} />
                    </Block>
                    <SizedBox height={30} />
                    <Block>
                      <OtpInput
                        numberOfDigits={6}
                        focusColor="#C0C8FF"
                        autoFocus={true}
                        hideStick={false}
                        blurOnFilled={true}
                        disabled={isSubmitting || loading || factorLoading}
                        type="numeric"
                        secureTextEntry={true}
                        focusStickBlinkingDuration={500}
                        onTextChange={text => setOtp(text)}
                        onFilled={text => setOtp(text)}
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
                      {logError && (
                        <Text
                          size={12}
                          center
                          color={palette.error}
                          style={{marginTop: 5}}>
                          {logError}
                        </Text>
                      )}
                      <SizedBox height={16} />
                      <Text center size={12} color={palette.dark}>
                        Didn't receive code?{' '}
                        <Text
                          fontFamily={family.Bold}
                          color={'#1A9459'}
                          onPress={() => {
                            // Resend OTP logic
                            login(logValues);
                          }}
                          style={styles.loginSpan}>
                          Resend code
                        </Text>
                      </Text>
                    </Block>
                  </Block>

                  <Block style={styles.mailButton}>
                    {logError && (
                      <Text color="red" size={12} style={{marginBottom: 10}}>
                        {logError}
                      </Text>
                    )}
                    <Button
                      title={'Verify OTP'}
                      onPress={handleSubmit}
                      loading={isSubmitting || loading || factorLoading}
                    />
                  </Block>
                  <SizedBox />
                </Block>
              </Block>
            )}
          </>
        )}
      </Formik>
    </Block>
  );
};
