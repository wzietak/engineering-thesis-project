import { globalStyles } from "@/styles/globalStyles";
import { Pressable, ViewStyle } from "react-native";
import Feather from '@expo/vector-icons/Feather';
import { theme } from "@/styles/theme";

type Props = {
    style?: ViewStyle;
}

export default function FloatingButton({style} : Props) {
	return (
		<Pressable style={[globalStyles.floatingButtonContainer, style]}>
			<Feather name="plus" size={50} color={'#fff'}/>
		</Pressable>
	);
}
