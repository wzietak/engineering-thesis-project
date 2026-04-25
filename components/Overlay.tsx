import { useAppTheme } from '@/contexts/ColorThemeContext';
import { useFadeAnimation } from '@/hooks/useFadeAnimation';
import { theme } from '@/styles/theme';
import { useEffect } from 'react';
import { Animated, Pressable, StyleSheet } from 'react-native';

type Props = {
	onPress: () => void;
	visible: boolean;
};

export default function Overlay({ visible, onPress }: Props) {
	const {theme} = useAppTheme();
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
				{ backgroundColor: theme.colors.background_alpha, opacity: opacity },
			]}
			pointerEvents={visible ? 'auto' : 'none'}>
			<Pressable style={{ flex: 1 }} onPress={onPress}></Pressable>
		</Animated.View>
	);
}
