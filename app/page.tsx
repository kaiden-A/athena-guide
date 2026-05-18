"use client"

import { useState, useRef, useEffect } from 'react';
import Header from './components/Header';
import UpperSection from './components/UpperSection';
import AthenaLoading from './components/AthenaLoading';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'; 

interface Message {
  text: string;
  isUser: boolean;
}

export default function AthenaChat() {
    const [messages, setMessages] = useState<Message[]>([
      { text: "Welcome! My name is Athena and I'm happy to help you", isUser: false }
    ]);
    const [input, setInput] = useState("");
    const [isLoading , setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom when messages change
    useEffect(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }, [messages]);

    const handleSubmit = async (e : any) => {
      e.preventDefault();
      if (!input.trim()) return;

      const userMsg = input;
      // 1. Instantly append the user message to the UI
      const updatedMessages = [...messages, { text: userMsg, isUser: true }];
      setMessages(updatedMessages);
      setInput("");
      setIsLoading(true);

      // 2. Package up recent messages for conversational context.
      // We grab the last 5 messages to avoid sending an infinitely growing history payload.
      const conversationContext = updatedMessages.slice(-3).map(msg => ({
        role: msg.isUser ? "user" : "assistant",
        content: msg.text
      }));

      try {
        // 3. Send the formatted history down to your API route
        const response = await fetch('/api/ask/athena', {
          method : 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body : JSON.stringify({
            question : userMsg, 
            history: conversationContext, // Your API route can now read this history
            top_k : 5
          })
        });

        const reply = await response.json();
        setMessages(prev => [...prev, { text: reply.answer, isUser: false }]);
      } catch(error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <div className="celestial-bg min-h-screen font-sans text-athena-text flex flex-col overflow-y-auto">
        <Header/>

        <main className="grow flex flex-col items-center px-4 py-8 relative z-10">
          <div className="w-full max-w-2xl flex flex-col space-y-8">
            <UpperSection/>

            <div className="glass-effect rounded-4xl overflow-hidden flex flex-col h-100 shadow-2xl animate-fade-in [animation-delay:200ms]">
              <div 
                ref={scrollRef}
                className="grow p-6 overflow-y-auto space-y-6 scroll-smooth custom-scrollbar"
              >
                {messages.map((msg, i) => (
                  <div key={i} className={`flex items-start ${msg.isUser ? 'justify-end' : ''} space-x-4 animate-reveal`}>
                    {!msg.isUser && (
                      <div className="shrink-0 w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-sky-400 border border-slate-700">
                        <img
                          src="/athena_logo_v3.svg"
                          alt="Athena - Motion-U Guide Avatar"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className={`p-4 rounded-2xl rounded-tl-none border border-white/5 shadow-lg max-w-[85%] ${
                      msg.isUser ? 'bg-sky-500 text-white' : 'bg-slate-800/80 text-slate-200'
                    }`}>

                      <div className="text-sm leading-relaxed overflow-x-auto custom-scrollbar">
                        <ReactMarkdown 
                          remarkPlugins={[remarkGfm]} 
                          components={{
                            strong: ({node, ...props}) => <span className="font-bold text-sky-400" {...props} />,
                            
                            a: ({node, href, ...props}) => (
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

                            table: ({node, ...props}) => (
                              <div className="my-4 overflow-x-auto rounded-lg border border-slate-700/50">
                                <table className="w-full text-left border-collapse text-xs" {...props} />
                              </div>
                            ),
                            thead: ({node, ...props}) => <thead className="bg-slate-900/80 text-sky-400 uppercase tracking-wider font-semibold" {...props} />,
                            th: ({node, ...props}) => <th className="p-3 border-b border-slate-700" {...props} />,
                            td: ({node, ...props}) => <td className="p-3 border-b border-slate-700/40 bg-slate-800/40 max-w-xs whitespace-normal break-words" {...props} />,
                            tr: ({node, ...props}) => <tr className="hover:bg-slate-700/20 transition-colors" {...props} />
                          }}
                        >
                          {msg.text}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </div>
                ))}

                {isLoading && <AthenaLoading />}
              </div>

              <div className="p-4 bg-slate-900/60 border-t border-white/5 shrink-0">
                <form className="relative flex items-end gap-2" onSubmit={handleSubmit}>
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
                    placeholder="Type something..."
                    className="w-full py-3 pl-5 pr-14 bg-slate-800/90 rounded-xl border border-transparent focus:border-sky-500/50 focus:ring-0 transition-all text-slate-100 text-sm outline-none resize-none min-h-11.5 max-h-40 overflow-y-auto"
                    style={{ height: 'auto' }}
                    ref={(el) => {
                      if (el) {
                        el.style.height = 'auto';
                        el.style.height = `${el.scrollHeight}px`;
                      }
                    }}
                  />
                  <button
                    className="absolute right-2 bottom-1.5 bg-sky-500 text-white p-2 rounded-lg hover:bg-sky-400 transition-all shadow-lg"
                    type="submit"
                    disabled={isLoading || !input.trim()}
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                    </svg>
                  </button>
                </form>
                <p className="text-[10px] text-center mt-5 text-slate-500 uppercase tracking-[0.2em] font-medium opacity-60">
                  GUIDED BY MOTION-U INTELLIGENCE
                </p>
              </div>
            </div>
          </div>
        </main>

        <footer className="py-12 text-center text-[10px] text-slate-600 uppercase tracking-widest shrink-0">
          <p>© 2026 Motion-U • Intelligence</p>
        </footer>
      </div>
    );
}