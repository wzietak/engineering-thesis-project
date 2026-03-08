import { theme } from '@/styles/theme';
import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native';

type Props = {
	label: string;
	cardsDue: number;
	backgroundColor?: string;
	style?: ViewStyle;
};

export default function Deck({
	label,
	cardsDue,
	backgroundColor = theme.colors.blue,
	style,
}: Props) {
	return (
		<Pressable style={[styles.deckContainer, { backgroundColor }, style]}>
			<Text style={styles.deckNameText}>{label}</Text>
			<Text style={styles.deckTextCardsDue}>{cardsDue} cards due</Text>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	deckContainer: {
		marginVertical: 5,
		padding: 13,
		width: '100%',
		flex: 1,
		minHeight: 120,
		maxHeight: 140,
		borderRadius: theme.borderRadius.sm,
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	deckNameText: {
		paddingLeft: 2,
		color: 'black',
		fontSize: theme.fontSize.lg,
		fontFamily: theme.fontFamily.bold,
	},
	deckTextCardsDue: {
		color: 'black',
		fontSize: theme.fontSize.sm,
		fontFamily: theme.fontFamily.bold,
		alignSelf: 'flex-end',
	},
});
