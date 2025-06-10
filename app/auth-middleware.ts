import { createMiddleware } from "@tanstack/react-start";
import { fetchUser } from "./server/fetchUser";

export const authMiddleware = createMiddleware().server(async ({ next }) => {
  const user = await fetchUser();
  if (!user) {
    throw new Error("User not found");
  }
  return next({
    context: {
      user,
    },
  });
});
