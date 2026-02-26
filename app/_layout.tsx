import MainOptions from '@/components/MainOptions';
import { Stack } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

export default function RootLayout() {
	const [optionsVisible, setOptionsVisible] = useState(false);
	return (
		<View style={styles.mainContainer}>
			<Stack screenOptions={{ headerShown: false }}>
				<Stack.Screen name='index' options={{ title: 'BetterAnki' }} />
			</Stack>
		</View>
	);
}

const styles = StyleSheet.create({
	mainContainer: {
		flex: 1,
	},
});
