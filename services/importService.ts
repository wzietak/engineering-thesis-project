import { CardType } from "@/models/CardTypes";
import { createNewCardState } from "@/repositories/flashcardReviewRepository";
import { globalCardRepository } from "@/repositories/globalCardRepository";
import { globalDeckRepository } from "@/repositories/globalDeckRepository";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system/legacy";
import { DeviceEventEmitter, ToastAndroid } from "react-native";
import { ExportedDeck } from "./exportService";

function validateImportedDeck(data: unknown): data is ExportedDeck {
  if (typeof data !== "object" || data === null) return false;

  const JSONString = data as Partial<ExportedDeck>;

  if (
    typeof JSONString.name !== "string" ||
    JSONString.name.trim().length === 0
  )
    return false;
  if (
    typeof JSONString.source_language !== "string" ||
    typeof JSONString.target_language !== "string"
  )
    return false;
  if (!Array.isArray(JSONString.cards)) return false;

  for (const card of JSONString.cards) {
    if (typeof card !== "object" || card === null) return false;
    if (!card.card_type) return false;
    if (typeof card.front !== "string" || typeof card.back !== "string")
      return false;
    if (card.front.trim().length === 0 || card.back.trim().length === 0)
      return false;
    if (typeof card.example_sentence !== "string") return false;
    if (typeof card.example_source !== "string") return false;
  }

  return true;
}

async function resolveDeckNameUniqueness(
  deckName: string,
  userId: string,
): Promise<string> {
  deckName = deckName.trim();
  let isDeckNameExisting = await globalDeckRepository.checkIfDeckNameExists(
    userId,
    deckName,
  );

  if (!isDeckNameExisting) return deckName;

  let counter = 1;
  while (true) {
    const newDeckName = `${deckName} (${counter})`;
    isDeckNameExisting = await globalDeckRepository.checkIfDeckNameExists(
      userId,
      newDeckName,
    );
    if (!isDeckNameExisting) return newDeckName;
    counter++;
  }
}

export async function importDeck(userId: string) {
  try {
    const pickedFiles = await DocumentPicker.getDocumentAsync({
      type: ["application/json", "text/*"],
      copyToCacheDirectory: true,
    });

    if (pickedFiles.canceled || !pickedFiles.assets?.length) return null;

    const fileUri = pickedFiles.assets[0].uri;
    const fileContent = await FileSystem.readAsStringAsync(fileUri, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    let JSONString: unknown;
    try {
      JSONString = JSON.parse(fileContent);
    } catch (error) {
      ToastAndroid.show(
        "Invalid format. The selected file is not valid JSON.",
        ToastAndroid.SHORT,
      );
      //   throw new Error("INVALID_JSON");
      return { success: false };
    }

    if (!validateImportedDeck(JSONString)) {
      ToastAndroid.show(
        "Invalid format. The selected file is not valid JSON.",
        ToastAndroid.SHORT,
      );
      return { success: false };
    }
    const uniqueDeckName = await resolveDeckNameUniqueness(
      JSONString.name,
      userId,
    );

    if (JSONString.cards.length === 0) {
      ToastAndroid.show(
        "Cannot import an empty deck. No cards found.",
        ToastAndroid.SHORT,
      );
      return { success: false };
    }

    const newlyCreatedDeck = await globalDeckRepository.createNewDeck({
      name: uniqueDeckName,
      source_language: JSONString.source_language,
      target_language: JSONString.target_language,
      user_id: userId,
    });

    for (const card of JSONString.cards) {
      const result = await globalCardRepository.createNewCard({
        deck_id: newlyCreatedDeck.id,
        card_type: card.card_type,
        front: card.front,
        back: card.back,
        example_sentence: card.example_sentence,
        example_source: card.example_source,
        user_id: userId,
      });
      if (card.card_type === CardType.BASIC_AND_REVERSED) {
        await createNewCardState(result.id, CardType.BASIC);
        await createNewCardState(result.id, CardType.REVERSED);
      } else {
        await createNewCardState(result.id, card.card_type as CardType);
      }
    }

    return {
      success: true,
      deckId: newlyCreatedDeck.id,
      deckTitle: uniqueDeckName,
      cardsCount: JSONString.cards.length,
    };
  } catch (error: any) {
    ToastAndroid.show(
      "Failed to import deck. Please try again.",
      ToastAndroid.SHORT,
    );
    console.log("ERROR DURING IMPORT: ", error);
  }
}
