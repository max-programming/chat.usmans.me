import { createClient } from "@/lib/supabase/server";
import { createServerFn } from "@tanstack/react-start";

export const getSession = createServerFn({ method: "GET" }).handler(
  async () => {
    const supabase = createClient();
    const { data, error: _error } = await supabase.auth.getSession();

    if (!data.session) {
      return null;
    }

    return {
      id: data.session.user.id,
      email: data.session.user.email,
    };
  }
);
