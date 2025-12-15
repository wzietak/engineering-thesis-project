import { StyleSheet } from 'react-native';
import { theme } from './theme';

export const globalStyles = StyleSheet.create({
	screen: {
		backgroundColor: theme.colors.background,
	},
	container: {
		flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 50,
	},
	deckContainer: {
		flex: 1,
		padding: 10,
		paddingLeft: 15,
		borderRadius: 12,
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	deckText: {
		color: 'black',
		fontSize: 23,
		fontWeight: 'bold',
	},
	deckTextCardsDue: {
		color: 'black',
		fontSize: 18,
		fontWeight: 'bold',
		alignSelf: 'flex-end',
	},
	scrollContainer: {
		marginTop: 30,
		alignItems: 'center',
		paddingVertical: 20,
	},
	floatingButtonContainer: {
		position: 'absolute',
		right: 22,
		bottom: 82,
		padding: 10,
		width: 75,
		height: 75,
		backgroundColor: theme.colors.primary,
		borderRadius: 18,
		justifyContent: 'center',
		alignItems: 'center',
		elevation: 10,
	},
});
