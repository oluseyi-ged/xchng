/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Block,
  Button,
  Select,
  SizedBox,
  SvgIcon,
  Switch,
  Text,
  TextInput,
} from '@components';
import {HDP, SCREEN_WEIGHT} from '@helpers';
import {useGetNgnBanksQuery, useLazyGetAccInqQuery} from '@services/queryApi';
import {WalletState} from '@slices/wallets';
import {family, palette} from '@theme';
import {Formik, FormikProps} from 'formik';
import React, {FC, useEffect, useRef, useState} from 'react';
import {SystemBars} from 'react-native-edge-to-edge';
import {RootState, useAppSelector} from 'store';
import * as yup from 'yup';
import styles from './styles';

// Define navigation prop type
type RootStackParamList = {
  PayAmount: {
    recipient: {
      name: string;
      account: string;
      bankName: string;
      bankCode: string;
      clientId: string;
      accountId: string;
      description: string;
      save: boolean;
    };
  };
};

interface FormValues {
  accountNumber: string;
  description: string;
  bankName: string;
  bankId: string;
  accountName?: string;
  clientId?: string;
  accountId?: string;
}

interface PayBankProps {
  navigation: any; // Replace with proper navigation type if possible
}

interface Bank {
  name: string;
  code: string;
  logo: string;
}

