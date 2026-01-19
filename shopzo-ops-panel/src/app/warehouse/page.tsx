"use client";
import { API_ENDPOINTS } from "@/lib/api";
import axios from "axios";
import React, { useEffect, useState } from "react";

const warehousePage = () => {
  const [loading, setLoading] = useState(false);
  const [warehouses, setWarehouses] = useState<Array<any>>([]);
  const [error, setError] = useState("");

  const fetchWarehouses = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.GET_WAREHOUSES);

      if (response.status === 200) {
        setWarehouses(response.data.warehouses);
      }
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to fetch warehouses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
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
