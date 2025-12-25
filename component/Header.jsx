"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaSearch } from "react-icons/fa";

const Header = () => {
  const [isUserLogin, setIsUserLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userDetail, setUserDetails] = useState(null);

  useEffect(() => {
    const validateToken = async () => {
      if (typeof window === "undefined") return;

      const token = localStorage.getItem("token");

      if (!token) {
        setIsUserLogin(false);
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `http://localhost:8080/api/auth/validate?token=${token}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.ok) {
          const result = await res.json();
          // console.log("API Response:", result);

          setIsUserLogin(true);

          // FIX: The API returns user data directly, not inside result.user
          setUserDetails(result); // NOT result.user

          // console.log("User details set:", result);
        } else {
          // Token is invalid or expired
          localStorage.removeItem("token");
          setIsUserLogin(false);
          setUserDetails(null);
        }
      } catch (error) {
        console.error("Error validating token:", error);
        setIsUserLogin(false);
        setUserDetails(null);
      } finally {
        setIsLoading(false);
      }
    };

    validateToken();
  }, []);

  // Add this useEffect to see when userDetail updates
  useEffect(() => {
    console.log("userDetail state updated:", userDetail);
  }, [userDetail]);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsUserLogin(false);
    setUserDetails(null);
    // Optional: Redirect to login page
    // window.location.href = "/login";
  };

  // Show loading state
  if (isLoading) {
    return (
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 bg-gray-200 rounded-xl animate-pulse"></div>
            <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="h-10 w-40 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <Image
            src="/image.png"
            height={44}
            width={44}
            alt="logo"
            className="rounded-xl"
            priority
          />
          <span className="text-lg font-semibold text-[#111827]">
            ServiceHub
          </span>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex gap-10 text-sm font-medium text-[#111827]">
          <Link
            href="/"
            className="hover:text-[#1D4ED8] transition font-extrabold text-lg"
          >
            Home
          </Link>
          <Link
            href="/service"
            className="hover:text-[#1D4ED8] transition font-extrabold text-lg"
          >
            Services
          </Link>
          <Link
            href="/about"
            className="hover:text-[#1D4ED8] transition font-extrabold text-lg"
          >
            About Us
          </Link>
        </nav>

        {/* Search Bar */}
        <div className="flex justify-center">
          <div className="flex w-full max-w-xl border border-gray-300 rounded-full overflow-hidden shadow-sm">
            <input
              type="text"
              placeholder="Search service..."
              className="flex-1 px-4 text-gray-800 placeholder-gray-400 focus:outline-none"
            />
            <button className="cursor-pointer flex items-center gap-2 bg-[#2563EB] text-white px-5 py-3 hover:bg-blue-300 transition">
              <FaSearch />
              Search
            </button>
          </div>
        </div>

        {/* User Info & Actions */}
        <div className="flex items-center gap-6">
          {isUserLogin && userDetail ? (
            <div className="text-right">
              <a href={`/profile/${userDetail.user.id}`}>
                <p className="text-sm font-medium text-gray-700">
                  Welcome, {userDetail.user.name || "umesh"}!
                </p>
              </a>
              {/* <p className="text-xs text-gray-500">
                {userDetail.email} • {userDetail.role}
              </p> */}
            </div>
          ) : isUserLogin ? (
            <div className="flex items-center gap-4">
              <Link href="/expert-login">
                <button className="bg-[#2563EB] text-white px-5 py-2 rounded-full text-sm hover:bg-[#1D4ED8] transition">
                  Become an Expert
                </button>
              </Link>

              {isUserLogin ? (
                <button
                  onClick={handleLogout}
                  className="text-sm text-[#111827] hover:text-[#1D4ED8] transition"
                >
                  Logout
                </button>
              ) : (
                <Link
                  href="/login"
                  className="text-sm text-[#111827] hover:text-[#1D4ED8] transition"
                >
                  Login/signup
                </Link>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
};

export default Header;
