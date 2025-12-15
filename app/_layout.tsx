import { Stack } from 'expo-router';


export default function RootLayout() {
	return (
		<Stack initialRouteName='main-screen'>
			<Stack.Screen name='main-screen' options={{headerShown: false}}/>
		</Stack>
	);
}
