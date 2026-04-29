export default function AthenaLoading() {
  return (
    <div className="flex items-start space-x-4 animate-reveal">
      {/* Athena Avatar Icon */}
      <div className="shrink-0 w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-sky-400 border border-slate-700">
          <img
            src="/athena_logo_v3.svg" // Update this with your actual image path
            alt="Athena - Motion-U Guide Avatar"
            className="w-full h-full object-cover" // Ensures the image fills the container beautifully
          />
      </div>
      
      {/* Loading Bubble */}
      <div className="bg-slate-800/80 p-4 rounded-2xl rounded-tl-none border border-white/5 shadow-lg flex space-x-2 items-center">
        <div className="w-2 h-2 bg-sky-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-2 h-2 bg-sky-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-2 h-2 bg-sky-400 rounded-full animate-bounce"></div>
      </div>
    </div>
  );
}