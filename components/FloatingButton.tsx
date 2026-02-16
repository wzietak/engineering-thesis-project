import { Pressable, ViewStyle, StyleSheet } from "react-native";
import Feather from '@expo/vector-icons/Feather';
import { theme } from "@/styles/theme";
import { SafeAreaInsetsContext, useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
    onButtonClick?: () => void;
}

export default function FloatingButton() {
	const insets = useSafeAreaInsets();
	return (
		<Pressable style={[styles.floatingButton, {bottom: insets.bottom+40}]}>
			<Feather name="plus" 
			size={45} color={'#fff'}/>
		</Pressable>
	);
}


const styles = StyleSheet.create({
	floatingButton:{
		position: 'absolute',
		width: 70,
		height: 70,
		flex: 1,
		right: 20,
		borderRadius: theme.borderRadius.md,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: theme.colors.primary,
	}

})
