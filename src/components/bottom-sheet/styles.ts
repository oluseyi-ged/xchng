import {HDP, RF} from '@helpers';
import {family, palette} from '@theme';
import {Dimensions, StyleSheet} from 'react-native';

const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  modalView: {
    backgroundColor: '#FAFAFF',
    borderRadius: HDP(25),
    position: 'absolute',
    width: width * 0.95,
    alignSelf: 'center',
    bottom: HDP(-0),
  },
  modalHeader: {
    fontSize: RF(20),
    fontFamily: family.Bold,
    color: palette.purple,
  },
  modalCTA: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
  },
  btn1: {
    color: palette.purple,
    fontSize: RF(14),
    fontFamily: family.Medium,
  },
  btn2: {
    color: palette.orange,
    fontSize: RF(14),
    fontFamily: family.Medium,
  },
  modalBar: {
    width: HDP(100),
    height: HDP(4),
    backgroundColor: '#05081A',
    borderRadius: HDP(50),
    alignSelf: 'center',
    marginTop: HDP(12),
  },
});

export default styles;
