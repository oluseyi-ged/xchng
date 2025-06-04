import {
  Block,
  BottomSheet,
  Button,
  SizedBox,
  SvgIcon,
  Text,
  TextInput,
} from '@components';
import {
  currencies,
  dateFilters,
  HDP,
  SCREEN_HEIGHT,
  transactionHistory,
} from '@helpers';
import {TransactionItem} from '@helpers/Reusables';
import {family, palette} from '@theme';
import {format, isToday, isYesterday} from 'date-fns';
import React, {FC, useState} from 'react';
import {SectionList} from 'react-native';
import {SystemBars} from 'react-native-edge-to-edge';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import style from './styles';

const groupTransactionsByDate = transactions => {
  const grouped = {};

  transactions.forEach(tx => {
    const date = new Date(tx.date);

    let label = format(date, 'dd/MM/yyyy');
    if (isToday(date)) label = 'Today';
    else if (isYesterday(date)) label = 'Yesterday';

    if (!grouped[label]) grouped[label] = [];
    grouped[label].push(tx);
  });

  return Object.entries(grouped).map(([label, data]) => ({label, data}));
};

export const Transactions: FC = ({navigation}: any) => {
  const [showFilter, setShowFilter] = useState(false);
  const [isStartDatePickerVisible, setStartDatePickerVisibility] =
    useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);

  // State for filter values
  const [filters, setFilters] = useState({
    amount: '',
    currency: '',
    period: '',
    startDate: null as Date | null,
    endDate: null as Date | null,
  });

  const groupedData: any = groupTransactionsByDate(
    transactionHistory.sort((a, b) => new Date(b.date) - new Date(a.date)),
  );

  const handleConfirm = (date: Date, type: 'start' | 'end') => {
    if (type === 'start') {
      setFilters(prev => ({...prev, startDate: date}));
      setStartDatePickerVisibility(false);
    } else {
      setFilters(prev => ({...prev, endDate: date}));
      setEndDatePickerVisibility(false);
    }
  };

  const hideDatePicker = (type: 'start' | 'end') => {
    if (type === 'start') {
      setStartDatePickerVisibility(false);
    } else {
      setEndDatePickerVisibility(false);
    }
  };

  const handleCurrencySelect = (currency: string) => {
    setFilters(prev => ({...prev, currency}));
  };

  const handlePeriodSelect = (period: string) => {
    setFilters(prev => ({...prev, period}));
  };

  const handleAmountChange = (amount: string) => {
    setFilters(prev => ({...prev, amount}));
  };

  const formatDate = (date: Date | null) => {
    return date ? format(date, 'dd/MM/yyyy') : '';
  };

  return (
    <Block
      bg="#05081A"
      safe
      flex={1}
      style={style.pageWrap}
      isScrollable={false}>
      <SystemBars style="light" />
      {/* Header */}
      <Block
        style={style.pageHeader}
        row
        justify="space-between"
        align="center">
        <Block width={80}>
          <SvgIcon
            name="back"
            size={40}
            onPress={() => navigation.goBack()}
            containerStyle={{alignSelf: 'flex-start'}}
          />
        </Block>
        <Block>
          <Text center size={16} color={palette.white}>
            Transactions
          </Text>
        </Block>
        <Block
          bg="#1A9459"
          radius={50}
          width={80}
          onPress={() => setShowFilter(true)}
          style={{
            paddingVertical: HDP(8),
          }}>
          <Text
            center
            size={16}
            color={palette.white}
            fontFamily={family.Medium}>
            Filter
          </Text>
        </Block>
      </Block>
      <Block bg={'#FAFAFF'} style={style.formBox}>
        <SectionList
          sections={groupedData}
          keyExtractor={item => item.id.toString()}
          renderItem={({item}) => (
            <Block style={{marginBottom: HDP(10)}}>
              <TransactionItem txItem={item} />
            </Block>
          )}
          renderSectionHeader={({section: {label}}) => (
            <Text color="#676D7E" size={14} marginBottom={10}>
              {label}
            </Text>
          )}
          contentContainerStyle={{paddingBottom: 100}}
        />
      </Block>
      <BottomSheet
        show={showFilter}
        dropPress={() => setShowFilter(false)}
        afterHide={() => setShowFilter(false)}
        avoidKeyboard={false}
        content={
          <Block
            scrollIn
            bounce={false}
            height={SCREEN_HEIGHT * 0.75}
            style={{padding: HDP(16)}}>
            <TextInput
              placeholder="Enter amount"
              label="Transaction Amount"
              autoCorrect={false}
              keyboardType="numeric"
              value={filters.amount}
              onChangeText={handleAmountChange}
            />
            <SizedBox height={24} />

            <Text color="#0F1545" fontFamily={family.Medium} size={20}>
              Currency
            </Text>
            <Block wrap="wrap" style={{marginVertical: HDP(16)}} row gap={8}>
              {currencies?.map(item => (
                <Block
                  width={96}
                  radius={32}
                  style={[
                    style.currBlock,
                    {
                      borderColor:
                        filters.currency === item.name
                          ? 'transparent'
                          : '#A5B0FC',
                    },
                  ]}
                  bg={filters.currency === item.name ? '#4754AB' : '#F3F5FF'}
                  gap={8}
                  row
                  onPress={() => handleCurrencySelect(item.name)}>
                  <SvgIcon name={item?.name} size={20} />
                  <Text
                    fontFamily={family.Medium}
                    color={filters.currency === item.name ? '#fff' : '#05081A'}
                    transform="uppercase">
                    {item?.name}
                  </Text>
                </Block>
              ))}
            </Block>
            <SizedBox height={12} />

            <Text color="#0F1545" fontFamily={family.Medium} size={20}>
              Period
            </Text>
            <Block wrap="wrap" style={{marginVertical: HDP(16)}} row gap={8}>
              {dateFilters?.map(item => (
                <Block
                  radius={32}
                  style={[
                    style.currBlock,
                    {
                      borderColor:
                        filters.period === item.name
                          ? 'transparent'
                          : '#A5B0FC',
                      paddingHorizontal: HDP(16),
                    },
                  ]}
                  bg={filters.period === item.name ? '#4754AB' : '#F3F5FF'}
                  gap={8}
                  row
                  onPress={() => handlePeriodSelect(item.name)}>
                  <Text
                    fontFamily={family.Medium}
                    color={filters.period === item.name ? '#fff' : '#05081A'}>
                    {item?.name}
                  </Text>
                </Block>
              ))}
            </Block>

            <Block onPress={() => setStartDatePickerVisibility(true)}>
              <TextInput
                placeholder="10/02/2024"
                label="Start Date *"
                autoCorrect={false}
                iconName2="calendar"
                editable={false}
                value={formatDate(filters.startDate)}
              />
            </Block>

            <DateTimePickerModal
              isVisible={isStartDatePickerVisible}
              mode="date"
              onConfirm={date => handleConfirm(date, 'start')}
              onCancel={() => hideDatePicker('start')}
            />
            <SizedBox height={12} />

            <Block onPress={() => setEndDatePickerVisibility(true)}>
              <TextInput
                placeholder="10/02/2024"
                label="End Date *"
                autoCorrect={false}
                iconName2="calendar"
                editable={false}
                value={formatDate(filters.endDate)}
              />
            </Block>

            <DateTimePickerModal
              isVisible={isEndDatePickerVisible}
              mode="date"
              onConfirm={date => handleConfirm(date, 'end')}
              onCancel={() => hideDatePicker('end')}
            />
            <SizedBox height={50} />

            <Button
              title={'Filter transactions'}
              onPress={() => {
                // Apply filters here
                setShowFilter(false);
              }}
            />
            <SizedBox height={10} />
          </Block>
        }
      />
    </Block>
  );
};
