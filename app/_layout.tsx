import AppHeader from "@/components/AppHeader";
import { Stack, useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";

export default function RootLayout() {
  const router = useRouter();

  //Extracted header into a constant to apply DRY principle - prevents duplicating the compoent on every Stack.Screen
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
          name="study"
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

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
});
