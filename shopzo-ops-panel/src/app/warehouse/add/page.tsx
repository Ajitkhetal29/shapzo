"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "@/lib/api";
import { toast } from "react-toastify";


const MapBase = dynamic(() => import("@/app/components/MapBase"), {
  ssr: false,
  loading: () => <div className="h-[500px] flex items-center justify-center">
    Loading map...
  </div>
});




export default function AddWarehousePage() {

  const [location, setLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [address, setAddress] = useState({
    formatted: "",
    state: "",
    city: "",
    pincode: "",
    landmark: "",
    // Additional fields for display only (not saved to DB)
    area: "",
    country: "",
  });
  const [formdata, setFormdata] = useState({
    name: "",
    contactNumber: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);




  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormdata({ ...formdata, [e.target.name]: e.target.value });
  }

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  }

  const handleSubmit = async () => {
    // Prevent double submit
    if (isSubmitting) return;

    // Validation
    if (!formdata.name || !formdata.contactNumber) {
      toast.error("Please fill in name and contact number");
      return;
    }
    if (!location) {
      toast.error("Please select a location on the map");
      return;
    }
    if (!address.formatted || !address.state || !address.city || !address.pincode) {
      toast.error("Please ensure address is properly loaded");
      return;
    }

    setIsSubmitting(true);
    try {
      const warehouseData = {
        name: formdata.name,
        contactNumber: formdata.contactNumber,
        location,
        address: {
          formatted: address.formatted,
          state: address.state,
          city: address.city,
          pincode: address.pincode,
          landmark: address.landmark || undefined,
        }
      };
      console.log("Warehouse Data:", warehouseData);
      const response = await axios.post(API_ENDPOINTS.CREATE_WAREHOUSES, warehouseData, {
        withCredentials: true
      });
      console.log("Response:", response.data);
      if (response.data.success) {
        toast.success("Warehouse added successfully");
        // Reset form
        setFormdata({ name: "", contactNumber: "" });
        setLocation(null);
        setAddress({
          formatted: "",
          state: "",
          city: "",
          pincode: "",
          landmark: "",
          area: "",
          country: "",
        });
      } else {
        toast.error(response.data.message || "Failed to add warehouse");
      }
    } catch (error: any) {
      console.error("Submit error:", error);
      toast.error(error.response?.data?.message || "Error adding warehouse. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  

const getAddress = async (lat: number, lng: number) => {
  try {
    const response = await axios.get(`http://localhost:8000/api/reversegeocode/${lat}/${lng}`);
    const addressData = response.data.address;
    
    // Smart city extraction: prioritize actual city, fallback to district/suburb
    // For Indian addresses: city could be in city_district, suburb, or city field
    const city = addressData.city 
      || addressData.city_district 
      || addressData.suburb 
      || addressData.state_district 
      || "";
    
    // Area: neighbourhood or suburb for display only
    const area = addressData.neighbourhood || addressData.suburb || "";
    
    // Map Nominatim response to warehouse schema structure
    setAddress({
      formatted: response.data.display_name || "",
      state: addressData.state || "",
      city: city,
      pincode: addressData.postcode || "",
      landmark: "", // User can fill this
      area: area,
      country: addressData.country || "",
    });
    console.log("Address:", response.data);
  } catch (error) {
    console.error("Error fetching address:", error);
  }
}

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Add New Warehouse</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Map Section */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Select Location</h2>
            <div className="h-[500px] w-full rounded-lg overflow-hidden border border-gray-200">
              <MapBase
                onLocationSelect={(lat, lng) => {
                  console.log("Selected:", lat, lng);
                  setLocation({ lat, lng });
                  getAddress(lat, lng);
                }}
              />
            </div>
            {location && (  
              <div className="mt-4 p-3 bg-blue-50 rounded-md">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Selected:</span> {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                </p>
              </div>
            )}
          </div>

          {/* Form Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-6">Warehouse Details</h2>
            
            <div className="space-y-4">
              {/* Editable Fields */}
              <div className="flex flex-col gap-2">
                <label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Warehouse Name <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  required 
                  name="name" 
                  value={formdata.name} 
                  onChange={handleChange}
                  className="w-full px-4 text-black py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter warehouse name"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="contactNumber" className="text-sm font-medium text-gray-700">
                  Contact Number <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  required 
                  maxLength={10} 
                  minLength={10} 
                  pattern="[0-9]*" 
                  name="contactNumber" 
                  value={formdata.contactNumber} 
                  onChange={handleChange}
                  className="w-full px-4 text-black py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="10 digit mobile number"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="landmark" className="text-sm font-medium text-gray-700">
                  Landmark
                </label>
                <input 
                  type="text" 
                  name="landmark" 
                  value={address.landmark} 
                  onChange={handleAddressChange}
                  className="w-full px-4 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Near Metro Station"
                />
              </div>

              <div className="border-t border-gray-200 pt-4 mt-4">
                <h3 className="text-sm font-semibold text-gray-600 mb-4">Address Details (Auto-filled)</h3>
              </div>

              {/* Auto-filled Address Fields */}
              <div className="flex flex-col gap-2">
                <label htmlFor="formatted" className="text-sm font-medium text-gray-700">
                  Full Address <span className="text-red-500">*</span>
                </label>
                <textarea 
                  name="formatted" 
                  value={address.formatted} 
                  onChange={handleAddressChange}
                  rows={2}
                  disabled={true}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600 cursor-not-allowed"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label htmlFor="area" className="text-sm font-medium text-gray-700">
                    Area/Neighbourhood
                  </label>
                  <input 
                    type="text" 
                    name="area" 
                    disabled={true} 
                    value={address.area} 
                    onChange={handleAddressChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600 cursor-not-allowed"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="city" className="text-sm font-medium text-gray-700">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    name="city" 
                    disabled={true} 
                    value={address.city} 
                    onChange={handleAddressChange} 
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label htmlFor="state" className="text-sm font-medium text-gray-700">
                    State <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    name="state" 
                    disabled={true} 
                    value={address.state} 
                    onChange={handleAddressChange} 
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600 cursor-not-allowed"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="pincode" className="text-sm font-medium text-gray-700">
                    Pincode <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    name="pincode" 
                    disabled={true} 
                    value={address.pincode} 
                    onChange={handleAddressChange} 
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="country" className="text-sm font-medium text-gray-700">
                  Country
                </label>
                <input 
                  type="text" 
                  name="country" 
                  disabled={true} 
                  value={address.country} 
                  onChange={handleAddressChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600 cursor-not-allowed"
                />
              </div>

              <button 
                type="submit" 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`w-full mt-6 px-6 py-3 rounded-md font-medium transition-colors ${
                  isSubmitting 
                    ? "bg-gray-400 text-white cursor-not-allowed" 
                    : "bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  "Submit"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}