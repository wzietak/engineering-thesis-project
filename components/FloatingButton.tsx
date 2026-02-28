import { theme } from '@/styles/theme';
import Feather from '@expo/vector-icons/Feather';
import { Pressable, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
	onButtonClick?: () => void;
	variant?: String;
	visible: boolean;
};

export default function FloatingButton({ variant, visible }: Props) {
	const insets = useSafeAreaInsets();
	if (!visible) {
		return null;
	}
	if (variant == 'AddNewCard') {
		return (
			<Pressable style={[styles.addNewButton, { bottom: insets.bottom + 40 }]}>
				<Text style={[styles.addNewText, { width: 83 }]}>Add new card</Text>
			</Pressable>
		);
	} else if (variant == 'AddNewDeck') {
		return (
			<Pressable style={[styles.addNewDeck, { bottom: insets.bottom + 125 }]}>
				<Text style={[styles.addNewText, { color: theme.colors.background }]}>
					Create new deck
				</Text>
			</Pressable>
		);
	}
	return (
		<Pressable
			style={({ pressed }) => [
				styles.floatingButton,
				{ bottom: insets.bottom + 40 },
				{
					backgroundColor: pressed
						? theme.colors.primary_light
						: theme.colors.primary,
				},
			]}
			onPressIn={null}>
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
		right: 20,
		borderRadius: theme.borderRadius.md,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: theme.colors.primary,
		boxShadow: theme.boxShadow.buttons,
	},
	addNewButton: {
		position: 'absolute',
		width: 140,
		height: 70,
		flex: 1,
		right: 108,
		borderRadius: theme.borderRadius.lg,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: theme.colors.background,
		boxShadow: theme.boxShadow.buttons,
	},
	addNewDeck: {
		position: 'absolute',
		width: 230,
		height: 50,
		flex: 1,
		right: 20,
		borderRadius: theme.borderRadius.lg,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: theme.colors.primary,
		boxShadow: theme.boxShadow.buttons,
	},
	addNewText: {
		fontWeight: 'bold',
		fontSize: theme.fontSize.md + 1,
		justifyContent: 'center',
		wordWrap: 'wrap',
		alignSelf: 'center',
		letterSpacing: 0.3,
	},
});
