import type { ActivityItem } from "@/lib/github";
import { formatDate } from "@/lib/format";

export function ActivityFeed({ items }: { items: ActivityItem[] }) {
  return (
    <ol className="divide-y divide-line rounded-xl border border-line bg-surface">
      {items.map((item) => (
        <li key={item.id} className="flex items-center justify-between gap-4 px-5 py-3 text-sm">
          <p className="min-w-0 truncate">
            <span className="text-muted">{item.text} in </span>
            <a
              href={item.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline-offset-4 hover:underline"
            >
              {item.repo}
            </a>
          </p>
          <time dateTime={item.createdAt} className="shrink-0 text-xs text-muted">
            {formatDate(item.createdAt)}
          </time>
        </li>
      ))}
    </ol>
  );
}
