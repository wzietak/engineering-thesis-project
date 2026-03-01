import { theme } from '@/styles/theme';
import Feather from '@expo/vector-icons/Feather';
import { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
	variant?: String;
	visible: boolean;
	onPress?: () => void;
};

export default function FloatingButton({ variant, visible, onPress }: Props) {
	const insets = useSafeAreaInsets();
	const buttonOpacity = useRef(new Animated.Value(0)).current;

	const interpolationValues = buttonOpacity.interpolate({
		inputRange: [0, 1],
		outputRange: [10, 0],
	});

	const fadeIn = () => {
		Animated.timing(buttonOpacity, {
			toValue: 1,
			duration: 300,
			useNativeDriver: true,
		}).start();
	};

	const fadeOut = () => {
		Animated.timing(buttonOpacity, {
			toValue: 0,
			duration: 300,
			useNativeDriver: true,
		}).start();
	};

	useEffect(() => {
		if (visible) {
			fadeOut();
		} else {
			fadeIn();
		}
	}, [visible]);

	if (variant == 'AddNewCard') {
		return (
			<Animated.View
				style={[
					styles.addNewButton,
					{
						bottom: insets.bottom + 40,
						opacity: buttonOpacity,
						paddingHorizontal: 20,
						transform: [{ translateX: interpolationValues }],
					},
				]}
				pointerEvents={visible ? 'auto' : 'none'}>
				<Pressable>
					<Text style={[styles.addNewText, { width: 'auto' }]}>
						Add new card
					</Text>
				</Pressable>
			</Animated.View>
		);
	} else if (variant == 'AddNewDeck') {
		return (
			<Animated.View
				style={[
					styles.addNewDeck,
					{
						bottom: insets.bottom + 125,
						opacity: buttonOpacity,
						transform: [{ translateY: interpolationValues }],
					},
				]}
				pointerEvents={visible ? 'auto' : 'none'}>
				<Pressable>
					<Text style={[styles.addNewText, { color: theme.colors.background }]}>
						Create new deck
					</Text>
				</Pressable>
			</Animated.View>
		);
	}
	return (
		<Pressable
			style={({ pressed }) => [
				styles.floatingButton,
				{ bottom: insets.bottom + 40 },
				{
					backgroundColor: pressed
						? theme.colors.primary_light
						: theme.colors.primary,
				},
			]}
			onPressIn={onPress}>
			<Feather name='plus' size={45} color={'#fff'} />
		</Pressable>
	);
}

const styles = StyleSheet.create({
	floatingButton: {
		position: 'absolute',
		width: 70,
		height: 70,
		flex: 1,
		right: 20,
		borderRadius: theme.borderRadius.md,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: theme.colors.primary,
		boxShadow: theme.boxShadow.buttons,
	},
	addNewButton: {
		position: 'absolute',
		width: 140,
		height: 70,
		flex: 1,
		right: 108,
		borderRadius: theme.borderRadius.lg,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: theme.colors.background,
		boxShadow: theme.boxShadow.buttons,
	},
	addNewDeck: {
		position: 'absolute',
		width: 230,
		height: 50,
		flex: 1,
		right: 20,
		borderRadius: theme.borderRadius.lg,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: theme.colors.primary,
		boxShadow: theme.boxShadow.buttons,
	},
	addNewText: {
		fontWeight: 'bold',
		fontSize: theme.fontSize.md + 1,
		justifyContent: 'center',
		wordWrap: 'wrap',
		alignSelf: 'center',
		letterSpacing: 0.3,
	},
});
