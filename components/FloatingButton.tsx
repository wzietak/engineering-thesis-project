import { theme } from '@/styles/theme';
import Feather from '@expo/vector-icons/Feather';
import { Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
	onButtonClick?: () => void;
};

export default function FloatingButton() {
	const insets = useSafeAreaInsets();
	return (
		<Pressable style={[styles.floatingButton, { bottom: insets.bottom + 40 }]} onPressIn={null}>
			<Feather name='plus' size={45} color={'#fff'} />
		</Pressable>
	);
}

const styles = StyleSheet.create({
	floatingButton: {
		position: 'absolute',
		width: 70,
		height: 70,
		flex: 1,
		right: '5%',
		borderRadius: theme.borderRadius.md,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: theme.colors.primary,
		boxShadow: theme.boxShadow.buttons,
	},
});
