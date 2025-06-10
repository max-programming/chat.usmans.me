import { createServerFn } from "@tanstack/react-start";
import { generateId } from "ai";
import { z } from "zod";
import { newMessage } from "../messages/newMessage";
import { chats } from "@/lib/db/schema";
import { db } from "@/lib/db";

const newChatSchema = z.object({
  message: z.string(),
  chatId: z.string(),
});

export type NewChatInput = z.infer<typeof newChatSchema>;

export const newChat = createServerFn({ method: "POST" })
  .validator(newChatSchema)
  .handler(async ({ data: { chatId, message } }) => {
    await db.insert(chats).values({
      id: chatId,
      title: "Untitled Chat",
    });

    const messageId = generateId();
    await newMessage({
      data: {
        chatId,
        content: message,
        role: "user",
        messageId,
      },
    });

    return { chatId, messageId };
  });
