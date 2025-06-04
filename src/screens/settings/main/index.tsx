import {Block, SizedBox, SvgIcon, Text} from '@components';
import {Avatar} from '@components/avatar';
import {HDP} from '@helpers';
import {setAuth} from '@slices/auth';
import {setLogged} from '@slices/logged';
import {family, palette} from '@theme';
import React, {FC} from 'react';
import {SystemBars} from 'react-native-edge-to-edge';
import {RootState, useAppDispatch, useAppSelector} from 'store';
import styles from './styles';

export const Settings: FC = ({navigation}: any) => {
  const dispatch = useAppDispatch();
  const {auth} = useAppSelector<any>((store: RootState) => store.auth);
  const profileOptions = [
    {
      name: '',
      listings: [
        {
          id: 1,
          title: 'Personal Information',
          desc: 'Your personal details, such as your first name, last name, DOB BVN, and others.',
          icon: 'personal',
          route: 'Account',
        },
        {
          id: 2,
          title: 'Address Information',
          desc: 'Includes your address information and also your utility bill.',
          icon: 'marker',
          route: 'AddressInfo',
        },
      ],
    },
    {
      name: 'Security',
      listings: [
        {
          id: 1,
          title: 'Change Password',
          desc: 'Update your account password to enhance security. Click this card to create a new password.',
          icon: 'password-round',
          route: 'ChangePassword',
        },
        {
          id: 2,
          title: 'Change Transaction PIN',
          desc: 'Set a new transaction PIN to secure your activities. Click this card to continue.',
          icon: 'pin-lock',
          route: 'ChangePin',
        },
        {
          id: 3,
          title: '2FA Authorization',
          desc: 'Secure your transactions with 2FA using SMS, email, or an authenticator app. Choose your method to get started.',
          icon: 'mfa',
          route: 'TwoFactor',
        },
      ],
    },
    {
      name: 'Settings',
      listings: [
        {
          id: 1,
          title: 'Notifications',
          desc: 'Manage your notification preferences.',
          icon: 'bell',
          route: 'Notifications',
        },
      ],
    },
    {
      name: 'Others',
      listings: [
        {
          id: 1,
          title: 'Referrals',
          desc: 'Refer friends and family to our platform.',
          icon: 'users',
          route: 'Referrals',
        },
      ],
    },
  ];

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
            Profile
          </Text>
        </Block>
        <SizedBox width={40} />
      </Block>

      {/* Content */}
      <Block scrollIn bg={'#FAFAFF'} style={styles.formBox}>
        <Block alignItems="center" justify="center">
          <Avatar
            shape="circle"
            name={auth?.firstName + ' ' + auth?.lastName}
            url=""
            size="medium"
            bg="#0D7242"
            textStyle={{
              color: '#fff',
              fontFamily: family.Medium,
            }}
          />
          <SizedBox height={16} />
          <Text textTransform="capitalize" center size={24}>
            {auth?.firstName + ' ' + auth?.lastName}
          </Text>
          <SizedBox height={4} />
          <Text center color="#858CA0" size={14} fontFamily={family.Light}>
            {auth?.email}
          </Text>
          <SizedBox height={24} />
          <Block
            onPress={() => navigation.navigate('CreateTag')}
            style={styles.tagBox}
            align="center"
            row
            radius={50}
            bg="#EEFFF7">
            <Text size={14} color="#05502C">
              @johnchebe
            </Text>
            <Block
              style={styles.copyBox}
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
        </Block>

        <SizedBox height={16} />

        {profileOptions.map((section, index) => (
          <Block key={index} style={{marginBottom: 32}}>
            {!!section.name && (
              <Text size={20} medium color="#676D7E">
                {section.name}
              </Text>
            )}

            <Block gap={12}>
              <SizedBox />

              {section.listings.map(item => (
                <Block
                  radius={8}
                  bg="#fff"
                  row
                  align="flex-start"
                  justify="space-between"
                  style={styles.listItem}
                  key={item.id}
                  onPress={() => navigation.navigate(item.route)}>
                  <Block align="flex-start" row gap={16} flex={0.7}>
                    <SvgIcon name={item?.icon} size={44} />
                    <Block>
                      <Text
                        color="#0F1545"
                        size={16}
                        fontFamily={family.Medium}>
                        {item.title}
                      </Text>
                      <Text color="#858CA0" size={14}>
                        {item.desc}
                      </Text>
                    </Block>
                  </Block>

                  <Block flex={0.2}>
                    <SvgIcon
                      name="caret-right"
                      style={{alignSelf: 'flex-end'}}
                      size={24}
                    />
                  </Block>
                </Block>
              ))}
            </Block>
          </Block>
        ))}

        <SizedBox height={10} />

        <Block justify="center" gap={8} alignItems="center" row>
          <Text
            style={{textDecorationLine: 'underline'}}
            size={16}
            color="#303B89">
            Terms of service
          </Text>
          <Text size={16} color="#303B89">
            •
          </Text>
          <Text size={16} color="#858CA0">
            © XCHNG 2025
          </Text>
        </Block>

        <SizedBox height={24} />

        <Block
          onPress={() => {
            navigation.reset({
              index: 0,
              routes: [{name: 'SplashScreen'}],
            });
            dispatch(setLogged(false));
            dispatch(setAuth({}));
          }}
          style={{
            paddingVertical: HDP(8.5),
            paddingHorizontal: HDP(20),
          }}
          gap={16}
          bg="#FDE7E8"
          radius={50}
          row
          alignSelf="center">
          <SvgIcon name="logout" size={24} />
          <Text size={16} color="#66191D">
            Log Out
          </Text>
        </Block>

        <SizedBox height={100} />
      </Block>
    </Block>
  );
};
