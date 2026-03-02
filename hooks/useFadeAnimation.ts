import { useRef } from "react";
import { Animated } from "react-native";


export const useFadeAnimation = (duration: number = 300) => {

    const opacity = useRef(new Animated.Value(0)).current;

    const fadeIn = () => {
            Animated.timing(opacity, {
                toValue: 1,
                duration: duration,
                useNativeDriver: true,
            }).start();
        };
    
        const fadeOut = () => {
            Animated.timing(opacity, {
                toValue: 0,
                duration: duration,
                useNativeDriver: true,
            }).start();
        };

    return {opacity, fadeIn, fadeOut};
}