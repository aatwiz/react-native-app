/**
 * Mock API layer.
 *
 * Simulates backend responses with realistic delays.
 * When the real backend is available, replace these functions with
 * actual fetch/axios calls — the signatures stay the same.
 */

import { Chat, Message, SendMessageResponse } from "../types";
import { generateId } from "../utils";

/* ------------------------------------------------------------------ */
/*  Simulated latency                                                 */
/* ------------------------------------------------------------------ */
const SIMULATED_DELAY_MS = 1_200;

function delay(ms: number = SIMULATED_DELAY_MS): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/* ------------------------------------------------------------------ */
/*  Mock bot responses                                                */
/* ------------------------------------------------------------------ */
const BOT_RESPONSES: string[] = [
  "Based on the relevant trademark laws, I can provide you with the following guidance on this matter.",
  "That's a great question. In the context of intellectual property law, there are several important considerations to keep in mind.",
  "I'd be happy to help with that. Here's what you need to know about IP protection in this jurisdiction.",
  "According to the latest regulatory framework, the process involves the following steps:\n\n1. Filing an application with the relevant authority\n2. Examination of the application\n3. Publication for opposition\n4. Registration and issuance of certificate",
  "To protect your brand effectively, I recommend considering both trademark registration and trade dress protection. Would you like me to elaborate on either of these?",
  "The filing requirements vary by jurisdiction. Could you specify which country or region you're interested in so I can provide more targeted guidance?",
];

function pickBotResponse(): string {
  return BOT_RESPONSES[Math.floor(Math.random() * BOT_RESPONSES.length)];
}

/* ------------------------------------------------------------------ */
/*  Public API                                                        */
/* ------------------------------------------------------------------ */

/** Send a user message and get a bot reply. */
export async function sendMessage(
  chatId: string,
  content: string
): Promise<SendMessageResponse> {
  await delay();

  const botMessage: Message = {
    id: generateId(),
    chatId,
    role: "assistant",
    content: pickBotResponse(),
    createdAt: new Date().toISOString(),
  };

  return { message: botMessage };
}

/** Create a new chat and return it. */
export async function createChat(): Promise<Chat> {
  await delay(300);

  const now = new Date().toISOString();
  return {
    id: generateId(),
    title: "New Chat",
    createdAt: now,
    updatedAt: now,
    messages: [],
  };
}

/** Fetch all chats for the current user (history). */
export async function fetchChats(): Promise<Chat[]> {
  // In production this would be an API call.
  // The cache layer provides offline data; this is just a fallback.
  await delay(200);
  return [];
}

/** Fetch a single chat by ID. */
export async function fetchChat(chatId: string): Promise<Chat | null> {
  await delay(200);
  return null;
}
