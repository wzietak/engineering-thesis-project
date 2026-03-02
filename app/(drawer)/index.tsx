import Deck from '@/components/Deck';
import FloatingButton from '@/components/FloatingButton';
import Overlay from '@/components/Overlay';
import { decksExampleData } from '@/data/MockData';
import { theme } from '@/styles/theme';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const decks = decksExampleData;

export default function mainScreen() {
	const insets = useSafeAreaInsets();
	const [buttonVisible, setButtonVisible] = useState(false);
	return (
		<View
			style={[
				styles.container,
				{
					backgroundColor: theme.colors.background,
					paddingBottom: insets.bottom,
				},
			]}>
			<ScrollView
				contentContainerStyle={styles.scrollContainer}
				showsVerticalScrollIndicator={false}>
				<Deck label={decks[0].title} cardsDue={decks[0].cardsDue} />
				<Deck
					label={decks[1].title}
					cardsDue={decks[1].cardsDue}
					backgroundColor={theme.colors.pink}
				/>
				<Deck
					label={decks[2].title}
					cardsDue={decks[2].cardsDue}
					backgroundColor={theme.colors.lightblue}
				/>
				<Deck
					label={decks[3].title}
					cardsDue={decks[3].cardsDue}
					backgroundColor={theme.colors.green}
				/>
				<Deck
					label={decks[4].title}
					cardsDue={decks[4].cardsDue}
					backgroundColor={theme.colors.green}
				/>
				<Deck
					label={decks[0].title}
					cardsDue={decks[0].cardsDue}
					backgroundColor={theme.colors.green}
				/>
				<Deck
					label={decks[1].title}
					cardsDue={decks[1].cardsDue}
					backgroundColor={theme.colors.green}
				/>
			</ScrollView>
			<Overlay
				visible={buttonVisible}
				onPress={() => setButtonVisible(false)}></Overlay>

			<FloatingButton
				visible={buttonVisible}
				variant={'AddNewDeck'}></FloatingButton>
			<FloatingButton
				visible={buttonVisible}
				variant={'AddNewCard'}></FloatingButton>
			<FloatingButton
				visible={true}
				onPress={() => setButtonVisible(!buttonVisible)}></FloatingButton>
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
		paddingHorizontal: 20,
		paddingBottom: 10,
	},
});
