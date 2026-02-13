import { Pressable, ViewStyle, StyleSheet } from "react-native";
import Feather from '@expo/vector-icons/Feather';
import { theme } from "@/styles/theme";

type Props = {
    style?: ViewStyle;
}

export default function FloatingButton({style} : Props) {
	return (
		<Pressable style={styles.floatingButton}>
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
		bottom: '8%',
		borderRadius: 18,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: theme.colors.primary,

	}

})
