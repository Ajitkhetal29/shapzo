"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import axios from "axios";
import { API_ENDPOINTS } from "@/lib/api";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

type userType = {
  id: string;
  name: string;
  email: string;
};

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [error, setError] = useState("");

  const user =  useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);
  


  const handleLogout = async () => {
    try {
      const res = await axios.post(API_ENDPOINTS.LOGOUT, {}, {
        withCredentials: true,
      });

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


  if (pathname === "/login") return null;

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
