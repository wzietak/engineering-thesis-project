import { theme } from '@/styles/theme';
import Octicons from '@expo/vector-icons/Octicons';
import {
	DrawerContentComponentProps,
	DrawerContentScrollView,
	DrawerItem,
} from '@react-navigation/drawer';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

export default function DrawerMenu(props: DrawerContentComponentProps) {
	return (
		<DrawerContentScrollView {...props}>
			<View style={styles.emptyView}></View>
			<View style={styles.separator}></View>
			<DrawerItem
				label={'Decks'}
				onPress={() => router.push('/')}
				icon={({ size }) => (
					<Octicons name='rows' size={size} color={theme.colors.primary} />
				)}
				labelStyle={styles.labelText}
				focused={
					props.state.routes[props.state.index].name == 'index' ? true : false
				}
				activeTintColor={theme.colors.blue}
				inactiveTintColor={theme.colors.primary}></DrawerItem>
			<DrawerItem
				label={'Browse cards'}
				onPress={() => router.push('/browse-cards')}
				icon={({ size }) => (
					<Octicons name='versions' size={size} color={theme.colors.primary} />
				)}
				labelStyle={styles.labelText}
				focused={
					props.state.routes[props.state.index].name == 'browse-cards'
						? true
						: false
				}
				activeTintColor={theme.colors.blue}
				inactiveTintColor={theme.colors.primary}></DrawerItem>
			<DrawerItem
				label={'Settings'}
				onPress={() => router.push('/general-settings')}
				icon={({ size }) => (
					<Octicons name='gear' size={size} color={theme.colors.primary} />
				)}
				labelStyle={styles.labelText}
				focused={
					props.state.routes[props.state.index].name == 'general-settings'
						? true
						: false
				}
				activeTintColor={theme.colors.blue}
				inactiveTintColor={theme.colors.primary}></DrawerItem>
		</DrawerContentScrollView>
	);
}

const styles = StyleSheet.create({
	emptyView: {
		marginBottom: 20,
		height: 120,
		width: '100%',
	},
	separator: {
        marginBottom: 10,
        marginLeft: 15,
		height: 1,
		width: '50%',
		backgroundColor: theme.colors.grey,
		borderRadius: theme.borderRadius.lg,
	},
	labelText: {
		fontSize: theme.fontSize.md,
		color: theme.colors.primary,
		fontFamily: theme.fontFamily.rubikBold,
	},
});
