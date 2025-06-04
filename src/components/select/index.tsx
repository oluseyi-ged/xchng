/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
import {
  Block,
  BottomSheet,
  SizedBox,
  SvgIcon,
  Text,
  TextInput,
} from '@components';
import {HDP} from '@helpers';
import React, {FC, useEffect, useMemo, useState} from 'react';
import {FlatList, ListRenderItem, View} from 'react-native';
import style from './styles';

interface SelectItem {
  name: string;
  value: string;
}

interface Props {
  placeholder?;
  editable?;
  value?;
  type?;
  label?;
  onChangeText?;
  iconName?;
  iconSize?;
  labelStyle?;
  white?;
  error?;
  data?: SelectItem[];
  onSelect?: (item: SelectItem) => void;
  height?;
}

export const Select: FC<Props> = ({
  placeholder,
  editable,
  value,
  type,
  label,
  onChangeText,
  iconName,
  iconSize,
  labelStyle,
  white,
  error,
  data = [],
  onSelect,
  height = 300,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string | undefined>(value);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (value) {
      setSelectedValue(value);
    }
  }, [value]);

  const filteredData = useMemo(() => {
    if (!searchQuery) return data;
    return data.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [data, searchQuery]);

  const showSearch = data.length > 10;

  const renderItem: ListRenderItem<SelectItem> = ({item}) => (
    <Block
      onPress={() => {
        setSelectedValue(item.value);
        onSelect?.(item);
        setShowModal(false);
        setSearchQuery(''); // Clear search on selection
      }}
      style={{
        backgroundColor:
          selectedValue === item.value ? '#FAFAFA' : 'transparent',
        paddingVertical: HDP(10),
        borderBottomWidth: 0.5,
        borderBottomColor: '#BDBDBD50',
      }}>
      <Text size={15} center>
        {item.name}
      </Text>
    </Block>
  );

  return (
    <View>
      <Text style={[style.label, labelStyle, white && {color: '#FA4A84'}]}>
        {label}
      </Text>

      <Block
        style={{
          borderWidth: 1,
          borderColor: '#E0E0E0',
          paddingVertical: HDP(10),
          paddingHorizontal: HDP(16),
        }}
        onPress={() => {
          setShowModal(true);
          setSearchQuery(''); // Clear search when opening modal
        }}
        radius={4}
        bg={'#FAFAFA'}
        row
        alignItems="center"
        justify="space-between">
        <Text color={selectedValue ? '#181D27' : '#BDBDBD'}>
          {selectedValue || placeholder || 'Select item'}
        </Text>
        <SvgIcon name="caret-down" size={24} />
      </Block>

      {error?.length ? (
        <>
          <Text style={[style.error]}>{error}</Text>
          <SizedBox height={10} />
        </>
      ) : (
        <SizedBox height={10} />
      )}

      <BottomSheet
        show={showModal}
        dropPress={() => {
          setShowModal(false);
          setSearchQuery(''); // Clear search when closing modal
        }}
        afterHide={() => setShowModal(false)}
        avoidKeyboard={true}
        content={
          <Block>
            {showSearch && (
              <>
                <TextInput
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  inputStyle={{
                    width: '90%',
                    alignSelf: 'center',
                    borderRadius: 16,
                    marginBottom: HDP(10),
                  }}
                  placeholder="Search"
                />
                <SizedBox height={8} />
              </>
            )}
            <FlatList
              data={filteredData}
              renderItem={renderItem}
              keyExtractor={item => item.value}
              style={{maxHeight: HDP(height), height: HDP(height)}}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingBottom: HDP(20),
                flexGrow: 0,
              }}
              keyboardShouldPersistTaps="handled"
            />
          </Block>
        }
      />
    </View>
  );
};
