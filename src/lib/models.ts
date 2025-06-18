import type { AllowedModels, AllowedProviders } from "@/routes/api/chat";
import {
  // SiGoogle,
  // SiAnthropic,
  SiOpenai,
  SiClaude,
  SiGooglegemini,
  type IconType,
} from "@icons-pack/react-simple-icons";

export const models = [
  {
    id: "gpt-4o-mini",
    name: "GPT-4o Mini",
    provider: "openai",
    providerDisplayName: "OpenAI",
    icon: SiOpenai,
    color: "white",
  },
  {
    id: "claude-3-haiku-20240307",
    name: "Claude 3 Haiku",
    provider: "anthropic",
    providerDisplayName: "Anthropic",
    icon: SiClaude,
    color: "#d7785b",
  },
  {
    id: "gemini-2.0-flash-lite",
    name: "Gemini 2.0 Flash Lite",
    provider: "google",
    providerDisplayName: "Google",
    icon: SiGooglegemini,
    color: "#5681eb",
  },
] satisfies Model[];

export interface Model {
  id: AllowedModels;
  name: string;
  provider: AllowedProviders;
  providerDisplayName: string;
  icon: IconType;
  color: string;
}
