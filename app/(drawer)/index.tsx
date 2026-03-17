import FloatingButton from "@/components/buttons/FloatingButton";
import DeckComponent from "@/components/Deck";
import Overlay from "@/components/Overlay";
import { Deck } from "@/models/deck";
import { MockDeckRepository } from "@/repositories/MockDeckRepository";
import { theme } from "@/styles/theme";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function mainScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [buttonVisible, setButtonVisible] = useState<boolean>(false);
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const decksRepository = new MockDeckRepository();
    decksRepository.getDecks().then((decks) => {
      setDecks(decks);
      setIsLoading(false);
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      return () => setButtonVisible(false);
    }, []),
  );

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.background,
          paddingBottom: insets.bottom,
        },
      ]}
    >
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
            ></DeckComponent>
          );
        }}
      ></FlatList>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
});
