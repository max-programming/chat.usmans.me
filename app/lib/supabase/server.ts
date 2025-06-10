import { createServerClient } from "@supabase/ssr";
import { parseCookies, setCookie } from "@tanstack/react-start/server";
import type { Database } from "./database.types";

export function createClient() {
  return createServerClient<Database>(
    process.env.VITE_SUPABASE_URL!,
    process.env.VITE_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return Object.entries(parseCookies()).map(
            ([name, value]) =>
              ({
                name,
                value,
              }) as { name: string; value: string }
          );
        },
        setAll(cookies) {
          cookies.forEach(cookie => {
            setCookie(cookie.name, cookie.value);
          });
        },
      },
    }
  );
}
