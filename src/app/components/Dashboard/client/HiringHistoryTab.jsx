"use client";

const HiringHistoryTab = ({ hiringHistory, paymentSuccessId, handlePayment }) => {
  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
          Dashboard &gt; <span className="text-[#e0a96d]">Hiring History</span>
        </div>
        <h2 className="text-2xl lg:text-3xl font-serif text-slate-100 mt-2 font-normal tracking-wide">Hiring Requests Log</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#050a12] border border-[#111927] p-5 rounded-none">
          <p className="text-[9px] font-mono text-slate-500 tracking-widest uppercase">Total Pipeline</p>
          <p className="text-2xl font-serif text-slate-100 mt-2 font-semibold">03</p>
        </div>
        <div className="bg-[#050a12] border border-[#e0a96d]/30 p-5 rounded-none">
          <p className="text-[9px] font-mono text-[#e0a96d] tracking-widest uppercase">Pending Lawyer Action</p>
          <p className="text-2xl font-serif text-[#e0a96d] mt-2 font-semibold">01</p>
        </div>
        <div className="bg-[#050a12] border border-[#111927] p-5 rounded-none">
          <p className="text-[9px] font-mono text-slate-500 tracking-widest uppercase">Acceptance Rate</p>
          <p className="text-2xl font-serif text-slate-100 mt-2 font-semibold">100%</p>
        </div>
        <div className="bg-[#050a12] border border-[#111927] p-5 rounded-none">
          <p className="text-[9px] font-mono text-slate-500 tracking-widest uppercase">Active Pipelines</p>
          <p className="text-2xl font-serif text-slate-100 mt-2 font-semibold">01</p>
        </div>
      </div>

      <div className="bg-[#050a12] border border-[#111927] rounded-none overflow-hidden">
        <div className="bg-[#f2b97e] text-black px-4 py-2 flex flex-col sm:flex-row justify-between items-start sm:items-center text-[10px] uppercase font-mono font-bold tracking-widest rounded-none gap-1">
          <span>Active Hiring Pipeline Records</span>
          <span className="text-black/60 font-normal">System Realtime Synchronized</span>
        </div>
        
        {/* Mobile Grid Layout */}
        <div className="block md:hidden divide-y divide-[#111927]">
          {hiringHistory.map((item) => (
            <div key={item.id} className="p-4 space-y-3 bg-[#050a12] hover:bg-[#080f1b]/30 transition-colors">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-sm font-semibold text-slate-200">{item.lawyer}</h4>
                  <p className="text-[11px] text-slate-500 font-mono mt-0.5">{item.date}</p>
                </div>
                <div>
                  {item.status === 'pending' && <span className="text-amber-500 border border-amber-500/30 font-mono text-[9px] px-2 py-0.5 uppercase bg-amber-950/20">Pending Action</span>}
                  {item.status === 'rejected' && <span className="text-rose-500 border border-rose-500/30 font-mono text-[9px] px-2 py-0.5 uppercase bg-rose-950/20">Rejected</span>}
                  {item.status === 'accepted' && <span className="text-emerald-400 border border-emerald-500/20 font-mono text-[9px] px-2 py-0.5 uppercase bg-emerald-950/20">Accepted</span>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 font-mono">
                <div>
                  <span className="text-slate-500 block text-[9px] uppercase tracking-wider">Specialization</span>
                  <span className="text-slate-300 font-sans text-xs">{item.specialization}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[9px] uppercase tracking-wider">Fee Metric</span>
                  <span className="text-[#e0a96d] text-xs">{item.fee}</span>
                </div>
              </div>

              {item.status === 'accepted' && (
                <div className="pt-2 flex justify-end">
                  {paymentSuccessId === item.id ? (
                    <span className="text-teal-400 text-xs font-mono py-1 animate-pulse">✓ Retainer Paid</span>
                  ) : (
                    <button 
                      onClick={() => handlePayment(item.id)}
                      className="w-full text-center bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs py-2 transition-colors rounded-none font-mono uppercase tracking-wider"
                    >
                      Pay Retainer Fee
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Desktop Table Layout */}
        <div className="hidden md:block w-full overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#03060b] text-[10px] text-slate-500 uppercase tracking-wider font-mono border-b border-[#111927]">
              <tr>
                <th className="py-3 px-6 font-normal">Lawyer Name</th>
                <th className="py-3 px-6 font-normal">Specialisation</th>
                <th className="py-3 px-6 font-normal">Fee Metric</th>
                <th className="py-3 px-6 font-normal">Hiring Date</th>
                <th className="py-3 px-6 font-normal text-right">Status / Actions Target</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#111927]/60">
              {hiringHistory.map((item) => (
                <tr key={item.id} className="hover:bg-[#080f1b]/50 transition-colors">
                  <td className="py-4 px-6 font-semibold text-slate-200">{item.lawyer}</td>
                  <td className="py-4 px-6 text-slate-400">{item.specialization}</td>
                  <td className="py-4 px-6 font-mono text-[#e0a96d]">{item.fee}</td>
                  <td className="py-4 px-6 text-slate-400">{item.date}</td>
                  <td className="py-4 px-6 text-right">
                    {item.status === 'pending' && <span className="text-amber-500 border border-amber-500/30 font-mono text-[10px] px-2 py-0.5 uppercase tracking-wide bg-amber-950/20 rounded-none">Pending Action</span>}
                    {item.status === 'rejected' && <span className="text-rose-500 border border-rose-500/30 font-mono text-[10px] px-2 py-0.5 uppercase tracking-wide bg-rose-950/20 rounded-none">Rejected</span>}
                    {item.status === 'accepted' && (
                      <div className="flex justify-end items-center gap-3">
                        <span className="text-emerald-400 font-mono text-[10px] uppercase tracking-wide">Accepted</span>
                        {paymentSuccessId === item.id ? (
                          <span className="text-teal-400 text-[11px] font-mono animate-pulse">✓ Retainer Paid</span>
                        ) : (
                          <button onClick={() => handlePayment(item.id)} className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-[11px] px-3 py-1 transition-colors rounded-none">Pay Fee</button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HiringHistoryTab;