"use client";

import axios from "axios";
import React, { useState } from "react";
import { API_ENDPOINTS } from "@/lib/api";

const AddWarehousePage = () => {
  const [submitting, setsubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    location: "",
    city: "",
    state: "",
    zipCode: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setsubmitting(true);
    setError("");

    try {
      const response = await axios.post(API_ENDPOINTS.CREATE_WAREHOUSES, form);

      if (response.status === 201) {
        // success
        setForm({
          name: "",
          location: "",
          city: "",
          state: "",
          zipCode: "",
        });
      }
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to add warehouse");
    } finally {
      setsubmitting(false);
    }
  };

  return (
    <div>
      <h1>Add Warehouse</h1>

      <form onSubmit={handleSubmit}>
        <label htmlFor="">Name</label>
        <input
          type="text"
          value={form.name}
          onChange={handleChange}
          name="name"
          placeholder="Enter name"
        />
        <label htmlFor="">Location</label>
        <input
          type="text"
          value={form.location}
          onChange={handleChange}
          name="location"
          placeholder="Enter location"
        />
        <label htmlFor="">City</label>
        <input
          type="text"
          value={form.city}
          onChange={handleChange}
          name="city"
          placeholder="Enter city"
        />
        <label htmlFor="">Zip Code</label>
        <input
          type="text"
          value={form.zipCode}
          onChange={handleChange}
          name="zipCode"
          placeholder="Enter zip code"
        />
        <label htmlFor="">State</label>
        <input
          type="text"
          value={form.state}
          onChange={handleChange}
          name="state"
          placeholder="Enter state"
        />
        <button disabled={submitting} type="submit">
          {submitting ? "Adding Warehouse..." : "Add Warehouse"}
        </button>
      </form>
    </div>
  );
};

export default AddWarehousePage;
