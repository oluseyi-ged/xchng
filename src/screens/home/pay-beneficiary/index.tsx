import {Block, Button, SizedBox, SvgIcon, Text, TextInput} from '@components';
import {HDP, SCREEN_WEIGHT} from '@helpers';
import {WalletState} from '@slices/wallets';
import {family, palette} from '@theme';
import {Formik} from 'formik';
import React, {FC, useState} from 'react';
import {SystemBars} from 'react-native-edge-to-edge';
import {RootState, useAppSelector} from 'store';
import * as yup from 'yup';
import styles from './styles';

interface FormValues {
  tag: string;
  description: string;
  bankName: string;
}

export const PayBeneficiary: FC = ({navigation}: any) => {
  const [loading, setLoading] = useState(false);
  const [saveBeneficiary, setSaveBeneficiary] = useState(false);
  const {beneficiaries} = useAppSelector<WalletState>(
    (store: RootState) => store.wallets,
  );

  console.log(beneficiaries);

  const initialValues: FormValues = {
    tag: '',
    description: '',
    bankName: '',
  };

  const validationSchema = yup.object().shape({
    tag: yup
      .string()
      .required('XCHNG Tag is required')
      .min(3, 'Tag must be at least 3 characters')
      .matches(
        /^[a-zA-Z0-9_]+$/,
        'Only letters, numbers and underscores allowed',
      ),
    description: yup.string().optional(),
    bankName: yup.string().required('Please select recipient bank'),
  });

  const handleSubmit = (values: FormValues, {setSubmitting}: any) => {
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setSubmitting(false);
      setLoading(false);
      navigation.navigate('PayAmount', {
        recipient: {
          tag: values.tag,
          description: values.description,
          save: saveBeneficiary,
        },
      });
    }, 1000);
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
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}>
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
            isValid,
          }) => (
            <Block flex={1} justifyContent="space-between">
              <Block>
                <Text size={22} fontFamily={family.Medium} color="#0F1545">
                  Recipient details
                </Text>
                <SizedBox height={5} />
                <Text color="#676D7E" size={12}>
                  Select beneficiary to send funds to
                </Text>
                <SizedBox height={40} />

                <Block flex={1}>
                  <TextInput
                    placeholder="Select beneficiary"
                    label="Beneficiaries *"
                    error={touched.bankName && errors.bankName}
                    value={values.bankName}
                    autoCorrect={false}
                    editable={false}
                    iconName2="caret-down"
                  />
                </Block>
                <SizedBox height={16} />

                <TextInput
                  onChangeText={handleChange('accountNumber')}
                  onBlur={handleBlur('accountNumber')}
                  placeholder="username"
                  label="Beneficiary Bank"
                  error={touched.accountNumber && errors.accountNumber}
                  value={'Access bank PLC'}
                  autoCorrect={false}
                  autoCapitalize="none"
                  maxLength={10}
                  keyboardType="number-pad"
                  editable={false}
                />
                <SizedBox height={16} />

                <TextInput
                  onChangeText={handleChange('accountNumber')}
                  onBlur={handleBlur('accountNumber')}
                  placeholder="username"
                  label="Beneficiary Account Number"
                  error={touched.accountNumber && errors.accountNumber}
                  value={'121200230023'}
                  autoCorrect={false}
                  autoCapitalize="none"
                  maxLength={10}
                  keyboardType="number-pad"
                  editable={false}
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
        <Button title="Continue" loading={loading} />
      </Block>
    </Block>
  );
};
