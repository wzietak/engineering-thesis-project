import { theme } from '@/styles/theme';
import { Link, Stack } from 'expo-router';
import { View, StyleSheet, Text } from 'react-native';

export default function NotFoundScreen() {
	return (
		<>
			<Stack.Screen options={{ title: 'Oops! Not Found' }} />
			<View style={styles.container}>
        <Text style={styles.text}>Oops! Not Found</Text>
				<Link href={'/'} style={styles.button} replace>Go back to Home Screen</Link>
			</View>
		</>
	);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    paddingBottom: 20,
    fontSize: theme.fontSize.lg,
    fontWeight: 'bold',
  },
  button: {
    fontSize: theme.fontSize.md,
    color: theme.colors.primary,
    textDecorationLine: 'underline'
  }

})