export const PayBank: FC<PayBankProps> = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const [saveBeneficiary, setSaveBeneficiary] = useState(false);
  const [error, setError] = useState('');
  const [bankId, setBankId] = useState('');
  const [clientId, setClientId] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const formikRef = useRef<FormikProps<FormValues>>(null);
  const [fetchAccountInfo] = useLazyGetAccInqQuery();
  const {beneficiaries} = useAppSelector<WalletState>(
    (store: RootState) => store.wallets,
  );

  const isABene =
    clientId && beneficiaries.length > 0
      ? beneficiaries?.find(item => item.clientId === clientId)
      : false;

  const {data: bankList, isLoading: bankLoad} = useGetNgnBanksQuery(null, {
    refetchOnMountOrArgChange: true,
  });

  const initialValues: FormValues = {
    accountNumber: '',
    description: '',
    bankName: '',
    bankId: '',
    accountName: '',
    clientId: '',
    accountId: '',
  };

  const validationSchema = yup.object().shape({
    accountNumber: yup
      .string()
      .required('Account number is required')
      .length(10, 'Account number must be 10 digits'),
    description: yup.string().optional(),
    bankName: yup.string().required('Please select recipient bank'),
    bankId: yup.string().required('Please select recipient bank'),
  });

  useEffect(() => {
    if (bankId && accountNumber.length === 10) {
      setLoading(true);
      fetchAccountInfo({
        accNumber: Number(accountNumber),
        code: Number(bankId),
        type: bankId === '999999' ? 'intra' : 'inter',
      })
        .unwrap()
        .then(res => {
          formikRef.current?.setFieldValue('accountName', res?.data?.name);
          formikRef.current?.setFieldValue('clientId', res?.data?.clientId);
          setClientId(res?.data?.clientId);
          formikRef.current?.setFieldValue('accountId', res?.data?.account?.id);
          setError('');
        })
        .catch(e => {
          formikRef.current?.setFieldValue('accountName', '');
          formikRef.current?.setFieldValue('clientId', '');
          setClientId('');
          formikRef.current?.setFieldValue('accountId', '');
          setError(
            e.data?.message?.split(',')[1] || 'Failed to fetch account details',
          );
        })
        .finally(() => setLoading(false));
    }
  }, [fetchAccountInfo, bankId, accountNumber]);

  const handleSubmit = async (values: FormValues) => {
    navigation.navigate('PayAmount', {
      recipient: {
        name: values.accountName || '',
        account: values.accountNumber,
        bankName: values.bankName,
        bankCode: values.bankId,
        clientId: values.clientId || '',
        accountId: values.accountId || '',
        description: values.description,
        save: saveBeneficiary,
      },
    });
  };

  return (
    <Block
      bg="#05081A"
      isScrollable={false}
      safe
      flex={1}
      style={styles.pageWrap}>
      <SystemBars style="light" />

      <Block
        style={styles.pageHeader}
        row
        justify="space-between"
        align="center">
        <SvgIcon name="back" size={40} onPress={() => navigation.goBack()} />
        <Block>
          <Text center size={16} color={palette.white}>
            Send Money
          </Text>
          <Text
            center
            size={10}
            fontFamily={family.Medium}
            color={palette.white}>
            Step 1 of 2
          </Text>
        </Block>
        <SizedBox width={40} />
      </Block>

      <Block scrollIn bg={'#FAFAFF'} style={styles.formBox}>
        <Formik
          innerRef={formikRef}
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          validateOnMount>
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
            setFieldValue,
            isValid,
          }) => (
            <Block flex={1} justifyContent="space-between">
              <Block>
                <Text size={22} fontFamily={family.Medium} color="#0F1545">
                  Recipient details
                </Text>
                <SizedBox height={5} />
                <Text color="#676D7E" size={12}>
                  Enter the recipient's account number and select bank
                </Text>
                <SizedBox height={40} />

                {bankLoad ? (
                  <Text>Loading banks...</Text>
                ) : (
                  <Select
                    label="Destination Bank *"
                    placeholder="Recipient Bank"
                    data={(bankList?.data?.bank ?? []).map((bank: Bank) => ({
                      name: bank.name,
                      value: bank.code,
                      logo: bank.logo,
                    }))}
                    onSelect={(item: any) => {
                      setFieldValue('bankName', item.name);
                      setFieldValue('bankId', item.value);
                      setBankId(item.value);
                    }}
                    value={values.bankName}
                    error={(touched.bankName && errors.bankName) || error}
                    height={500}
                  />
                )}
                <SizedBox height={16} />

                <TextInput
                  onChangeText={(text: string) => {
                    handleChange('accountNumber')(text);
                    setAccountNumber(text);
                  }}
                  onBlur={handleBlur('accountNumber')}
                  placeholder="Account number"
                  label="Account Number*"
                  error={touched.accountNumber && errors.accountNumber}
                  value={values.accountNumber}
                  autoCorrect={false}
                  autoCapitalize="none"
                  maxLength={10}
                  keyboardType="number-pad"
                  successMsg={values.accountName}
                />
                <SizedBox height={16} />

                <TextInput
                  onChangeText={handleChange('description')}
                  onBlur={handleBlur('description')}
                  placeholder="e.g. John's business account"
                  label="Description"
                  error={touched.description && errors.description}
                  value={values.description}
                  autoCorrect={true}
                />
              </Block>
            </Block>
          )}
        </Formik>
      </Block>

      <Block
        bg="#FAFAFF"
        position="absolute"
        bottom={180}
        style={{paddingHorizontal: HDP(24), paddingVertical: HDP(20)}}
        width={SCREEN_WEIGHT}
        alignSelf="center">
        {error ? (
          <Text color="red" size={12} marginBottom={10}>
            {error}
          </Text>
        ) : null}
        {formikRef?.current?.values?.accountName && !isABene ? (
          <Block row justify="space-between" align="center" marginBottom={26}>
            <Text color="#2A3147" size={14}>
              Add as beneficiary
            </Text>
            <Switch
              value={saveBeneficiary}
              onValueChange={setSaveBeneficiary}
              size="small"
              label={saveBeneficiary ? 'Yes' : 'No'}
              labelPosition="left"
            />
          </Block>
        ) : null}

        <Button
          title="Continue"
          onPress={() => {
            formikRef.current?.handleSubmit();
          }}
          disabled={loading || !formikRef.current?.isValid || !!error}
          loading={loading}
        />
      </Block>
    </Block>
  );
};
