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
import NetInfo from "@react-native-community/netinfo";

export const LAST_SYNC_KEY = (userId: string) => `@lastSyncTime_${userId}`;

let isSyncInProgress = false;

export async function syncData(userId: string) {
  if (isSyncInProgress) {
    return;
  }

  const networkConnectionState = await NetInfo.fetch();

  if (
    !networkConnectionState.isConnected ||
    !networkConnectionState.isInternetReachable
  ) {
    console.log("OFFLINE!");
    throw new Error("NO_NETWORK_CONNECTION");
  }

  isSyncInProgress = true;
  const { data: serverTime, error } = await supabase.rpc("get_server_time");
  console.log(">>SERVER TIME: ", serverTime);
  const currentSyncTime = new Date().toISOString();
  const SAFETY_BUFFER_MS = 30 * 1000;

  try {
    const rawLastSyncTime = await AsyncStorage.getItem(LAST_SYNC_KEY(userId));

    const lastSyncTime = rawLastSyncTime
      ? new Date(
          new Date(rawLastSyncTime).getTime() - SAFETY_BUFFER_MS,
        ).toISOString()
      : null;

    console.log(">>>>> lastSyncTime: ", lastSyncTime);

    await pullDecks(userId, lastSyncTime);
    await pullCards(userId, lastSyncTime);
    await pullFSRSStates(userId, lastSyncTime);
    await pullReviews(lastSyncTime);

    await pushDecks(userId);
    await pushCards(userId);
    await pushFSRSStates(userId);
    await pushReviews(userId);

    await AsyncStorage.setItem(
      LAST_SYNC_KEY(userId),
      serverTime || currentSyncTime,
    );
  } catch (error) {
    console.log("ERROR during synchronization: ", error);
  } finally {
    isSyncInProgress = false;
  }
}

async function pullDecks(userId: string, lastSyncTime: string | null) {
  let query = supabase.from("decks").select("*"); //Added RLS policy in Supabase, so user_id is not required to select all the records belonging to the user that is signed in

  if (lastSyncTime) {
    query = query.gt("updated_at", lastSyncTime);
  }

  const { data: serverDecks, error } = await query;
  if (error) {
    console.log("pullDecks error: ", error);
    return;
  }

  console.log(`[PULL DECKS] Pobrane z Supabase: ${serverDecks?.length ?? 0}`);

  if (!serverDecks || serverDecks.length === 0) return;

  const decksMap = new Map();

  const localUnsyncedDecks =
    await globalDeckRepository.getUnsyncedDecks(userId);

  for (const localDeck of localUnsyncedDecks) {
    decksMap.set(localDeck.id, localDeck);
  }

  const decksToUpsert: any[] = [];

  for (const serverDeck of serverDecks) {
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

  if (decksToUpsert.length > 0) {
    console.log(
      "[PULL DECKS] Wykonuję upsert w SQLite dla:",
      serverDecks.length,
    );
    await globalDeckRepository.updateUnsyncedDecks(decksToUpsert);
  }
}

async function pushDecks(userId: string) {
  const localUnsyncedDecks =
    await globalDeckRepository.getUnsyncedDecks(userId);

  console.log(`[PUSH DECKS] Do wysłania: ${localUnsyncedDecks.length}`);

  if (localUnsyncedDecks.length > 0) {
    const { error } = await supabase.from("decks").upsert(localUnsyncedDecks);

    if (error) {
      console.log("pushDecks error: ", error);
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
    console.log("pullCards error: ", error);
    return;
  }

  console.log(`[PULL CARDS] Pobrane z Supabase: ${serverCards?.length ?? 0}`);
  if (!serverCards || serverCards.length === 0) return;

  console.log("PULL CARDS, serverCards: ", serverCards);
  const cardsMap = new Map();

  const localUnsyncedCards =
    await globalCardRepository.getUnsyncedCards(userId);

  for (const localCard of localUnsyncedCards) {
    cardsMap.set(localCard.id, localCard);
  }

  const cardsToUpsert: any[] = [];

  for (const serverCard of serverCards) {
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

  if (cardsToUpsert.length > 0) {
    console.log(
      "[PULL CARDS] Wykonuję upsert w SQLite dla:",
      serverCards.length,
    );
    await globalCardRepository.updateUnsyncedCards(cardsToUpsert);
  }
}

async function pushCards(userId: string) {
  const localUnsyncedCards =
    await globalCardRepository.getUnsyncedCards(userId);

  console.log(`[PUSH CARDS] Do wysłania: ${localUnsyncedCards.length}`);

  if (localUnsyncedCards.length > 0) {
    const { error } = await supabase.from("cards").upsert(localUnsyncedCards);

    if (error) {
      console.log("pushCards error: ", error);
      return;
    }
    await globalCardRepository.markCardsAsSynced(
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
    console.log("pullStates error: ", error);
    return;
  }

  console.log(
    `[PULL FSRS STATES] Pobrane z Supabase: ${serverStates?.length ?? 0}`,
  );

  if (!serverStates || serverStates.length === 0) return;

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
    console.log(
      "[PULL FSRS STATES] Wykonuję upsert w SQLite dla:",
      serverStates.length,
    );
    await updateUnsyncedFSRSStates(statesToUpsert);
  }
}

async function pushFSRSStates(userId: string) {
  const localUnsyncedStates = await getUnsyncedFSRSStates(userId);

  console.log(`[PUSH FSRS STATES] Do wysłania: ${localUnsyncedStates.length}`);

  if (localUnsyncedStates.length > 0) {
    const { error } = await supabase
      .from("fsrs_states")
      .upsert(localUnsyncedStates);

    if (error) {
      console.log("pushStates error: ", error);
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
    console.log("pullReviews error: ", error);
    return;
  }

  console.log(
    `[PULL REVIEWS] Pobrane z Supabase: ${serverReviews?.length ?? 0}`,
  );

  if (!serverReviews || serverReviews.length === 0) return;
  console.log(
    "[PULL REVIEWS] Wykonuję upsert w SQLite dla:",
    serverReviews.length,
  );
  await insertReviewsLocally(serverReviews);
}

async function pushReviews(userId: string) {
  const localUnsyncedReviews = await getUnsyncedReviews(userId);

  console.log(`[PUSH REVIEWS] Do wysłania: ${localUnsyncedReviews.length}`);

  if (localUnsyncedReviews.length > 0) {
    const { error } = await supabase
      .from("reviews")
      .upsert(localUnsyncedReviews);

    if (error) {
      console.log("pushReviews error: ", error);
      return;
    }

    await markReviewsAsSynced(localUnsyncedReviews.map((review) => review.id));
  }
}
