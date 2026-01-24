"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

// Dynamically import MapPicker with no SSR because Leaflet needs 'window'
const MapPicker = dynamic(() => import("@/app/components/MapPicker"), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-gray-800 animate-pulse flex items-center justify-center text-gray-400">Loading Map Engine...</div>
});
import { reverseGeocode } from "@/utils/reverseGeocode";
import { API_ENDPOINTS } from "@/lib/api";

export default function AddWarehousePage() {
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null
  );

  const [formData, setFormData] = useState({
    name: "",
    contactNumber: "",
    address: {
      state: "",
      city: "",
      pincode: "",
      landmark: "",
      formatted: "",
    },
  });

  const handleLocationSelect = async (lat: number, lng: number) => {
    setLocation({ lat, lng });
    setLoading(true);

    try {
      const addr = await reverseGeocode(lat, lng);
      setFormData((prev) => ({
        ...prev,
        address: {
          ...addr,
          landmark: prev.address.landmark, // Keep manual landmark if user typed it
        },
      }));
    } catch (err) {
      console.error("Reverse geocoding failed", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name.startsWith("address.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        address: { ...prev.address, [field]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!location) {
      alert("Please select a location on the map or search for one.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(API_ENDPOINTS.CREATE_WAREHOUSES, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          location,
        }),
      });

      if (response.ok) {
        alert("Warehouse registered successfully!");
      } else {
        const error = await response.json();
        alert(`Error: ${error.message || "Failed to add warehouse"}`);
      }
    } catch (err) {
      console.error("Submission failed", err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Side: Interactive Map with Search */}
        <div className="flex-1 space-y-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Add New Warehouse</h1>
            {location && (
              <span className="bg-green-900/30 text-green-400 px-3 py-1 rounded-full text-xs font-mono border border-green-800">
                GPS: {location.lat.toFixed(5)}, {location.lng.toFixed(5)}
              </span>
            )}
          </div>
          <div className="border border-gray-800 rounded-2xl overflow-hidden shadow-2xl h-[600px] relative">
            <MapPicker onLocationSelect={handleLocationSelect} center={location || undefined} />
          </div>
          <p className="text-sm text-gray-400 italic">
            Tip: Search for the warehouse location or click directly on the map to pin it.
          </p>
        </div>

        {/* Right Side: Details Form */}
        <form onSubmit={handleSubmit} className="w-full lg:w-[400px] space-y-6 bg-gray-900 p-8 rounded-2xl border border-gray-800 shadow-xl">
          <h3 className="text-lg font-semibold border-b border-gray-800 pb-4">Warehouse Details</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1 uppercase">Warehouse Name</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="e.g. Central Logistics Hub"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1 uppercase">Contact Number</label>
              <input
                type="text"
                name="contactNumber"
                required
                value={formData.contactNumber}
                onChange={handleChange}
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="+91 98765 43210"
              />
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-widest">Address (Auto-detected)</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase">Full Address</label>
                <textarea
                  name="address.formatted"
                  value={formData.address.formatted}
                  onChange={handleChange}
                  rows={2}
                  className="w-full p-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                />
              </div>
              
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase">City</label>
                <input
                  type="text"
                  name="address.city"
                  value={formData.address.city}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase">Pincode</label>
                <input
                  type="text"
                  name="address.pincode"
                  value={formData.address.pincode}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase">Custom Landmark / Area</label>
                <input
                  type="text"
                  name="address.landmark"
                  value={formData.address.landmark}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  placeholder="e.g. Near Blue Dart Office"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !location}
            className="w-full bg-blue-600 text-white p-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/20 disabled:bg-gray-800 disabled:text-gray-600 mt-4"
          >
            {loading ? "Registering..." : "Save Warehouse"}
          </button>
        </form>
      </div>
    </div>
  );
}
