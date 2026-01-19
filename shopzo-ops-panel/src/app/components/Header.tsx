"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { API_ENDPOINTS } from "@/lib/api";
import { error } from "console";

type userType = {
  id: string;
  name: string;
  email: string;
};

const Header = () => {
  const router = useRouter();
  const [error, setError] = useState("");

  const [user, setUser] = useState<userType | null>(null);

  const getUser = async () => {
    try {
      const res = await axios.get(`${API_ENDPOINTS.CURRENT_USER}`, {
        withCredentials: true,
      });

      if (res.status === 200) {
        console.log(res.data);
        setUser(res.data.user);
      } else {
        window.location.href = "/login";
      }
    } catch (error) {
      window.location.href = "/login";
      console.log(error);
    }
  };

  const handleLogout = async () => {
    try {
      const res = await axios.post(API_ENDPOINTS.LOGOUT);

      if (res.status === 200) {
        router.push("/login");
      } else {
        console.log(res.data.message);
        setError(res.data.message);
      }
    } catch (error: any) {
      setError(error.message);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1rem",
        borderBottom: "1px solid #ccc",
        marginBottom: "2rem",
      }}
    >
      <h2 style={{ margin: 0 }}>Shopzo Ops Panel</h2>
      <div>
        {user && (
          <span style={{ marginRight: "1rem" }}>Hello, {user.name}</span>
        )}
        {error && <span style={{ color: "red" }}>{error}</span>}
        <button onClick={handleLogout}>Logout</button>
      </div>
    </header>
  );
};

export default Header;
