import AppHeader from "@/components/AppHeader";
import DrawerMenu from "@/components/DrawerMenu";
import MainOptions from "@/components/MainOptions";

import { AuthContext } from "@/contexts/AuthContext";
import { useAppTheme } from "@/contexts/ColorThemeContext";
import { importDeck } from "@/services/importService";
import { DrawerActions } from "@react-navigation/native";
import Drawer from "expo-router/drawer";
import { useContext, useState } from "react";
import {
  DeviceEventEmitter,
  StyleSheet,
  ToastAndroid,
  View,
} from "react-native";

export default function RootLayout() {
  const [optionsVisible, setOptionsVisible] = useState(false);
  const { theme, preferredTheme } = useAppTheme();
  const session = useContext(AuthContext);
  const userId = session?.currentSession?.user.id;

  if (!userId) return;

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
        onImportPress={async () => {
          const result = await importDeck(userId);
          setOptionsVisible(false);
          if (result?.success === true) {
            DeviceEventEmitter.emit("import_completed");
            ToastAndroid.show(
              "Deck imported successfully!",
              ToastAndroid.SHORT,
            );
          }
        }}
      ></MainOptions>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
});
