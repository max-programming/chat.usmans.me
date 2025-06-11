import { createMiddleware } from "@tanstack/react-start";
import { getSession } from "./server/getSession";
import { fetchUser } from "./server/fetchUser";

export const authMiddleware = createMiddleware().server(async ({ next }) => {
  const session = await getSession();
  if (!session) {
    throw new Error("User not found");
  }
  return next({
    context: {
      user: session,
    },
  });
});

export const authUserMiddleware = createMiddleware().server(
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
