"use client";
import { API_ENDPOINTS } from "@/lib/api";
import axios from "axios";
import React, { useEffect, useState } from "react";

const warehousePage = () => {
  const [loading, setLoading] = useState(false);
  const [warehouses, setWarehouses] = useState<Array<any>>([]);
  const [error, setError] = useState("");

  const fetchWarehouses = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_ENDPOINTS.GET_WAREHOUSES,{
        withCredentials: true
      });
      console.log("Response:", response.data);
      if (response.data.success) {
        setWarehouses(response.data.warehouses);
      } else {
        setError(response.data.message || "Failed to fetch warehouses");
      }
    } catch (error: any) {
      console.error("Error fetching warehouses:", error);
    }
   finally {
    setLoading(false);
   }
  };

  useEffect(() => {
    fetchWarehouses();
  }, []);

  return (
    <div>
      <h1>Warehouse Page</h1>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
            <ul>
              {warehouses.map((warehouse) => (
                <li key={warehouse.id}>{warehouse.name}</li>
              ))}
            </ul>
          )}

    </div>
  );
};

export default warehousePage;