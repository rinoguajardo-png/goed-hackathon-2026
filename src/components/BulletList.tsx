interface BulletListProps {
  title: string;
  items: string[];
  emptyLabel?: string;
}

/** Shared renderer for the concerns / what-to-verify / next-steps sections —
 * same shape (title + bullet list), different content and semantics. */
export function BulletList({ title, items, emptyLabel = "None noted" }: BulletListProps) {
  return (
    <div>
      <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500">{title}</h4>
      {items.length > 0 ? (
        <ul className="mt-1 list-inside list-disc space-y-1 text-sm text-gray-700 dark:text-gray-300">
          {items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      ) : (
        <p className="mt-1 text-sm text-gray-400 italic">{emptyLabel}</p>
      )}
    </div>
  );
}
