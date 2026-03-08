import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {};

export default function AddNewCard() {
	const insets = useSafeAreaInsets();

	return (
		<View>
			<Text>Hello, Flashcard here</Text>
		</View>
	);
}
