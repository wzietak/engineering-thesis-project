import { theme } from '@/styles/theme';
import Feather from '@expo/vector-icons/Feather';
import { Pressable, Text, View, StyleSheet } from 'react-native';

type Props = {
	title: string;
	showBack?: boolean;
	onBack?: () => void;
	onMenu?: () => void;
	onOptions?: () => void;
};

export default function AppHeader({
	title,
	showBack = false,
	onBack,
	onMenu,
	onOptions,
}: Props) {
	return (
		<View style={styles.menuContainer}>
			<Pressable onPress={showBack ? onBack : onMenu}>
				<Feather
					name={showBack ? 'arrow-left' : 'menu'}
					size={36}
					color={theme.colors.primary}
				/>
			</Pressable>

			<Text style={styles.menuText}>{title}</Text>

			<Pressable onPress={onOptions}>
				<Feather name='more-vertical' size={36} color={theme.colors.primary} />
			</Pressable>
		</View>
	);
}

const styles = StyleSheet.create({
	menuContainer: {
		padding: 15,
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		maxHeight: '13%',
		backgroundColor: theme.colors.background,
	},
	menuText: {
		fontSize: 26,
		fontWeight: 'bold'
	}
})
