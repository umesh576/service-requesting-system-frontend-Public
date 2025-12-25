"use client";

import React from "react";
import Link from "next/link";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaShieldAlt,
  FaStar,
  FaUsers,
  FaHandshake,
} from "react-icons/fa";
import FooterServiceRequest from "./FooterServiceRequest";

const MainFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      {/* Service Request Section */}
      <div className="bg-gradient-to-r from-blue-700 to-purple-700 py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Cant Find Your Service?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Request any service and get matched with verified professionals on
            ServiceHub
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center min-w-[200px]">
              <div className="text-3xl mb-2">🏆</div>
              <h4 className="font-bold">Verified Experts</h4>
              <p className="text-sm text-blue-200">Background checked</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center min-w-[200px]">
              <div className="text-3xl mb-2">💰</div>
              <h4 className="font-bold">Best Price</h4>
              <p className="text-sm text-blue-200">Compare multiple quotes</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center min-w-[200px]">
              <div className="text-3xl mb-2">🛡️</div>
              <h4 className="font-bold">Service Guarantee</h4>
              <p className="text-sm text-blue-200">100% satisfaction</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center mb-4">
              <div className="text-3xl font-bold text-blue-400 mr-2">
                ServiceHub
              </div>
              <span className="text-xs bg-blue-600 px-2 py-1 rounded">PRO</span>
            </div>
            <p className="text-gray-300 mb-6">
              Connecting you with trusted service professionals for all your
              needs. Quality, reliability, and convenience guaranteed.
            </p>
            <div className="flex space-x-4">
              {[FaFacebook, FaTwitter, FaInstagram, FaLinkedin].map(
                (Icon, index) => (
                  <a
                    key={index}
                    href="#"
                    className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors duration-200"
                    aria-label={`Social Media ${index}`}
                  >
                    <Icon />
                  </a>
                )
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-white">Quick Links</h3>
            <ul className="space-y-3">
              {[
                "Browse Services",
                "Become an Expert",
                "How It Works",
                "Pricing",
                "Blog",
                "Careers",
              ].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center"
                  >
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Service Categories */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-white">Top Services</h3>
            <ul className="space-y-3">
              {[
                "Plumbing",
                "Electrical",
                "Cleaning",
                "AC Repair",
                "Painting",
                "Carpentry",
                "Pest Control",
                "View All",
              ].map((service) => (
                <li key={service}>
                  <Link
                    href="#"
                    className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center"
                  >
                    <FaStar className="text-yellow-500 mr-3 text-sm" />
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-white">Contact Us</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <FaPhone className="text-blue-400 mt-1 mr-3" />
                <div>
                  <p className="font-medium">24/7 Support</p>
                  <p className="text-gray-300">+91 1800-123-4567</p>
                </div>
              </div>
              <div className="flex items-start">
                <FaEnvelope className="text-blue-400 mt-1 mr-3" />
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-gray-300">support@servicehub.com</p>
                </div>
              </div>
              <div className="flex items-start">
                <FaMapMarkerAlt className="text-blue-400 mt-1 mr-3" />
                <div>
                  <p className="font-medium">Office</p>
                  <p className="text-gray-300">
                    123 Service Street, Mumbai, India
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="bg-gray-800 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center items-center gap-8">
            <div className="flex items-center">
              <FaShieldAlt className="text-3xl text-green-400 mr-3" />
              <div>
                <p className="font-bold">Verified Professionals</p>
                <p className="text-sm text-gray-400">Background checked</p>
              </div>
            </div>
            <div className="flex items-center">
              <FaUsers className="text-3xl text-blue-400 mr-3" />
              <div>
                <p className="font-bold">50,000+ Customers</p>
                <p className="text-sm text-gray-400">Happy clients served</p>
              </div>
            </div>
            <div className="flex items-center">
              <FaHandshake className="text-3xl text-purple-400 mr-3" />
              <div>
                <p className="font-bold">Service Guarantee</p>
                <p className="text-sm text-gray-400">100% satisfaction</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © {currentYear} ServiceHub. All rights reserved.
            </div>
            <div className="flex flex-wrap gap-6 text-sm">
              <Link
                href="#"
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                Privacy Policy
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                Terms of Service
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                Cookie Policy
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                Sitemap
              </Link>
            </div>
          </div>
          <div className="text-center text-gray-500 text-xs mt-4">
            ServiceHub is a registered trademark. All service professionals are
            independently verified.
          </div>
        </div>
      </div>

      {/* Include Service Request System */}
      <FooterServiceRequest />
    </footer>
  );
};

export default MainFooter;
