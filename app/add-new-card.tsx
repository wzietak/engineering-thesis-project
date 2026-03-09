import { theme } from '@/styles/theme';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {};

export default function AddNewCard() {
	const insets = useSafeAreaInsets();
	const [open, setOpen] = useState(false);
	const [value, setValue] = useState(null);
	const [items, setItems] = useState([
		{ label: 'Apple', value: 'apple' },
		{ label: 'Banana', value: 'banana' },
	]);

	return (
		<View style={styles.mainContainer}>
			<Text style={[styles.formText, { paddingTop: 0 }]}>Deck</Text>
			<DropDownPicker
				open={open}
				value={value}
				items={items}
				setOpen={setOpen}
				setValue={setValue}
				setItems={setItems}
				disabled={true}
				style={styles.dropdown}
			/>
			<Text style={styles.formText}>Card type</Text>
			<DropDownPicker
				open={open}
				value={value}
				items={items}
				setOpen={setOpen}
				setValue={setValue}
				setItems={setItems}
				style={styles.dropdown}
			/>

			<Text style={styles.formText}>Front</Text>
			<TextInput style={styles.textInput} />
			<Text style={styles.formText}>Back</Text>
			<TextInput style={styles.textInput} />
			<Text style={styles.formText}>Example of use</Text>
			<TextInput
				style={[styles.textInput, { borderColor: theme.colors.purple }]}
			/>
			<Pressable style={styles.genwithAIContent}>
				<SimpleLineIcons
					name='magic-wand'
					size={24}
					color={theme.colors.purple}
					style={{
						textShadowRadius: 30,
						textShadowColor: theme.colors.purple_alpha,
					}}
				/>
				<Text
					style={[
						styles.formText,
						{
							paddingHorizontal: 10,
							color: theme.colors.purple,
							textShadowRadius: 30,
							textShadowColor: theme.colors.purple_alpha,
						},
					]}>
					{' Generate with AI '}
				</Text>
			</Pressable>
			<Text style={[styles.formText, { paddingTop: 0 }]}>Tags</Text>
			<DropDownPicker
				open={open}
				value={value}
				items={items}
				setOpen={setOpen}
				setValue={setValue}
				setItems={setItems}
				multiple={true}
				style={styles.dropdown}
			/>
			<Pressable style={styles.buttonContainer}>
				<Text>Save</Text>
			</Pressable>
		</View>
	);
}

const styles = StyleSheet.create({
	mainContainer: {
		paddingBottom: 10,
		paddingHorizontal: 20,
		flex: 1,
		flexDirection: 'column',
		backgroundColor: theme.colors.background,
		justifyContent: 'flex-start',
	},
	formText: {
		paddingTop: 10,
		fontFamily: theme.fontFamily.bold,
		fontSize: theme.fontSize.sm,
	},
	dropdown: {
		height: 45,
		borderWidth: 1,
		borderRadius: theme.borderRadius.sm,
		borderColor: theme.colors.primary,
	},
	textInput: {
		minHeight: 45,
		borderWidth: 1,
		borderRadius: theme.borderRadius.sm,
		borderColor: theme.colors.primary,
		color: theme.colors.primary,
		fontFamily: theme.fontFamily.regular,
	},
	genwithAIContent: {
		maxHeight: 45,
		paddingTop: 5,
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	},
	buttonContainer: {
		paddingTop: 30,
		height: 48,
		borderRadius: theme.borderRadius.md,
		boxShadow: theme.boxShadow.buttons,
		backgroundColor: theme.colors.primary,
		color: theme.colors.background,

	}
});
