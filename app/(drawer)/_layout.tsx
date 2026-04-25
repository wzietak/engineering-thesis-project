import AppHeader from "@/components/AppHeader";
import DrawerMenu from "@/components/DrawerMenu";
import MainOptions from "@/components/MainOptions";
import { useAppTheme } from "@/contexts/ColorThemeContext";
import { DrawerActions } from "@react-navigation/native";
import Drawer from "expo-router/drawer";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

export default function RootLayout() {
  const [optionsVisible, setOptionsVisible] = useState(false);
  const { theme, preferredTheme } = useAppTheme();
  return (
    <View style={styles.mainContainer}>
      <Drawer
        drawerContent={DrawerMenu}
        screenOptions={{
          header: (props) => {
            return (
              <AppHeader
                title={String(props.options.title)}
                showBack={false}
                openOptions={() => setOptionsVisible(!optionsVisible)}
                openDrawer={() =>
                  props.navigation.dispatch(DrawerActions.toggleDrawer())
                }
              ></AppHeader>
            );
          },
          drawerStyle: { backgroundColor: theme.colors.background },
        }}
      >
        <Drawer.Screen
          name="index"
          options={{
            title: "Decks",
          }}
        />
        <Drawer.Screen
          name="browse-cards"
          options={{
            title: "Browse cards",
          }}
        />
        <Drawer.Screen
          name="general-settings"
          options={{
            title: "Settings",
          }}
        />
      </Drawer>
      <MainOptions
        visible={optionsVisible}
        hideOnOutline={() => setOptionsVisible(false)}
      ></MainOptions>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
});
