export function MatchScoreIndicator({ score }: { score: number }) {
  const percent = Math.round(score * 100);
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
        <div className="h-full rounded-full bg-blue-600" style={{ width: `${percent}%` }} />
      </div>
      <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{percent}%</span>
    </div>
  );
}
