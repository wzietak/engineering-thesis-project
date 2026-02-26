import { DrawerContentScrollView, DrawerItem, DrawerContentComponentProps } from '@react-navigation/drawer';
import { router } from 'expo-router';

export default function DrawerMenu(props: DrawerContentComponentProps) {
	return (
		<DrawerContentScrollView {...props}>
			<DrawerItem label={'Decks'} onPress={() => router.push('/+not-found')}></DrawerItem>
		</DrawerContentScrollView>
	);
};
