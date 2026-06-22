"use client";

const  ManageProfileTab = ({ 
  profile, 
  setProfile, 
  sessionUser, 
  isUpdating, 
  isUploading, 
  fileInputRef, 
  handleProfileUpdate, 
  handleImageReupload 
}) =>  {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start animate-fadeIn w-full">
      
      {/* Left Column Fields form */}
      <div className="lg:col-span-2 bg-[#050a12] border border-[#111927] rounded-none overflow-hidden w-full">
        <div className="p-4 border-b border-[#111927] bg-[#080f1b]">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#e0a96d]">Profile Info Modifier</h3>
        </div>
        
        <form className="p-6 space-y-6" onSubmit={handleProfileUpdate}>
          <div>
            <label className="block text-[10px] font-mono uppercase text-slate-400 tracking-wider mb-2">Full Name *</label>
            <input 
              type="text" 
              placeholder={sessionUser?.name || "Loading name..."}
              value={profile.fullName} 
              onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
              className="w-full bg-[#09101d] border border-[#162235] px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-[#e0a96d]/50 font-mono rounded-none" 
            />
          </div>

          <button 
            type="submit" 
            disabled={isUpdating || isUploading}
            className="w-full sm:w-auto bg-[#e0a96d] text-black font-medium text-xs tracking-wider uppercase px-5 py-2.5 hover:bg-[#cca25a] disabled:bg-zinc-700 disabled:text-zinc-400 disabled:cursor-not-allowed transition-colors rounded-none font-mono"
          >
            {isUpdating ? "Updating Account..." : "Update Information"}
          </button>
        </form>
      </div>

     
      <div className="border border-[#111927] bg-[#050a12] p-6 flex flex-col items-center space-y-4">
        <h3 className="w-full text-left text-xs font-mono uppercase tracking-wider text-[#e0a96d] border-b border-[#111927] pb-3">
          Profile Avatar Asset *
        </h3>
        
        <div className="p-4 border border-dashed border-[#162235] w-full flex flex-col items-center bg-[#03060b]">
          <div className="w-28 h-32 bg-zinc-900 border border-zinc-800 relative group overflow-hidden flex items-center justify-center text-zinc-600 mb-4">
            {profile.avatar ? (
              <>
                <img src={profile.avatar} alt="Preview" className="w-full h-full object-cover object-top" />
                <button
                  type="button"
                  disabled={isUploading}
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-1 text-[10px] text-[#e0a96d] font-mono tracking-wider font-medium cursor-pointer disabled:cursor-not-allowed"
                >
                  <span>✏️</span>
                  <span>EDIT IMAGE</span>
                </button>
              </>
            ) : (
              <div className="text-[9px] uppercase font-mono text-amber-500/80">
                {isUploading ? "Processing..." : "Avatar Missing"}
              </div>
            )}
          </div>

          <div className="w-full space-y-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageReupload}
              accept="image/*"
              className="hidden"
              disabled={isUploading}
            />

            <button
              type="button"
              disabled={isUploading}
              onClick={() => fileInputRef.current?.click()}
              className="w-full border border-zinc-800 bg-[#09101d] hover:bg-zinc-800/80 text-[10px] font-mono uppercase tracking-wider text-gray-300 py-2.5 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{isUploading ? "Uploading Asset..." : "Upload New Photo"}</span>
            </button>

            <input
              type="url"
              name="avatar"
              required
              placeholder="https://example.com/avatar.jpg"
              value={profile.avatar}
              onChange={(e) => setProfile({ ...profile, avatar: e.target.value })}
              className="w-full bg-[#09101d] border border-[#162235] px-2 py-1.5 text-[11px] text-gray-200 font-mono focus:outline-none focus:border-[#e0a96d]/50"
            />
          </div>
        </div>
      </div>

    </div>
  );
};

export default ManageProfileTab;