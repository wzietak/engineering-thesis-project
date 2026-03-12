import { useFadeAnimation } from '@/hooks/useFadeAnimation';
import { useEffect } from 'react';
import { Animated, Pressable, StyleSheet } from 'react-native';

type Props = {
	onPress: () => void;
	visible: boolean;
};

export default function Overlay({ visible, onPress }: Props) {
	const { opacity, fadeIn, fadeOut } = useFadeAnimation();

	useEffect(() => {
		if (visible) {
			fadeIn();
		} else {
			fadeOut();
		}
	}, [visible]);

	return (
		<Animated.View
			style={[
				StyleSheet.absoluteFill,
				{ backgroundColor: 'rgba(255, 255, 255, 0.2)', opacity: opacity },
			]}
			pointerEvents={visible ? 'auto' : 'none'}>
			<Pressable style={{ flex: 1 }} onPress={onPress}></Pressable>
		</Animated.View>
	);
}
