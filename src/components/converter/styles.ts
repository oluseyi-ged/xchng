
import { Dimensions, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    extrasView: {
        borderLeftWidth: 0.7,
        borderColor: '#6E57C0',
        width: width * 0.85,
        alignSelf: 'flex-end',
    },
});

export default styles;
