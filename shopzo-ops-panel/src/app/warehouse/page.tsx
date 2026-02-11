"use client";
import { API_ENDPOINTS } from "@/lib/api";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setWarehouses } from "@/store/slices/warehouseSlice";
import { RootState } from "@/store";
import { Warehouse } from "@/store/types/warehouse";


const WarehousePage = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const warehouses = useSelector((state: RootState) => state.warehouse.warehouses) ;

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
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Warehouses</h1>
        <a
          href="/warehouse/add"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Warehouse
        </a>
      </div>

      {warehouses.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No warehouses found
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  Contact Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  Address
                </th>

                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {warehouses.map((warehouse) => (
                <tr key={warehouse._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {warehouse.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {warehouse.contactNumber || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">
                    {warehouse.address?.formatted || "N/A"}
                  </td> 
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default WarehousePage;