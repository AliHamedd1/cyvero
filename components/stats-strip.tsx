export function StatsStrip({
  stats,
}: {
  stats: Array<{ label: string; value: string }>;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label} className="panel-soft p-6 text-center">
          <div className="font-heading text-4xl text-white">{stat.value}</div>
          <p className="mt-3 text-sm text-steel">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
