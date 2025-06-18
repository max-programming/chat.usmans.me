import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@/lib/supabase/server";

export const fetchUser = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = createClient();
  const { data, error: _error } = await supabase.auth.getUser();

  if (!data.user?.email) {
    return null;
  }

  return {
    id: data.user.id,
    email: data.user.email,
  };
});
