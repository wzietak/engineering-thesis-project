import { theme } from '@/styles/theme';
import { Pressable, StyleSheet, View } from 'react-native';

type Props = {
	visible: boolean;
	onClose: () => void;
};

export default function MainOptions({ visible, onClose }: Props) {
    if(!visible){
        return null;
    }
	return (
		<View style={styles.mainOptionsComponent}>
			<View style={styles.mainOptionsContainer}>
				<Pressable></Pressable>
                <Pressable></Pressable>
                <Pressable></Pressable>
			</View>
		</View>
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
		backgroundColor: 'red',
	},
	mainOptionsContainer: {},
});
