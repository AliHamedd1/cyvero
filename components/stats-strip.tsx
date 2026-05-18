export function StatsStrip({
  stats,
}: {
  stats: Array<{ label: string; value: string }>;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label} className="metric-card text-center">
          <div className="font-heading text-3xl text-white md:text-4xl">{stat.value}</div>
          <p className="mt-2 text-sm text-steel">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
