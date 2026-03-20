
export default function UpperSection() {
  return (
    <section className="text-center space-y-4 animate-fade-in shrink-0">
      {/* Outer border/padding ring */}
      <div className="inline-block p-1 bg-slate-700/20 rounded-full mb-2">
        {/* Container for the image, retaining the glow and inner border */}
        <div className="bg-slate-800 rounded-full w-18 h-18 md:w-20 md:h-20 flex items-center justify-center border border-sky-500/20 animate-pulse-glow overflow-hidden">
          {/* --- Image replacement here --- */}
          <img
            src="/athena_logo_lut.png" // Update this with your actual image path
            alt="Athena - Motion-U Guide Avatar"
            className="w-full h-full object-cover" // Ensures the image fills the container beautifully
          />
        </div>
      </div>

      {/* Main heading */}
      <h1 className="text-3xl md:text-4xl font-light text-slate-100 tracking-tight">
        Hello, I'm <span className="font-semibold text-sky-400">Athena</span>.
      </h1>

      {/* Description text */}
      <p className="text-base md:text-lg text-slate-400 max-w-md mx-auto leading-relaxed">
        I'm here to guide you through Motion-U. How Can I help or navigate today?
      </p>
    </section>
  );
}