"use client";
import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, ShieldCheck, X, DollarSign, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";
import { useSession } from "@/lib/auth-client";

import {
  insertServiceData,
  updateServiceData,
  deleteServiceData,
  fetchServiceData,
} from "@/lib/actions/api/service";

const ManageServices = () => {
  const { data } = useSession();
  const user = data?.user;

  const [activeCurrency, setActiveCurrency] = useState("USD");
  const [viewMode, setViewMode] = useState("all");
  const [selectedService, setSelectedService] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [mockServices, setMockServices] = useState([]);
  const [serviceForm, setServiceForm] = useState({
    title: "",
    price: "",
    description: "",
  });

  // Modal State handling
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [targetDeleteId, setTargetDeleteId] = useState(null);

  // 1. DYNAMIC DATA FETCH
  useEffect(() => {
    const loadDynamicServices = async () => {
      if (!user?.id) return;
      setIsLoading(true);
      try {
        const liveData = await fetchServiceData(user.id);
        setMockServices(liveData || []);
      } catch (error) {
        console.error("Sync error inside component:", error);
        toast.error("Failed to sync catalogue files.");
      } finally {
        setIsLoading(false);
      }
    };

    loadDynamicServices();
  }, [user?.id]);

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
    setServiceForm({
      title: service.title,
      price: service.price,
      description: service.description,
    });
    setViewMode("edit");
  };

  const closeForm = () => {
    setServiceForm({ title: "", price: "", description: "" });
    setSelectedService(null);
    setViewMode("all");
  };

  // 2. CREATE DATA
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!user?.id) return toast.error("Authentication missing. Please log in.");
    if (!serviceForm.title || !serviceForm.price)
      return toast.error("Please complete fields");

    const loadingToast = toast.loading("Saving new service entry...");

    try {
      const payload = {
        title: serviceForm.title,
        price: Number(serviceForm.price),
        description: serviceForm.description,
        userId: user.id,
      };

      const result = await insertServiceData(payload);

      if (result?.insertedId) {
        setMockServices([
          ...mockServices,
          { _id: result.insertedId, ...payload },
        ]);
        toast.success("Service added successfully!", { id: loadingToast });
        closeForm();
      } else {
        throw new Error("Action not acknowledged by database");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to save service data to database.", {
        id: loadingToast,
      });
    }
  };

  // 3. UPDATE DATA
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!user?.id) return toast.error("Session expired.");
    if (!selectedService?._id) return toast.error("Target identifier missing.");

    const loadingToast = toast.loading("Updating...");

    try {
      const updatedFields = {
        title: serviceForm.title,
        price: Number(serviceForm.price),
        description: serviceForm.description,
        userId: user.id,
      };

      await updateServiceData(selectedService._id, updatedFields);

      setMockServices(
        mockServices.map((item) =>
          item._id === selectedService._id
            ? { ...item, ...updatedFields }
            : item
        )
      );

      toast.success("Service changes saved securely!", { id: loadingToast });
      closeForm();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update service parameter data.", {
        id: loadingToast,
      });
    }
  };

  // Triggers the safety validation overlay context
  const requestDeleteConfirmation = (id) => {
    setTargetDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  // 4. CONFIRMED DELETION ROUTINE
  const confirmDelete = async () => {
    if (!user?.id || !targetDeleteId) return;

    const loadingToast = toast.loading("Removing catalog entry...");
    setIsDeleteModalOpen(false); // Instantly close modal UI

    try {
      await deleteServiceData(targetDeleteId);
      setMockServices(mockServices.filter((item) => item._id !== targetDeleteId));
      toast.success("Service deleted.", { id: loadingToast });
    } catch (error) {
      console.error(error);
      toast.error("Failed to remove service entity from data store.", {
        id: loadingToast,
      });
    } finally {
      setTargetDeleteId(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 border-b border-[#131B2E] pb-4">
        <div>
          <h2 className="text-2xl font-serif text-[#FCBA80] tracking-wide">
            Manage Services
          </h2>
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
                <option
                  key={curr.code}
                  value={curr.code}
                  className="bg-[#050811] text-white"
                >
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
          <button
            onClick={closeForm}
            className="absolute top-4 right-4 text-gray-500 hover:text-white"
          >
            <X size={16} />
          </button>

          <h3 className="text-sm font-mono text-[#FCBA80] uppercase tracking-wider mb-4">
            {viewMode === "add"
              ? "Create New Catalog Entry"
              : "Modify Service Parameter"}
          </h3>

          <form
            onSubmit={viewMode === "add" ? handleCreate : handleUpdate}
            className="space-y-4"
          >
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 space-y-1.5">
                <label className="text-[9px] font-mono uppercase tracking-widest text-gray-400 block">
                  Service Name *
                </label>
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
              <label className="text-[9px] font-mono uppercase tracking-widest text-gray-400 block">
                Description & Bounds
              </label>
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
          {isLoading ? (
            <div className="p-8 text-center text-xs font-mono tracking-wide text-[#FCBA80] animate-pulse">
              Synchronizing remote data resources...
            </div>
          ) : mockServices.length === 0 ? (
            <div className="p-8 text-center text-xs italic text-gray-500">
              No registered catalog parameters active. Click "Add Service" above to initialize setup.
            </div>
          ) : (
            <div className="divide-y divide-[#131B2E]">
              {mockServices.map((service) => (
                <div
                  key={service._id}
                  className="p-4 flex items-center justify-between hover:bg-[#090D1A]/60 transition-all"
                >
                  <div className="space-y-1 max-w-xl">
                    <div className="flex items-center gap-3">
                      <h4 className="text-xs font-mono font-bold tracking-wide text-gray-200 uppercase">
                        {service.title}
                      </h4>
                      <span className="text-[10px] font-mono bg-[#0E1526] border border-[#131B2E] text-[#FCBA80] px-2 py-0.5 uppercase tracking-wider">
                        {currencyOptions.find((c) => c.code === activeCurrency)?.symbol || ""}
                        {service.price} {activeCurrency} Flat Rate
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
                      onClick={() => requestDeleteConfirmation(service._id)}
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

      {/* SECURE DELETION CONFIRMATION OVERLAY MODAL */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Blur effect */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsDeleteModalOpen(false)}
          />
          
          {/* Main Content Modal Container */}
          <div className="relative w-full max-w-md border border-[#131B2E] bg-[#0A0F1D] p-6 shadow-2xl text-white animate-in fade-in zoom-in-95 duration-150">
            <button 
              onClick={() => setIsDeleteModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>

            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded bg-red-950/40 border border-red-900/40 p-1.5 text-red-400">
                <AlertTriangle size={16} />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-sm font-mono uppercase tracking-wider text-[#FCBA80]">
                  Confirm Catalogue Deletion
                </h3>
                <p className="text-xs text-gray-300 font-light leading-relaxed">
                  Are you absolutely sure you want to completely remove this active service contract configuration from your framework catalog parameters? This change cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-5 mt-2 border-t border-[#131B2E]">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="border border-zinc-800 bg-zinc-900/40 px-4 py-1.5 text-xs font-mono text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="bg-red-600 hover:bg-red-700 text-white font-mono font-bold text-xs tracking-wider px-4 py-1.5 transition-all"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageServices;