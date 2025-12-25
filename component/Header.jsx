import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FaSearch } from "react-icons/fa";

const Header = () => {
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
        <div className="flex justify-center">
          <div className="flex w-full max-w-xl border border-gray-300 rounded-full overflow-hidden shadow-sm">
            {/* Input */}
            <input
              type="text"
              placeholder="Search service..."
              className="flex-1 px-4 text-gray-800 placeholder-gray-400 focus:outline-none"
            />

            {/* Button */}
            <button className=" cursor-pointer flex items-center gap-2 bg-[#2563EB] text-white px-5 py-3 hover:bg-blue-300 transition">
              <FaSearch />
              Search
            </button>
          </div>
        </div>
        {/* Actions */}
        <div className="flex items-center gap-4">
          <Link href="/expert-login">
            <button className="bg-[#2563EB] text-white px-5 py-2 rounded-full text-sm hover:bg-[#1D4ED8] transition">
              Become an Expert
            </button>
          </Link>

          <Link
            href="/login"
            className="text-sm text-[#111827] hover:text-[#1D4ED8] transition"
          >
            Login/signup
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
