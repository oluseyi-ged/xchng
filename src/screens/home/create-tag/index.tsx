import {XBg} from '@assets/images';
import {Block, Button, SizedBox, Text, TextInput} from '@components';
import {SCREEN_HEIGHT} from '@helpers';
import {ErrorInfo} from '@helpers/Reusables';
import {useCreateTagMutation} from '@services/mutationApi';
import {family, palette} from '@theme';
import React, {FC, useState} from 'react';
import {SystemBars} from 'react-native-edge-to-edge';
import styles from './styles';

export const CreateTag: FC = ({navigation}: any) => {
  const [tag, setTag] = useState('');
  const [error, setError] = useState('');
  const [createTag, {isLoading, isSuccess, error: tagError}]: any =
    useCreateTagMutation();

  const validateTag = (tag: string) => {
    if (!tag || tag.trim() === '') {
      setError('Tag is required');
      return false;
    }

    if (tag.length < 3) {
      setError('Tag must be at least 3 characters');
      return false;
    }

    setError('');
    return true;
  };

  const handleSubmit = async () => {
    if (!validateTag(tag)) return;

    try {
      const res = await createTag({xTag: tag}).unwrap();
      if (res?.success) {
        navigation.navigate('SuccessPage', {
          title: 'Tag Created',
          description: 'Your XCHNG Tag has been successfully created.',
          navRoute: 'AppHome',
        });
      }
    } catch (e: any) {
      setError(e?.data?.message);
    }
  };

  return (
    <Block
      backgroundScroll
      backgroundImage={XBg}
      flex={1}
      safe
      style={styles.pageWrap}>
      <SystemBars style="light" />

      <SizedBox height={SCREEN_HEIGHT * 0.15} />
      <Block style={{paddingHorizontal: 33}}>
        <Text
          style={{width: '70%'}}
          size={30}
          fontFamily={family.Medium}
          color={palette.white}>
          Create your XCHNG Tag
        </Text>
        <Text size={12} color={palette.white}>
          Create a unique identifier for your account
        </Text>
      </Block>
      <SizedBox height={40} />

      <Block bg={palette.white} radius={24} style={styles.formBox}>
        <Block flex={1} justifyContent="space-between">
          <Block>
            <TextInput
              onChangeText={text => {
                setTag(text);
                setError(''); // Clear error when typing
              }}
              placeholder="Enter your XCHNG Tag"
              label="Tag *"
              error={error}
              value={tag}
              autoCorrect={false}
              autoCapitalize="none"
            />
          </Block>

          <Block>
            <ErrorInfo message="This name tag @johnchebe is already in use. Please choose  a different one and try again." />
            <Button
              title={'Create Tag'}
              onPress={handleSubmit}
              disabled={!tag.trim()}
            />
            <SizedBox height={4} />
            <Text center color="#05081A" fontFamily={family.Light} size={14}>
              Do this later?{' '}
              <Text
                style={{textDecorationLine: 'underline'}}
                color="#1A9459"
                fontFamily={family.Medium}
                size={14}
                onPress={() => navigation.goBack()}>
                Skip here
              </Text>
            </Text>
          </Block>
        </Block>
      </Block>
    </Block>
  );
};
