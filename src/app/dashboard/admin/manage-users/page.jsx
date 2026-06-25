"use client";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { AlertTriangle, X, Shield, Mail, User, Trash2 } from "lucide-react";
import { getAdminUsersAction, updateUserRoleAction, deleteUserAction } from "@/lib/actions/api/admin";

export default function AdminManageUsers() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userToDelete, setUserToDelete] = useState(null);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const data = await getAdminUsersAction();
      setUsers(data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load user list registry.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    const loadingToast = toast.loading("Updating user role privilege...");
    try {
      await updateUserRoleAction(userId, newRole);
      toast.success(`User role updated to ${newRole}`, { id: loadingToast });
      fetchUsers();
    } catch (error) {
      toast.error("Failed to update user role status.", { id: loadingToast });
    }
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    const targetId = userToDelete._id || userToDelete.id;
    setUserToDelete(null);

    const loadingToast = toast.loading("Removing user account from records...");
    try {
      await deleteUserAction(targetId);
      toast.success("User account successfully removed.", { id: loadingToast });
      fetchUsers();
    } catch (error) {
      toast.error("Failed to remove user account.", { id: loadingToast });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <p className="text-xs font-mono text-slate-500 uppercase tracking-widest">// Syncing Users Registry...</p>
        <div className="h-40 bg-[#050a12] border border-[#111927] flex items-center justify-center text-sm font-mono text-slate-400">
          Loading users...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-serif text-slate-100 font-normal uppercase tracking-wide">
          Manage Users Registry
        </h2>
        <p className="text-xs text-slate-400 font-mono mt-1">
          Review, modify user role credentials, and remove user database objects.
        </p>
      </div>

      {/* Users Table */}
      <div className="bg-[#050a12] border border-[#111927] rounded-none overflow-hidden">
        <div className="bg-[#FCBA80] text-black px-4 py-2 flex flex-col sm:flex-row justify-between items-start sm:items-center text-[10px] uppercase font-mono font-bold tracking-widest rounded-none gap-1">
          <span>Active Users Registry</span>
          <span className="text-black/60 font-normal">Real-Time Access Log</span>
        </div>

        {users.length === 0 ? (
          <div className="p-8 text-center text-xs font-mono text-slate-500 uppercase tracking-wider">
            No users detected in database.
          </div>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#03060b] text-[10px] text-slate-500 uppercase tracking-wider font-mono border-b border-[#111927]">
                <tr>
                  <th className="py-3 px-6 font-normal">User Identity</th>
                  <th className="py-3 px-6 font-normal">Email Address</th>
                  <th className="py-3 px-6 font-normal">Privilege status</th>
                  <th className="py-3 px-6 font-normal">Set Privilege</th>
                  <th className="py-3 px-6 font-normal text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#111927]/40 font-mono">
                {users.map((user) => {
                  const userId = user._id || user.id;
                  const isLawyer = user.role?.toLowerCase() === "lawyer";
                  const isAdmin = user.role?.toLowerCase() === "admin";
                  const isUser = user.role?.toLowerCase() === "user" || user.role?.toLowerCase() === "client";

                  return (
                    <tr key={String(userId)} className="hover:bg-[#080f1b]/50 transition-colors">
                      <td className="py-4 px-6 text-white font-medium flex items-center gap-2">
                        <User size={13} className="text-[#FCBA80]" />
                        {user.name || "No Name"}
                      </td>
                      <td className="py-4 px-6 text-slate-400 font-mono truncate max-w-[200px]">
                        {user.email}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-2 py-0.5 font-mono text-[9px] font-bold tracking-wider uppercase ${
                          isAdmin ? "bg-red-950/40 text-red-400 border border-red-900/30" :
                          isLawyer ? "bg-emerald-950/40 text-emerald-400 border border-emerald-900/30" : 
                          "bg-blue-950/40 text-blue-400 border border-blue-900/30"
                        }`}>
                          {user.role || "user"}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <select
                          value={user.role || "user"}
                          onChange={(e) => handleRoleChange(String(userId), e.target.value)}
                          className="bg-[#0A0F1D] border border-[#131B2E] text-slate-300 font-mono text-[11px] px-2.5 py-1 focus:outline-none focus:border-[#FCBA80]/40 capitalize cursor-pointer rounded-none"
                        >
                          <option value="user">User (Client)</option>
                          <option value="lawyer">Lawyer</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => setUserToDelete(user)}
                          className="text-[10px] uppercase font-bold tracking-wider text-red-400 bg-red-950/20 hover:bg-red-950/40 border border-red-900/30 rounded-none px-2.5 py-1.5 transition-colors inline-flex items-center gap-1"
                        >
                          <Trash2 size={11} /> Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="relative w-full max-w-md border border-red-900/40 bg-[#0A0F1D] p-6 text-white space-y-6">
            <button
              onClick={() => setUserToDelete(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
            <div className="flex items-start gap-3 border-b border-[#131B2E] pb-3 text-red-400">
              <AlertTriangle size={18} className="shrink-0 mt-0.5" />
              <div>
                <span className="text-[9px] font-mono uppercase tracking-widest block">// Terminate User Protocol</span>
                <h3 className="text-md font-serif uppercase tracking-wide">Destructive Account Purge</h3>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Are you certain you wish to completely delete user <strong className="text-white">"{userToDelete.name}"</strong>? This will permanently wipe access privileges and cannot be undone.
            </p>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setUserToDelete(null)}
                className="border border-[#131B2E] py-2 text-xs font-mono uppercase text-gray-400 hover:text-white transition-colors"
              >
                Abort Protocol
              </button>
              <button
                onClick={handleConfirmDelete}
                className="bg-red-600 hover:bg-red-700 text-white py-2 text-xs font-mono font-bold uppercase tracking-wide transition-all"
              >
                Confirm Terminate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
