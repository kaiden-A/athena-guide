export default function TargetAudienceCard({ data }: { data: any }) {
  try {
    const parsed = typeof data === 'string' ? JSON.parse(data.trim()) : data;
    return (
      <div className="my-5 bg-linear-to-b from-slate-800/80 to-slate-900/80 border border-sky-500/20 rounded-xl p-5 shadow-lg">
        <h4 className="text-xs uppercase tracking-wider text-sky-400 font-bold mb-3">✨ Ideal Target Profiles</h4>
        <ul className="space-y-2 mb-4">
          {parsed.idealFor?.map((item: string, i: number) => (
            <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
              <span className="text-sky-400 mt-0.5">✔</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
        {parsed.prerequisites && (
          <div className="pt-3 border-t border-slate-700/50 text-xs">
            <span className="text-slate-400 font-semibold">⚡ Prerequisites: </span>
            <span className="text-slate-300 font-mono text-[11px]">{parsed.prerequisites}</span>
          </div>
        )}
      </div>
    );
  } catch (e) {
    return <pre className="text-xs text-red-400 p-2 bg-red-950/20 rounded">Data Frame Render Error</pre>;
  }
}