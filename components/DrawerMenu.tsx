import { AuthContext } from "@/contexts/AuthContext";
import { theme } from "@/styles/theme";
import { supabase } from "@/utils/supabase";
import Octicons from "@expo/vector-icons/Octicons";
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem,
} from "@react-navigation/drawer";
import { router } from "expo-router";
import { useContext } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import {
  useSafeAreaInsets
} from "react-native-safe-area-context";

export default function DrawerMenu(props: DrawerContentComponentProps) {
  const session = useContext(AuthContext);
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{ flex: 1, marginBottom: insets.bottom, marginTop: insets.top }}
    >
      <DrawerContentScrollView {...props}>
        <View style={styles.emptyView}>
          <Octicons name="person" size={30} color="black" />
          <View style={styles.userDetailsTextBox}>
            <Text style={{ fontFamily: theme.fontFamily.bold, lineHeight: 15 }}>
              User
            </Text>
            <Text
              style={styles.userNameText}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {session?.currentSession?.user.email}
            </Text>
          </View>
        </View>
        <View style={styles.separator}></View>
        <DrawerItem
          label={"Decks"}
          onPress={() => router.push("/")}
          icon={({ size }) => (
            <Octicons name="rows" size={size} color={theme.colors.primary} />
          )}
          labelStyle={styles.labelText}
          focused={
            props.state.routes[props.state.index].name == "index" ? true : false
          }
          activeTintColor={theme.colors.blue}
          inactiveTintColor={theme.colors.primary}
        ></DrawerItem>
        <DrawerItem
          label={"Browse cards"}
          onPress={() => router.push("/browse-cards")}
          icon={({ size }) => (
            <Octicons
              name="versions"
              size={size}
              color={theme.colors.primary}
            />
          )}
          labelStyle={styles.labelText}
          focused={
            props.state.routes[props.state.index].name == "browse-cards"
              ? true
              : false
          }
          activeTintColor={theme.colors.blue}
          inactiveTintColor={theme.colors.primary}
        ></DrawerItem>
        <DrawerItem
          label={"Settings"}
          onPress={() => router.push("/general-settings")}
          icon={({ size }) => (
            <Octicons name="gear" size={size} color={theme.colors.primary} />
          )}
          labelStyle={styles.labelText}
          focused={
            props.state.routes[props.state.index].name == "general-settings"
              ? true
              : false
          }
          activeTintColor={theme.colors.blue}
          inactiveTintColor={theme.colors.primary}
        ></DrawerItem>
      </DrawerContentScrollView>
      <View style={styles.emptyViewBottom}>
        <Pressable
          style={styles.logOutPressable}
          onPress={() => {
            async function signOut() {
              const { error } = await supabase.auth.signOut();
            }
            signOut();
          }}
        >
          <Octicons name="sign-out" size={24} color={theme.colors.primary} />
          <Text style={styles.labelText}>Sign out</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  emptyView: {
    marginBottom: 20,
    marginLeft: 15,
    paddingRight: 15,
    height: 120,
    width: "100%",
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
  },
  separator: {
    marginBottom: 10,
    marginLeft: 15,
    height: 1,
    width: "50%",
    backgroundColor: theme.colors.grey,
    borderRadius: theme.borderRadius.lg,
  },
  labelText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.primary,
    fontFamily: theme.fontFamily.bold,
  },
  userNameText: {
    fontSize: theme.fontSize.x_sm - 2,
    color: theme.colors.primary,
    fontFamily: theme.fontFamily.regular,
    flexShrink: 1,
  },
  emptyViewBottom: {
    marginLeft: 25,
    paddingBottom: 20,
  },
  logOutPressable: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  userDetailsTextBox: {
    flex: 1,
    flexDirection: "column",
  },
});
