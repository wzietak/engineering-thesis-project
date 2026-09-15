import { globalDeckRepository } from "@/repositories/globalDeckRepository";
import { supabase } from "@/utils/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";

const lastSync = (userId: string) => `@lastSyncTime_${userId}`;

export async function syncData(userId: string) {
  try {
    const lastSyncTime = await AsyncStorage.getItem(`@lastSyncTime_${userId}`);
  } catch (error) {}
}

export async function setLastSyncTime(lastSyncTime: string, userId: string) {
  try {
    await AsyncStorage.setItem(lastSync(userId), lastSyncTime);
  } catch (error) {}
}

async function pullDecks(userId: string, lastSyncTime: string) {
  const decksMap = new Map();

  let query = supabase.from("decks").select("*").eq("user_id", userId);

  if (lastSyncTime) {
    query.gt("updated_at", lastSyncTime);
  }

  const { data: serverDecks, error } = await query;
  if (error) {
    console.log(error);
    return;
  }
  if (!serverDecks || serverDecks.length === 0) return;

  console.log(serverDecks);

  const localUnsyncedDecks =
    await globalDeckRepository.getUnsyncedDecks(userId);

  if (localUnsyncedDecks.length > 0) {
    for (const localDeck of localUnsyncedDecks) {
      decksMap.set(localDeck.id, localDeck);
    }
  }

  const decksToDelete = [];
  const decksToUpsert = [];

  for (const serverDeck of serverDecks) {
    if (serverDeck.is_deleted === 1) {
      decksToDelete.push(serverDeck.id);
      continue;
    }
    if (decksMap.has(serverDeck.id)) {
      const serverDeckUpdatedTimestamp = new Date(
        serverDeck.updated_at,
      ).getTime();
      const localDeckUpdatedTimestamp = new Date(
        decksMap.get(serverDeck.id).updated_at,
      ).getTime();

      if (serverDeckUpdatedTimestamp > localDeckUpdatedTimestamp) {
        decksToUpsert.push(serverDeck);
      } //we don't do anything if the local date is newer - it'll be taken care of in PUSH function
    } else {
      decksToUpsert.push(serverDeck);
    }
  }
}

async function pullCards() {}

async function pullFSRSStates() {}

async function pullReviews() {}

async function pushDecks() {}

async function pushCards() {}

async function pushFSRSStates() {}

async function pushReviews() {}
