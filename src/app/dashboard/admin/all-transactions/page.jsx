"use client";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Receipt, DollarSign, Calendar, Mail } from "lucide-react";
import { getAdminTransactionsAction } from "@/lib/actions/api/admin";

export default function AdminTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      const data = await getAdminTransactionsAction();
      setTransactions(data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load platform transaction ledger.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const formatDate = (dateValue) => {
    if (!dateValue) return "N/A";
    const dateObj = new Date(dateValue);
    return isNaN(dateObj.getTime()) ? "N/A" : dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <p className="text-xs font-mono text-slate-500 uppercase tracking-widest">// Syncing Transactions Ledger...</p>
        <div className="h-40 bg-[#050a12] border border-[#111927] flex items-center justify-center text-sm font-mono text-slate-400">
          Loading transactions...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-serif text-slate-100 font-normal uppercase tracking-wide">
          Transaction Ledger Log
        </h2>
        <p className="text-xs text-slate-400 font-mono mt-1">
          Review central platform transaction histories, Stripe reference IDs, and user payments.
        </p>
      </div>

      {/* Transactions Table */}
      <div className="bg-[#050a12] border border-[#111927] rounded-none overflow-hidden">
        <div className="bg-[#FCBA80] text-black px-4 py-2 flex flex-col sm:flex-row justify-between items-start sm:items-center text-[10px] uppercase font-mono font-bold tracking-widest rounded-none gap-1">
          <span>Stripe Ledger Settlement Records</span>
          <span className="text-black/60 font-normal">Audited System Entries</span>
        </div>

        {transactions.length === 0 ? (
          <div className="p-8 text-center text-xs font-mono text-slate-500 uppercase tracking-wider">
            No transaction records found in ledger database.
          </div>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#03060b] text-[10px] text-slate-500 uppercase tracking-wider font-mono border-b border-[#111927]">
                <tr>
                  <th className="py-3 px-6 font-normal">Transaction ID</th>
                  <th className="py-3 px-6 font-normal">Client Email</th>
                  <th className="py-3 px-6 font-normal">Lawyer Email</th>
                  <th className="py-3 px-6 font-normal">Fee Charge</th>
                  <th className="py-3 px-6 font-normal">Settlement Date</th>
                  <th className="py-3 px-6 font-normal text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#111927]/40 font-mono">
                {transactions.map((txn) => (
                  <tr key={txn._id || txn.transactionId} className="hover:bg-[#080f1b]/50 transition-colors">
                    <td className="py-4 px-6 text-white font-medium flex items-center gap-2">
                      <Receipt size={13} className="text-[#FCBA80]" />
                      <span className="text-xs select-text">{txn.transactionId || "TXN-AUTO"}</span>
                    </td>
                    <td className="py-4 px-6 text-slate-300 font-mono">
                      {txn.userEmail || "client@lexvizo.com"}
                    </td>
                    <td className="py-4 px-6 text-slate-300 font-mono">
                      {txn.lawyerEmail || "assigned-expert@lexvizo.com"}
                    </td>
                    <td className="py-4 px-6 text-[#FCBA80] font-bold">
                      ${txn.amount || 100} USD
                    </td>
                    <td className="py-4 px-6 text-slate-400 font-sans">
                      {formatDate(txn.date)}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <span className="bg-emerald-950/40 text-emerald-400 border border-emerald-900/30 px-2.5 py-0.5 rounded-none uppercase text-[9px] font-bold tracking-wider">
                        Paid
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
