"use client";

const  Sidebar = ({ activeTab, setActiveTab, isSidebarOpen, setIsSidebarOpen, profile, sessionUser }) =>  {
  return (
    <>
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-[#050a12] border-r border-[#111927] flex flex-col justify-between shrink-0 transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:h-screen lg:sticky lg:top-0
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div>
          <div className="p-6 hidden lg:block">
            <h1 className="text-2xl font-serif text-[#e0a96d] tracking-wide font-medium">LexVizo</h1>
            <span className="text-[10px] text-slate-500 tracking-widest block mt-1 font-mono">USER MANAGEMENT</span>
          </div>

          <nav className="mt-20 lg:mt-4 px-3 space-y-1">
            <button 
              onClick={() => { setActiveTab('hiring-history'); setIsSidebarOpen(false); }}
              className={`w-full text-left px-4 py-3 text-sm tracking-wider uppercase  transition-all flex items-center gap-3 rounded-none ${
                activeTab === 'hiring-history' ? 'bg-[#111927] text-[#e0a96d]' : 'text-slate-400 hover:bg-[#09101d] hover:text-slate-200'
              }`}
            >
              ⏱️ Hiring History
            </button>
            <button 
              onClick={() => { setActiveTab('update-profile'); setIsSidebarOpen(false); }}
              className={`w-full text-left px-4 py-3 text-sm tracking-wider uppercase  transition-all flex items-center gap-3 rounded-none ${
                activeTab === 'update-profile' ? 'bg-[#111927] text-[#e0a96d]' : 'text-slate-400 hover:bg-[#09101d] hover:text-slate-200'
              }`}
            >
              👤 Manage Profile
            </button>
            <button 
              onClick={() => { setActiveTab('comments'); setIsSidebarOpen(false); }}
              className={`w-full text-left px-4 py-3 text-sm tracking-wider uppercase  transition-all flex items-center gap-3 rounded-none ${
                activeTab === 'comments' ? 'bg-[#111927] text-[#e0a96d]' : 'text-slate-400 hover:bg-[#09101d] hover:text-slate-200'
              }`}
            >
              💬 Manage Comments
            </button>
          </nav>
        </div>
        
        <div className="p-4 border-t border-[#111927] flex flex-col gap-2 bg-[#03060b]">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 bg-[#111927] border border-[#1d2d44] flex items-center justify-center text-[10px] font-mono text-[#e0a96d] font-bold overflow-hidden">
              {profile.avatar ? (
                <img src={profile.avatar} alt="mini-avatar" className="w-full h-full object-cover" />
              ) : (
                profile.fullName ? profile.fullName.charAt(0).toUpperCase() : "U"
              )}
            </div>
            <div className="truncate max-w-[170px]">
              <p className="text-[11px] font-mono font-medium text-slate-200 truncate">{profile.fullName || "Loading..."}</p>
              <p className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">{sessionUser?.role || "Client"}</p>
            </div>
          </div>
          <span className="text-[9px] text-slate-600 font-mono mt-1 block">LexVizo System v1.0</span>
        </div>
      </aside>

      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-30 lg:hidden"
        />
      )}
    </>
  );
}


export default Sidebar;