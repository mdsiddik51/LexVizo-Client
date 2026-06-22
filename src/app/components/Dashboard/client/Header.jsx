"use client";

const Header = ({ setActiveTab, profile }) => {
  return (
    <header className="min-h-16 h-auto py-3 lg:py-0 border-b border-[#111927] flex flex-col sm:flex-row items-center justify-between px-4 lg:px-8 gap-4 bg-[#050a12]">
      <div className="relative w-full sm:w-72 md:w-96">
        <span className="absolute inset-y-0 left-3 flex items-center text-slate-500 text-sm">🔍</span>
        <input 
          type="text" 
          placeholder="Search history records..." 
          className="w-full bg-[#09101d] border border-[#162235] rounded-none px-9 py-1.5 text-xs text-slate-300 placeholder-slate-500 focus:outline-none"
        />
      </div>
      
      <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
        <button 
          onClick={() => setActiveTab('update-profile')}
          className="border border-[#e0a96d]/40 text-[#e0a96d] hover:bg-[#e0a96d] hover:text-black font-mono transition-all text-[11px] uppercase tracking-wider px-3 py-1.5 rounded-none"
        >
          Update Profile
        </button>
        <div className="w-7 h-7 bg-[#111927] border border-[#1d2d44] flex items-center justify-center text-xs font-mono text-[#e0a96d] font-bold rounded-none shrink-0 overflow-hidden">
          {profile.avatar ? (
            <img src={profile.avatar} alt="User avatar" className="w-full h-full object-cover" />
          ) : (
            profile.fullName ? profile.fullName.charAt(0).toUpperCase() : "U"
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;