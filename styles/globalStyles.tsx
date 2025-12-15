import { StyleSheet } from 'react-native';
import { theme } from './theme';

export const globalStyles = StyleSheet.create({
	screen: {
		backgroundColor: theme.colors.background,
	},
	container: {
		flex: 1,
	},
	deckContainer: {
		borderRadius: 12,
        padding: 10,
        paddingLeft: 15,
	},
	deckText: {
		color: 'black',
		fontSize: 23,
		fontWeight: 'bold',
	},
	scrollContainer: {
        marginTop: 30,
		alignItems: 'center',
		paddingVertical: 20,
	},
});
