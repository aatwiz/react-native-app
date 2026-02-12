import { sendMessage, createChat } from "../src/api";

describe("chatApi (mock)", () => {
  it("createChat returns a chat with valid structure", async () => {
    const chat = await createChat();
    expect(chat).toHaveProperty("id");
    expect(chat).toHaveProperty("title", "New Chat");
    expect(chat).toHaveProperty("messages");
    expect(Array.isArray(chat.messages)).toBe(true);
    expect(chat.messages).toHaveLength(0);
  });

  it("sendMessage returns a bot message", async () => {
    const { message } = await sendMessage("test-chat-id", "Hello");
    expect(message).toHaveProperty("id");
    expect(message).toHaveProperty("role", "assistant");
    expect(message).toHaveProperty("content");
    expect(typeof message.content).toBe("string");
    expect(message.content.length).toBeGreaterThan(0);
  });
});
