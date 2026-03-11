import { theme } from '@/styles/theme';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {};

export default function addNewDeck() {
	const insets = useSafeAreaInsets();
	const [open, setOpen] = useState(false);
	const [value, setValue] = useState(null);
	const [items, setItems] = useState([
		{ label: 'Apple', value: 'apple' },
		{ label: 'Banana', value: 'banana' },
	]);

	return (
		<View style={[styles.container, { paddingBottom: insets.bottom }]}>
			<Text style={[styles.formText, { paddingTop: 0 }]}>Deck name</Text>
			<TextInput style={styles.textInput} />
			<Text style={styles.formText}>Deck language</Text>
			<DropDownPicker
				open={open}
				value={value}
				items={items}
				setOpen={setOpen}
				setValue={setValue}
				setItems={setItems}
				multiple={true}
				style={[styles.dropdown, { marginBottom: 30 }]}
			/>
			<Pressable
				style={[styles.buttonPressable, { bottom: insets.bottom + 40 }]}>
				<Text style={styles.buttonText}>Save</Text>
			</Pressable>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		width: '100%',
		paddingHorizontal: 20,
		flex: 1,
		flexDirection: 'column',
		alignItems: 'center',
		backgroundColor: theme.colors.background,
	},
	formText: {
		paddingTop: 10,
		fontFamily: theme.fontFamily.bold,
		fontSize: theme.fontSize.sm,
        alignSelf: 'flex-start',
	},
	dropdown: {
		height: 45,
		borderWidth: 1,
		borderRadius: theme.borderRadius.sm,
		borderColor: theme.colors.primary,
	},
	textInput: {
		paddingHorizontal: 10,
		minHeight: 45,
		width: '100%',
		borderWidth: 1,
		borderRadius: theme.borderRadius.sm,
		borderColor: theme.colors.primary,
		color: theme.colors.primary,
		fontFamily: theme.fontFamily.regular,
	},
	buttonPressable: {
		position: 'absolute',
		height: 60,
		width: '100%',
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: theme.borderRadius.lg,
		boxShadow: theme.boxShadow.buttons,
		backgroundColor: theme.colors.primary,
	},
	buttonText: {
		alignSelf: 'center',
		color: theme.colors.background,
		fontFamily: theme.fontFamily.bold,
		fontSize: theme.fontSize.lg,
	},
});
