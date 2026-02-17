/**
 * Chat API layer.
 *
 * Talks to the Express mock server. Falls back to inline mocks
 * if the server is unreachable (offline development).
 */

import { Chat, Message, SendMessageResponse } from "../types";
import { generateId } from "../utils";

/* ------------------------------------------------------------------ */
/*  Server base URL                                                   */
/* ------------------------------------------------------------------ */
const API_BASE = "http://localhost:3000"; // Mock server

/* ------------------------------------------------------------------ */
/*  Helper — fetch with fallback                                      */
/* ------------------------------------------------------------------ */
async function apiFetch<T>(
  url: string,
  options?: RequestInit,
  fallback?: () => Promise<T>
): Promise<T> {
  try {
    const res = await fetch(url, {
      ...options,
      headers: { "Content-Type": "application/json", ...options?.headers },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    // 204 No Content
    if (res.status === 204) return undefined as unknown as T;
    return res.json();
  } catch {
    if (fallback) return fallback();
    throw new Error("Server unreachable and no fallback provided");
  }
}

/* ------------------------------------------------------------------ */
/*  Offline-mode mock helpers                                         */
/* ------------------------------------------------------------------ */
const SIMULATED_DELAY_MS = 1_200;
function delay(ms: number = SIMULATED_DELAY_MS): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

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
  return apiFetch<SendMessageResponse>(
    `${API_BASE}/chats/${chatId}/messages`,
    { method: "POST", body: JSON.stringify({ content }) },
    // Fallback: local mock
    async () => {
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
  );
}

/** Create a new chat and return it. */
export async function createChat(): Promise<Chat> {
  return apiFetch<Chat>(
    `${API_BASE}/chats`,
    { method: "POST" },
    async () => {
      await delay(300);
      const now = new Date().toISOString();
      return { id: generateId(), title: "New Chat", createdAt: now, updatedAt: now, messages: [] };
    }
  );
}

/** Fetch all chats for the current user (history). */
export async function fetchChats(): Promise<Chat[]> {
  return apiFetch<Chat[]>(
    `${API_BASE}/chats`,
    { method: "GET" },
    async () => {
      await delay(200);
      return [];
    }
  );
}

/** Fetch a single chat by ID. */
export async function fetchChat(chatId: string): Promise<Chat | null> {
  return apiFetch<Chat | null>(
    `${API_BASE}/chats/${chatId}`,
    { method: "GET" },
    async () => null
  );
}
