import Deck from '@/components/Deck';
import { globalStyles } from '@/styles/globalStyles';
import { theme } from '@/styles/theme';
import { ScrollView, View } from 'react-native';

export default function mainScreen() {
	return (
		<View
			style={[
				globalStyles.container,
				{ backgroundColor: theme.colors.background },
			]}>
			<ScrollView contentContainerStyle={globalStyles.scrollContainer}>
				<Deck
					label='Przycisk 1'
					style={{
						width: '88%',
						height: 120,
						marginVertical: 10,
					}}
					cardsDue={3}
				/>
				<Deck
					label='Przycisk 2'
					style={{
						width: '88%',
						height: 120,
						marginVertical: 10,
					}}
					cardsDue={3}
					backgroundColor={theme.colors.pink}
				/>
				<Deck
					label='Przycisk 3'
					style={{
						width: '88%',
						height: 120,
						marginVertical: 10,
					}}
					cardsDue={3}
					backgroundColor={theme.colors.lightblue}
				/>
				<Deck
					label='Przycisk 3'
					style={{
						width: '88%',
						height: 120,
						marginVertical: 10,
					}}
					cardsDue={3}
					backgroundColor={theme.colors.green}
				/>
			</ScrollView>
		</View>
	);
}
