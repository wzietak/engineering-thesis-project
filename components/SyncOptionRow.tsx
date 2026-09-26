import { useAppTheme } from "@/contexts/ColorThemeContext";
import { LAST_SYNC_KEY, syncData } from "@/services/syncService";
import { AppTheme } from "@/styles/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Platform, StyleSheet, Text, ToastAndroid, View } from "react-native";
import SyncPill from "./buttons/SyncPill";

type Props = {
  userId: string;
};

export default function SyncOptionRow({ userId }: Props) {
  const { theme, setPreferredTheme, preferredTheme } = useAppTheme();
  const styles = createStyles(theme);
  const [lastSyncDate, setLastSyncDate] = useState<string>("Never");
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  const loadLastSyncDate = useCallback(async () => {
    if (!userId) return;
    const asyncStorageKey = LAST_SYNC_KEY(userId);

    try {
      const lastSynced = await AsyncStorage.getItem(asyncStorageKey);

      if (lastSynced) {
        const formattedDate = new Date(lastSynced).toLocaleTimeString(
          ["en-GB"],
          {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          },
        );
        setLastSyncDate(formattedDate);
      }
    } catch (error: any) {
      console.log(error);
    }
  }, [userId]);

  useFocusEffect(
    useCallback(() => {
      loadLastSyncDate();
    }, [loadLastSyncDate]),
  );

  const handleManualSync = async () => {
    if (isSyncing) return;
    setIsSyncing(true);

    try {
      await syncData(userId);
      await loadLastSyncDate();
    } catch (error: any) {
      console.log(error);
      if (error?.message === "NO_NETWORK_CONNECTION") {
        if (Platform.OS === "android") {
          ToastAndroid.show("No network connection", ToastAndroid.SHORT);
        }
      }
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <View style={styles.mainContainer}>
      <Text style={styles.mainText}>Cloud sync</Text>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View
          style={{
            flexDirection: "column",
            justifyContent: "flex-end",
          }}
        >
          <Text style={styles.text}>Last synced at: </Text>
          <Text style={styles.text}>{lastSyncDate}</Text>
        </View>

        <SyncPill onPress={handleManualSync} isSyncing={isSyncing}></SyncPill>
      </View>
    </View>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    mainContainer: {
      paddingVertical: 5,
      paddingTop: 10,
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    mainText: {
      fontFamily: theme.fontFamily.bold,
      fontSize: theme.fontSize.sm,
      color: theme.colors.primary,
    },
    text: {
      fontFamily: theme.fontFamily.regular,
      fontSize: theme.fontSize.x_sm,
      color: theme.colors.primary,
    },
  });
