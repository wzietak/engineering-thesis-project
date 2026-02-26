import AppHeader from '@/components/AppHeader';
import DrawerMenu from '@/components/DrawerMenu';
import MainOptions from '@/components/MainOptions';
import Entypo from '@expo/vector-icons/Entypo';
import { DrawerActions } from '@react-navigation/native';
import Drawer from 'expo-router/drawer';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

export default function RootLayout() {
	const [optionsVisible, setOptionsVisible] = useState(false);

	return (
		<View style={styles.mainContainer}>
			<Drawer
				drawerContent={DrawerMenu}
				screenOptions={{
					header: (props) => {
						return (
							<AppHeader
								title={String(props.options.title)}
								showBack={false}
								openOptions={() => setOptionsVisible(!optionsVisible)}
								openDrawer={() =>
									props.navigation.dispatch(DrawerActions.toggleDrawer())
								}></AppHeader>
						);
					},
				}}>
				<Drawer.Screen
					name='index'
					options={{
						drawerLabel: 'Decks',
						title: 'Decks',
						drawerIcon: () => (
							<Entypo name='documents' size={24} color='black' />
						),
					}}
				/>
			</Drawer>
			<MainOptions
				visible={optionsVisible}
				hideOnOutline={() => setOptionsVisible(false)}></MainOptions>
		</View>
	);
}

const styles = StyleSheet.create({
	mainContainer: {
		flex: 1,
	},
});
