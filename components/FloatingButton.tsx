import { useFadeAnimation } from '@/hooks/useFadeAnimation';
import { theme } from '@/styles/theme';
import Feather from '@expo/vector-icons/Feather';
import { Link,} from 'expo-router';
import { useEffect } from 'react';
import { Animated, Pressable, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
	variant?: string;
	visible: boolean;
	onPress?: () => void;
};

export default function FloatingButton({ variant, visible, onPress }: Props) {
	const insets = useSafeAreaInsets();
	const { opacity, fadeIn, fadeOut } = useFadeAnimation();

	const interpolationValues = opacity.interpolate({
		inputRange: [0, 1],
		outputRange: [10, 0],
	});

	useEffect(() => {
		if (visible) {
			fadeIn();
		} else {
			fadeOut();
		}
	}, [visible]);

	if (variant == 'AddNewCard') {
		return (
			<Animated.View
				style={[
					styles.addNewButton,
					{
						bottom: insets.bottom + 40,
						opacity: opacity,
						paddingHorizontal: 20,
						transform: [{ translateX: interpolationValues }],
					},
				]}
				pointerEvents={visible ? 'auto' : 'none'}>
				<Link href={'/add-new-card'} asChild>
					<Pressable>
						<Text style={[styles.addNewText, { width: 'auto' }]}>
							Add new card
						</Text>
					</Pressable>
				</Link>
			</Animated.View>
		);
	} else if (variant == 'AddNewDeck') {
		return (
			<Animated.View
				style={[
					styles.addNewDeck,
					{
						bottom: insets.bottom + 125,
						opacity: opacity,
						transform: [{ translateY: interpolationValues }],
					},
				]}
				pointerEvents={visible ? 'auto' : 'none'}>
					<Link href={'/add-new-deck'} asChild>
				<Pressable>
					<Text style={[styles.addNewText, { color: theme.colors.background }]}>
						Create new deck
					</Text>
				</Pressable></Link>
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
		fontFamily: theme.fontFamily.bold,
		fontSize: theme.fontSize.md + 1,
		justifyContent: 'center',
		wordWrap: 'wrap',
		alignSelf: 'center',
		letterSpacing: 0.3,
	},
});
