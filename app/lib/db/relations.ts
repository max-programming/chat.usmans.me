import { relations } from "drizzle-orm/relations";
import { users, chats, messages } from "./schema";

export const chatsRelations = relations(chats, ({ one, many }) => ({
  users: one(users, {
    fields: [chats.userId],
    references: [users.id],
  }),
  messages: many(messages),
}));

export const usersRelations = relations(users, ({ many }) => ({
  chats: many(chats),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  chat: one(chats, {
    fields: [messages.chatId],
    references: [chats.id],
  }),
}));
