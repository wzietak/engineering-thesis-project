import DeckPill from "@/components/DeckPill";
import FlashcardComponent from "@/components/Flashcard";
import { AuthContext } from "@/contexts/AuthContext";
import { useAppTheme } from "@/contexts/ColorThemeContext";
import { DBContext } from "@/contexts/DBContext";
import { globalCardRepository } from "@/repositories/globalCardRepository";
import { globalDeckRepository } from "@/repositories/globalDeckRepository";
import { AppTheme } from "@/styles/theme";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useContext, useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { FlatList, ScrollView } from "react-native-gesture-handler";
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
  const [decks, setDecks] = useState<{ id: string; name: string }[]>();
  const [selectedDeckId, setSelectedDeckId] = useState<string>("");

  const userId = session?.currentSession?.user.id as string;

  const filteredCards = useMemo(() => {
    if (selectedDeckId === "") return cards;
    return cards.filter((c) => c.deckId === selectedDeckId);
  }, [cards, selectedDeckId]);

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

      globalDeckRepository.getDecks(userId).then((fetchedDecks) => {
        setDecks(fetchedDecks);
      });
    }, [DBconnection.isReady, userId]),
  );

  return (
    <View style={[styles.mainContainer, { paddingBottom: insets.bottom }]}>
      <ScrollView
        horizontal={true}
        style={[styles.scrollContainer]}
        showsHorizontalScrollIndicator={false}
      >
        <DeckPill
          onPress={() => {
            setSelectedDeckId("");
          }}
          backgroundCol={selectedDeckId ? "" : theme.colors.lightpurple}
        ></DeckPill>
        {decks?.map((deck) => {
          return (
            <DeckPill
              key={deck.id}
              deckId={deck.id}
              deckName={deck.name}
              onPress={() => {
                setSelectedDeckId(deck.id);
              }}
              backgroundCol={
                selectedDeckId === deck.id ? theme.colors.lightpurple : ""
              }
            ></DeckPill>
          );
        })}
      </ScrollView>

      <FlatList
        style={{ height: "100%" }}
        contentContainerStyle={[styles.scrollContainer]}
        keyExtractor={(item) => item.cardId}
        data={filteredCards}
        showsVerticalScrollIndicator={false}
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
        ListHeaderComponent={
          <View
            style={{
              paddingVertical: 5,
            }}
          >
            <Text style={styles.textStyle}>
              {filteredCards.length === 1
                ? `Showing ${filteredCards.length} card`
                : `Showing ${filteredCards.length} cards`}
            </Text>
          </View>
        }
      ></FlatList>
    </View>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    mainContainer: {
      paddingHorizontal: 20,
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContainer: {
      paddingBottom: 10,
    },
    textStyle: {
      fontFamily: theme.fontFamily.regular,
      fontSize: theme.fontSize.x_sm,
      color: theme.colors.blue,
    },
  });
