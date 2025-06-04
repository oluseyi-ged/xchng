import {Block, Button, SizedBox, SvgIcon, Text} from '@components';
import SvgIconContainer from '@components/svg-icon/SvgIconContainer';
import {HDP, SCREEN_WEIGHT, triggerToast} from '@helpers';
import {QoreIdSdk} from '@qore-id/react-native-qoreid-sdk';
import {color, palette} from '@theme';
import React, {FC, useCallback, useEffect, useState} from 'react';
import {ActivityIndicator} from 'react-native';
import {SystemBars} from 'react-native-edge-to-edge';
import {
  useCreateWalletsMutation,
  useVerifyLivelinessMutation,
} from 'services/mutationApi';
import {useGetKycStatusQuery} from 'services/queryApi';
import {RootState, useAppSelector} from 'store';
import styles from './styles';

export const Kyc: FC = ({navigation}: any) => {
  const {auth: userData} = useAppSelector((store: RootState) => store.auth);
  const [verificationEvent, setVerificationEvent] = useState<any>(null);
  const [verificationError, setVerificationError] = useState<any>(null);

  // API hooks
  const {data: kycData, refetch: refetchKycStatus} = useGetKycStatusQuery();
  const [
    verifyLiveliness,
    {isLoading: isVerifying, isSuccess: verificationSuccess},
  ] = useVerifyLivelinessMutation();
  const [createWallet, {isLoading: isCreatingWallet}] =
    useCreateWalletsMutation();

  const applicantData = {
    firstName: userData?.firstName || '',
    lastName: userData?.lastName || '',
    phoneNumber: userData?.phone?.startsWith('+')
      ? userData.phone
      : `+${userData?.phone || ''}`,
    email: userData?.email || '',
  };

  console.log('QOREID user data:', applicantData);

  // Finalize onboarding after successful KYC
  const finalizeOnboard = useCallback(async () => {
    try {
      await createWallet({currencyCode: 'NGN'}).unwrap();
      navigation.goBack();
    } catch (error) {
      navigation.goBack();
    }
  }, [createWallet]);

  // Handle verification events
  const callback = useCallback((event: any) => {
    console.log('QOREID error:', event);
    switch (event.type) {
      case 'submitted':
        handleVerificationSubmitted(event.data);
        break;
      case 'error':
        handleVerificationError(event.data);
        break;
      case 'closed':
        handleVerificationClosed(event.data);
        break;
      default:
        break;
    }
  }, []);

  const handleVerificationSubmitted = (data: any) => {
    console.log(data);
  };

  const handleVerificationError = (error: any) => {
    setVerificationError(error);
    triggerToast('Verification error occurred', 'error', 'Error');
  };

  const handleVerificationClosed = (data: any) => {
    // Handle verification closed event if needed
  };

  useEffect(() => {
    const unsubscribe = QoreIdSdk.events(callback);
    return () => unsubscribe();
  }, [callback]);

  useEffect(() => {
    if (verificationSuccess) {
      navigation.replace('SuccessPage', {
        title: 'KYC Completed',
        description:
          'Your KYC verification has been successfully completed. You can now access all features seamlessly.',
        onPress: () => navigation.goBack(),
      });
    }
  }, [verificationSuccess]);

  const kycSteps = [
    {
      id: 1,
      icon: 'personal',
      title: 'Personal Information',
      active:
        !userData?.verifiedBvn ||
        !userData?.verifiedNin ||
        !userData?.addedEmploymentDetails,
      done:
        userData?.verifiedBvn &&
        userData?.verifiedNin &&
        userData?.addedEmploymentDetails,
      route: 'PersonalInfo',
    },
    {
      id: 2,
      icon: 'marker',
      title: 'Address Information',
      active:
        kycData?.data?.addedEmploymentDetails &&
        !kycData?.data?.addedAddressDetails,
      done: kycData?.data?.addedAddressDetails,
      route: 'AddressKyc',
    },
    {
      id: 3,
      icon: 'liveness',
      title: 'Liveness Check',
      active: true,
      // kycData?.data?.addedAddressDetails &&
      // !kycData?.data?.livelinessCompleted,
      done: kycData?.data?.livelinessCompleted,
    },
  ];

  const launchLivenessCheck = () => {
    QoreIdSdk.launch({
      flowId: 0,
      clientId: 'TVZEANEWUY7UMAFYXYCC', // Replace with your actual client ID
      productCode: 'liveness',
      customerReference: userData?.email,
      applicantData,
    });
  };

  return (
    <Block
      bg="#05081A"
      safe
      isScrollable={false}
      flex={1}
      style={styles.pageWrap}
      contentContainerStyle={{flexGrow: 1}}>
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
            KYC
          </Text>
        </Block>
        <SizedBox width={40} />
      </Block>

      {/* Content */}
      <Block
        bg={'#FAFAFF'}
        contentContainerStyle={{
          justifyContent: 'space-between',
        }}
        scrollIn
        style={styles.formBox}
        flex={1}>
        <Block gap={16}>
          {kycSteps.map(step => (
            <Block
              key={step.id}
              onPress={() => {
                if (step.active) {
                  if (step.route) {
                    navigation.navigate(step.route);
                  } else if (!step.done) {
                    launchLivenessCheck();
                  }
                }
              }}
              style={[
                styles.stepItem,
                {
                  opacity: step.active || step.done ? 1 : 0.5,
                  backgroundColor: palette.white,
                },
              ]}
              row
              justify="space-between">
              <Block row align="center" gap={10}>
                {step?.done ? (
                  <SvgIconContainer
                    name={step.done ? 'verify' : step.icon}
                    size={17}
                    containerSize={32}
                    color="#2BB673"
                  />
                ) : (
                  <SvgIcon name={step.icon} size={32} />
                )}

                <Text size={16} medium color={'#0F1545'}>
                  {step.title}
                </Text>
              </Block>
              {step.id === 3 && isVerifying ? (
                <ActivityIndicator color={color.primary} size="small" />
              ) : step.active && !step.done ? (
                <SvgIcon name={'caret-right'} size={24} />
              ) : null}
            </Block>
          ))}
        </Block>
      </Block>

      <Block
        bg="#FAFAFF"
        position="absolute"
        bottom={180}
        style={{paddingHorizontal: HDP(24), paddingVertical: HDP(20)}}
        width={SCREEN_WEIGHT}
        alignSelf="center">
        <Button
          title="Continue"
          onPress={finalizeOnboard}
          loading={isCreatingWallet}
          disabled={isCreatingWallet}
        />
      </Block>
    </Block>
  );
};
