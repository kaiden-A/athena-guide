"use client"

import { useState, useRef, useEffect } from 'react';
import Header from './components/Header';
import UpperSection from './components/UpperSection';
import AthenaLoading from './components/AthenaLoading';
import ReactMarkdown from 'react-markdown';

export default function AthenaChat() {
    const [messages, setMessages] = useState([
      { text: "Welcome! My name is Athena and I'm happy to help you.", isUser: false }
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
      setMessages(prev => [...prev, { text: userMsg, isUser: true }]);
      setInput("");

      setIsLoading(true);

      //  Athena Response
      try{
        const response = await fetch('/api/ask/athena', {
          method : 'POST',
          body : JSON.stringify({question : userMsg})
        });

        const reply = await response.json();

        setMessages(prev => [...prev, { text: reply.answer, isUser: false }]);

      }catch(error){

      }finally{
        setIsLoading(false);
      }
      
    };

    return (
      <div className="celestial-bg min-h-screen font-sans text-athena-text flex flex-col overflow-y-auto">
        {/* Header */}
        <Header/>

        {/* Main Content */}
        <main className="grow flex flex-col items-center px-4 py-8 relative z-10">
          <div className="w-full max-w-2xl flex flex-col space-y-8">
            
            <UpperSection/>

            {/* Chat Container */}
            <div className="glass-effect rounded-4xl overflow-hidden flex flex-col h-100 shadow-2xl animate-fade-in [animation-delay:200ms]">
              
              <div 
              ref={scrollRef}
              className="grow p-6 overflow-y-auto space-y-6 scroll-smooth custom-scrollbar"
            >
              {messages.map((msg, i) => (
                <div key={i} className={`flex items-start ${msg.isUser ? 'justify-end' : ''} space-x-4 animate-reveal`}>
                  {!msg.isUser && (
                    <div className="shrink-0 w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-sky-400 border border-slate-700">
                      A
                    </div>
                  )}
                  <div className={`p-4 rounded-2xl rounded-tl-none border border-white/5 shadow-lg max-w-[85%] ${
                    msg.isUser ? 'bg-sky-500 text-white' : 'bg-slate-800/80 text-slate-200'
                  }`}>


                    <div className="text-sm leading-relaxed wrap-break-words">
                      <ReactMarkdown 
                        components={{
                          strong: ({node, ...props}) => <span className="font-bold text-sky-400" {...props} />
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

              {/* Input Form */}
              <div className="p-4 bg-slate-900/60 border-t border-white/5 shrink-0">
                <form className="relative" onSubmit={handleSubmit}>
                  <input 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="w-full py-3 pl-5 pr-14 bg-slate-800/90 rounded-xl border border-transparent focus:border-sky-500/50 focus:ring-0 transition-all text-slate-100 text-sm outline-none" 
                    placeholder="Type something..." 
                    type="text" 
                    autoComplete="off"
                  />
                  <button 
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-sky-500 text-white p-2 rounded-lg hover:bg-sky-400 transition-all shadow-lg" 
                    type="submit"
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