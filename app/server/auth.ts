import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "@tanstack/react-router";

export const loginUser = createServerFn({ method: "POST" })
  .validator((data: { email: string; password: string }) => data)
  .handler(async ({ data }) => {
    const supabase = createClient();

    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    if (authData.user) {
      throw redirect({
        href: "/",
      });
    }

    return {
      success: true,
    };
  });

export const registerUser = createServerFn({ method: "POST" })
  .validator((data: { email: string; password: string }) => data)
  .handler(async ({ data }) => {
    const supabase = createClient();

    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    });

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    if (authData.user) {
      return {
        success: true,
        message: "Check your email to confirm your account",
      };
    }

    return {
      success: false,
      error: "Registration failed",
    };
  });
