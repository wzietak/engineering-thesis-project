import { globalStyles } from '@/styles/globalStyles';
import { theme } from '@/styles/theme';
import { Pressable, Text, ViewStyle } from 'react-native';

type Props = {
	label: string;
    cardsDue: number;
	backgroundColor?: string;
	style?: ViewStyle;
};

export default function Deck({
	label, cardsDue,
	backgroundColor = theme.colors.blue,
	style,
}: Props) {
	return (
		<Pressable style={[globalStyles.deckContainer, { backgroundColor }, style]}>
			<Text style={globalStyles.deckText}>{label}</Text>
            <Text style={globalStyles.deckTextCardsDue}>{cardsDue} cards due</Text>
		</Pressable>
	);
}
