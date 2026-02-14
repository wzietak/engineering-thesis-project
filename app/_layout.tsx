import AppHeader from '@/components/AppHeader';
import { theme } from '@/styles/theme';
import { Stack } from 'expo-router';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RootLayout() {
	return (
		<SafeAreaView style={styles.headerContainer}>
			<AppHeader title='BetterAnki'></AppHeader>

			<Stack screenOptions={{headerShown: false}}>
				<Stack.Screen name='index' />
			</Stack>

		</SafeAreaView>

	);
}


const styles = StyleSheet.create({
	headerContainer:{
		flex: 1, 
		backgroundColor: theme.colors.background
	}
})
