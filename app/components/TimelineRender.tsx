import remarkGfm from 'remark-gfm';
import ReactMarkdown from 'react-markdown';

interface Milestone {
  time: string;
  status: string;
  title: string;
  content: string;
}

function parseAttributes(block: string) {
  const get = (key: string) => {
    const m = block.match(new RegExp(`${key}\\s*=\\s*["'][^"']*["']`));
    return m ? m[0].replace(/^[^=]*=\s*["']|["']$/g, '').trim() : '';
  };
  return { time: get('time'), status: get('status') || 'pending', title: get('title') };
}

function cleanContent(raw: string) {
  return raw
    .replace(/(?:time|status|title)\s*=\s*["'][^"']*["']/g, '')
    .replace(/^\s*\{\s*\}/, '')
    .replace(/\s*:::\s*$/g, '')
    .trim();
}

export default function TimelineRender({ children }: { children: string }) {
  const raw = children
    .replace(/^\s*:::\s*timeline\s*/i, '')
    .replace(/^:::\s*$/gm, '')
    .trim();

  const parts = raw.split(/::milestone\s*/);

  const preamble = parts[0].trim();
  const milestones: Milestone[] = parts
    .slice(1)
    .map((part) => {
      const attrs = parseAttributes(part);
      return { ...attrs, content: cleanContent(part) };
    })
    .filter((m) => m.title || m.time || m.content);

  const statusColors: Record<string, string> = {
    completed: 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]',
    active: 'bg-sky-500 animate-pulse shadow-[0_0_10px_rgba(56,189,248,0.6)]',
    pending: 'bg-slate-700 border border-slate-500'
  };

  return (
    <div className="my-6 relative border-l-2 border-slate-700/60 ml-3 pl-6 space-y-8">
      {preamble && (
        <div className="text-xs text-slate-400 leading-relaxed whitespace-pre-line">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{preamble}</ReactMarkdown>
        </div>
      )}

      {milestones.map((m, idx) => (
        <div key={idx} className="relative group animate-reveal">
          {/* Timeline node icon dot */}
          <span className={`absolute -left-[33px] top-1 w-4 h-4 rounded-full z-10 transition-colors ${statusColors[m.status] || statusColors.pending}`} />

          <div className="bg-slate-900/40 border border-white/[0.04] rounded-xl p-4 shadow-sm hover:border-white/[0.08] transition-all">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-2">
              <h4 className="text-sm font-semibold text-slate-100 tracking-wide">{m.title}</h4>
              {m.time && <span className="text-xs font-mono px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 self-start sm:self-center font-bold">{m.time}</span>}
            </div>
            <div className="text-xs text-slate-400 leading-relaxed whitespace-pre-line">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.content}</ReactMarkdown>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}