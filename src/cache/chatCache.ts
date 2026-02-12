/**
 * Offline-first caching layer backed by AsyncStorage.
 *
 * Stores chat history so users can browse conversations offline.
 * Data is synced from the API when connectivity is available.
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Chat, Message } from "../types";

const CHATS_KEY = "@aip_genius/chats";

/* ------------------------------------------------------------------ */
/*  Read                                                               */
/* ------------------------------------------------------------------ */

/** Get all cached chats, sorted newest-first. */
export async function getCachedChats(): Promise<Chat[]> {
  try {
    const raw = await AsyncStorage.getItem(CHATS_KEY);
    if (!raw) return [];
    const chats: Chat[] = JSON.parse(raw);
    return chats.sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  } catch {
    return [];
  }
}

/** Get a single cached chat by ID. */
export async function getCachedChat(chatId: string): Promise<Chat | null> {
  const chats = await getCachedChats();
  return chats.find((c) => c.id === chatId) ?? null;
}

/* ------------------------------------------------------------------ */
/*  Write                                                              */
/* ------------------------------------------------------------------ */

/** Persist the full list of chats. */
async function persistChats(chats: Chat[]): Promise<void> {
  await AsyncStorage.setItem(CHATS_KEY, JSON.stringify(chats));
}

/** Save (upsert) a single chat. */
export async function cacheChat(chat: Chat): Promise<void> {
  const chats = await getCachedChats();
  const idx = chats.findIndex((c) => c.id === chat.id);
  if (idx >= 0) {
    chats[idx] = chat;
  } else {
    chats.unshift(chat);
  }
  await persistChats(chats);
}

/** Append a message to a cached chat. */
export async function cacheMessage(
  chatId: string,
  message: Message
): Promise<void> {
  const chats = await getCachedChats();
  const chat = chats.find((c) => c.id === chatId);
  if (!chat) return;
  chat.messages.push(message);
  chat.updatedAt = message.createdAt;
  await persistChats(chats);
}

/** Update the title of a cached chat. */
export async function updateChatTitle(
  chatId: string,
  title: string
): Promise<void> {
  const chats = await getCachedChats();
  const chat = chats.find((c) => c.id === chatId);
  if (!chat) return;
  chat.title = title;
  await persistChats(chats);
}

/** Delete a cached chat. */
export async function deleteCachedChat(chatId: string): Promise<void> {
  const chats = await getCachedChats();
  await persistChats(chats.filter((c) => c.id !== chatId));
}

/** Clear all cached chats. */
export async function clearChatCache(): Promise<void> {
  await AsyncStorage.removeItem(CHATS_KEY);
}
