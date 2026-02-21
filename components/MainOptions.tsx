import { theme } from '@/styles/theme';
import {
	Modal,
	Pressable,
	StyleSheet,
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
		<Modal transparent={true} animationType='fade'>
			<TouchableOpacity
				style={styles.touchable}
				activeOpacity={1}
				onPress={() => hideOnOutline()}>
				<View
					style={styles.mainOptionsComponent}
					onStartShouldSetResponder={() => true}>
					<View style={styles.mainOptionsContainer}>
						<Pressable></Pressable>
						<Pressable></Pressable>
						<Pressable></Pressable>
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
	mainOptionsContainer: {},
	touchable: {
		flex: 1,
	},
});
