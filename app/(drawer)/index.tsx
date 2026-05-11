import FloatingButton from "@/components/buttons/FloatingButton";
import DeckComponent from "@/components/Deck";
import DeckOptions from "@/components/DeckOptions";
import DeleteConfirmationAlert from "@/components/DeleteConfirmationAlert";
import LoadingScreen from "@/components/LoadingScreen";
import NoDecksView from "@/components/NoDecksView";
import Overlay from "@/components/Overlay";
import { AuthContext } from "@/contexts/AuthContext";
import { useAppTheme } from "@/contexts/ColorThemeContext";
import { DBContext } from "@/contexts/DBContext";
import { Deck } from "@/models/deck";
import { globalDeckRepository } from "@/repositories/globalDeckRepository";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useContext, useState } from "react";
import {
  Dimensions,
  FlatList,
  Platform,
  StyleSheet,
  ToastAndroid,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function mainScreen() {
  const { theme } = useAppTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const session = useContext(AuthContext);
  const DBconnection = useContext(DBContext);
  const [buttonVisible, setButtonVisible] = useState<boolean>(false);
  const [decks, setDecks] = useState<Deck[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [areDeckOptionsVisible, setDeckOptionsVisible] = useState(false);
  const [pressLocationY, setPressLocationY] = useState<number>();
  const [activeDeckId, setActiveDeckId] = useState<string | null>(null);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  const SCREEN_HEIGHT = Dimensions.get("window").height;
  const SAFE_MARGIN = 20;

  const userId = session?.currentSession?.user.id as string;

  useFocusEffect(
    useCallback(() => {
      if (!DBconnection.isReady || !userId) {
        return;
      }
      setIsLoading(true);
      globalDeckRepository
        .getDecks(userId)
        .then((fetchedDecks) => {
          setDecks([...(fetchedDecks || [])]);
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          setIsLoading(false);
        });
      return () => setButtonVisible(false);
    }, [DBconnection.isReady, session?.currentSession?.user.id]),
  );

  const handleDelete = async () => {
    if (activeDeckId) {
      await globalDeckRepository.deleteDeck(activeDeckId as string, userId);
      setDecks((decks) => {
        const updatedDecks = decks.filter((deck) => {
          return deck.id !== activeDeckId;
        });
        return updatedDecks;
      });
      setIsDeleteModalVisible(false);
      if (Platform.OS === "android")
        ToastAndroid.show("Deck deleted successfully", ToastAndroid.SHORT);
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.background,
          paddingBottom: insets.bottom,
        },
      ]}
      key={decks.length}
    >
      {isLoading ? (
        <LoadingScreen></LoadingScreen>
      ) : decks.length === 0 ? (
        <NoDecksView></NoDecksView>
      ) : (
        <FlatList
          contentContainerStyle={styles.scrollContainer}
          data={decks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item, index }) => {
            const colorPalette = [
              theme.colors.blue,
              theme.colors.pink,
              theme.colors.lightblue,
              theme.colors.green,
              theme.colors.lightpurple,
            ];
            return (
              <DeckComponent
                label={item.name}
                cardsDue={0}
                backgroundColor={colorPalette[index % colorPalette.length]}
                onPress={() => {
                  router.push({
                    pathname: "/study-screen/[deckId]",
                    params: { deckId: item.id },
                  });
                }}
                onLongPress={(event) => {
                  setActiveDeckId(item.id);
                  setDeckOptionsVisible(true);
                  if (event.nativeEvent.pageY - 120 < 30) {
                    setPressLocationY(event.nativeEvent.pageY - 90);
                  } else if (
                    event.nativeEvent.pageY + 110 >
                    SCREEN_HEIGHT - SAFE_MARGIN
                  ) {
                    setPressLocationY(event.nativeEvent.pageY - 180);
                  } else {
                    setPressLocationY(event.nativeEvent.pageY - 120);
                  }
                }}
              ></DeckComponent>
            );
          }}
        ></FlatList>
      )}

      <Overlay
        visible={buttonVisible}
        onPress={() => setButtonVisible(false)}
      ></Overlay>

      <FloatingButton
        visible={buttonVisible}
        variant={"AddNewDeck"}
        onPress={() => {
          router.push("/add-new-deck");
        }}
      ></FloatingButton>
      <FloatingButton
        visible={buttonVisible}
        variant={"AddNewCard"}
        onPress={() => {
          router.push("/add-new-card");
        }}
      ></FloatingButton>
      <FloatingButton
        visible={true}
        onPress={() => setButtonVisible(!buttonVisible)}
      ></FloatingButton>

      <Overlay
        visible={areDeckOptionsVisible}
        onPress={() => setDeckOptionsVisible(false)}
      ></Overlay>

      <DeckOptions
        isVisible={areDeckOptionsVisible}
        positionTop={pressLocationY as number}
        onEditPress={() => {
          router.push({
            pathname: "/add-new-deck",
            params: { deckId: activeDeckId as string },
          });
          setActiveDeckId(null);
          setDeckOptionsVisible(false);
        }}
        onDeletePress={() => {
          setDeckOptionsVisible(false);
          setIsDeleteModalVisible(true);
        }}
      ></DeckOptions>
      {isDeleteModalVisible ? (
        <DeleteConfirmationAlert
          onCancel={() => setIsDeleteModalVisible(false)}
          onDelete={handleDelete}
          onClose={() => setIsDeleteModalVisible(false)}
        ></DeleteConfirmationAlert>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
    flexDirection: "column",
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
});
