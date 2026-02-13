import { theme } from '@/styles/theme';
import Feather from '@expo/vector-icons/Feather';
import { Pressable, Text, View } from 'react-native';

type Props = {
	title: string;
	showBack?: boolean;
	onBack?: () => void;
	onMenu?: () => void;
	onOptions?: () => void;
};

export default function AppHeader({
	title,
	showBack = false,
	onBack,
	onMenu,
	onOptions,
}: Props) {
	return (
		<View>
			<Pressable onPress={showBack ? onBack : onMenu}>
				<Feather
					name={showBack ? 'arrow-left' : 'menu'}
					size={24}
					color={theme.colors.primary}
				/>
			</Pressable>

			<Text>{title}</Text>

			<Pressable onPress={onOptions}>
				<Feather name='more-vertical' size={24} color={theme.colors.primary} />
			</Pressable>
		</View>
	);
}
