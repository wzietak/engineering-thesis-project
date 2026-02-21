import { theme } from '@/styles/theme';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import {
	Modal,
	Pressable,
	StyleSheet,
	Switch,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';

type Props = {
	visible: boolean;
	hideOnOutline: () => void;
};

export default function MainOptions({ visible, hideOnOutline }: Props) {
	if (!visible) {
		return null;
	}
	return (
		<Modal
			transparent={true}
			animationType='fade'
			navigationBarTranslucent={true}
			statusBarTranslucent={true}>
			<TouchableOpacity
				style={styles.touchable}
				activeOpacity={1}
				onPress={() => hideOnOutline()}>
				<View
					style={styles.mainOptionsComponent}
					onStartShouldSetResponder={() => true}>
					<View style={styles.mainOptionsContainer}>
						<Pressable style={styles.menuOptionToggle}>
							<Text style={styles.menuOptionText}>Toggle theme</Text>
							<Switch
								thumbColor={theme.colors.blue}
								trackColor={{ false: theme.colors.grey, true: 'red' }}></Switch>
						</Pressable>
						<Pressable style={styles.menuOption}>
							<MaterialCommunityIcons
								style={styles.menuIcon}
								name='import'
								size={24}
								color='black'
							/>
							<Text style={styles.menuOptionText}>Import</Text>
						</Pressable>
						<Pressable style={styles.menuOption}>
							<MaterialCommunityIcons
								style={styles.menuIcon}
								name='export-variant'
								size={24}
								color='black'
							/>
							<Text style={styles.menuOptionText}>Export</Text>
						</Pressable>
					</View>
				</View>
			</TouchableOpacity>
		</Modal>
	);
}

const styles = StyleSheet.create({
	mainOptionsComponent: {
		width: 190,
		height: 130,
		position: 'absolute',
		right: '5%',
		top: 95,
		borderRadius: theme.borderRadius.sm,
		backgroundColor: theme.colors.background,
		boxShadow: theme.boxShadow.buttons,
	},
	touchable: {
		flex: 1,
	},
	mainOptionsContainer: {
		paddingHorizontal: 10,
		flex: 1,
		flexDirection: 'column',
	},
	menuOption: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
	},
	menuOptionToggle: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-evenly',
		alignItems: 'center',
	},
	menuOptionText: {
        paddingRight: 10,
		fontSize: theme.fontSize.sm,
		fontWeight: 'bold',
	},
	menuIcon: {
		paddingRight: 5,
	},
});
