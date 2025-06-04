/* eslint-disable @typescript-eslint/no-unused-vars */
import {Fyp1, XBg} from '@assets/images';
import {Block, BottomSheet, Button, SizedBox, SvgIcon, Text} from '@components';
import {Avatar} from '@components/avatar';
import SvgIconContainer from '@components/svg-icon/SvgIconContainer';
import {
  HDP,
  reorderWallets,
  SCREEN_WEIGHT,
  transactionHistory,
  triggerToast,
} from '@helpers';
import {TransactionItem} from '@helpers/Reusables';
import {useFocusEffect} from '@react-navigation/native';
import {useCreateWalletsMutation} from '@services/mutationApi';
import {setAuth} from '@slices/auth';
import {setLogged} from '@slices/logged';
import {setWallets} from '@slices/wallets';
import {family, palette} from '@theme';
import {WalletCreationModel, WalletModel} from '@utils/models';
import React, {FC, useEffect, useRef, useState} from 'react';
import {FlatList, Image} from 'react-native';
import {
  useGetKycStatusQuery,
  useGetProfileQuery,
  useGetTxnsQuery,
  useGetUserWalletsQuery,
  useLazyGetUserWalletsQuery,
} from 'services/queryApi';
import {RootState, useAppDispatch, useAppSelector} from 'store';
import style from './styles';

