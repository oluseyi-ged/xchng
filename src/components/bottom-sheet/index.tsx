// import { SizedBox } from '@components/sized-box';
import {SizedBox} from '@components';
import {HDP} from '@helpers';
import React, {FC} from 'react';
import {View} from 'react-native';
import Modal from 'react-native-modal';
import styles from './styles';

interface Props {
  title?: string;
  content?: any;
  show?: boolean;
  dropPress?: any;
  afterHide?: any;
  modalStyle?: any;
  avoidKeyboard?: boolean;
  height?: any;
}

export const BottomSheet: FC<Props> = ({
  title,
  content,
  show = false,
  dropPress,
  avoidKeyboard = true,
  afterHide,
  modalStyle,
}) => {
  return (
    <Modal
      isVisible={show}
      avoidKeyboard={avoidKeyboard}
      onBackdropPress={dropPress}
      onModalHide={afterHide}>
      <View
        style={[
          styles.modalView,
          title?.length! > 0 && {paddingHorizontal: HDP(24)},
          modalStyle,
        ]}>
        <View style={styles.modalBar} />
        <SizedBox height={24} />
        <View>{content}</View>
        <SizedBox height={24} />
      </View>
    </Modal>
  );
};
