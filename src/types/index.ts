/* ------------------------------------------------------------------ */
/*  Types shared across the app                                       */
/* ------------------------------------------------------------------ */

/** A single message in a conversation. */
export interface Message {
  id: string;
  chatId: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string; // ISO-8601
}

/** A chat conversation (list of messages). */
export interface Chat {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: Message[];
}

/** Payload sent to the backend when the user sends a message. */
export interface SendMessageRequest {
  chatId: string;
  content: string;
}

/** Response from the backend after sending a message. */
export interface SendMessageResponse {
  message: Message;
}

/** User profile (from Keycloak or backend). */
export interface UserProfile {
  sub: string;
  preferred_username?: string;
  email?: string;
  name?: string;
}
