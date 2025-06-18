import { mergeQueryKeys } from "@lukemorales/query-key-factory";
import { chats } from "./chats";

export const queries = mergeQueryKeys(chats);
