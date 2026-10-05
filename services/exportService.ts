import { ExampleSource } from "@/models/card";
import { CardType } from "@/models/CardTypes";
import { globalCardRepository } from "@/repositories/globalCardRepository";
import { globalDeckRepository } from "@/repositories/globalDeckRepository";
import * as FileSystem from "expo-file-system/legacy";
import { Platform, ToastAndroid } from "react-native";

export interface ExportedDeck {
  name: string;
  source_language: string;
  target_language: string;
  cards: {
    card_type: CardType;
    front: string;
    back: string;
    example_sentence?: string;
    example_source: ExampleSource;
  }[];
}

export async function exportDeck(deckId: string, userId: string) {
  try {
    const deck = await globalDeckRepository.getDeckById(deckId, userId);
    const cards = await globalCardRepository.getCards(userId, deckId);

    if (cards.length === 0) {
      ToastAndroid.show(
        "Cannot export an empty deck. Add cards first.",
        ToastAndroid.SHORT,
      );
      return;
    }

    if (deck && cards) {
      const exportData: ExportedDeck = {
        name: deck.name,
        source_language: deck.source_language ?? "",
        target_language: deck.target_language ?? "",
        cards: cards.map((card) => ({
          card_type: card.card_type as CardType,
          front: card.front,
          back: card.back,
          example_sentence: card.example_sentence ?? "",
          example_source: card.example_source as ExampleSource,
        })),
      };

      const JSONString = JSON.stringify(exportData, null, 2);

      const cleanFileName = exportData.name
        .trim()
        .replace(/[^a-zA-Z0-9_-\u00C0-\u017F]/g, "_");

      const finalFileName = `${cleanFileName}.json`;

      if (Platform.OS === "android") {
        const { StorageAccessFramework } = FileSystem;
        const permission =
          await StorageAccessFramework.requestDirectoryPermissionsAsync();
        if (!permission.granted) return;
        const wasGoogleDriveChosen = permission.directoryUri.includes(
          "com.google.android.apps.docs.storage",
        );

        if (wasGoogleDriveChosen) {
          ToastAndroid.show(
            "Google Drive isn't supported. Please select a local folder.",
            ToastAndroid.SHORT,
          );
        }

        const fileUri = await StorageAccessFramework.createFileAsync(
          permission.directoryUri,
          finalFileName,
          "application/json",
        );

        await FileSystem.writeAsStringAsync(fileUri, JSONString, {
          encoding: FileSystem.EncodingType.UTF8,
        });
      }

      ToastAndroid.show("Deck exported successfully!", ToastAndroid.SHORT);
    }
  } catch (error: any) {
    ToastAndroid.show(
      "Failed to export deck. Please try again.",
      ToastAndroid.SHORT,
    );
    console.log("ERROR DURING EXPORT: ", error);
  }
}
