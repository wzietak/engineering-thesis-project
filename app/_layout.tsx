import AppHeader from "@/components/AppHeader";
import AuthProvider, { AuthContext } from "@/contexts/AuthContext";
import ColorThemeProvider from "@/contexts/ColorThemeContext";
import { DBContextProvider } from "@/contexts/DBContext";
import {
  SplashScreen,
  Stack,
  useRootNavigationState,
  useRouter,
  useSegments,
} from "expo-router";
import { useContext, useEffect } from "react";
import { Platform, StyleSheet, ToastAndroid, View } from "react-native";

SplashScreen.preventAutoHideAsync();

function ProtectionComponent() {
  const router = useRouter();
  const session = useContext(AuthContext);
  const currScreen = useSegments();
  const rootNavigationState = useRootNavigationState();

  //Extracted header into a constant to apply DRY principle - prevents duplicating the component on every Stack.Screen
  const headerStyle = {
    header: (props: any) => (
      <AppHeader
        title={String(props.options.title)}
        showBack={true}
        showOptions={false}
        goBack={() => {
          router.back();
        }}
      ></AppHeader>
    ),
  };

  useEffect(() => {
    if (!rootNavigationState?.key || !currScreen || !session?.isInitialized) {
      return;
    }
    const unprotectedScreens = ["login", "+not-found"];
    console.log(currScreen);
    if (
      !session.currentSession &&
      !unprotectedScreens.includes(currScreen[0])
    ) {
      router.replace("/login");
      if (Platform.OS === "android")
        ToastAndroid.show("You've been signed out.", ToastAndroid.SHORT);
    } else if (session.currentSession && currScreen[0] === "login") {
      router.replace("/(drawer)");
    }
  }, [session, currScreen, rootNavigationState?.key]);

  useEffect(() => {
    if (
      (session?.currentSession && currScreen[0] == "login") ||
      (session?.currentSession && currScreen[0] === "(drawer)")
    ) {
      SplashScreen.hide();
    }
  }, [session?.currentSession]);

  return (
    <View style={styles.mainContainer}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(drawer)" />
        <Stack.Screen
          name="add-new-card"
          options={{
            ...headerStyle,
            title: "Add new card",
            presentation: "modal",
            headerShown: true,
          }}
        ></Stack.Screen>
        <Stack.Screen
          name="add-new-deck"
          options={{
            ...headerStyle,
            title: "Create new deck",
            presentation: "modal",
            headerShown: true,
          }}
        ></Stack.Screen>
        <Stack.Screen
          name="study-screen/[deckId]"
          options={{
            ...headerStyle,
            title: "Study",
            presentation: "modal",
            headerShown: true,
          }}
        ></Stack.Screen>
      </Stack>
    </View>
  );
}

export default function RootLayout() {
  return (
    <ColorThemeProvider>
      <AuthProvider>
        <DBContextProvider>
          <ProtectionComponent></ProtectionComponent>
        </DBContextProvider>
      </AuthProvider>
    </ColorThemeProvider>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
});
