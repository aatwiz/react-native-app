import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type PropsWithChildren,
} from "react";
import { Chat, Message } from "../types";
import { generateId } from "../utils";
import * as api from "../api";
import * as cache from "../cache";
import { useAuth } from "./AuthContext";

/* ------------------------------------------------------------------ */
/*  Context types                                                     */
/* ------------------------------------------------------------------ */
interface ChatState {
  /** All chats the user has, newest first. */
  chats: Chat[];
  /** The currently active chat (shown on screen). */
  activeChat: Chat | null;
  /** Whether the bot is currently "typing". */
  isBotTyping: boolean;
  /** Create a new chat and make it active. */
  createNewChat: () => Promise<Chat>;
  /** Switch to an existing chat. */
  setActiveChat: (chatId: string) => void;
  /** Send a user message in the active chat. */
  sendMessage: (content: string) => Promise<void>;
  /** Delete a chat by ID. */
  deleteChat: (chatId: string) => Promise<void>;
  /** Close the active chat (go to empty state). */
  closeActiveChat: () => void;
}

const ChatContext = createContext<ChatState>({
  chats: [],
  activeChat: null,
  isBotTyping: false,
  createNewChat: async () => ({} as Chat),
  setActiveChat: () => {},
  sendMessage: async () => {},
  deleteChat: async () => {},
  closeActiveChat: () => {},
});

/* ------------------------------------------------------------------ */
/*  Provider                                                          */
/* ------------------------------------------------------------------ */
export function ChatProvider({ children }: PropsWithChildren) {
  const { isAuthenticated } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChatState] = useState<Chat | null>(null);
  const [isBotTyping, setIsBotTyping] = useState(false);

  /* ---- Load cached chats on mount ---- */
  useEffect(() => {
    (async () => {
      const cached = await cache.getCachedChats();
      setChats(cached);
    })();
  }, []);

  /* ---- Reset to fresh chat on new login ---- */
  useEffect(() => {
    if (isAuthenticated) {
      setActiveChatState(null);
    }
  }, [isAuthenticated]);

  /* ---- Create new chat ---- */
  const createNewChat = useCallback(async () => {
    const chat = await api.createChat();
    setChats((prev) => [chat, ...prev]);
    setActiveChatState(chat);
    await cache.cacheChat(chat);
    return chat;
  }, []);

  /* ---- Switch active chat ---- */
  const setActiveChat = useCallback(
    (chatId: string) => {
      const found = chats.find((c) => c.id === chatId) ?? null;
      setActiveChatState(found);
    },
    [chats]
  );

  /* ---- Close active chat ---- */
  const closeActiveChat = useCallback(() => {
    setActiveChatState(null);
  }, []);

  /* ---- Send message ---- */
  const sendMessage = useCallback(
    async (content: string) => {
      if (!activeChat) return;

      // 1. Add user message locally
      const userMsg: Message = {
        id: generateId(),
        chatId: activeChat.id,
        role: "user",
        content,
        createdAt: new Date().toISOString(),
      };

      const updatedChat: Chat = {
        ...activeChat,
        messages: [...activeChat.messages, userMsg],
        updatedAt: userMsg.createdAt,
        // Auto-title: use first user message
        title:
          activeChat.title === "New Chat"
            ? content.slice(0, 40) + (content.length > 40 ? "…" : "")
            : activeChat.title,
      };

      setActiveChatState(updatedChat);
      setChats((prev) =>
        prev.map((c) => (c.id === updatedChat.id ? updatedChat : c))
      );
      await cache.cacheChat(updatedChat);

      // 2. Get bot response
      setIsBotTyping(true);
      try {
        const { message: botMsg } = await api.sendMessage(
          activeChat.id,
          content
        );

        const withReply: Chat = {
          ...updatedChat,
          messages: [...updatedChat.messages, botMsg],
          updatedAt: botMsg.createdAt,
        };

        setActiveChatState(withReply);
        setChats((prev) =>
          prev.map((c) => (c.id === withReply.id ? withReply : c))
        );
        await cache.cacheChat(withReply);
      } catch (err) {
        console.error("[ChatContext] sendMessage error:", err);
      } finally {
        setIsBotTyping(false);
      }
    },
    [activeChat]
  );

  /* ---- Delete chat ---- */
  const deleteChat = useCallback(
    async (chatId: string) => {
      setChats((prev) => prev.filter((c) => c.id !== chatId));
      if (activeChat?.id === chatId) setActiveChatState(null);
      await cache.deleteCachedChat(chatId);
    },
    [activeChat]
  );

  return (
    <ChatContext.Provider
      value={{
        chats,
        activeChat,
        isBotTyping,
        createNewChat,
        setActiveChat,
        sendMessage,
        deleteChat,
        closeActiveChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export const useChat = () => useContext(ChatContext);
