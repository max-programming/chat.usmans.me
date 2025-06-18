import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import { queries } from "@/lib/queries";
import type { InfiniteChats } from "@/server/chats/getChatsInfinite";

export function useInfiniteChats(limit = 20) {
  const { ref, inView } = useInView();

  const queryResult = useSuspenseInfiniteQuery({
    ...queries.chats.infinite(limit),
    initialPageParam: undefined,
    getNextPageParam: (lastPage: InfiniteChats) => lastPage.nextCursor,
  });

  const { fetchNextPage, hasNextPage, isFetchingNextPage } = queryResult;

  // Fetch next page when the loader comes into view
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage, isFetchingNextPage]);

  // Flatten all pages into a single array of chats
  const allChats = queryResult.data.pages.flatMap(page => page.chats);

  return {
    ...queryResult,
    allChats,
    loadMoreRef: ref,
    isLoadingMore: isFetchingNextPage,
  };
}
