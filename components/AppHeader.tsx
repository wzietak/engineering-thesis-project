import { theme } from '@/styles/theme';
import Feather from '@expo/vector-icons/Feather';
import { Pressable, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = {
	title: string;
	showBack?: boolean;
	showOptions?: boolean;
	goBack?: () => void;
	openDrawer?: () => void;
	openOptions?: () => void;
};

export default function AppHeader({
	title = 'BetterAnki',
	showBack = false,
	showOptions = true,
	goBack,
	openDrawer,
	openOptions,
}: Props) {
	return (
		<SafeAreaView edges={['top']} style={[styles.headerContainer, {paddingLeft: showBack? 10 : 20}]}>
			<Pressable onPress={showBack ? goBack : openDrawer} hitSlop={showBack? 6 : 6}>
				<Feather
					name={showBack ? 'chevron-left' : 'menu'}
					size={showBack ? 42 : 36}
					color={theme.colors.primary}
				/>
			</Pressable>
			<Text style={styles.headerText}>{title}</Text>
			
				<Pressable onPress={showOptions? openOptions : null} hitSlop={10}>
					<Feather
						name='more-vertical'
						size={36}
						color={theme.colors.primary}
						style={{opacity: showOptions? 1:0}}
					/>
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
		fontSize: theme.fontSize.x_lg,
		fontFamily: theme.fontFamily.bold,
	},
});
