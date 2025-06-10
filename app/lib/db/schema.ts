import {
  pgTable,
  foreignKey,
  pgPolicy,
  uuid,
  varchar,
  boolean,
  timestamp,
  index,
  text,
  integer,
  pgSchema,
  customType,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import type { Message } from "ai";

const authSchema = pgSchema("auth");

export const users = authSchema.table("users", {
  id: uuid("id").primaryKey(),
});

export const chats = pgTable(
  "chats",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    userId: uuid("user_id").default(sql`auth.uid()`),
    title: varchar(),
    isArchived: boolean("is_archived").default(false),
    createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow(),
  },
  table => [
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: "chats_user_id_fkey",
    }).onDelete("set null"),
    pgPolicy("Users can only create chats for themselves", {
      as: "permissive",
      for: "insert",
      to: ["authenticated"],
      withCheck: sql`(user_id = auth.uid())`,
    }),
    pgPolicy("Enable users to delete their own data only", {
      as: "permissive",
      for: "delete",
      to: ["authenticated"],
    }),
    pgPolicy("Enable users to update their own data only", {
      as: "permissive",
      for: "update",
      to: ["authenticated"],
    }),
    pgPolicy("Enable users to view their own data only", {
      as: "permissive",
      for: "select",
      to: ["authenticated"],
    }),
  ]
);

const messageRole = customType<{ data: Message["role"] }>({
  dataType: () => "varchar",
});
export const messages = pgTable(
  "messages",
  {
    id: varchar().primaryKey().notNull(),
    chatId: uuid("chat_id").notNull(),
    role: messageRole().notNull(),
    content: text().notNull(),
    modelName: varchar("model_name"),
    tokenCount: integer("token_count"),
    createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
  },
  table => [
    index("messages_chat_id_created_at_idx").using(
      "btree",
      table.chatId.asc().nullsLast().op("timestamp_ops"),
      table.createdAt.asc().nullsLast().op("timestamp_ops")
    ),
    foreignKey({
      columns: [table.chatId],
      foreignColumns: [chats.id],
      name: "messages_chat_id_fkey",
    }).onDelete("cascade"),
    pgPolicy("Users can delete their own messages", {
      as: "permissive",
      for: "delete",
      to: ["authenticated"],
      using: sql`(chat_id IN ( SELECT chats.id
   FROM chats
  WHERE (chats.user_id = ( SELECT auth.uid() AS uid))))`,
    }),
    pgPolicy("Users can update their own messages", {
      as: "permissive",
      for: "update",
      to: ["authenticated"],
    }),
    pgPolicy("Users can create messages in their own chats", {
      as: "permissive",
      for: "insert",
      to: ["authenticated"],
    }),
    pgPolicy("Users can only view their own messages", {
      as: "permissive",
      for: "select",
      to: ["authenticated"],
    }),
  ]
);
