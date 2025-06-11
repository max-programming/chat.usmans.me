import { Skeleton } from "../ui/skeleton";

interface ChatMessageSkeletonProps {
  isUser?: boolean;
}

export function ChatMessageSkeleton({
  isUser = false,
}: ChatMessageSkeletonProps) {
  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-xs lg:max-w-md">
          <div className="rounded-lg p-3 bg-muted">
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <Skeleton className="h-3 w-16 mt-1" />
          </div>

          <div className="flex mt-2 gap-1 justify-end mr-2">
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-2">
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        <Skeleton className="h-3 w-16 mt-2" />
      </div>

      <div className="flex mt-2 gap-1 justify-start">
        <Skeleton className="h-8 w-8 rounded-md" />
        <Skeleton className="h-8 w-8 rounded-md" />
      </div>
    </div>
  );
}

export function ChatMessagesSkeleton() {
  return (
    <div className="space-y-4">
      <ChatMessageSkeleton isUser={true} />
      <ChatMessageSkeleton />
      <ChatMessageSkeleton isUser={true} />
      <ChatMessageSkeleton />
      <ChatMessageSkeleton isUser={true} />
      <ChatMessageSkeleton />
      <ChatMessageSkeleton />
      <ChatMessageSkeleton isUser={true} />
      <ChatMessageSkeleton />
    </div>
  );
}
