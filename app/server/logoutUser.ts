import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@/lib/supabase/server";

export const logoutUser = createServerFn({ method: "POST" }).handler(
  async () => {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
    };
  }
);
