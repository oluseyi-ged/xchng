import {
  Block,
  BottomSheet,
  Button,
  Select,
  SizedBox,
  SvgIcon,
  Text,
  TextInput,
} from '@components';
import {
  employmentStatus,
  HDP,
  incomeRange,
  purposeOfAccount,
  referralOptions,
  removeDialCode,
  RF,
  SCREEN_WEIGHT,
  sourceOfIncome,
  triggerToast,
} from '@helpers';
import {
  useUpdateProfileMutation,
  useValidateBvnTokenMutation,
  useVerifyIdMutation,
} from '@services/mutationApi';
import {
  useGetOccupationsQuery,
  useLazySendBvnOtpQuery,
} from '@services/queryApi';
import {family, palette} from '@theme';
import {format} from 'date-fns';
import {Formik} from 'formik';
import React, {FC, useRef, useState} from 'react';
import {SystemBars} from 'react-native-edge-to-edge';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {OtpInput} from 'react-native-otp-entry';
import PhoneInput from 'react-native-phone-number-input';
import {RootState, useAppSelector} from 'store';
import * as Yup from 'yup';
import styles from './styles';

// Validation schemas
const PersonalInfoSchema = Yup.object().shape({
  fullName: Yup.string().required('Full name is required'),
  middleName: Yup.string(),
  email: Yup.string().email('Invalid email').required('Email is required'),
  phone: Yup.string().required('Phone number is required'),
  dob: Yup.date().required('Date of birth is required'),
  gender: Yup.string().required('Gender is required'),
});

const BvnSchema = Yup.object().shape({
  bvn: Yup.string().required('BVN is required'),
});

const NinSchema = Yup.object().shape({
  nin: Yup.string().required('NIN is required'),
});

const FundsSchema = Yup.object().shape({
  accountPurpose: Yup.string().required('Purpose is required'),
  averageMonthlyIncome: Yup.string().required('Monthly amount is required'),
  sourceOfPayment: Yup.string().required('Payment sources are required'),
  occupation: Yup.string().required('Occupation is required'),
  employmentStatus: Yup.string().required('Employment status is required'),
  referralSource: Yup.string().required('This field is required'),
});

const UserForm: FC<{
  onSubmit: (values: any) => void;
  initialValues: any;
  formikRef: React.MutableRefObject<any>;
}> = ({onSubmit, initialValues, formikRef}) => {
  const phoneInput = useRef<PhoneInput>(null);
  const [isStartDatePickerVisible, setStartDatePickerVisibility] =
    useState(false);

  const formatDate = (date: Date | null) => {
    return date ? format(date, 'dd/MM/yyyy') : '';
  };

  const handleConfirm = (date: Date, setFieldValue: any) => {
    setStartDatePickerVisibility(false);
    setFieldValue('dob', date);
  };

  const hideDatePicker = () => {
    setStartDatePickerVisibility(false);
  };

  return (
    <Formik
      innerRef={formikRef}
      initialValues={initialValues}
      validationSchema={PersonalInfoSchema}
      onSubmit={onSubmit}>
      {({handleChange, handleBlur, setFieldValue, values, errors, touched}) => (
        <Block>
          <Block>
            <Text medium size={24} color="#05081A">
              Personal Information
            </Text>
            <Text size={14} color="#05081A">
              Enter your personal details, such as your name, BVN, and other
              required information, to proceed.
            </Text>
          </Block>
          <SizedBox height={20} />
          <TextInput
            label="Full name"
            value={values.fullName}
            placeholder={'Full Name'}
            editable={false}
          />
          <TextInput
            label="Middle name"
            placeholder="Middle name"
            value={values.middleName}
            editable={false}
          />
          <SizedBox height={16} />
          <TextInput
            label="Email"
            placeholder="Email"
            value={values.email}
            editable={false}
          />
          <SizedBox height={16} />
          <Text style={[styles.label]}>Phone Number*</Text>
          {/* @ts-ignore */}
          <PhoneInput
            ref={phoneInput}
            defaultValue={values.phone}
            defaultCode={values.countryCode}
            layout="first"
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
            codeTextStyle={{fontSize: RF(10)}}
            textInputStyle={{fontSize: RF(10)}}
            textContainerStyle={{paddingVertical: 0}}
            onChangeFormattedText={text => setFieldValue('phone', text)}
            onChangeCountry={country =>
              setFieldValue('countryCode', country.cca2)
            }
          />
          {touched.phone && errors.phone && (
            // @ts-ignore
            <Text style={styles.error}>{errors.phone}</Text>
          )}
          <SizedBox height={16} />
          <Block onPress={() => setStartDatePickerVisibility(true)}>
            <TextInput
              placeholder="10/02/2024"
              label="DOB *"
              autoCorrect={false}
              iconName2="calendar"
              editable={false}
              value={values.dob ? formatDate(values.dob) : ''}
              // @ts-ignore
              error={touched.dob && errors.dob}
            />
          </Block>
          <DateTimePickerModal
            isVisible={isStartDatePickerVisible}
            mode="date"
            onConfirm={date => handleConfirm(date, setFieldValue)}
            onCancel={hideDatePicker}
          />
          <SizedBox height={10} />
          <Select
            label="Gender"
            placeholder="Select gender"
            data={[
              {name: 'Male', value: 'Male'},
              {name: 'Female', value: 'Female'},
            ]}
            onSelect={item => setFieldValue('gender', item?.value)}
            value={values.gender}
          />
        </Block>
      )}
    </Formik>
  );
};

