import {
  Block,
  Button,
  SizedBox,
  SvgIcon,
  Switch,
  Text,
  TextInput,
} from '@components';
import {HDP, SCREEN_WEIGHT} from '@helpers';
import {WalletState} from '@slices/wallets';
import {family, palette} from '@theme';
import {Formik} from 'formik';
import React, {FC, useRef, useState} from 'react';
import {SystemBars} from 'react-native-edge-to-edge';
import {RootState, useAppSelector} from 'store';
import * as yup from 'yup';
import styles from './styles';

interface FormValues {
  tag: string;
  description: string;
}

export const PayTag: FC = ({navigation}: any) => {
  const [saveBeneficiary, setSaveBeneficiary] = useState(false);
  const formikRef = useRef<any>();
  const [isFormValid, setIsFormValid] = useState(false);
  const {beneficiaries} = useAppSelector<WalletState>(
    (store: RootState) => store.wallets,
  );

  // const isABene =
  //   formik.values.client_id && beneficiaries.length > 0
  //     ? beneficiaries?.find(item => item.clientId === formik.values.client_id)
  //     : false;

  const initialValues: FormValues = {
    tag: '',
    description: '',
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
  });

  const handleSubmit = (values: FormValues, {setSubmitting}: any) => {
    navigation.navigate('PayAmount', {
      recipient: {
        tag: values.tag,
        description: values.description,
        save: saveBeneficiary,
        name: values.tag,
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

      {/* Header */}
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
          validateOnChange
          validateOnBlur>
          {({handleChange, handleBlur, values, errors, touched, isValid}) => {
            // Update form validity state whenever validation changes
            React.useEffect(() => {
              setIsFormValid(isValid);
            }, [isValid]);

            return (
              <Block flex={1} justifyContent="space-between">
                <Block>
                  <Text size={22} fontFamily={family.Medium} color="#0F1545">
                    Recipient details
                  </Text>
                  <SizedBox height={5} />
                  <Text color="#676D7E" size={12}>
                    Enter the recipient's XCHNG Tag and optional description
                  </Text>
                  <SizedBox height={40} />

                  {/* Tag Input */}
                  <TextInput
                    onChangeText={handleChange('tag')}
                    onBlur={handleBlur('tag')}
                    placeholder="username"
                    label="XCHNG Tag *"
                    error={touched.tag && errors.tag}
                    value={values.tag}
                    autoCorrect={false}
                    autoCapitalize="none"
                    firstText={'@'}
                    maxLength={20}
                  />
                  <SizedBox height={16} />

                  {/* Description Input */}
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
            );
          }}
        </Formik>
      </Block>

      <Block
        bg="#FAFAFF"
        position="absolute"
        bottom={180}
        style={{paddingHorizontal: HDP(24), paddingVertical: HDP(20)}}
        width={SCREEN_WEIGHT}
        alignSelf="center">
        <Block row justify="space-between" align="center" marginBottom={26}>
          <Text color="#2A3147" size={14}>
            Add {formikRef.current?.values?.tag || 'this user'} as beneficiary
          </Text>
          <Switch
            value={saveBeneficiary}
            onValueChange={setSaveBeneficiary}
            size="small"
            label={saveBeneficiary ? 'Yes' : 'No'}
            labelPosition="left"
          />
        </Block>
        <Button
          title="Continue"
          onPress={() => formikRef.current?.handleSubmit()}
          disabled={!isFormValid}
        />
      </Block>
    </Block>
  );
};
