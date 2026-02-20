import AppHeader from '@/components/AppHeader';
import MainOptions from '@/components/MainOptions';
import { Stack } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

export default function RootLayout() {
	const [optionsVisible, setOptionsVisible] = useState(false);
	return (
		<View style={styles.mainContainer}>
			<Stack
				screenOptions={{
					header: (props) => {
						return (
							<AppHeader
								title={String(props.options.title)}
								goBack={props.navigation.goBack} openOptions={() => setOptionsVisible(!optionsVisible)}
							/>
						);
					},
				}}>
				<Stack.Screen name='index' options={{ title: 'BetterAnki' }} />
			</Stack>
			<MainOptions visible={optionsVisible} hideOnOutline={()=>setOptionsVisible(false)}></MainOptions>
		</View>
	);
}

const styles = StyleSheet.create({
	mainContainer: {
		flex: 1,
	},
});
