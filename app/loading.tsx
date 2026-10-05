import { RepoCardSkeleton } from "@/components/repo-card";

const SKELETON_COUNT = 6;

export default function Loading() {
  return (
    <main className="flex-1 px-4 py-12 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 animate-pulse">
          <div className="h-8 w-56 rounded bg-line" />
          <div className="mt-3 h-4 w-72 rounded bg-line" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: SKELETON_COUNT }, (_, i) => (
            <RepoCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </main>
  );
}
