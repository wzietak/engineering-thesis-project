import Octicons from '@expo/vector-icons/Octicons';
import {
	DrawerContentComponentProps,
	DrawerContentScrollView,
	DrawerItem,
} from '@react-navigation/drawer';
import { router } from 'expo-router';

export default function DrawerMenu(props: DrawerContentComponentProps) {
	return (
		<DrawerContentScrollView {...props}>
			<DrawerItem
				label={'Decks'}
				onPress={() => router.push('/')}
				icon={({ size, color }) => (
					<Octicons name='rows' size={size} color={color} />
				)}></DrawerItem>
		</DrawerContentScrollView>
	);
}
