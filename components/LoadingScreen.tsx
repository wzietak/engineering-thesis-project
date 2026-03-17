import { theme } from "@/styles/theme";
import { ActivityIndicator } from "react-native";

export default function LoadingScreen() {
  return (
    <ActivityIndicator
      style={{
        flex: 1,
        paddingBottom: 120,
        backgroundColor: theme.colors.background,
      }}
      size={45}
      color={theme.colors.blue}
    ></ActivityIndicator>
  );
}