export const Home: FC = ({navigation}: any) => {
  const dispatch = useAppDispatch();
  const {auth} = useAppSelector<any>((store: RootState) => store.auth);
  const flatListRef = useRef<any>(null);
  const [initiatePin, setInitiatePin] = useState(false);
  const [initiateSend, setInitiateSend] = useState(false);
  const [selectedSendOption, setSelectedSendOption] = useState<any>(null);
  const totalFields = 5;
  const {refresh} = useAppSelector<any>((store: RootState) => store.wallets);
  const {wallets} = useAppSelector<any>((store: RootState) => store.wallets);

  const {
    data: userData,
    isSuccess: userTrue,
    isLoading: userLoad,
    isFetching: userFetch,
    refetch,
  } = useGetProfileQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const {
    data: walletData,
    isSuccess: walletTrue,
    isLoading: walletLoad,
  } = useGetUserWalletsQuery(undefined, {
    refetchOnMountOrArgChange: true,
    skip: !userData?.data.accountCreated,
  });
  const {
    data: kycData,
    isSuccess: kycTrue,
    isLoading: kycLoad,
    isFetching: kycFetch,
    refetch: refetchKyc,
  } = useGetKycStatusQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const {
    data,
    isLoading,
    isFetching,
    refetch: refetchTxs,
  } = useGetTxnsQuery(null, {
    refetchOnMountOrArgChange: true,
    skip: wallets?.length === 0,
  });

  const [getAllWallets] = useLazyGetUserWalletsQuery();

  useFocusEffect(
    React.useCallback(() => {
      setTimeout(() => {
        dispatch(setLogged(true));
        getAllWallets()
          .unwrap()
          .then(res => {
            dispatch(setWallets(reorderWallets(res?.wallets)));
            refetch();
          });
      }, 3000);
    }, []),
  );

  const hasUSDWallet = walletData?.wallets?.some(
    (wallet: WalletModel) => wallet.currencyCode === 'USD',
  );

  // const filteredActions = quickActions.filter(
  //   action => !(action.currency === 'USD' && hasUSDWallet),
  // );

  const isUsdPndn = userData?.data?.walletCreationStatus?.find(
    (status: WalletCreationModel) =>
      status.currencyCode === 'USD' && status.creationStatus === 'PENDING',
  );

  const isNgnPndn = userData?.data?.walletCreationStatus?.find(
    (status: WalletCreationModel) =>
      status.currencyCode === 'NGN' && status.creationStatus === 'PENDING',
  );

  const [createWallet]: any = useCreateWalletsMutation();

  const completedFields = [
    kycData?.data?.verifiedBvn,
    kycData?.data?.verifiedNin,
    kycData?.data?.addedEmploymentDetails,
    kycData?.data?.addedAddressDetails,
    // kycData?.data?.livelinessVerified,
    kycData?.data?.livelinessCompleted,
  ].filter(field => field === true).length;

  const completionPercentage =
    completedFields === totalFields
      ? 100
      : Math.round((completedFields / totalFields) * 100);

  const refreshCalls = () => {
    refetch();
    refetchKyc();
  };

  const finalizeOnboard = () => {
    createWallet({currencyCode: 'NGN'}).unwrap();
  };

  const openActions = (currency: string) => {
    if (walletData?.wallets?.length > 0) {
    } else {
      triggerToast('You have not completed your KYC', 'error', 'Error');

      return;
    }
  };

  useEffect(() => {
    const shouldShowPinModal =
      userTrue &&
      kycTrue &&
      completionPercentage === 100 &&
      !userData?.data?.hasSetPin;

    if (shouldShowPinModal) {
      setInitiatePin(true);
    }
  }, [kycData, completionPercentage, userData, userTrue, kycTrue]);

  useEffect(() => {
    if (userTrue && kycTrue && !kycFetch && !userFetch) {
      dispatch(setAuth({...userData?.data, ...kycData?.data}));
    }
  }, [userTrue, kycTrue, kycFetch, userFetch]);

  // handles ngn account creation if admin trigger
  useEffect(() => {
    if (
      completionPercentage === 100 &&
      !userData?.data?.accountCreated &&
      !isNgnPndn &&
      !walletLoad &&
      userTrue &&
      kycTrue &&
      !kycFetch &&
      !userFetch
    ) {
      finalizeOnboard();
    }
  }, [
    completionPercentage,
    userData,
    userTrue,
    kycTrue,
    kycFetch,
    userFetch,
    walletLoad,
    isNgnPndn,
  ]);

  useEffect(() => {
    if (walletTrue) {
      dispatch(setWallets(reorderWallets(walletData?.wallets)));
    }
    // else dispatch(setWallets(dummyWallets));
  }, [walletTrue]);

  const quicks = [
    {
      id: 1,
      title: 'Account Info',
      icon: 'bank',
    },
    {
      id: 2,
      title: 'Top up',
      icon: 'inflow',
    },
    {
      id: 3,
      title: 'Send',
      icon: 'outflow',
    },
    {
      id: 4,
      title: 'Swap',
      icon: 'swap',
    },
    {
      id: 5,
      title: 'More',
      icon: 'more',
    },
  ];

  const sendOptions = [
    {
      id: 1,
      icon: 'xtag',
      title: 'To XCHNG Tag',
      description: 'Send money to a user XCHNG tag',
      route: 'PayTag',
    },
    {
      id: 2,
      icon: 'bank-icon',
      title: 'Other NGN Banks',
      description: 'Send money to a Naira account.',
      route: 'PayBank',
    },
    {
      id: 3,
      icon: 'users',
      title: 'To A Beneficiary',
      description: 'Send money to a Beneficiary account.',
      route: 'PayBeneficiary',
    },
  ];

  const fyps = [
    {id: 1, url: Fyp1},
    {id: 1, url: Fyp1},
  ];

  const renderItem = ({item, index}) => {
    return (
      <Image
        source={item.url}
        style={{
          height: HDP(142),
          width: SCREEN_WEIGHT * 0.7,
          borderRadius: 12,
          overflow: 'hidden',
          borderWidth: 0.5,
          borderColor: '#C0C8FF',
        }}
        resizeMode="cover"
      />
    );
  };

  return (
    <Block
      backgroundImage={XBg}
      flex={1}
      backgroundScroll
      // bounce
      showScrollbar={false}>
      {/* Page Header */}
      <Block style={{paddingHorizontal: HDP(24)}} row justify="space-between">
        <Block row gap={8} align="center">
          <Avatar
            bg="#F3F5FF"
            shape="circle"
            name={auth?.firstName + ' ' + auth?.lastName}
            url=""
            size="tiny"
          />
          <Text textTransform="capitalize" color="#8591EF">
            Hi {auth?.firstName} 👋🏽
          </Text>
        </Block>
        <Block row gap={8} align="center">
          <Block
            onPress={() => navigation.navigate('CreateTag')}
            style={style.tagBox}
            align="center"
            row
            radius={50}
            bg="#EEFFF7">
            <Text size={14} color="#05502C">
              @johnchebe
            </Text>

            <Block
              style={style.copyBox}
              align="center"
              bg={'#1A9459'}
              radius={50}
              row>
              <SvgIcon name="copy" size={8} />
              <Text size={10} color={palette.white}>
                Copy
              </Text>
            </Block>
          </Block>
          <SvgIcon name="bell" color="#FEF4EB" size={32} />
        </Block>
      </Block>

      <SizedBox height={37} />
      {/* Balance section */}

      <Block>
        <Text color={palette.white} center>
          NGN Account Balance
        </Text>
        <Block justify="center" align="flex-start" row>
          <Text color={'#F3F5FF'} fontFamily={family.Medium} size={48}>
            ₦ 5,000
            <Text color={'#8591EF'} fontFamily={family.Medium} size={48}>
              .09
            </Text>
          </Text>
          <SvgIcon name="eyes-open" size={24} />
        </Block>
      </Block>

      <SizedBox height={40} />
      {/* Quick Options */}

      <Block gap={12} row justify="center">
        {quicks?.map(item => (
          <Block
            onPress={() => {
              if (item?.id === 3) {
                setInitiateSend(true);
              }
              if (item?.id === 4) {
                navigation.navigate('SwapFunds');
              }
            }}
            align="center"
            gap={10}
            key={item?.id}>
            <SvgIconContainer
              name={item?.icon}
              size={20}
              containerSize={56}
              containerStyles={{borderWidth: 0.5, borderColor: '#8591EF'}}
              color="#1E2132"
            />
            <Text color={palette.white} size={12}>
              {item?.title}
            </Text>
          </Block>
        ))}
      </Block>

      <SizedBox height={40} />

      <Block bg={'#FAFAFF'} style={style.bottomPage}>
        {/* Info scroll */}
        <Block
          style={style.infoBox}
          onPress={() => navigation.navigate('Kyc')}
          bg={'#05081A'}
          radius={8}>
          <Block row justify="space-between">
            <Text color={palette.white} size={14} fontFamily={family.Medium}>
              Complete your KYC
            </Text>
          </Block>
          <SizedBox height={6} />
          <Text width="80%" color={'#EEFFF7'} size={12}>
            Click here to complete your account setup to get the most of your
            personal account.
          </Text>
          <SizedBox height={24} />
          <Block row gap={6} align="center">
            <Text color={palette.white} size={14} fontFamily={family.Medium}>
              Continue to KYC
            </Text>
            <SvgIcon name="arrow-right-green" size={24} />
          </Block>
        </Block>

        <SizedBox height={24} />
        {/* FYP scroll */}

        <Block>
          <Text color={'#14290A'} size={14}>
            For you ✨
          </Text>
          <SizedBox height={16} />
          <Block width={SCREEN_WEIGHT} align="center" justify="center">
            <FlatList
              ref={flatListRef}
              data={fyps}
              renderItem={renderItem}
              keyExtractor={item => item.id?.toString()}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              scrollEventThrottle={16}
              contentContainerStyle={{
                gap: 8,
                paddingRight: 50,
              }}
            />
          </Block>
        </Block>

        <SizedBox height={24} />

        <Block>
          <Text color={'#676D7E'} size={14}>
            Recent transactions
          </Text>

          {/* Tx Item */}
          <SizedBox height={16} />
          <Block gap={10}>
            {transactionHistory
              ?.sort((a, b) => new Date(b?.date) - new Date(a?.date))
              ?.slice(0, 3) // Take only first 3 items
              ?.map(txItem => (
                <TransactionItem key={txItem.id} txItem={txItem} />
              ))}
          </Block>
        </Block>

        <SizedBox height={80} />
      </Block>

      <BottomSheet
        show={initiatePin}
        afterHide={() => setInitiatePin(false)}
        title="Settings"
        avoidKeyboard={true}
        content={
          <Block>
            <SvgIconContainer
              name="password"
              size={44}
              containerSize={80}
              color={'#DADEFF'}
              containerStyles={{alignSelf: 'center'}}
            />
            <SizedBox height={16} />
            <Text center color="#0F1545" size={32} fontFamily={family.Medium}>
              Create PIN
            </Text>
            <SizedBox height={6} />
            <Text
              width={'80%'}
              center
              alignSelf="center"
              color="#0F1545"
              size={14}>
              Join us and get started in just a few steps. Create your account
              now!
            </Text>
            <SizedBox height={90} />
            <Button
              title={'Continue'}
              onPress={() => {
                setInitiatePin(false);
                navigation.navigate('CreatePin');
              }}
            />
            <SizedBox height={16} />
            <Text
              onPress={() => setInitiatePin(false)}
              center
              color="#4F4F4F"
              size={14}>
              Want to do that later?{' '}
              <Text center color="#1A9459" fontFamily={family.Bold} size={14}>
                Skip
              </Text>
            </Text>
            <SizedBox height={20} />
          </Block>
        }
      />

      <BottomSheet
        show={initiateSend}
        dropPress={() => {
          setInitiateSend(false);
        }}
        afterHide={() => setInitiateSend(false)}
        title="Settings"
        avoidKeyboard={true}
        content={
          <Block>
            <Block row gap={12} align="center">
              <SvgIcon name="ngn" size={32} />
              <Text size={20} fontFamily={family.Medium} color="#14290A">
                Send Naira
              </Text>
            </Block>
            <SizedBox height={40} />
            <Block gap={16}>
              {sendOptions?.map(item => (
                <Block
                  key={item.id}
                  bg={
                    selectedSendOption?.id === item.id
                      ? '#FAFAFF'
                      : palette.white
                  }
                  radius={5}
                  style={{
                    paddingHorizontal: HDP(16),
                    paddingVertical: HDP(12),
                    borderWidth: 1,
                    borderColor:
                      selectedSendOption?.id === item.id
                        ? '#8591EF'
                        : '#DDE1E9',
                  }}
                  row
                  justify="space-between"
                  align="flex-start"
                  onPress={() => setSelectedSendOption(item)}>
                  <Block row gap={10} align="flex-start">
                    <SvgIcon name={item?.icon} size={32} />
                    <Block>
                      <Text
                        size={16}
                        fontFamily={family.Medium}
                        color="#1D2667">
                        {item?.title}
                      </Text>
                      <SizedBox height={5} />
                      <Text size={14} fontFamily={family.Light} color="#0F1545">
                        {item?.description}
                      </Text>
                    </Block>
                  </Block>

                  <SvgIcon
                    name={
                      selectedSendOption?.id === item.id
                        ? 'circle-check'
                        : 'radio-off'
                    }
                    size={16}
                    color={
                      selectedSendOption?.id === item.id ? '#8591EF' : undefined
                    }
                  />
                </Block>
              ))}
            </Block>
            <SizedBox height={60} />
            <Button
              title={'Continue'}
              onPress={() => {
                setInitiateSend(false);
                navigation.navigate(selectedSendOption?.route);
              }}
            />
            <SizedBox height={10} />
          </Block>
        }
      />
    </Block>
  );
};
