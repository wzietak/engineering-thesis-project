import FloatingButton from "@/components/FloatingButton";
import Overlay from "@/components/Overlay";
import { decksExampleData } from "@/data/MockData";
import { Deck } from "@/models/deck";
import { MockDeckRepository } from "@/repositories/MockDeckRepository";
import { theme } from "@/styles/theme";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const decks = decksExampleData;

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
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* <Deck label={decks[0].title} cardsDue={decks[0].cardsDue} />
				<Deck
					label={decks[1].title}
					cardsDue={decks[1].cardsDue}
					backgroundColor={theme.colors.pink}
				/>
				<Deck
					label={decks[2].title}
					cardsDue={decks[2].cardsDue}
					backgroundColor={theme.colors.lightblue}
				/>
				<Deck
					label={decks[3].title}
					cardsDue={decks[3].cardsDue}
					backgroundColor={theme.colors.green}
				/>
				<Deck
					label={decks[4].title}
					cardsDue={decks[4].cardsDue}
					backgroundColor={theme.colors.green}
				/>
				<Deck
					label={decks[0].title}
					cardsDue={decks[0].cardsDue}
					backgroundColor={theme.colors.green}
				/>
				<Deck
					label={decks[1].title}
					cardsDue={decks[1].cardsDue}
					backgroundColor={theme.colors.green}
				/> */}
      </ScrollView>
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
