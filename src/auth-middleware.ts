import { createMiddleware } from "@tanstack/react-start";
import { getSession } from "./server/getSession";
import { fetchUser } from "./server/fetchUser";

export const authMiddleware = createMiddleware({ type: "function" }).server(
  async ({ next }) => {
    const session = await getSession();
    if (!session) {
      throw new Error("User not found");
    }
    return next({
      context: {
        user: session,
      },
    });
  }
);

export const authApiMiddleware = createMiddleware({ type: "request" }).server(
  async ({ next }) => {
    const session = await getSession();
    if (!session) {
      throw new Error("User not found");
    }
    return next({
      context: {
        user: session,
      },
    });
  }
);

export const authUserMiddleware = createMiddleware({ type: "function" }).server(
  async ({ next }) => {
    const user = await fetchUser();
    if (!user) {
      throw new Error("User not found");
    }
    return next({
      context: {
        user,
      },
    });
  }
);