const BvnForm: FC<{
  onSubmit: (values: any) => void;
  initialValues: any;
  formikRef: React.MutableRefObject<any>;
  bvnData: any;
}> = ({onSubmit, initialValues, formikRef, bvnData}) => {
  return (
    <Formik
      innerRef={formikRef}
      initialValues={initialValues}
      validationSchema={BvnSchema}
      onSubmit={onSubmit}>
      {({handleChange, handleBlur, values, errors, touched}) => (
        <Block>
          <Block>
            <Text medium size={24} color="#05081A">
              Bank Verification Number
            </Text>
            <Text size={14} color="#05081A">
              Enter your personal details, such as your name, BVN, and other
              required information, to proceed.
            </Text>
          </Block>
          <SizedBox height={20} />
          <TextInput
            label="Enter your Bank Verification Number (BVN)*"
            value={values.bvn}
            onChangeText={handleChange('bvn')}
            onBlur={handleBlur('bvn')}
            // @ts-ignore
            error={touched.bvn && errors.bvn}
          />
          {bvnData?.data?.status === 'VERIFIED' ? (
            <Block alignSelf="flex-end" row gap={5} align="center">
              <SvgIcon name="verify-deep" size={20} />
              <Text color={'#195742'}>NIN successfully verified</Text>
            </Block>
          ) : null}
          <Text size={14} color="#828282">
            Don't remember your BVN? Dial{' '}
            <Text color="#828282" semibold>
              *565*0#
            </Text>{' '}
            on your registered phone number to get your BVN
          </Text>
          <SizedBox height={16} />
          {bvnData?.data?.status === 'VERIFIED' ? null : (
            <Block
              radius={2}
              bg="#EEFFF7"
              style={{paddingHorizontal: HDP(21), paddingVertical: HDP(17)}}>
              <Text size={14} fontFamily={family.Light} color="#011A0E">
                The CBN requires that customer needs to give consent prior to
                release of BVN Information
              </Text>
            </Block>
          )}
        </Block>
      )}
    </Formik>
  );
};

