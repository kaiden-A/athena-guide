import remarkGfm from 'remark-gfm';
import ReactMarkdown from 'react-markdown';

export default function TimelineRender({ children }: { children: string }) {
  // Extract milestones by splitting on ::milestone
  const milestones = children.split('::milestone').filter(Boolean);

  return (
    <div className="my-6 relative border-l-2 border-slate-700/60 ml-3 pl-6 space-y-8">
      {milestones.map((m, idx) => {
        // Regex match attributes like time="08:30 AM" status="completed" title="..."
        const timeMatch = m.match(/time="([^"]+)"/);
        const statusMatch = m.match(/status="([^"]+)"/);
        const titleMatch = m.match(/title="([^"]+)"/);
        
        // Clean out the attributes tags to get the inner body content text
        const content = m.replace(/\{[^}]+\}/g, '').trim();

        const time = timeMatch ? timeMatch[1] : '';
        const status = statusMatch ? statusMatch[1] : 'pending';
        const title = titleMatch ? titleMatch[1] : '';

        // Match badge colors based on your status schema rules
        const statusColors: Record<string, string> = {
          completed: 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]',
          active: 'bg-sky-500 animate-pulse shadow-[0_0_10px_rgba(56,189,248,0.6)]',
          pending: 'bg-slate-700 border border-slate-500'
        };

        return (
          <div key={idx} className="relative group animate-reveal">
            {/* Timeline node icon dot */}
            <span className={`absolute -left-[33px] top-1 w-4 h-4 rounded-full z-10 transition-colors ${statusColors[status] || statusColors.pending}`} />
            
            <div className="bg-slate-900/40 border border-white/[0.04] rounded-xl p-4 shadow-sm hover:border-white/[0.08] transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-2">
                <h4 className="text-sm font-semibold text-slate-100 tracking-wide">{title}</h4>
                {time && <span className="text-xs font-mono px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 self-start sm:self-center font-bold">{time}</span>}
              </div>
              <div className="text-xs text-slate-400 leading-relaxed whitespace-pre-line">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}