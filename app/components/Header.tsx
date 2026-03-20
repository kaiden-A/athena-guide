

export default function Header(){

    return(
        <header className="w-full py-6 px-8 flex justify-between items-center relative z-10 shrink-0">
            <div className="flex items-center space-x-3 group cursor-pointer">
                {/* --- Logo Replacement --- */}
                <img 
                src="/icon.png" 
                alt="Motion-U Logo" 
                className="w-9 h-9 object-contain group-hover:scale-105 transition-transform duration-200" 
                />
                
                <span className="font-semibold text-lg text-slate-200">
                Motion-U
                </span>
            </div>
            
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">
                athena-guide
            </span>
        </header>
    )
}