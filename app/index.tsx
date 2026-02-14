import Deck from '@/components/Deck';
import FloatingButton from '@/components/FloatingButton';
import { theme } from '@/styles/theme';
import { ScrollView, View, StyleSheet } from 'react-native';
import{ decksExampleData } from '@/data/MockData';

const decks = decksExampleData;

export default function mainScreen() {
	return (
		<View
			style={[
				styles.container,
				{ backgroundColor: theme.colors.background },
			]}>
			<ScrollView
				contentContainerStyle={styles.scrollContainer}
				showsVerticalScrollIndicator={false}>
				<Deck
					label= {decks[0].title}
					cardsDue={decks[0].cardsDue}
				/>
				<Deck
					label= {decks[1].title}
					cardsDue={decks[1].cardsDue}
					backgroundColor={theme.colors.pink}
				/>
				<Deck
					label= {decks[2].title}
					cardsDue={decks[2].cardsDue}
					backgroundColor={theme.colors.lightblue}
				/>
				<Deck
					label= {decks[3].title}
					cardsDue={decks[3].cardsDue}
					backgroundColor={theme.colors.green}
				/>
				<Deck
					label= {decks[4].title}
					cardsDue={decks[4].cardsDue}
					backgroundColor={theme.colors.green}
				/>
				<Deck
					label= {decks[0].title}
					cardsDue={decks[0].cardsDue}
					backgroundColor={theme.colors.green}
				/>
				<Deck
					label= {decks[1].title}
					cardsDue={decks[1].cardsDue}
					backgroundColor={theme.colors.green}
				/>
			</ScrollView>
			<FloatingButton></FloatingButton>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		width: '100%',
		flex: 1,
		flexDirection: 'column',
		alignItems: 'center',
	},
	scrollContainer: {
		width: '90%',
		paddingBottom: 20,
	},
})
