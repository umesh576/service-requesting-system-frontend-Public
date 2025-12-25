"use client";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaTools,
  FaEdit,
  FaHistory,
  FaStar,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaMoneyBillWave,
  FaInfoCircle,
  FaTag,
} from "react-icons/fa";

const ProfilePage = () => {
  const [userdetails, setUserdetails] = useState(null);
  const [bookServiceId, setBookserviceId] = useState(0);
  const [bookServiceDetails, setBookServiceDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("personal");
  const [serviceId, setServiceId] = useState(0);
  const [serviceDetails, setServiceDetails] = useState(null);
  const params = useParams();
  const userId = params.id;

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:8080/user/searchuser/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const user = await response.json();
        console.log("Fetched user:", user);
        setUserdetails(user);

        if (user.bookServiceId && user.bookServiceId > 0) {
          setBookserviceId(user.bookServiceId);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    if (token && userId) {
      fetchUser();
    }
  }, [userId, token]);

  useEffect(() => {
    const fetchbookedService = async () => {
      if (bookServiceId && bookServiceId > 0 && token) {
        try {
          const response = await fetch(
            `http://localhost:8080/bookservices/${bookServiceId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (!response.ok) {
            throw new Error("Failed to fetch booked service");
          }

          const bookedService = await response.json();
          console.log("Booked Service:", bookedService);
          setBookServiceDetails(bookedService);
          setServiceId(bookedService.serviceId);
        } catch (error) {
          console.error("Error fetching booked service:", error);
        }
      }
    };
    fetchbookedService();
  }, [bookServiceId, token]);

  useEffect(() => {
    const fetchService = async () => {
      if (serviceId && serviceId > 0 && token) {
        try {
          const response = await fetch(
            `http://localhost:8080/api/services/${serviceId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (!response.ok) {
            throw new Error("Failed to fetch service");
          }
          const service = await response.json();
          console.log("Service details:", service);
          setServiceDetails(service);
        } catch (error) {
          console.error("Error fetching service:", error);
        }
      }
    };
    fetchService();
  }, [serviceId, token]);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "Not provided";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return dateString;
      }
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      return dateString;
    }
  };

  // Format time
  const formatTime = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "";
      }
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "";
    }
  };

  // Get status badge
  const getStatusBadge = (status) => {
    if (!status) return null;

    const statusLower = status.toLowerCase();
    if (statusLower.includes("pending") || statusLower.includes("waiting")) {
      return (
        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">
          <FaClock className="inline mr-1" /> Pending
        </span>
      );
    } else if (
      statusLower.includes("confirmed") ||
      statusLower.includes("approved")
    ) {
      return (
        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
          <FaCheckCircle className="inline mr-1" /> Confirmed
        </span>
      );
    } else if (
      statusLower.includes("completed") ||
      statusLower.includes("done")
    ) {
      return (
        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
          <FaCheckCircle className="inline mr-1" /> Completed
        </span>
      );
    } else if (
      statusLower.includes("cancelled") ||
      statusLower.includes("rejected")
    ) {
      return (
        <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold">
          <FaExclamationTriangle className="inline mr-1" /> Cancelled
        </span>
      );
    } else {
      return (
        <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-semibold">
          <FaInfoCircle className="inline mr-1" /> {status}
        </span>
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!userdetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
          <FaUser className="text-6xl text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            User Not Found
          </h2>
          <p className="text-gray-600">
            The requested profile could not be loaded.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8">
          {/* Profile Cover */}
          <div className="h-48 bg-gradient-to-r from-blue-600 to-purple-600 relative">
            <div className="absolute -bottom-16 left-8">
              <div className="relative">
                <div className="w-32 h-32 bg-white rounded-full p-1 shadow-2xl">
                  <div className="w-full h-full bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center">
                    <FaUser className="text-5xl text-white" />
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white"></div>
              </div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="pt-20 px-8 pb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {userdetails.name || "User"}
                </h1>
                <div className="flex items-center gap-2 mt-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      userdetails.role === "USER"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-purple-100 text-purple-800"
                    }`}
                  >
                    {userdetails.role}
                  </span>
                  <span className="text-gray-500">•</span>
                  <span className="text-gray-600">Member since 2024</span>
                </div>
              </div>
              <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full font-semibold hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl">
                <FaEdit />
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Personal Information */}
          <div className="lg:col-span-2 space-y-8">
            {/* Tabs */}
            <div className="bg-white rounded-2xl shadow-lg">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  <button
                    onClick={() => setActiveTab("personal")}
                    className={`py-4 px-1 font-medium text-sm border-b-2 transition-colors duration-300 ${
                      activeTab === "personal"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Personal Information
                  </button>
                  <button
                    onClick={() => setActiveTab("bookings")}
                    className={`py-4 px-1 font-medium text-sm border-b-2 transition-colors duration-300 ${
                      activeTab === "bookings"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Booked Services
                  </button>
                  <button
                    onClick={() => setActiveTab("history")}
                    className={`py-4 px-1 font-medium text-sm border-b-2 transition-colors duration-300 ${
                      activeTab === "history"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Service History
                  </button>
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === "personal" && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-6">
                      Personal Details
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Email */}
                      <div className="bg-gray-50 rounded-xl p-5 hover:shadow-md transition-shadow duration-300">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <FaEnvelope className="text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">
                              Email Address
                            </p>
                            <p className="font-medium text-gray-900">
                              {userdetails.email}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Phone */}
                      <div className="bg-gray-50 rounded-xl p-5 hover:shadow-md transition-shadow duration-300">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <FaPhone className="text-green-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">
                              Phone Number
                            </p>
                            <p className="font-medium text-gray-900">
                              {userdetails.number || "Not provided"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Location */}
                      <div className="bg-gray-50 rounded-xl p-5 hover:shadow-md transition-shadow duration-300">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                            <FaMapMarkerAlt className="text-red-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Location</p>
                            <p className="font-medium text-gray-900">
                              {userdetails.location || "Not provided"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Date of Birth */}
                      <div className="bg-gray-50 rounded-xl p-5 hover:shadow-md transition-shadow duration-300">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                            <FaCalendarAlt className="text-purple-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">
                              Date of Birth
                            </p>
                            <p className="font-medium text-gray-900">
                              {formatDate(userdetails.dob)}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* User ID */}
                      <div className="bg-gray-50 rounded-xl p-5 hover:shadow-md transition-shadow duration-300">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                            <FaUser className="text-yellow-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">User ID</p>
                            <p className="font-medium text-gray-900">
                              #{userdetails.id}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Account Status */}
                      <div className="bg-gray-50 rounded-xl p-5 hover:shadow-md transition-shadow duration-300">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <FaStar className="text-green-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">
                              Account Status
                            </p>
                            <p className="font-medium text-green-600">Active</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "bookings" && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-6">
                      Booked Services
                    </h3>

                    {bookServiceDetails ? (
                      <div className="space-y-6">
                        {/* Booked Service Card */}
                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                <FaTools className="text-blue-600 text-xl" />
                              </div>
                              <div>
                                <h4 className="font-bold text-gray-900">
                                  Booking #{bookServiceDetails.id || "N/A"}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  Booking Date:{" "}
                                  {bookServiceDetails.bookingDate
                                    ? `${formatDate(
                                        bookServiceDetails.bookingDate
                                      )} ${formatTime(
                                        bookServiceDetails.bookingDate
                                      )}`
                                    : "Not specified"}
                                </p>
                              </div>
                            </div>
                            <div>
                              {getStatusBadge(bookServiceDetails.status)}
                            </div>
                          </div>

                          {/* Booking Details Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div className="space-y-2">
                              <p className="text-sm text-gray-500">
                                Service Type
                              </p>
                              <p className="font-medium">
                                {bookServiceDetails.serviceType ||
                                  "Not specified"}
                              </p>
                            </div>
                            <div className="space-y-2">
                              <p className="text-sm text-gray-500">
                                Booking Status
                              </p>
                              <div className="flex items-center gap-2">
                                {getStatusBadge(bookServiceDetails.status)}
                              </div>
                            </div>
                            <div className="space-y-2">
                              <p className="text-sm text-gray-500">
                                Booking Time
                              </p>
                              <p className="font-medium">
                                {bookServiceDetails.bookingDate
                                  ? `${formatDate(
                                      bookServiceDetails.bookingDate
                                    )} ${formatTime(
                                      bookServiceDetails.bookingDate
                                    )}`
                                  : "Not specified"}
                              </p>
                            </div>
                            <div className="space-y-2">
                              <p className="text-sm text-gray-500">
                                Total Amount
                              </p>
                              <p className="font-medium text-green-600 flex items-center gap-1">
                                <FaMoneyBillWave />
                                {bookServiceDetails.price
                                  ? `Rs. ${bookServiceDetails.price}`
                                  : "Not specified"}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Service Details Card */}
                        {serviceDetails && (
                          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                            <div className="flex items-center gap-3 mb-6">
                              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                <FaTag className="text-purple-600" />
                              </div>
                              <h4 className="text-xl font-bold text-gray-800">
                                Service Details
                              </h4>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-4">
                                <div>
                                  <p className="text-sm text-gray-500">
                                    Service Name
                                  </p>
                                  <p className="font-medium text-lg">
                                    {serviceDetails.serviceName || "N/A"}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">
                                    Description
                                  </p>
                                  <p className="text-gray-700">
                                    {serviceDetails.description ||
                                      "No description"}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">Price</p>
                                  <p className="font-medium text-green-600 text-lg">
                                    Rs. {serviceDetails.price || "N/A"}
                                  </p>
                                </div>
                              </div>

                              <div className="space-y-4">
                                <div>
                                  <p className="text-sm text-gray-500">
                                    Service Location
                                  </p>
                                  <div className="flex items-center gap-2 text-gray-700">
                                    <FaMapMarkerAlt className="text-red-500" />
                                    <span>
                                      {serviceDetails.location?.locationName ||
                                        serviceDetails.location?.city ||
                                        serviceDetails.location?.address ||
                                        "Location not specified"}
                                    </span>
                                  </div>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">
                                    Service ID
                                  </p>
                                  <p className="font-medium">
                                    #{serviceDetails.id || "N/A"}
                                  </p>
                                </div>
                                {serviceDetails.serviceImage && (
                                  <div>
                                    <p className="text-sm text-gray-500 mb-2">
                                      Service Image
                                    </p>
                                    <div className="mt-2">
                                      <img
                                        src={serviceDetails.serviceImage}
                                        alt={serviceDetails.serviceName}
                                        className="w-full h-48 object-cover rounded-lg border border-gray-200"
                                        onError={(e) => {
                                          e.target.src =
                                            "https://via.placeholder.com/400x200?text=Service+Image";
                                        }}
                                      />
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="mt-6 pt-6 border-t border-gray-200">
                              <div className="flex flex-wrap gap-3">
                                <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300">
                                  Track Service
                                </button>
                                <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300">
                                  Contact Provider
                                </button>
                                <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-300">
                                  View Invoice
                                </button>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* No Service Details */}
                        {!serviceDetails && (
                          <div className="bg-white rounded-2xl p-6 border border-gray-200 text-center">
                            <FaInfoCircle className="text-4xl text-gray-400 mx-auto mb-4" />
                            <h4 className="text-lg font-bold text-gray-700 mb-2">
                              Service Details Unavailable
                            </h4>
                            <p className="text-gray-600">
                              Could not load service details for this booking.
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <FaTools className="text-3xl text-gray-400" />
                        </div>
                        <h4 className="text-xl font-bold text-gray-700 mb-2">
                          No Active Bookings
                        </h4>
                        <p className="text-gray-600 mb-6">
                          You havent booked any services yet.
                        </p>
                        <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full font-semibold hover:opacity-90 transition-all duration-300">
                          Browse Services
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "history" && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-6">
                      Service History
                    </h3>
                    <div className="text-center py-12">
                      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaHistory className="text-3xl text-gray-400" />
                      </div>
                      <h4 className="text-xl font-bold text-gray-700 mb-2">
                        No History Available
                      </h4>
                      <p className="text-gray-600">
                        Your service history will appear here.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Activities */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6">
                Recent Activities
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <FaUser className="text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Profile updated successfully</p>
                    <p className="text-sm text-gray-600">2 days ago</p>
                  </div>
                </div>
                {bookServiceDetails && (
                  <div className="flex items-center gap-4 p-4 bg-green-50 rounded-xl">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <FaTools className="text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">
                        {bookServiceDetails.serviceType || "Service"} booked
                      </p>
                      <p className="text-sm text-gray-600">
                        {bookServiceDetails.bookingDate
                          ? formatDate(bookServiceDetails.bookingDate)
                          : "Recently"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Stats & Quick Actions */}
          <div className="space-y-8">
            {/* Account Stats */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6">
                Account Overview
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="text-sm text-gray-600">Total Bookings</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {bookServiceId ? 1 : 0}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <FaCalendarAlt className="text-blue-600" />
                  </div>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="text-sm text-gray-600">Active Services</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {bookServiceDetails ? 1 : 0}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <FaTools className="text-green-600" />
                  </div>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="text-sm text-gray-600">Member Since</p>
                    <p className="text-2xl font-bold text-gray-900">2024</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <FaStar className="text-purple-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl shadow-lg p-6 text-white">
              <h3 className="text-xl font-bold mb-6">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full text-left p-4 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-300">
                  Edit Profile Information
                </button>
                <button className="w-full text-left p-4 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-300">
                  Change Password
                </button>
                <button className="w-full text-left p-4 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-300">
                  Notification Settings
                </button>
                <button className="w-full text-left p-4 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-300">
                  Privacy & Security
                </button>
              </div>
            </div>

            {/* Current Booking Status */}
            {bookServiceDetails && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-6">
                  Current Booking Status
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <span className="text-gray-700">Service:</span>
                    <span className="font-medium">
                      {bookServiceDetails.serviceType || "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="text-gray-700">Status:</span>
                    {getStatusBadge(bookServiceDetails.status)}
                  </div>
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <span className="text-gray-700">Amount:</span>
                    <span className="font-medium text-green-600">
                      {bookServiceDetails.price
                        ? `Rs. ${bookServiceDetails.price}`
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <span className="text-gray-700">Booking ID:</span>
                    <span className="font-medium">
                      #{bookServiceDetails.id}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
