import { theme } from '@/styles/theme';
import Feather from '@expo/vector-icons/Feather';
import { Pressable, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = {
	title: string;
	showBack?: boolean;
	goBack?: () => void;
	openDrawer?: () => void;
	openOptions?: () => void;
};

export default function AppHeader({
	title = 'BetterAnki',
	showBack = false,
	goBack,
	openDrawer,
	openOptions,
}: Props) {
	return (
		<SafeAreaView edges={['top']} style={styles.headerContainer}>
			<Pressable onPress={showBack ? goBack : openDrawer}>
				<Feather
					name={showBack ? 'arrow-left' : 'menu'}
					size={36}
					color={theme.colors.primary}
				/>
			</Pressable>

			<Text style={styles.headerText}>{title}</Text>

			<Pressable onPress={openOptions}>
				<Feather name='more-vertical' size={36} color={theme.colors.primary} />
			</Pressable>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	headerContainer: {
		width: '100%',
		height: 100,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 20,
		backgroundColor: theme.colors.background,
	},
	headerText: {
		fontSize: 26,
		fontFamily: theme.fontFamily.bold,
	},
});
