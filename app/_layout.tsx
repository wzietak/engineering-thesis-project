import AppHeader from '@/components/AppHeader';
import { DrawerActions } from '@react-navigation/native';
import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

export default function RootLayout() {
	const [optionsVisible, setOptionsVisible] = useState(false);
	const router = useRouter();
	return (
		<View style={styles.mainContainer}>
			<Stack screenOptions={{ headerShown: false }}>
				<Stack.Screen name='(drawer)' />
				<Stack.Screen name='add-new-card' options={{ title: 'Add new card', presentation: 'modal', headerShown: true, header: (props) => {
										return (
											<AppHeader
												title={String(props.options.title)}
												showBack={true} showOptions={false}
												goBack={()=>{router.back()}}
												></AppHeader>
										);
									}}}></Stack.Screen>
			</Stack>
		</View>
	);
}

const styles = StyleSheet.create({
	mainContainer: {
		flex: 1,
	},
});
