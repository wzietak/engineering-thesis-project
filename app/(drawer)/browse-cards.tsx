import FlashcardComponent from "@/components/Flashcard";
import { AuthContext } from "@/contexts/AuthContext";
import { useAppTheme } from "@/contexts/ColorThemeContext";
import { DBContext } from "@/contexts/DBContext";
import { globalCardRepository } from "@/repositories/globalCardRepository";
import { AppTheme } from "@/styles/theme";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useContext, useState } from "react";
import { StyleSheet, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export type CardForBrowse = {
  cardId: string;
  deckId: string;
  deckName: string;
  cardFront: string;
  cardBack: string;
  nextReview: string;
};

export default function browseCards() {
  const insets = useSafeAreaInsets();
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const DBconnection = useContext(DBContext);
  const session = useContext(AuthContext);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [cards, setCards] = useState<CardForBrowse[]>([]);

  const userId = session?.currentSession?.user.id as string;

  useFocusEffect(
    useCallback(() => {
      if (!DBconnection.isReady || !userId) {
        return;
      }
      setIsLoading(true);
      globalCardRepository
        .getAllCardsByUser(userId)
        .then((fetchedCards) => {
          setCards([...(fetchedCards || [])]);
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }, [DBconnection.isReady, userId]),
  );

  return (
    <View style={[styles.mainContainer, { paddingBottom: insets.bottom }]}>
      <FlatList
        contentContainerStyle={styles.scrollContainer}
        keyExtractor={(item) => item.cardId}
        data={cards}
        renderItem={({ item, index }) => {
          return (
            <FlashcardComponent
              cardId={item.cardId}
              cardFront={item.cardFront}
              cardBack={item.cardBack}
              deckName={item.deckName}
              nextReview={item.nextReview}
              onPress={() => {
                router.push({
                  pathname: "/add-new-card",
                  params: { cardId: item.cardId },
                });
              }}
            ></FlashcardComponent>
          );
        }}
      ></FlatList>
    </View>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: theme.colors.background,
      flexDirection: "column",
    },
    scrollContainer: {
      paddingHorizontal: 20,
      paddingBottom: 10,
    },
  });
