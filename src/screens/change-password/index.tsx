import {Block, Button, SizedBox, SvgIcon, Text, TextInput} from '@components';
import {HDP, SCREEN_WEIGHT} from '@helpers';
import {palette} from '@theme';
import {Formik} from 'formik';
import React, {FC, useRef, useState} from 'react';
import {SystemBars} from 'react-native-edge-to-edge';
import * as Yup from 'yup';
import styles from './styles';

// Validation Schema
const ChangePasswordSchema = Yup.object().shape({
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(
      /[^A-Za-z0-9]/,
      'Password must contain at least one special character',
    ),
  confirmPassword: Yup.string()
    .required('Please confirm your password')
    .oneOf([Yup.ref('password')], 'Passwords must match'),
});

interface PasswordRequirements {
  length: boolean;
  uppercase: boolean;
  lowercase: boolean;
  number: boolean;
  specialChar: boolean;
}

export const ChangePassword: FC = ({navigation}: any) => {
  const formikRef = useRef<any>(null);
  const [passwordReqs, setPasswordReqs] = useState<PasswordRequirements>({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
  });

  const checkPasswordRequirements = (password: string) => {
    setPasswordReqs({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      specialChar: /[^A-Za-z0-9]/.test(password),
    });
  };

  const handleSubmit = async (
    values: {password: string; confirmPassword: string},
    {setSubmitting}: any,
  ) => {
    try {
      // Handle password change logic here
      navigation.navigate('SuccessPage', {
        title: 'Password Changed Successfully',
        description:
          'Your password has been successfully updated!\nYou will be logged out now.',
        navRoute: 'Auth',
        accessQuicks: true,
      });
    } catch (error) {
      console.error('Error changing password:', error);
    } finally {
      setSubmitting(false);
    }
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
            Change Password
          </Text>
        </Block>
        <SizedBox width={40} />
      </Block>
      <Formik
        innerRef={formikRef}
        initialValues={{password: '', confirmPassword: ''}}
        validationSchema={ChangePasswordSchema}
        onSubmit={handleSubmit}>
        {({
          handleChange,
          handleBlur,
          values,
          errors,
          touched,
          isSubmitting,
          isValid,
        }) => (
          <Block scrollIn bg={'#FAFAFF'} style={styles.formBox}>
            <Block>
              <TextInput
                onChangeText={(text: string) => {
                  handleChange('password')(text);
                  checkPasswordRequirements(text);
                }}
                onBlur={handleBlur('password')}
                placeholder="New Password"
                label="New Password*"
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
                    color={passwordReqs.length ? palette.white : '#05502C'}>
                    8 characters
                  </Text>
                </Block>
                <Block
                  style={{padding: 8}}
                  bg={passwordReqs.uppercase ? '#1A9459' : '#C9FFE5'}
                  radius={30}>
                  <Text
                    size={12}
                    color={passwordReqs.uppercase ? palette.white : '#05502C'}>
                    Uppercase letter
                  </Text>
                </Block>
                <Block
                  style={{padding: 8}}
                  bg={passwordReqs.lowercase ? '#1A9459' : '#C9FFE5'}
                  radius={30}>
                  <Text
                    size={12}
                    color={passwordReqs.lowercase ? palette.white : '#05502C'}>
                    Lowercase letter
                  </Text>
                </Block>
                <Block
                  style={{padding: 8}}
                  bg={passwordReqs.number ? '#1A9459' : '#C9FFE5'}
                  radius={30}>
                  <Text
                    size={12}
                    color={passwordReqs.number ? palette.white : '#05502C'}>
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
                    Special character
                  </Text>
                </Block>
              </Block>
              <SizedBox height={24} />
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
            <SizedBox height={HDP(100)} />
          </Block>
        )}
      </Formik>

      <Block
        bg="#FAFAFF"
        position="absolute"
        bottom={150}
        style={{paddingHorizontal: HDP(24), paddingVertical: HDP(20)}}
        width={SCREEN_WEIGHT}
        alignSelf="center">
        <Button
          title="Reset Password"
          onPress={() => formikRef.current?.submitForm()}
          loading={formikRef.current?.isSubmitting}
          disabled={
            !passwordReqs.length ||
            !passwordReqs.uppercase ||
            !passwordReqs.lowercase ||
            !passwordReqs.number ||
            !passwordReqs.specialChar ||
            !formikRef.current?.isValid
          }
        />
      </Block>
    </Block>
  );
};
