
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const SkeletonTransactionList = () => {
  return (
    <div className="space-y-4 p-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-3 w-[150px]" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-6 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
};
