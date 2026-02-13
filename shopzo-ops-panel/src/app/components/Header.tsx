"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import axios from "axios";
import { API_ENDPOINTS } from "@/lib/api";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { setUser, logout } from "@/store/slices/authSlice";

type userType = {
  id: string;
  name: string;
  email: string;
};

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.auth.user);
  const [isVerifying, setIsVerifying] = useState(true);

  // Verify auth on mount and restore user state
  useEffect(() => {
    // Skip if on login page
    if (pathname === "/login") {
      setIsVerifying(false);
      return;
    }

    // If we already have user, skip verification
    if (user) {
      setIsVerifying(false);
      return;
    }

    let isMounted = true;

    const verifyAuth = async () => {
      setIsVerifying(true);
      try {
        const res = await axios.get(API_ENDPOINTS.CURRENT_USER, {
          withCredentials: true,
        });
        if (isMounted) {
          if (res.data.success && res.data.user) {
            dispatch(setUser(res.data.user));
          } else {
            // Not authenticated, redirect to login
            router.push("/login");
          }
        }
      } catch (err) {
        // Not authenticated, redirect to login
        if (isMounted) {
          router.push("/login");
        }
      } finally {
        if (isMounted) {
          setIsVerifying(false);
        }
      }
    };

    verifyAuth();

    return () => {
      isMounted = false;
    };
  }, [dispatch, pathname, router, user]);
  


  const handleLogout = async () => {
    try {
      const res = await axios.post(API_ENDPOINTS.LOGOUT, {}, {
        withCredentials: true,
      });

      if (res.status === 200) {
        dispatch(logout());
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
