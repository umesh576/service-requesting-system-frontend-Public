"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaSearch, FaBars, FaTimes, FaUser } from "react-icons/fa";

const Header = () => {
  const [isUserLogin, setIsUserLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userDetail, setUserDetails] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  useEffect(() => {
    const validateToken = async () => {
      // if (typeof window === "undefined") return;

      const token = localStorage.getItem("token");
      console.log("token", token);
      // console.log("result", result);
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
          setIsUserLogin(true);
          setUserDetails(result);
        } else {
          setIsUserLogin(false);
          setUserDetails(null);
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        setIsUserLogin(false);
        setUserDetails(null);
      } finally {
        setIsLoading(false);
      }
    };

    validateToken();
  }, []);

  const handleLogout = () => {
    setIsUserLogin(false);
    setUserDetails(null);
    setIsMenuOpen(false);
    localStorage.removeItem("token");
  };

  if (isLoading) {
    return (
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 bg-gray-200 rounded-xl animate-pulse"></div>
              <div className="hidden sm:block h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="hidden md:block h-10 w-40 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        {/* Main Header */}
        <div className="flex items-center justify-between">
          {/* Logo and Mobile Menu Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>

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
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-8 text-sm font-medium text-[#111827]">
            <Link
              href="/"
              className="hover:text-[#1D4ED8] transition font-semibold"
            >
              Home
            </Link>
            <Link
              href="/service"
              className="hover:text-[#1D4ED8] transition font-semibold"
            >
              Services
            </Link>
            <Link
              href="/about"
              className="hover:text-[#1D4ED8] transition font-semibold"
            >
              About Us
            </Link>
          </nav>

          {/* Search Bar (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-xl mx-4">
            <div className="flex w-full border border-gray-300 rounded-full overflow-hidden shadow-sm">
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

          {/* Desktop User Actions - FIXED LOGIC */}
          <div className="hidden md:flex items-center gap-4">
            {isUserLogin ? (
              <>
                {userDetail ? (
                  <div className="flex items-center gap-4">
                    <Link
                      href={`/profile/${userDetail.user?.id}`}
                      className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-[#1D4ED8] transition"
                    >
                      <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                        <FaUser className="text-blue-600" />
                      </div>
                      <span>Welcome, {userDetail.user?.name || "User"}!</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="text-sm text-[#111827] hover:text-[#1D4ED8] transition px-3 py-1 border border-gray-300 rounded-full hover:border-blue-300"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    <Link href="/expert-login">
                      <button className="bg-[#2563EB] text-white px-4 py-2 rounded-full text-sm hover:bg-[#1D4ED8] transition whitespace-nowrap">
                        Become an Expert
                      </button>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="text-sm text-[#111827] hover:text-[#1D4ED8] transition"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/expert-login">
                  <button className="bg-[#2563EB] text-white px-4 py-2 rounded-full text-sm hover:bg-[#1D4ED8] transition whitespace-nowrap">
                    Become an Expert
                  </button>
                </Link>
                <Link
                  href="/login"
                  className="text-sm text-[#111827] hover:text-[#1D4ED8] transition px-3 py-1 border border-gray-300 rounded-full hover:border-blue-300"
                >
                  Login/Signup
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Search and User Icons */}
          <div className="flex md:hidden items-center gap-4">
            <button
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              className="p-2 rounded-lg hover:bg-gray-100"
              aria-label="Search"
            >
              <FaSearch size={18} />
            </button>

            {isUserLogin && userDetail ? (
              <Link
                href={`/profile/${userDetail.user?.id}`}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <FaUser size={18} className="text-gray-600" />
              </Link>
            ) : (
              <Link href="/login" className="p-2 rounded-lg hover:bg-gray-100">
                <FaUser size={18} className="text-gray-600" />
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isMobileSearchOpen && (
          <div className="mt-4 md:hidden">
            <div className="flex w-full border border-gray-300 rounded-full overflow-hidden shadow-sm">
              <input
                type="text"
                placeholder="Search service..."
                className="flex-1 px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none"
              />
              <button className="cursor-pointer flex items-center gap-2 bg-[#2563EB] text-white px-5 py-3 hover:bg-blue-300 transition">
                <FaSearch />
              </button>
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="mt-4 md:hidden border-t border-gray-200 pt-4">
            {/* Mobile Navigation */}
            <nav className="flex flex-col gap-4">
              <Link
                href="/"
                className="text-lg font-medium text-[#111827] hover:text-[#1D4ED8] transition py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/service"
                className="text-lg font-medium text-[#111827] hover:text-[#1D4ED8] transition py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Services
              </Link>
              <Link
                href="/about"
                className="text-lg font-medium text-[#111827] hover:text-[#1D4ED8] transition py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                About Us
              </Link>
            </nav>

            {/* Mobile User Actions */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              {isUserLogin ? (
                <>
                  {userDetail && (
                    <div className="mb-4">
                      <Link
                        href={`/profile/${userDetail.user?.id}`}
                        className="flex items-center gap-3 text-gray-700 hover:text-[#1D4ED8] transition py-2"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                          <FaUser className="text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">
                            Welcome, {userDetail.user?.name || "User"}!
                          </p>
                          <p className="text-sm text-gray-500">View Profile</p>
                        </div>
                      </Link>
                    </div>
                  )}

                  <Link href="/expert-login">
                    <button
                      className="w-full bg-[#2563EB] text-white px-4 py-3 rounded-full text-sm hover:bg-[#1D4ED8] transition mb-4"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Become an Expert
                    </button>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full text-center text-sm text-[#111827] hover:text-[#1D4ED8] transition py-3 border border-gray-300 rounded-full hover:border-blue-300"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/expert-login">
                    <button
                      className="w-full bg-[#2563EB] text-white px-4 py-3 rounded-full text-sm hover:bg-[#1D4ED8] transition mb-4"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Become an Expert
                    </button>
                  </Link>

                  <Link href="/login">
                    <button
                      className="w-full text-center text-sm text-[#111827] hover:text-[#1D4ED8] transition py-3 border border-gray-300 rounded-full hover:border-blue-300"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Login/Signup
                    </button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
