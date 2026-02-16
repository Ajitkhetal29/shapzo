"use client";
import { API_ENDPOINTS } from "@/lib/api";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setWarehouses } from "@/store/slices/warehouseSlice";
import { RootState } from "@/store";
import { Warehouse } from "@/store/types/warehouse";
import { useRouter } from "next/navigation";
import Link from "next/link";


const WarehousePage = () => {
  const dispatch = useDispatch();
  const router = useRouter()
    ;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const warehouses = useSelector((state: RootState) => state.warehouse.warehouses);

  const fetchWarehouses = async () => {

    setLoading(true);
    setError("");
    try {
      const response = await axios.get(API_ENDPOINTS.GET_WAREHOUSES, {
        withCredentials: true,
      });
      console.log("Response:", response.data);
      if (response.data.success) {
        dispatch(setWarehouses(response.data.warehouses))
      } else {
        setError(response.data.message || "Failed to fetch warehouses");
      }
    } catch (error: any) {
      console.error("Error fetching warehouses:", error);
      setError(error.response?.data?.message || "Failed to fetch warehouses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWarehouses();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">Warehouses</h1>
            <p className="mt-1 text-sm text-gray-600">Manage warehouse locations and details</p>
          </div>
          <Link
            href="/warehouse/add"
            className="inline-flex items-center justify-center px-4 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors shadow-sm"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Warehouse
          </Link>
        </div>

        {/* Warehouses Table */}
        {warehouses.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No warehouses</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new warehouse.</p>
            <div className="mt-6">
              <Link
                href="/warehouse/add"
                className="inline-flex items-center px-4 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Warehouse
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Contact Number
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Address
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {warehouses.map((warehouse) => (
                    <tr key={warehouse._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                            <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                          </div>
                          <span className="text-sm font-medium text-gray-900">{warehouse.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {warehouse.contactNumber || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-xs">
                        <div className="truncate" title={warehouse.address?.formatted || "N/A"}>
                          {warehouse.address?.formatted || "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button 
                          onClick={() => router.push(`/warehouse/edit/${warehouse._id}`)} 
                          className="text-black hover:text-gray-700 font-medium transition-colors"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WarehousePage;