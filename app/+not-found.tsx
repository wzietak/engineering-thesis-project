import { useAppTheme } from "@/contexts/ColorThemeContext";
import { AppTheme } from "@/styles/theme";
import { router, Stack } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

export default function NotFoundScreen() {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  return (
    <>
      <Stack.Screen options={{ title: "Oops! Not Found" }} />
      <View style={styles.container}>
        <Image
          source={require("@/assets/images/potato.png")}
          style={{ height: 150, width: 150 }}
        ></Image>
        <Text style={[styles.text, { paddingTop: 20, paddingBottom: 10 }]}>
          Sorry!
        </Text>
        <Text style={[styles.text, { fontSize: theme.fontSize.md }]}>
          There is nothing here but a potato.
        </Text>
        <Pressable onPress={router.back}>
          <Text style={styles.goBackText}>Go back</Text>
        </Pressable>
      </View>
    </>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 20,
      flex: 1,
      backgroundColor: theme.colors.background,
      alignItems: "center",
      justifyContent: "center",
    },
    text: {
      paddingBottom: 50,
      fontSize: theme.fontSize.lg,
      fontFamily: theme.fontFamily.bold,
      textAlign: "center",
    },
    button: {
      fontFamily: theme.fontFamily.bold,
      fontSize: theme.fontSize.lg,
      color: theme.colors.purple,
    },
    goBackText: {
      fontSize: theme.fontSize.md,
      fontFamily: theme.fontFamily.regular,
      color: theme.colors.purple,
    },
  });