const NinForm: FC<{
  onSubmit: (values: any) => void;
  initialValues: any;
  formikRef: React.MutableRefObject<any>;
  ninData: any;
}> = ({onSubmit, initialValues, formikRef, ninData}) => {
  return (
    <Formik
      innerRef={formikRef}
      initialValues={initialValues}
      validationSchema={NinSchema}
      onSubmit={onSubmit}>
      {({handleChange, handleBlur, values, errors, touched}) => (
        <Block>
          <Block>
            <Text medium size={24} color="#05081A">
              National Identification Number
            </Text>
            <Text size={14} color="#05081A">
              We need your National Identification Number to verify your
              identity
            </Text>
          </Block>
          <SizedBox height={20} />
          <TextInput
            label="National Identification Number *"
            value={values.nin}
            onChangeText={handleChange('nin')}
            onBlur={handleBlur('nin')}
            // @ts-ignore
            error={touched.nin && errors.nin}
          />
          {ninData?.data?.status === 'VERIFIED' ? (
            <Block alignSelf="flex-end" row gap={5} align="center">
              <SvgIcon name="verify-deep" size={20} />
              <Text color={'#195742'}>NIN successfully verified</Text>
            </Block>
          ) : null}
          {ninData?.data?.status === 'VERIFIED' ? null : (
            <Block
              radius={2}
              bg="#EEFFF7"
              style={{paddingHorizontal: HDP(21), paddingVertical: HDP(17)}}>
              <Text size={14} fontFamily={family.Light} color="#011A0E">
                The National Identification Number (NIN) are the 12-digits on
                this part of the National Identity Slip
              </Text>
            </Block>
          )}
        </Block>
      )}
    </Formik>
  );
};

const FundsForm: FC<{
  onSubmit: (values: any) => void;
  initialValues: any;
  formikRef: React.MutableRefObject<any>;
}> = ({onSubmit, initialValues, formikRef}) => {
  const {data: occupations} = useGetOccupationsQuery({});

  return (
    <Formik
      innerRef={formikRef}
      initialValues={initialValues}
      validationSchema={FundsSchema}
      onSubmit={onSubmit}>
      {({handleChange, handleBlur, setFieldValue, values, errors, touched}) => (
        <Block>
          <Block>
            <Text medium size={24} color="#05081A">
              Source of funds
            </Text>
          </Block>
          <SizedBox height={20} />
          <Select
            label="Primary purpose for account *"
            placeholder="Select option"
            data={purposeOfAccount}
            onSelect={item => setFieldValue('accountPurpose', item?.value)}
            value={values.accountPurpose}
            error={touched.accountPurpose && errors.accountPurpose}
          />
          <Select
            label="How much on average do you expect to receive monthly? *"
            placeholder="Select option"
            data={incomeRange}
            onSelect={item =>
              setFieldValue('averageMonthlyIncome', item?.value)
            }
            value={values.averageMonthlyIncome}
            error={touched.averageMonthlyIncome && errors.averageMonthlyIncome}
          />
          <SizedBox height={16} />
          <Select
            label="What are your expected sources of Payment? *"
            placeholder="Select option"
            data={sourceOfIncome}
            onSelect={item => setFieldValue('sourceOfPayment', item?.value)}
            value={values.sourceOfPayment}
            error={touched.sourceOfPayment && errors.sourceOfPayment}
          />
          <SizedBox height={16} />
          <Select
            label="Occupation*"
            placeholder="Select option"
            data={(occupations?.data ?? []).map(
              (item: {code: string; name: string}) => ({
                value: item.name,
                name: item.name,
              }),
            )}
            onSelect={item => setFieldValue('occupation', item?.value)}
            value={values.occupation}
            error={touched.occupation && errors.occupation}
          />
          <SizedBox height={16} />
          <Select
            label="Employment status *"
            placeholder="Select option"
            data={employmentStatus}
            onSelect={item => setFieldValue('employmentStatus', item?.value)}
            value={values.employmentStatus}
            error={touched.employmentStatus && errors.employmentStatus}
          />
          <SizedBox height={16} />
          <Select
            label="How did you hear about us? *"
            placeholder="Select option"
            data={referralOptions}
            onSelect={item => setFieldValue('referralSource', item?.value)}
            value={values.referralSource}
            error={touched.referralSource && errors.referralSource}
          />
        </Block>
      )}
    </Formik>
  );
};

