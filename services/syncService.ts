import { globalCardRepository } from "@/repositories/globalCardRepository";
import { globalDeckRepository } from "@/repositories/globalDeckRepository";
import { supabase } from "@/utils/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";

const lastSync = (userId: string) => `@lastSyncTime_${userId}`;

export async function getLastSyncTime(userId: string) {
  try {
    const lastSyncTime = await AsyncStorage.getItem(`@lastSyncTime_${userId}`);
  } catch (error) {
    return null;
  }
  return setLastSyncTime;
}

export async function setLastSyncTime(lastSyncTime: string, userId: string) {
  try {
    await AsyncStorage.setItem(lastSync(userId), lastSyncTime);
  } catch (error) {}
}

async function pullDecks(userId: string, lastSyncTime: string) {
  let query = supabase.from("decks").select("*").eq("user_id", userId);

  if (lastSyncTime) {
    query = query.gt("updated_at", lastSyncTime);
  }

  const { data: serverDecks, error } = await query;
  if (error) {
    console.log(error);
    return;
  }
  if (!serverDecks || serverDecks.length === 0) return;

  console.log(serverDecks);
  const decksMap = new Map();

  const localUnsyncedDecks =
    await globalDeckRepository.getUnsyncedDecks(userId);

  for (const localDeck of localUnsyncedDecks) {
    decksMap.set(localDeck.id, localDeck);
  }

  const decksToDelete: string[] = [];
  const decksToUpsert: any[] = [];

  for (const serverDeck of serverDecks) {
    if (serverDeck.is_deleted === true) {
      decksToDelete.push(serverDeck.id);
      continue;
    }
    const localDeck = decksMap.get(serverDeck.id);

    if (localDeck) {
      const serverDeckUpdatedTimestamp = new Date(
        serverDeck.updated_at,
      ).getTime();
      const localDeckUpdatedTimestamp = new Date(
        localDeck.updated_at,
      ).getTime();

      if (serverDeckUpdatedTimestamp > localDeckUpdatedTimestamp) {
        decksToUpsert.push(serverDeck);
      } //we don't do anything if the local date is newer - it'll be taken care of in PUSH function
    } else {
      decksToUpsert.push(serverDeck);
    }
  }

  for (const deckId of decksToDelete)
    await globalDeckRepository.deleteDeck(deckId, userId);

  if (decksToUpsert.length > 0) {
    await globalDeckRepository.updateUnsyncedDecks(decksToUpsert);
  }
}

async function pushDecks(userId: string) {
  const localUnsyncedDecks =
    await globalDeckRepository.getUnsyncedDecks(userId);

  if (localUnsyncedDecks.length > 0) {
    const { error } = await supabase.from("decks").upsert(localUnsyncedDecks);

    if (error) {
      console.log(error);
      return;
    }
    await globalDeckRepository.markDecksAsSynced(
      userId,
      localUnsyncedDecks.map((deck) => deck.id),
    );
  }
}

async function pullCards(userId: string, lastSyncTime: string) {
  let query = supabase.from("cards").select("*").eq("user_id", userId);

  if (lastSyncTime) {
    query = query.gt("updated_at", lastSyncTime);
  }

  const { data: serverCards, error } = await query;
  if (error) {
    console.log(error);
    return;
  }
  if (!serverCards || serverCards.length === 0) return;

  console.log(serverCards);
  const cardsMap = new Map();

  const localUnsyncedCards =
    await globalCardRepository.getUnsyncedCards(userId);

  for (const localCard of localUnsyncedCards) {
    cardsMap.set(localCard.id, localCard);
  }

  const cardsToDelete: string[] = [];
  const cardsToUpsert: any[] = [];

  for (const serverCard of serverCards) {
    if (serverCard.is_deleted === true) {
      cardsToDelete.push(serverCard.id);
      continue;
    }
    const localCard = cardsMap.get(serverCard.id);

    if (localCard) {
      const serverCardUpdatedTimestamp = new Date(
        serverCard.updated_at,
      ).getTime();
      const localCardUpdatedTimestamp = new Date(
        localCard.updated_at,
      ).getTime();

      if (serverCardUpdatedTimestamp > localCardUpdatedTimestamp) {
        cardsToUpsert.push(serverCard);
      } //we don't do anything if the local date is newer - it'll be taken care of in PUSH function
    } else {
      cardsToUpsert.push(serverCard);
    }
  }

  for (const cardId of cardsToDelete)
    await globalCardRepository.deleteCard(cardId, userId);

  if (cardsToUpsert.length > 0) {
    await globalCardRepository.updateUnsyncedCards(cardsToUpsert);
  }
}

async function pushCards(userId: string) {
  const localUnsyncedCards =
    await globalCardRepository.getUnsyncedCards(userId);

  if (localUnsyncedCards.length > 0) {
    const { error } = await supabase.from("cards").upsert(localUnsyncedCards);

    if (error) {
      console.log(error);
      return;
    }
    await globalCardRepository.markCardsAsSynced(
      userId,
      localUnsyncedCards.map((card) => card.id),
    );
  }
}

async function pullFSRSStates() {}

async function pullReviews() {}

async function pushFSRSStates() {}

async function pushReviews() {}
