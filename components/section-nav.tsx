export type NavItem = { id: string; label: string };

export function SectionNav({ items }: { items: NavItem[] }) {
  if (items.length < 2) return null;

  return (
    <nav
      aria-label="Abschnitte"
      className="sticky top-0 z-40 -mx-4 mb-8 border-b border-line bg-canvas/80 px-4 backdrop-blur sm:-mx-8 sm:px-8"
    >
      <ul className="mx-auto flex max-w-6xl gap-1 overflow-x-auto py-2">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className="block whitespace-nowrap rounded-full px-3 py-1.5 text-sm text-muted transition-colors hover:bg-surface hover:text-fg"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
