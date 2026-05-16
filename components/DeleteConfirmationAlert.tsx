import { useAppTheme } from "@/contexts/ColorThemeContext";
import { AppTheme } from "@/styles/theme";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  onClose: () => void;
  onDelete: () => void;
  onCancel: () => void;
};
export default function DeleteConfirmationAlert({
  onClose,
  onDelete,
  onCancel,
}: Props) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  return (
    <Modal animationType="fade" transparent={true}>
      <Pressable
        style={{ flex: 1, backgroundColor: theme.colors.overlay }}
        onPress={onClose}
      >
        <View style={styles.mainContainer}>
          <Text style={styles.mainText}>Delete deck?</Text>
          <Text
            style={[
              styles.mainText,
              {
                fontFamily: theme.fontFamily.regular,
                fontSize: theme.fontSize.x_sm,
              },
            ]}
          >
            This deck and all its flaschards will be permanently deleted.
          </Text>
          <View style={styles.buttonsContainer}>
            <Pressable style={[styles.button]} onPress={onCancel}>
              <Text style={styles.buttonText}>Cancel</Text>
            </Pressable>
            <Pressable
              style={[styles.button, { backgroundColor: theme.colors.red }]}
              onPress={onDelete}
            >
              <Text style={styles.buttonText}>Delete</Text>
            </Pressable>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    mainContainer: {
      width: 280,
      height: 160,
      top: "35%",
      padding: 10,
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.background,
      alignSelf: "center",
      alignItems: "center",
      justifyContent: "center",
    },
    buttonsContainer: {
      width: "100%",
      paddingTop: 20,
      flexDirection: "row",
      justifyContent: "space-around",
    },
    button: {
      width: 120,
      height: 40,
      borderRadius: theme.borderRadius.lg,
      backgroundColor: theme.colors.primary,
      alignItems: "center",
      justifyContent: "center",
    },
    buttonText: {
      fontSize: theme.fontSize.x_sm,
      fontFamily: theme.fontFamily.bold,
      color: theme.colors.background,
    },
    mainText: {
      fontSize: theme.fontSize.sm,
      fontFamily: theme.fontFamily.bold,
      color: theme.colors.primary,
      textAlign: "center",
    },
  });
