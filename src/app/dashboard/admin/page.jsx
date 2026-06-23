"use client";

import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Receipt, 
  User, 
  Gavel, 
  Handshake, 
  TrendingUp, 
  AlertTriangle,
  Star
} from 'lucide-react';

export default function AdminDashboard() {
  // Tabs routing state
  const [activeTab, setActiveTab] = useState('analytics');

  // Dynamic state for functional user management
  const [users, setUsers] = useState([
    { id: '1', name: 'No Way', email: 'noway@lexvizo.com', role: 'ADMIN' },
    { id: '2', name: 'John Doe', email: 'john.doe@example.com', role: 'USER' },
    { id: '3', name: 'Sarah Jenkins', email: 's.jenkins@law.com', role: 'LAWYER' },
    { id: '4', name: 'Michael Chang', email: 'm.chang@ajax.com', role: 'USER' },
  ]);

  const [transactions] = useState([
    { id: 'TXN-90821', email: 'case.handel@law.com', amount: 232, date: '2026-06-22', status: 'PAID' },
    { id: 'TXN-90820', email: 'noway@lexvizo.com', amount: 232, date: '2026-06-21', status: 'PENDING' },
    { id: 'TXN-90819', email: 'no.name@service.com', amount: 323, date: '2026-06-19', status: 'PAID' },
    { id: 'TXN-90818', email: 'no.name@service.com', amount: 323, date: '2026-06-18', status: 'PENDING' },
  ]);

  // Action states
  const [userToDelete, setUserToDelete] = useState(null);

  const handleRoleChange = (userId, newRole) => {
    setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
  };

  const executeDeletion = () => {
    setUsers(users.filter(u => u.id !== userToDelete.id));
    setUserToDelete(null);
  };

  return (
    <div className="min-h-screen bg-[#05080f] text-[#8e9bb2] selection:bg-[#e5a967]/30 flex font-sans antialiased selection:text-white">
      
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-64 bg-[#070b13] border-r border-[#121b2d] flex flex-col justify-between shrink-0">
        <div>
          <div className="p-6 pb-2">
            <h1 className="text-xl font-serif text-[#e5a967] tracking-wide font-medium">LexVizo</h1>
            <p className="text-[9px] text-[#4d5c75] tracking-widest uppercase font-semibold mt-0.5">Legal Management</p>
          </div>

          <nav className="mt-8 px-3 space-y-1">
            <button 
              onClick={() => setActiveTab('analytics')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-xs tracking-wider uppercase font-semibold rounded transition-all ${
                activeTab === 'analytics' ? 'bg-[#0f1726] text-[#e5a967] border-l-2 border-[#e5a967]' : 'hover:bg-[#0b111e] hover:text-white'
              }`}
            >
              <LayoutDashboard size={14} className={activeTab === 'analytics' ? 'text-[#e5a967]' : 'text-[#4d5c75]'} />
              Dashboard
            </button>
            <button 
              onClick={() => setActiveTab('users')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-xs tracking-wider uppercase font-semibold rounded transition-all ${
                activeTab === 'users' ? 'bg-[#0f1726] text-[#e5a967] border-l-2 border-[#e5a967]' : 'hover:bg-[#0b111e] hover:text-white'
              }`}
            >
              <Users size={14} className={activeTab === 'users' ? 'text-[#e5a967]' : 'text-[#4d5c75]'} />
              Manage Users
            </button>
            <button 
              onClick={() => setActiveTab('transactions')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-xs tracking-wider uppercase font-semibold rounded transition-all ${
                activeTab === 'transactions' ? 'bg-[#0f1726] text-[#e5a967] border-l-2 border-[#e5a967]' : 'hover:bg-[#0b111e] hover:text-white'
              }`}
            >
              <Receipt size={14} className={activeTab === 'transactions' ? 'text-[#e5a967]' : 'text-[#4d5c75]'} />
              All Transactions
            </button>
          </nav>
        </div>

        {/* User Card Tag */}
        <div className="p-4 border-t border-[#121b2d] bg-[#060910]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#111929] border border-[#1c2a44] flex items-center justify-center text-xs font-serif text-[#e5a967] font-bold shadow-inner">N</div>
            <div>
              <p className="text-xs font-semibold text-white tracking-wide">No Way</p>
              <p className="text-[10px] text-[#4d5c75] uppercase tracking-wider">Admin Role</p>
            </div>
          </div>
        </div>
      </aside>

      {/* CORE DISPLAY WORKSPACE */}
      <main className="flex-1 p-8 overflow-y-auto max-w-[1600px] mx-auto w-full">
        
        {/* UPPER BARS */}
        <header className="mb-8 flex justify-between items-start">
          <div>
            <div className="text-[10px] text-[#4d5c75] tracking-widest uppercase font-bold font-mono">Overview &gt; System Disclosure</div>
            <h2 className="text-3xl font-serif text-white mt-1">Welcome Back, No</h2>
          </div>

          <div className="bg-[#0b1220] border border-[#142035] px-4 py-2 rounded flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-white">
              <Star size={13} className="text-[#e5a967] fill-[#e5a967]" /> 3.5
            </div>
            <div className="h-4 w-px bg-[#142035]" />
            <div>
              <p className="text-[9px] text-[#4d5c75] uppercase tracking-wider font-bold">Today's Activity</p>
              <p className="text-[#00bc8c] font-bold text-[11px] mt-0.5">+1 platform event</p>
            </div>
          </div>
        </header>

        {/* TAB 1: ANALYTICS VIEW */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {/* Top Stat Row Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="bg-[#070b14] border border-[#111927] p-5 rounded-sm flex justify-between items-center">
                <div>
                  <p className="text-[9px] text-[#4d5c75] tracking-wider uppercase font-bold font-mono">Total Users</p>
                  <p className="text-2xl text-white font-serif mt-2">1,240</p>
                </div>
                <div className="w-8 h-8 border border-[#142238] flex items-center justify-center rounded bg-[#0a1523]">
                  <User size={14} className="text-[#00bc8c]" />
                </div>
              </div>

              <div className="bg-[#070b14] border border-[#111927] p-5 rounded-sm flex justify-between items-center">
                <div>
                  <p className="text-[9px] text-[#4d5c75] tracking-wider uppercase font-bold font-mono">Total Lawyers</p>
                  <p className="text-2xl text-white font-serif mt-2">02</p>
                </div>
                <div className="w-8 h-8 border border-[#142238] flex items-center justify-center rounded bg-[#0a1523]">
                  <Gavel size={14} className="text-[#00bc8c]" />
                </div>
              </div>

              <div className="bg-[#070b14] border border-[#111927] p-5 rounded-sm flex justify-between items-center">
                <div>
                  <p className="text-[9px] text-[#4d5c75] tracking-wider uppercase font-bold font-mono">Total Hires</p>
                  <p className="text-2xl text-white font-serif mt-2">892</p>
                </div>
                <div className="w-8 h-8 border border-[#142238] flex items-center justify-center rounded bg-[#141b27]">
                  <Handshake size={14} className="text-[#e5a967]" />
                </div>
              </div>

              <div className="bg-[#070b14] border border-[#111927] p-5 rounded-sm flex justify-between items-center">
                <div>
                  <p className="text-[9px] text-[#4d5c75] tracking-wider uppercase font-bold font-mono">Total Revenue</p>
                  <p className="text-2xl text-[#e5a967] font-serif mt-2">$42,550</p>
                </div>
                <div className="w-8 h-8 border border-[#142238] flex items-center justify-center rounded bg-[#141b27]">
                  <TrendingUp size={14} className="text-[#e5a967]" />
                </div>
              </div>

            </div>

            {/* Bottom Overview Split Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              <div className="lg:col-span-4 bg-[#070b14] border border-[#111927] p-6 rounded-sm">
                <h3 className="text-xs text-[#e5a967] tracking-wider uppercase font-mono font-bold mb-6">Settlement Status</h3>
                
                <div className="space-y-5 text-[10px]">
                  <div>
                    <div className="flex justify-between uppercase font-bold text-[#8e9bb2] mb-1.5">
                      <span>Collection / Paid Rate</span>
                      <span>50%</span>
                    </div>
                    <div className="w-full bg-[#101929] h-1.5 rounded-sm overflow-hidden">
                      <div className="bg-[#00bc8c] h-full w-1/2" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between uppercase font-bold text-[#8e9bb2] mb-1.5">
                      <span>Pending Arrears Ratio</span>
                      <span>50%</span>
                    </div>
                    <div className="w-full bg-[#101929] h-1.5 rounded-sm overflow-hidden">
                      <div className="bg-[#e5a967] h-full w-1/2" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between uppercase font-bold text-[#8e9bb2] mb-1.5">
                      <span>Urgent Queue Volume</span>
                      <span>0%</span>
                    </div>
                    <div className="w-full bg-[#101929] h-1.5 rounded-sm overflow-hidden">
                      <div className="bg-red-500 h-full w-0" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Activity Sample List Block Layout */}
              <div className="lg:col-span-8 bg-[#070b14] border border-[#111927] p-6 rounded-sm">
                <h3 className="text-xs text-[#e5a967] tracking-wider uppercase font-mono font-bold mb-4">System Operational Log</h3>
                <p className="text-xs text-[#4d5c75]">Select another workspace tab to access granular dynamic configuration profiles.</p>
                <div className="mt-8 border-t border-[#111927] pt-4 flex items-center justify-between">
                  <span className="text-[10px] tracking-wider text-[#4d5c75] uppercase font-bold">All services parameters green</span>
                  <span className="text-[10px] text-[#e5a967] uppercase font-bold tracking-wider cursor-pointer hover:underline">Examine logs history →</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: USER MANAGEMENT */}
        {activeTab === 'users' && (
          <div className="bg-[#070b14] border border-[#111927] rounded-sm p-6">
            <h3 className="text-xs text-[#e5a967] tracking-wider uppercase font-mono font-bold mb-4">Manage Users System Registry</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#111927] text-[#4d5c75] tracking-wider uppercase font-mono text-[10px]">
                    <th className="pb-3 font-bold">User Identity</th>
                    <th className="pb-3 font-bold">Email Address</th>
                    <th className="pb-3 font-bold">Current Privilege</th>
                    <th className="pb-3 font-bold">Modify Status</th>
                    <th className="pb-3 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#111927]/50">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-[#0c1220]/40 transition-colors">
                      <td className="py-4 text-white font-medium">{user.name}</td>
                      <td className="py-4 font-mono text-[#62738d]">{user.email}</td>
                      <td className="py-4">
                        <span className={`px-2 py-0.5 rounded-sm font-mono text-[9px] font-bold tracking-wider ${
                          user.role === 'ADMIN' ? 'bg-red-950/40 text-red-400 border border-red-900/30' :
                          user.role === 'LAWYER' ? 'bg-[#00bc8c]/10 text-[#00bc8c]' : 'bg-blue-950/40 text-blue-400'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="py-4">
                        <select 
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          className="bg-[#0b1220] border border-[#142238] rounded px-2 py-1 text-[#8e9bb2] outline-none focus:border-[#e5a967] cursor-pointer"
                        >
                          <option value="USER">USER</option>
                          <option value="LAWYER">LAWYER</option>
                          <option value="ADMIN">ADMIN</option>
                        </select>
                      </td>
                      <td className="py-4 text-right">
                        <button 
                          onClick={() => setUserToDelete(user)}
                          className="text-[10px] uppercase font-bold tracking-wider text-red-400 bg-red-950/20 hover:bg-red-950/40 border border-red-900/30 rounded px-2 py-1 transition-colors"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: TRANSACTIONS LIST */}
        {activeTab === 'transactions' && (
          <div className="bg-[#070b14] border border-[#111927] rounded-sm p-6">
            <h3 className="text-xs text-[#e5a967] tracking-wider uppercase font-mono font-bold mb-4">Client Settlement Inbound Registry</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#111927] text-[#4d5c75] tracking-wider uppercase font-mono text-[10px]">
                    <th className="pb-3 font-bold">Transaction ID</th>
                    <th className="pb-3 font-bold">User / Lawyer Account</th>
                    <th className="pb-3 font-bold">Fee Charge</th>
                    <th className="pb-3 font-bold">Settlement Date</th>
                    <th className="pb-3 font-bold text-right">Payment Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#111927]/50 font-sans">
                  {transactions.map((txn) => (
                    <tr key={txn.id} className="hover:bg-[#0c1220]/40 transition-colors">
                      <td className="py-4 font-mono text-[#62738d]">{txn.id}</td>
                      <td className="py-4 text-white font-medium">{txn.email}</td>
                      <td className="py-4 text-white font-mono font-bold">${txn.amount}</td>
                      <td className="py-4 font-mono text-[#62738d]">{txn.date}</td>
                      <td className="py-4 text-right">
                        <span className={`text-[9px] font-bold tracking-widest px-2 py-0.5 rounded-sm uppercase ${
                          txn.status === 'PAID' ? 'bg-[#00bc8c]/10 text-[#00bc8c]' : 'bg-[#e5a967]/10 text-[#e5a967]'
                        }`}>
                          {txn.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>

      {/* CONFIRM SYSTEM PURGE MODAL */}
      {userToDelete && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#070b14] border border-red-900/40 max-w-sm w-full p-6 rounded shadow-2xl">
            <h4 className="text-sm font-mono font-bold text-red-400 tracking-wider uppercase mb-2 flex items-center gap-2">
              <AlertTriangle size={16} /> Destructive System Action
            </h4>
            <p className="text-xs text-[#8e9bb2] leading-relaxed mb-6">
              Are you certain you wish to terminate the ledger access configuration profile for <span className="text-white font-bold">{userToDelete.name}</span>? This structural update is immediate.
            </p>
            <div className="flex justify-end gap-3 text-[10px] tracking-wider uppercase font-bold">
              <button 
                onClick={() => setUserToDelete(null)}
                className="px-3 py-2 bg-[#0b1220] border border-[#142238] rounded text-[#8e9bb2] hover:text-white transition-colors"
              >
                Abort
              </button>
              <button 
                onClick={executeDeletion}
                className="px-3 py-2 bg-red-950/40 border border-red-700 text-red-200 rounded hover:bg-red-900 transition-colors"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}