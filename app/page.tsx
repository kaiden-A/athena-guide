"use client"

import { useState, useRef, useEffect } from 'react';
import Header from './components/Header';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
  text: string;
  isUser: boolean;
  time?: string;
}

function getTime() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

const WELCOME: Message = {
  text: "Welcome! My name is Athena and I'm happy to help you navigate Motion-U today. What are you looking to build or explore?",
  isUser: false,
  time: getTime(),
};

export default function AthenaChat() {
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(false);
  const [snapshot, setSnapshot] = useState<Message[]>([]);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleClear = () => {
    // Save current messages so undo can restore them
    setSnapshot(messages);
    setMessages([WELCOME]);

    // Show toast for 4 seconds
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast(true);
    toastTimer.current = setTimeout(() => setToast(false), 4000);
  };

  const handleUndo = () => {
    setMessages(snapshot);
    setToast(false);
    if (toastTimer.current) clearTimeout(toastTimer.current);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input;
    const timestamp = getTime();
    const updatedMessages = [...messages, { text: userMsg, isUser: true, time: timestamp }];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    const conversationContext = updatedMessages.slice(-3).map(msg => ({
      role: msg.isUser ? "user" : "assistant",
      content: msg.text,
    }));

    try {
      const response = await fetch('/api/ask/athena', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: userMsg,
          history: conversationContext,
          top_k: 5,
        }),
      });
      const reply = await response.json();
      setMessages(prev => [...prev, { text: reply.answer, isUser: false, time: getTime() }]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="celestial-bg min-h-screen font-sans text-athena-text flex flex-col overflow-hidden">
      <Header />

      <div className="flex-1 flex items-center justify-center px-4 py-6">
        <div className="flex w-full max-w-5xl h-[80vh] bg-[rgba(18,19,35,0.65)] backdrop-blur-xl border border-white/[0.06] rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.4)]">

          {/* ── Sidebar ── */}
          <aside className="hidden md:flex w-64 bg-[rgba(10,11,22,0.5)] border-r border-white/[0.06] flex-col p-6 shrink-0">
            <div className="flex items-center gap-3 mb-10">
              <img src="/athena_logo_v3.svg" alt="Motion-U Athena Logo" className="w-8 h-8 object-contain" />
              <h2 className="text-lg font-semibold tracking-wide text-slate-100">Motion-U</h2>
            </div>
            <div className="grow">
              <h3 className="text-[0.75rem] text-slate-500 uppercase tracking-widest mb-3">Athena Guide</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Have a question about Motion-U? I've got you covered.
              </p>
            </div>
            <div className="font-mono text-[0.7rem] text-white/20">SYSTEM // ACTIVE</div>
          </aside>

          {/* ── Main Chat Window ── */}
          <main className="flex flex-col flex-1 h-full bg-[rgba(15,16,32,0.2)] min-w-0 relative">

            {/* Chat header */}
            <header className="flex items-center justify-between px-6 py-4 bg-[rgba(12,13,26,0.4)] border-b border-white/[0.06] shrink-0">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-sky-500 shadow-[0_0_10px_rgba(56,189,248,0.3)] flex items-center justify-center overflow-hidden">
                  <img src="/athena_logo_v3.svg" alt="Athena Avatar" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-slate-100">Athena</h2>
                  <span className="flex items-center gap-1.5 text-xs text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                    Online
                  </span>
                </div>
              </div>
              <button
                onClick={handleClear}
                title="Clear Conversation"
                className="text-slate-500 hover:text-red-400 hover:bg-red-400/10 p-2 rounded-lg transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6h18M8 6V4a1 1 0 011-1h6a1 1 0 011 1v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                </svg>
              </button>
            </header>

            {/* ── Undo Toast ── */}
            <div
              className={`absolute top-[72px] left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-4 py-2.5 rounded-xl bg-slate-800 border border-white/10 shadow-xl text-sm text-slate-200 transition-all duration-300 ${
                toast ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
              }`}
            >
              <span>Conversation cleared</span>
              <button
                onClick={handleUndo}
                className="text-sky-400 hover:text-sky-300 font-medium transition-colors"
              >
                Undo
              </button>
            </div>

            {/* Messages */}
            <section
              ref={scrollRef}
              className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-5 scroll-smooth custom-scrollbar"
            >
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex gap-3 max-w-[75%] animate-reveal ${msg.isUser ? 'self-end flex-row-reverse' : 'self-start'}`}
                >
                  <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold overflow-hidden ${msg.isUser ? 'bg-sky-600 text-white' : 'bg-slate-800'}`}>
                    {msg.isUser ? 'U' : (
                      <img src="/athena_logo_v3.svg" alt="Athena" className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className={`flex flex-col gap-1 ${msg.isUser ? 'items-end' : 'items-start'}`}>
                    <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed border border-white/[0.03] shadow-md overflow-x-auto custom-scrollbar ${
                      msg.isUser
                        ? 'bg-sky-600 text-white rounded-tr-[2px]'
                        : 'bg-[#1e2038] text-slate-200 rounded-tl-[2px]'
                    }`}>
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          strong: ({ node, ...props }) => <span className="font-bold text-sky-400" {...props} />,
                          a: ({ node, href, ...props }) => (
                            <a
                              href={href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`font-medium underline decoration-sky-400/50 hover:decoration-sky-400 transition-colors ${
                                msg.isUser ? 'text-white underline-offset-4' : 'text-sky-400 hover:text-sky-300'
                              }`}
                              {...props}
                            />
                          ),
                          table: ({ node, ...props }) => (
                            <div className="my-4 overflow-x-auto rounded-lg border border-slate-700/50">
                              <table className="w-full text-left border-collapse text-xs" {...props} />
                            </div>
                          ),
                          thead: ({ node, ...props }) => <thead className="bg-slate-900/80 text-sky-400 uppercase tracking-wider font-semibold" {...props} />,
                          th: ({ node, ...props }) => <th className="p-3 border-b border-slate-700" {...props} />,
                          td: ({ node, ...props }) => <td className="p-3 border-b border-slate-700/40 bg-slate-800/40 max-w-xs whitespace-normal break-words" {...props} />,
                          tr: ({ node, ...props }) => <tr className="hover:bg-slate-700/20 transition-colors" {...props} />,
                        }}
                      >
                        {msg.text}
                      </ReactMarkdown>
                    </div>
                    {msg.time && (
                      <span className="text-[0.7rem] text-slate-500 px-1">{msg.time}</span>
                    )}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-3 self-start">
                  <div className="shrink-0 w-8 h-8 rounded-full bg-slate-800 overflow-hidden">
                    <img src="/athena_logo_v3.svg" alt="Athena" className="w-full h-full object-cover" />
                  </div>
                  <div className="px-4 py-3 rounded-2xl rounded-tl-[2px] bg-[#1e2038] border border-white/[0.03]">
                    <div className="flex gap-1.5 items-center h-4">
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-bounce [animation-delay:0ms]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-bounce [animation-delay:150ms]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-bounce [animation-delay:300ms]" />
                    </div>
                  </div>
                </div>
              )}
            </section>

            {/* Input dock */}
            <footer className="px-6 py-5 bg-[rgba(12,13,26,0.4)] border-t border-white/[0.06] shrink-0">
              <form
                onSubmit={handleSubmit}
                className="flex items-center gap-2 bg-[rgba(30,32,56,0.5)] border border-white/[0.06] rounded-xl px-2 py-1.5 transition-all focus-within:border-sky-500 focus-within:shadow-[0_0_12px_rgba(56,189,248,0.2)] focus-within:bg-[rgba(30,32,56,0.8)]"
              >
                <textarea
                  rows={1}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                  placeholder="Type something to ask Athena..."
                  className="flex-1 bg-transparent border-none outline-none text-slate-100 text-sm placeholder-slate-500/60 px-3 py-2.5 resize-none min-h-[40px] max-h-40 overflow-y-auto"
                  ref={(el) => {
                    if (el) {
                      el.style.height = 'auto';
                      el.style.height = `${el.scrollHeight}px`;
                    }
                  }}
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="w-9 h-9 rounded-lg bg-sky-500 hover:bg-sky-400 active:scale-95 transition-all flex items-center justify-center text-white disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                  title="Send Message"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" />
                  </svg>
                </button>
              </form>
              <p className="text-[10px] text-center mt-4 text-slate-600 uppercase tracking-[0.2em] font-medium opacity-60">
                GUIDED BY MOTION-U INTELLIGENCE
              </p>
            </footer>
          </main>
        </div>
      </div>
    </div>
  );
}