import Deck from '@/components/Deck';
import FloatingButton from '@/components/FloatingButton';
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
			<ScrollView contentContainerStyle={globalStyles.scrollContainer} showsVerticalScrollIndicator={false}>
				<Deck
					label='Przycisk 1'
					style={{
						width: '100%',
						height: 120,
						marginVertical: 10,
					}}
					cardsDue={3}
				/>
				<Deck
					label='Przycisk 2'
					style={{
						width: '100%',
						height: 120,
						marginVertical: 10,
					}}
					cardsDue={3}
					backgroundColor={theme.colors.pink}
				/>
				<Deck
					label='Przycisk 3'
					style={{
						width: '100%',
						height: 120,
						marginVertical: 10,
					}}
					cardsDue={3}
					backgroundColor={theme.colors.lightblue}
				/>
				<Deck
					label='Przycisk 3'
					style={{
						width: '100%',
						height: 120,
						marginVertical: 10,
					}}
					cardsDue={3}
					backgroundColor={theme.colors.green}
				/>
			</ScrollView>
            <FloatingButton style={globalStyles.floatingButtonContainer} ></FloatingButton>
		</View>

	);
}
