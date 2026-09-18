import {
  getUnsyncedFSRSStates,
  getUnsyncedReviews,
  insertReviewsLocally,
  markFSRSStatesAsSynced,
  markReviewsAsSynced,
  updateUnsyncedFSRSStates,
} from "@/repositories/flashcardReviewRepository.ts";
import { globalCardRepository } from "@/repositories/globalCardRepository";
import { globalDeckRepository } from "@/repositories/globalDeckRepository";
import { supabase } from "@/utils/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LAST_SYNC_KEY = (userId: string) => `@lastSyncTime_${userId}`;

export async function syncData(userId: string) {
  try {
    const lastSyncTime = await AsyncStorage.getItem(LAST_SYNC_KEY(userId));

    const currentSyncTime = new Date().toISOString();

    pullDecks(userId, lastSyncTime);
    pullCards(userId, lastSyncTime);
    pullFSRSStates(userId, lastSyncTime);
    pullReviews(lastSyncTime);

    pushDecks(userId);
    pushCards(userId);
    pushFSRSStates(userId);
    pushReviews(userId);

    await AsyncStorage.setItem(LAST_SYNC_KEY(userId), currentSyncTime);
  } catch (error) {
    console.log("ERROR during synchronization: ", error);
  }
}

async function pullDecks(userId: string, lastSyncTime: string | null) {
  let query = supabase.from("decks").select("*"); //Added RLS policy in Supabase, so user_id is not required to select all the records belonging to the user that is signed in

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

async function pullCards(userId: string, lastSyncTime: string | null) {
  let query = supabase.from("cards").select("*"); //Added RLS policy in Supabase, so user_id is not required to select all the records belonging to the user that is signed in

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

async function pullFSRSStates(userId: string, lastSyncTime: string | null) {
  let query = supabase.from("fsrs_states").select("*");

  if (lastSyncTime) {
    query = query.gt("updated_at", lastSyncTime);
  }

  const { data: serverStates, error } = await query;
  if (error) {
    console.log(error);
    return;
  }
  if (!serverStates || serverStates.length === 0) return;

  console.log(serverStates);
  const statesMap = new Map();

  const localUnsyncedStates = await getUnsyncedFSRSStates(userId);

  for (const localState of localUnsyncedStates) {
    statesMap.set(localState.id, localState);
  }

  const statesToUpsert: any[] = [];

  for (const serverState of serverStates) {
    const localState = statesMap.get(serverState.id);

    if (localState) {
      const serverStateUpdatedTimestamp = new Date(
        serverState.updated_at,
      ).getTime();
      const localStateUpdatedTimestamp = new Date(
        localState.updated_at,
      ).getTime();

      if (serverStateUpdatedTimestamp > localStateUpdatedTimestamp) {
        statesToUpsert.push(serverState);
      } //we don't do anything if the local date is newer - it'll be taken care of in PUSH function
    } else {
      statesToUpsert.push(serverState);
    }
  }

  if (statesToUpsert.length > 0) {
    await updateUnsyncedFSRSStates(statesToUpsert);
  }
}

async function pushFSRSStates(userId: string) {
  const localUnsyncedStates = await getUnsyncedFSRSStates(userId);

  if (localUnsyncedStates.length > 0) {
    const { error } = await supabase
      .from("fsrs_states")
      .upsert(localUnsyncedStates);

    if (error) {
      console.log(error);
      return;
    }
    await markFSRSStatesAsSynced(localUnsyncedStates.map((state) => state.id));
  }
}

async function pullReviews(lastSyncTime: string | null) {
  let query = supabase.from("reviews").select("*");

  if (lastSyncTime) {
    query = query.gt("reviewed_at", lastSyncTime);
  }

  const { data: serverReviews, error } = await query;
  if (error) {
    console.log(error);
    return;
  }
  if (!serverReviews || serverReviews.length === 0) return;

  await insertReviewsLocally(serverReviews);
}

async function pushReviews(userId: string) {
  const localUnsyncedReviews = await getUnsyncedReviews(userId);

  if (localUnsyncedReviews.length > 0) {
    const { error } = await supabase
      .from("reviews")
      .upsert(localUnsyncedReviews);

    if (error) {
      console.log(error);
      return;
    }
    await markReviewsAsSynced(localUnsyncedReviews.map((review) => review.id));
  }
}
