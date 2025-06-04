import {HDP} from '@helpers';
import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  dialPadContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 12,
    marginBottom: HDP(0),
    marginTop: HDP(0),
    borderRadius: 50,
    borderColor: '#DADEFF',
    backgroundColor: '#F3F5FF',
    borderWidth: 0.5,
  },
  dialBox: {
    alignSelf: 'center',
    gap: 20,
  },
});

export default styles;
