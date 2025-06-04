import {
  Block,
  BottomSheet,
  Button,
  DialpadKeypad,
  SizedBox,
  SvgIcon,
  Text,
} from '@components';
import CurrencySection from '@components/currency-input';
import {
  extractErrors,
  formatAmountInCurrency,
  HDP,
  SCREEN_WEIGHT,
  triggerToast,
} from '@helpers';
import {
  useAddBeneficiaryMutation,
  useGetFeeMutation,
  useInitTxnMutation,
  useValidatePinMutation,
} from '@services/mutationApi';
import {setTxnRef} from '@slices/transactions';
import {family, palette} from '@theme';
import React, {useState} from 'react';
import {SystemBars} from 'react-native-edge-to-edge';
import {useAppDispatch} from 'store';
import styles from './styles';

export const PayAmount = ({navigation, route}: any) => {
  const dispatch = useAppDispatch();
  const recipient = route?.params?.recipient;
  console.log(route?.params);
  const bank = {};
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState<string>('');
  const [pin, setPin] = useState('');
  const [feeLog, setFeeLog] = useState({
    id: '',
    fee: '',
    totalAmount: '',
  });
  const [activatePin, setActivatePin] = useState(false);
  const [calcFee] = useGetFeeMutation();
  const [validatePin, {isLoading: validateLoad}] = useValidatePinMutation();
  const [initTxn, {isLoading: initLoad}] = useInitTxnMutation();
  const [addBene, {isLoading: beneLoad}] = useAddBeneficiaryMutation();

  const calculateFee = () =>
    calcFee({
      type: 'PAYOUT',
      sourceCurrency: 'NGN',
      amount: parseFloat(amount),
      destCurrency: 'NGN',
    })
      .unwrap()
      .then(res => {
        setFeeLog({
          id: res.data?.sessionId,
          fee: res.data?.feeApplied,
          totalAmount: res.data?.debitAmount,
        });
      });

  const handleSubmit = async () => {
    setLoading(true);

    try {
      await calculateFee();
      setLoading(false);
      setActivatePin(true);
    } catch (error) {
      setLoading(false);
      console.error('Error calculating fee:', error);
    }
  };

  const handleNext = async (val: string) => {
    console.log(val);
    setPin(val);

    try {
      // Use the passed val instead of pin to avoid async state issues
      await validatePin({pin: val}).unwrap();

      const res = await initTxn({
        transactionType: 'PAYOUT',
        sessionId: feeLog?.id,
        destinationName: recipient?.name,
        destinationBankCode: recipient?.bankCode ?? '',
        destinationClientId: recipient?.clientId,
        destinationAccount: recipient?.account ?? '',
        destinationAccountId: recipient?.account_id ?? '',
      }).unwrap();

      dispatch(setTxnRef(res?.data?.transactionRef));

      // Only save beneficiary if recipient.saveBene is true
      if (recipient?.saveBene) {
        try {
          await addBene({
            name: recipient?.name ?? '',
            account: recipient?.account ?? '',
            bankName: recipient?.bankName ?? '',
            bankCode: recipient?.bankCode ?? '',
            clientId: recipient?.clientId ?? '',
            xTag: recipient?.tag ?? '',
          }).unwrap();
        } catch (beneError) {
          // Handle beneficiary saving error separately
          setActivatePin(false);
          setPin('');
          triggerToast('Failed to save beneficiary', 'error', 'Error');
        }
      }

      // Navigate after all operations complete
      setActivatePin(false);
      navigation.navigate('SuccessPage', {
        title: 'Transaction Successful',
        description: `You successfully sent NGN 100,000 to ${recipient?.name} | @${recipient?.tag}.`,
        accessQuicks: true,
      });
    } catch (e) {
      const errors = extractErrors(e);
      setActivatePin(false);
      setPin('');
      errors.forEach((error: any) => {
        console.log(error, 'market');
        triggerToast(
          error.data?.message ||
            error?.message ||
            error ||
            'Transaction failed',
          'error',
          'Error',
        );
      });
    }
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
            Step 2 of 2
          </Text>
        </Block>
        <SizedBox width={40} />
      </Block>

      <Block bg={palette.white} style={styles.formBox}>
        <Block>
          <Block>
            <CurrencySection
              title="Enter Amount (NGN)"
              amount={formatAmountInCurrency(amount ? Number(amount) : 0)}
              onChangeAmount={val => setAmount(val.toString())}
              // error="Insuff"
              editable={false}
            />
            {/* <Block
              style={{
                marginTop: HDP(5),
                paddingHorizontal: HDP(12),
                paddingVertical: HDP(4),
              }}
              radius={16}
              bg="#1A9459"
              alignSelf="center">
              <Text
                center
                fontFamily={family.Light}
                size={12}
                color={palette.white}>
                FEE:{' '}
                <Text fontFamily={family.Bold} color={palette.white}>
                  ₦ 50.00
                </Text>
              </Text>
            </Block> */}
          </Block>

          <SizedBox height={50} />

          <Button
            title="Continue"
            disabled={Number(amount) < 50}
            onPress={handleSubmit}
            loading={loading}
          />

          <SizedBox height={30} />

          <DialpadKeypad
            value={amount || ''}
            setValue={setAmount}
            mode="amount"
            dialPadSize={62}
            dialPadTextSize={20}
          />
        </Block>
      </Block>

      <BottomSheet
        show={activatePin}
        dropPress={() => setActivatePin(false)}
        afterHide={() => setActivatePin(false)}
        title=""
        modalStyle={{
          width: SCREEN_WEIGHT * 0.9,
        }}
        avoidKeyboard={true}
        content={
          <Block>
            <Block>
              <Block style={styles.reviewBox}>
                <Block
                  style={styles.reviewFloater}
                  bg="#0F1545"
                  alignSelf="center"
                  radius={50}>
                  <Text color={palette.white}>Review</Text>
                </Block>
                <SizedBox height={20} />

                <Text
                  center
                  size={14}
                  color="#05081A"
                  fontFamily={family.Medium}>
                  AMOUNT
                </Text>
                <Text
                  center
                  size={24}
                  color="#1A9459"
                  fontFamily={family.SemiBold}>
                  NGN {formatAmountInCurrency(amount)}
                </Text>
                <SizedBox height={20} />
                <Block row justify="space-between">
                  <Text size={14} color="#05081A" fontFamily={family.Light}>
                    Reciepient {recipient?.tag ? 'xTag' : 'Account'}
                  </Text>
                  <Block flex={1}>
                    <Text
                      align="right"
                      numberOfLines={1}
                      size={14}
                      color="#1D2667">
                      {recipient?.tag
                        ? `@${recipient?.tag}`
                        : `${recipient?.account} • ${recipient?.bankName}`}
                    </Text>
                  </Block>
                </Block>
                <SizedBox height={15} />
                <Block row justify="space-between">
                  <Text size={14} color="#05081A" fontFamily={family.Light}>
                    Reciepient Name
                  </Text>
                  <Block flex={1}>
                    <Text
                      numberOfLines={1}
                      align="right"
                      size={14}
                      color="#1D2667">
                      {recipient?.tag
                        ? `@${recipient?.tag}`
                        : `${recipient?.name}`}
                    </Text>
                  </Block>
                </Block>
                <SizedBox height={15} />
                <Block row justify="space-between">
                  <Text size={14} color="#05081A" fontFamily={family.Light}>
                    Transaction fee
                  </Text>
                  <Text size={14} color="#1D2667">
                    NGN {formatAmountInCurrency(feeLog?.fee)}
                  </Text>
                </Block>
              </Block>
            </Block>

            <SizedBox height={30} />

            <Block
              radius={6}
              alignSelf="center"
              style={{
                borderWidth: 1,
                borderColor: '#DADEFF',
                paddingHorizontal: HDP(16),
              }}
              bg="#F3F5FF"
              row
              gap={16}>
              {[...Array(4)].map((_, index) => (
                <Text
                  key={index}
                  size={30}
                  color={index < pin.length ? '#0F172A' : '#A5B0FC'}>
                  •
                </Text>
              ))}
            </Block>

            <SizedBox height={30} />

            <DialpadKeypad
              value={pin || ''}
              setValue={setPin}
              mode="pin"
              dialPadSize={50}
              dialPadTextSize={16}
              pinLength={4}
              onPinComplete={handleNext}
              loading={validateLoad || initLoad || beneLoad}
              dialPadContent={[
                '1',
                '2',
                '3',
                '4',
                '5',
                '6',
                '7',
                '8',
                '9',
                'X',
                '0',
                ';',
              ]}
            />
            <SizedBox height={10} />
          </Block>
        }
      />
    </Block>
  );
};
