"use client";
import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, ShieldCheck, X, DollarSign } from "lucide-react";
import toast from "react-hot-toast";
import { useSession } from "@/lib/auth-client"; 

const ManageServices = () => {
  const { data } = useSession();
  const user = data?.user;

  const [activeCurrency, setActiveCurrency] = useState("USD");
  const [viewMode, setViewMode] = useState("all"); 
  const [selectedService, setSelectedService] = useState(null);
  
  const [mockServices, setMockServices] = useState([
    { id: "1", title: "Corporate Contract Review", price: 250, description: "Detailed liability check & risk assessment." },
    { id: "2", title: "IP Trademarks Filing", price: 400, description: "End-to-end management of corporate trademark validation documents." },
  ]);

  const [serviceForm, setServiceForm] = useState({ title: "", price: "", description: "" });

  useEffect(() => {
    if (user?.currency) {
      setActiveCurrency(user.currency);
    }
  }, [user?.currency]);

  const currencyOptions = [
    { code: "USD", symbol: "$", label: "USD ($)" },
    { code: "BDT", symbol: "৳", label: "BDT (৳)" },
    { code: "EUR", symbol: "€", label: "EUR (€)" },
    { code: "GBP", symbol: "£", label: "GBP (£)" },
    { code: "INR", symbol: "₹", label: "INR (₹)" },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setServiceForm((prev) => ({ ...prev, [name]: value }));
  };

  const openEditMode = (service) => {
    setSelectedService(service);
    setServiceForm({ title: service.title, price: service.price, description: service.description });
    setViewMode("edit");
  };

  const closeForm = () => {
    setServiceForm({ title: "", price: "", description: "" });
    setSelectedService(null);
    setViewMode("all");
  };

  const handleCreate = (e) => {
    e.preventDefault();
    if (!serviceForm.title || !serviceForm.price) return toast.error("Please complete fields");
    
    setMockServices([...mockServices, { id: Date.now().toString(), ...serviceForm }]);
    toast.success("Service added successfully!");
    closeForm();
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    setMockServices(mockServices.map(item => item.id === selectedService.id ? { ...item, ...serviceForm } : item));
    toast.success("Service changes saved securely!");
    closeForm();
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to remove this service from your catalogue?")) {
      setMockServices(mockServices.filter(item => item.id !== id));
      toast.success("Service deleted.");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 border-b border-[#131B2E] pb-4">
        <div>
          <h2 className="text-2xl font-serif text-[#FCBA80] tracking-wide">Manage Services</h2>
          <p className="text-xs text-gray-400 mt-1 font-light">
            Configure custom catalog operations: Add, Edit, Delete, or Audit variations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 border border-[#131B2E] bg-[#0A0F1D] px-2.5 py-1.5">
            <DollarSign size={12} className="text-gray-500" />
            <select
              value={activeCurrency}
              onChange={(e) => {
                setActiveCurrency(e.target.value);
                toast.success(`Currency view adjusted to ${e.target.value}`);
              }}
              className="bg-transparent text-xs font-mono text-gray-300 focus:outline-none cursor-pointer select-none"
            >
              {currencyOptions.map((curr) => (
                <option key={curr.code} value={curr.code} className="bg-[#050811] text-white">
                  {curr.label}
                </option>
              ))}
            </select>
          </div>

          {viewMode === "all" && (
            <button
              onClick={() => setViewMode("add")}
              className="bg-[#FCBA80] border border-[#FCBA80] text-xs font-mono uppercase text-black font-bold tracking-widest px-4 py-2 hover:bg-[#E2A76F] transition-all flex items-center gap-1.5"
            >
              <Plus size={14} strokeWidth={2.5} /> Add Service
            </button>
          )}
        </div>
      </div>

      {viewMode !== "all" && (
        <div className="border border-[#131B2E] bg-[#090D1A]/40 p-6 max-w-2xl relative">
          <button onClick={closeForm} className="absolute top-4 right-4 text-gray-500 hover:text-white">
            <X size={16} />
          </button>
          
          <h3 className="text-sm font-mono text-[#FCBA80] uppercase tracking-wider mb-4">
            {viewMode === "add" ? "Create New Catalog Entry" : "Modify Service Parameter"}
          </h3>

          <form onSubmit={viewMode === "add" ? handleCreate : handleUpdate} className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 space-y-1.5">
                <label className="text-[9px] font-mono uppercase tracking-widest text-gray-400 block">Service Name *</label>
                <input
                  type="text"
                  name="title"
                  value={serviceForm.title}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g. Legal Consultation"
                  className="w-full bg-[#0A0F1D] border border-[#131B2E] px-3 py-2 text-xs text-gray-200 focus:outline-none focus:border-[#FCBA80]/40"
                />
              </div>
              <div className="col-span-1 space-y-1.5">
                <label className="text-[9px] font-mono uppercase tracking-widest text-gray-400 block">
                  Price ({activeCurrency}) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={serviceForm.price}
                  onChange={handleInputChange}
                  required
                  placeholder="0.00"
                  className="w-full bg-[#0A0F1D] border border-[#131B2E] px-3 py-2 text-xs text-gray-200 font-mono focus:outline-none focus:border-[#FCBA80]/40"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] font-mono uppercase tracking-widest text-gray-400 block">Description & Bounds</label>
              <textarea
                name="description"
                rows={3}
                value={serviceForm.description}
                onChange={handleInputChange}
                placeholder="Specify bounds or limitations of the custom package..."
                className="w-full bg-[#0A0F1D] border border-[#131B2E] px-3 py-2 text-xs text-gray-200 focus:outline-none focus:border-[#FCBA80]/40 resize-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={closeForm}
                className="border border-zinc-800 bg-zinc-900/40 px-4 py-1.5 text-xs font-mono text-gray-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-[#FCBA80] text-black font-mono font-bold text-xs tracking-wider px-5 py-1.5 flex items-center gap-1.5"
              >
                <ShieldCheck size={14} /> Commit Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {viewMode === "all" && (
        <div className="border border-[#131B2E] bg-[#090D1A]/20">
          {mockServices.length === 0 ? (
            <div className="p-8 text-center text-xs italic text-gray-500">
              No registered catalog parameters active. Click "Add Service" above to initialize setup.
            </div>
          ) : (
            <div className="divide-y divide-[#131B2E]">
              {mockServices.map((service) => (
                <div key={service.id} className="p-4 flex items-center justify-between hover:bg-[#090D1A]/60 transition-all">
                  <div className="space-y-1 max-w-xl">
                    <div className="flex items-center gap-3">
                      <h4 className="text-xs font-mono font-bold tracking-wide text-gray-200 uppercase">
                        {service.title}
                      </h4>
                      <span className="text-[10px] font-mono bg-[#0E1526] border border-[#131B2E] text-[#FCBA80] px-2 py-0.5 uppercase tracking-wider">
                        {currencyOptions.find(c => c.code === activeCurrency)?.symbol || ""}{service.price} {activeCurrency} Flat Rate
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-400 font-light leading-relaxed">
                      {service.description || "No explicit framework scope added."}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditMode(service)}
                      className="p-2 border border-zinc-800 bg-zinc-900/40 text-gray-400 hover:text-[#FCBA80] hover:border-[#FCBA80]/40 transition-all"
                      title="Edit Service"
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      onClick={() => handleDelete(service.id)}
                      className="p-2 border border-zinc-800 bg-zinc-900/40 text-gray-400 hover:text-red-400 hover:border-red-900/40 transition-all"
                      title="Delete Service"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ManageServices;