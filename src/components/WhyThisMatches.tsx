export function WhyThisMatches({ explanation }: { explanation: string }) {
  return (
    <div>
      <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500">Why this matches</h4>
      <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">{explanation}</p>
    </div>
  );
}