export const PersonalInfo: FC = ({navigation}: any) => {
  const [pageStep, setPageStep] = useState(0); // Changed to 0 for initial state
  const {auth} = useAppSelector<any>((store: RootState) => store.auth);
  const [formData, setFormData] = useState({
    personalInfo: {
      fullName: auth?.firstName + ' ' + auth?.lastName,
      middleName: '',
      email: auth?.email,
      phone: removeDialCode(auth?.phone),
      dob: auth?.dob || null,
      gender: auth?.gender || '',
      countryCode: 'NG',
    },
    bvnInfo: {bvn: ''},
    ninInfo: {nin: ''},
    fundsInfo: {
      accountPurpose: '',
      monthlyAmount: '',
      sourceOfPayment: '',
      occupation: '',
      employmentStatus: '',
      referralSource: '',
    },
  });

  const [
    verifyBvn,
    {data: bvnData, isLoading: bvnLoad, isSuccess: bvnTrue},
  ]: any = useVerifyIdMutation();
  const [
    updateProfile,
    {
      isLoading: updateLoad,
      isError: updateIsErr,
      error: updateError,
      isSuccess: updateTrue,
    },
  ] = useUpdateProfileMutation();
  const [
    verifyNin,
    {data: ninData, isLoading: ninLoad, isSuccess: ninTrue},
  ]: any = useVerifyIdMutation();
  const [sendBvnOtp] = useLazySendBvnOtpQuery();
  const [
    validateBvn,
    {
      isLoading: isValidateBvnLoading,
      isSuccess: isValidateBvnSuccess,
      isError: isValidateBvnError,
      error: validateBvnError,
    },
  ] = useValidateBvnTokenMutation();

  const personalInfoRef = useRef<any>(null);
  const bvnRef = useRef<any>(null);
  const ninRef = useRef<any>(null);
  const fundsRef = useRef<any>(null);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [bvnVerifyOption, setBvnVerifyOption] = useState<any>(null);
  const [otp, setOtp] = useState('');
  const [bvnModalStep, setBvnModalStep] = useState(0);

  const OTP_TIMEOUT = 60;
  const [seconds, setSeconds] = useState(OTP_TIMEOUT);
  const [disabled, setDisabled] = useState(false);

  const startCountdown = () => {
    setDisabled(true);
    const timer = setInterval(() => {
      setSeconds(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setDisabled(false);
          return OTP_TIMEOUT;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const resetCountdown = () => {
    setSeconds(OTP_TIMEOUT);
    startCountdown();
  };

  React.useEffect(() => {
    if (isValidateBvnSuccess) {
      triggerToast('BVN verified successfully', 'success', 'Success');
      setModalIsOpen(false);
      setFormData({...formData, bvnInfo: {bvn: ''}});
      setPageStep(2);
    }
    if (isValidateBvnError && validateBvnError && 'data' in validateBvnError) {
      triggerToast(
        validateBvnError?.data?.message || 'Failed to verify OTP',
        'error',
        'Error',
      );
    }
  }, [isValidateBvnSuccess, isValidateBvnError, validateBvnError]);

  React.useEffect(() => {
    if (updateTrue) {
      triggerToast('Profile updated successfully', 'success', 'Success');
      setPageStep(pageStep + 1);
    }
    if (updateIsErr && updateError && 'data' in updateError) {
      triggerToast(
        updateError?.data?.message || 'Failed to update profile',
        'error',
        'Error',
      );
    }
  }, [updateTrue, updateIsErr, updateError]);

  React.useEffect(() => {
    if (ninTrue && ninData?.data?.status === 'VERIFIED') {
      triggerToast('NIN verified successfully', 'success', 'Success');
      setFormData({...formData, ninInfo: {nin: ''}});
      setPageStep(3);
    }
  }, [ninTrue, ninData]);

  const handleSubmitPersonalInfo = async (values: any) => {
    try {
      const {fullName, middleName, email, phone, dob, gender, countryCode} =
        values;
      const [firstName, ...lastNameParts] = fullName.split(' ');
      const lastName = lastNameParts.join(' ');
      await updateProfile({
        firstName,
        lastName,
        middleName,
        email,
        phone: phone,
        dob: dob ? format(dob, 'yyyy-MM-dd') : '',
        gender,
      }).unwrap();
      setFormData({...formData, personalInfo: values});
      setPageStep(1);
    } catch (error: any) {
      console.error('Profile update error:', error);
      triggerToast(
        error?.data?.message || 'Failed to update profile',
        'error',
        'Error',
      );
    }
  };

  const handleSubmitBvn = async (values: any) => {
    try {
      const response: any = await verifyBvn({
        identificationNumber: values.bvn,
        type: 'BVN',
      }).unwrap();
      setFormData({...formData, bvnInfo: values});
      if (response?.data?.status === 'OTP_REQUIRED') {
        setModalIsOpen(true);
        setBvnVerifyOption(response?.data?.options[0]);
      } else if (response?.data?.status === 'VERIFIED') {
        setFormData({...formData, bvnInfo: {bvn: ''}});
        setPageStep(2);
      } else {
        triggerToast(
          response?.data?.description || 'BVN verification failed',
          'error',
          'Error',
        );
      }
    } catch (error: any) {
      console.error('BVN verification error:', error);
      triggerToast(
        error?.data?.message || 'Failed to verify BVN',
        'error',
        'Error',
      );
    }
  };

  const handleSubmitNin = async (values: any) => {
    try {
      await verifyNin({
        identificationNumber: values.nin,
        type: 'NIN',
      }).unwrap();
      setFormData({...formData, ninInfo: values});
      // Step progression handled in useEffect for VERIFIED status
    } catch (error: any) {
      console.error('NIN verification error:', error);
      triggerToast(
        error?.data?.message || 'Failed to verify NIN',
        'error',
        'Error',
      );
    }
  };

  React.useEffect(() => {
    if (pageStep === 2 && formData.ninInfo.nin.length === 11) {
      handleSubmitNin(formData.ninInfo);
    }
  }, [formData.ninInfo.nin, pageStep]);

  const handleSubmitFunds = async (values: any) => {
    try {
      await updateProfile(values).unwrap();
      setFormData({...formData, fundsInfo: values});
      navigation.navigate('SuccessScreen'); // Replace with actual route
    } catch (error: any) {
      console.error('Funds update error:', error);
      triggerToast(
        error?.data?.message || 'Failed to update funds info',
        'error',
        'Error',
      );
    }
  };

  const handleBack = () => {
    if (pageStep > 0) {
      setPageStep(pageStep - 1);
    } else {
      navigation.goBack();
    }
  };

  const handleNext = () => {
    if (pageStep === 0) {
      if (personalInfoRef.current?.isValid) {
        personalInfoRef.current?.submitForm();
      } else {
        triggerToast('Please complete all required fields', 'error', 'Error');
      }
    } else if (pageStep === 1) {
      if (bvnRef.current?.isValid) {
        bvnRef.current?.submitForm();
      } else {
        triggerToast('Please enter a valid BVN', 'error', 'Error');
      }
    } else if (pageStep === 2) {
      if (ninRef.current?.isValid) {
        ninRef.current?.submitForm();
      } else {
        triggerToast('Please enter a valid NIN', 'error', 'Error');
      }
    } else if (pageStep === 3) {
      if (fundsRef.current?.isValid) {
        fundsRef.current?.submitForm();
      } else {
        triggerToast('Please complete all required fields', 'error', 'Error');
      }
    }
  };

  const getStepTitle = () => {
    switch (pageStep) {
      case 0:
        return 'Personal Information';
      case 1:
        return 'BVN Verification';
      case 2:
        return 'NIN Verification';
      case 3:
        return 'Source of Funds';
      default:
        return 'Personal Information';
    }
  };

  const resendOtp = async () => {
    if (disabled) {
      triggerToast('Wait for countdown timer', 'error', 'Error');
      return;
    }
    try {
      await sendBvnOtp(bvnVerifyOption?.type).unwrap();
      triggerToast('We just sent you an OTP', 'success', 'Success');
      resetCountdown();
    } catch (error: any) {
      console.error('Resend OTP error:', error);
      triggerToast(
        error?.data?.message || 'Failed to resend OTP',
        'error',
        'Error',
      );
    }
  };

  const handleVerifyOtp = async () => {
    try {
      await validateBvn({otp: Number(otp)}).unwrap();
      setModalIsOpen(false);
      setFormData({...formData, bvnInfo: {bvn: ''}});
      setPageStep(2);
    } catch (error: any) {
      console.error('OTP validation error:', error);
      triggerToast(
        error?.data?.message || 'Failed to verify OTP',
        'error',
        'Error',
      );
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
      <Block
        style={styles.pageHeader}
        row
        justify="space-between"
        align="center">
        <SvgIcon name="back" size={40} onPress={handleBack} />
        <Block>
          <Text center size={16} color={palette.white}>
            {getStepTitle()}
          </Text>
          <Text medium center size={10} color={palette.white}>
            Step {pageStep + 1} of 4
          </Text>
        </Block>
        <SizedBox width={40} />
      </Block>
      <Block scrollIn bg={'#FAFAFF'} style={styles.formBox}>
        {pageStep === 0 && (
          <UserForm
            onSubmit={handleSubmitPersonalInfo}
            initialValues={formData.personalInfo}
            formikRef={personalInfoRef}
          />
        )}
        {pageStep === 1 && (
          <BvnForm
            onSubmit={handleSubmitBvn}
            initialValues={formData.bvnInfo}
            formikRef={bvnRef}
            bvnData={bvnData}
          />
        )}
        {pageStep === 2 && (
          <NinForm
            onSubmit={handleSubmitNin}
            initialValues={formData.ninInfo}
            formikRef={ninRef}
            ninData={ninData}
          />
        )}
        {pageStep === 3 && (
          <FundsForm
            onSubmit={handleSubmitFunds}
            initialValues={formData.fundsInfo}
            formikRef={fundsRef}
          />
        )}
        <SizedBox height={100} />
      </Block>
      <Block
        bg="#FAFAFF"
        position="absolute"
        bottom={150}
        style={{paddingHorizontal: HDP(24), paddingVertical: HDP(20)}}
        width={SCREEN_WEIGHT}
        alignSelf="center">
        <Button
          title={
            pageStep === 3
              ? 'Submit'
              : pageStep === 2
              ? 'Verify NIN'
              : pageStep === 1
              ? 'Verify BVN'
              : 'Proceed'
          }
          disabled={updateLoad || bvnLoad || ninLoad || isValidateBvnLoading}
          loading={updateLoad || bvnLoad || ninLoad || isValidateBvnLoading}
          onPress={handleNext}
        />
      </Block>
      <BottomSheet
        show={modalIsOpen}
        dropPress={() => setModalIsOpen(false)}
        title="BVN Verification"
        content={
          bvnModalStep === 0 ? (
            <Block>
              <Block>
                <Text color={'#181D27'} medium size={20}>
                  Authorization Mode
                </Text>
                <Text color="#555555" size={14}>
                  Choose a method to verify your BVN.
                </Text>
              </Block>
              <SizedBox height={40} />
              <Block gap={16}>
                {bvnData?.data?.options?.map((opt: any) => (
                  <Block
                    key={opt.option}
                    bg={
                      bvnVerifyOption?.option === opt.option
                        ? '#FAFAFF'
                        : palette.white
                    }
                    radius={5}
                    style={{
                      paddingHorizontal: HDP(16),
                      paddingVertical: HDP(12),
                      borderWidth: 1,
                      borderColor:
                        bvnVerifyOption?.option === opt.option
                          ? '#8591EF'
                          : '#DDE1E9',
                    }}
                    row
                    justify="space-between"
                    align="flex-start"
                    onPress={() => setBvnVerifyOption(opt)}>
                    <Block row gap={10} align="flex-start">
                      <SvgIcon
                        name={opt.type === 'email' ? 'mail-round' : 'sms'}
                        size={32}
                      />
                      <Block>
                        <Text>{opt.type === 'email' ? 'Email' : 'Phone'}</Text>
                        <Text>{opt.option}</Text>
                      </Block>
                    </Block>
                    <SvgIcon
                      name={
                        bvnVerifyOption?.option === opt.option
                          ? 'circle-check'
                          : 'radio-off'
                      }
                      size={16}
                      color={
                        bvnVerifyOption?.option === opt.option
                          ? '#8591EF'
                          : undefined
                      }
                    />
                  </Block>
                ))}
              </Block>
              <SizedBox height={60} />
              <Button
                title={'Continue'}
                onPress={() => {
                  setBvnModalStep(1);
                  sendBvnOtp(bvnVerifyOption?.type)
                    .unwrap()
                    .then(() => {
                      triggerToast(
                        'We just sent you an OTP',
                        'success',
                        'Success',
                      );
                      startCountdown();
                    })
                    .catch((error: any) => {
                      triggerToast(
                        error?.data?.message || 'Failed to send OTP',
                        'error',
                        'Error',
                      );
                    });
                }}
                disabled={!bvnVerifyOption}
              />
              <SizedBox height={10} />
            </Block>
          ) : (
            <Block>
              <SvgIcon
                name="back"
                size={24}
                containerStyle={{alignSelf: 'flex-start'}}
                onPress={() => setBvnModalStep(0)}
              />
              <SizedBox height={10} />
              <Text medium size={20}>
                Verify your OTP
              </Text>
              <SizedBox height={5} />
              <Text size={14}>
                Enter the 6-digit OTP sent to {bvnVerifyOption?.option}
              </Text>
              <SizedBox height={20} />
              <OtpInput
                numberOfDigits={6}
                focusColor="#C0C8FF"
                autoFocus={true}
                hideStick={false}
                blurOnFilled={true}
                disabled={isValidateBvnLoading}
                type="numeric"
                secureTextEntry={true}
                focusStickBlinkingDuration={500}
                onTextChange={text => setOtp(text)}
                onFilled={text => setOtp(text)}
                textInputProps={{accessibilityLabel: 'One-Time Password'}}
                textProps={{
                  accessibilityRole: 'text',
                  accessibilityLabel: 'OTP digit',
                  allowFontScaling: false,
                }}
                theme={{
                  containerStyle: styles.pinContainer,
                  pinCodeTextStyle: styles.pinCodeText,
                  pinCodeContainerStyle: styles.pinCodeContainer,
                  focusedPinCodeContainerStyle: styles.activePinCodeContainer,
                  filledPinCodeContainerStyle: styles.filledPinCodeContainer,
                }}
              />
              <SizedBox height={16} />
              <Text center size={12} color={palette.dark}>
                Didn't receive code?{' '}
                <Text
                  fontFamily={family.Bold}
                  color={'#1A9459'}
                  onPress={resendOtp}
                  style={styles.loginSpan}>
                  {disabled ? `Resend OTP (${seconds}s)` : 'Resend OTP'}
                </Text>
              </Text>
              <SizedBox height={50} />
              <Button
                title="Continue"
                disabled={otp?.length < 6}
                onPress={handleVerifyOtp}
                loading={isValidateBvnLoading}
              />
              <SizedBox height={10} />
            </Block>
          )
        }
      />
    </Block>
  );
};
