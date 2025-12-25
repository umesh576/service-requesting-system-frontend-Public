"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import {
  FaCalendarAlt,
  FaClock,
  FaUser,
  FaTools,
  FaCheck,
  FaExclamationCircle,
  FaArrowLeft,
  FaMapMarkerAlt,
  FaPhone,
  FaComment,
  FaInfoCircle,
} from "react-icons/fa";

const BookServicePage = () => {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  // Get serviceId from URL parameters
  const serviceId = params.serviceId;

  const [isLoading, setIsLoading] = useState(true);
  const [serviceDetails, setServiceDetails] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state - only mandatory fields
  const [formData, setFormData] = useState({
    time: "",
    date: "",
    message: "",
  });

  // Validation errors
  const [errors, setErrors] = useState({});

  // Time slots
  const timeSlots = [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "01:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
    "05:00 PM",
    "06:00 PM",
    "07:00 PM",
  ];

  // Fetch service details and get user ID
  useEffect(() => {
    const fetchServiceDetails = async () => {
      if (!serviceId) {
        toast.error("Service ID is required");
        router.push("/services");
        return;
      }

      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          `http://localhost:8080/api/services/${serviceId}`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }
        );

        if (res.ok) {
          const data = await res.json();
          setServiceDetails(data);
        } else if (res.status === 404) {
          toast.error("Service not found");
          router.push("/services");
        } else {
          throw new Error("Failed to fetch service");
        }
      } catch (error) {
        console.error("Error fetching service:", error);
        toast.error("Failed to load service details");
      } finally {
        setIsLoading(false);
      }
    };

    // Extract user ID from JWT token
    const extractUserIdFromToken = () => {
      if (typeof window === "undefined") return;

      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login to book a service");
        router.push(`/login?redirect=/book-service/${serviceId}`);
        return;
      }

      try {
        // Decode JWT token to get user ID
        // Assuming token format: header.payload.signature
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const payload = JSON.parse(window.atob(base64));

        // Try different possible user ID fields
        const extractedUserId =
          payload.userId || payload.id || payload.sub || payload.user_id;

        if (extractedUserId) {
          setUserId(extractedUserId);
          console.log("Extracted User ID:", extractedUserId);
        } else {
          console.warn("User ID not found in token payload:", payload);
          toast.error("Unable to identify user. Please login again.");

          router.push("/login");
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        router.push("/login");
      }
    };

    if (serviceId) {
      fetchServiceDetails();
      extractUserIdFromToken();
    }
  }, [serviceId, router]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    // Validate mandatory fields
    if (!formData.date) newErrors.date = "Please select a date";
    if (!formData.time) newErrors.time = "Please select a time slot";
    if (!formData.message)
      newErrors.message = "Please describe your service requirement";

    // Validate message length
    if (formData.message && formData.message.trim().length < 10) {
      newErrors.message = "Please provide more details (minimum 10 characters)";
    }

    // Date validation (not in past)
    if (formData.date) {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        newErrors.date = "Cannot select a past date";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Format date to YYYY-MM-DD format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    // Check if user ID is available
    if (!userId) {
      toast.error("User not authenticated. Please login again.");
      router.push("/login");
      return;
    }

    // Check if service ID is available
    if (!serviceId) {
      toast.error("Service information is missing");
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare booking data according to API requirements
      const bookingData = {
        serviceId: parseInt(serviceId), // From URL parameter
        time: `${formatDate(formData.date)} ${formData.time}`, // Combine date and time
        message: formData.message.trim(),
        status: "REQUESTED", // Fixed status as per API
        userId: parseInt(userId), // From JWT token
      };

      console.log("Booking Data to Send:", bookingData);

      // Get token for authorization
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication token not found");
      }

      // Send booking request
      const response = await fetch("http://localhost:8080/bookservices/book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bookingData),
      });

      const responseData = await response.json();

      if (response.ok) {
        toast.success(
          <div className="flex items-center">
            <FaCheck className="mr-2 text-green-500 text-xl" />
            <div>
              <p className="font-semibold">Booking Request Submitted!</p>
              <p className="text-sm">
                Your service request has been sent to professionals
              </p>
            </div>
          </div>,
          { autoClose: 5000 }
        );

        // Redirect to my bookings page
        setTimeout(() => {
          router.push("/my-bookings");
        }, 2000);
      } else {
        // Handle specific error messages
        let errorMessage = "Failed to book service";

        if (responseData.message) {
          errorMessage = responseData.message;
        } else if (response.status === 409) {
          errorMessage = "You already have a booking for this service";
        }

        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error("Booking error:", error);
      toast.error(
        <div>
          <p className="font-semibold">Booking Failed</p>
          <p className="text-sm">{error.message}</p>
        </div>,
        { autoClose: 4000 }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Set minimum date (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  // Set maximum date (next 60 days)
  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 60);
    return maxDate.toISOString().split("T")[0];
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading booking details...</p>
        </div>
      </div>
    );
  }

  // If no service found
  if (!serviceDetails) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaExclamationCircle className="text-5xl text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Service Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The service youre looking for doesnt exist.
          </p>
          <button
            onClick={() => router.push("/services")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Browse Services
          </button>
        </div>
      </div>
    );
  }

  // If user not authenticated
  if (!userId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaExclamationCircle className="text-5xl text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Authentication Required
          </h2>
          <p className="text-gray-600 mb-6">
            Please login to book this service.
          </p>
          <button
            onClick={() =>
              router.push(`/login?redirect=/book-service/${serviceId}`)
            }
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Login to Continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-6 group"
        >
          <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Service
        </button>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 text-white p-8 text-center">
            <h1 className="text-3xl font-bold mb-3">Book Your Service</h1>
            <p className="text-blue-100 text-lg">
              Complete your booking in just a few steps
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
            {/* Left Column - Service Summary */}
            <div className="lg:col-span-1 bg-gradient-to-b from-gray-50 to-white p-8 border-r border-gray-200">
              <div className="sticky top-8">
                {/* Service Card */}
                <div className="bg-white rounded-xl p-6 border border-gray-300 shadow-sm">
                  <div className="flex items-center mb-5">
                    <div className="p-3 bg-blue-100 rounded-xl mr-4">
                      <FaTools className="text-2xl text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">
                        Service Summary
                      </h3>
                      <p className="text-gray-500 text-sm">
                        Review before booking
                      </p>
                    </div>
                  </div>

                  <div className="space-y-5">
                    {/* Service Info */}
                    <div className="pb-4 border-b border-gray-200">
                      <h4 className="font-semibold text-gray-700 mb-1">
                        Service
                      </h4>
                      <p className="text-lg font-bold text-blue-700 truncate">
                        {serviceDetails.serviceName}
                      </p>
                      {serviceDetails.description && (
                        <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                          {serviceDetails.description}
                        </p>
                      )}
                    </div>

                    {/* Pricing */}
                    <div className="pb-4 border-b border-gray-200">
                      <h4 className="font-semibold text-gray-700 mb-1">
                        Pricing
                      </h4>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-green-600">
                          ₹{serviceDetails.price}
                        </span>
                        <span className="text-sm text-gray-500 px-3 py-1 bg-gray-100 rounded-full">
                          Fixed Price
                        </span>
                      </div>
                    </div>

                    {/* IDs Information */}
                    <div className="space-y-3">
                      <div className="flex items-center text-gray-600">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                          <FaUser className="text-blue-600 text-sm" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Your User ID</p>
                          <p className="font-mono font-semibold">{userId}</p>
                        </div>
                      </div>

                      <div className="flex items-center text-gray-600">
                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                          <FaTools className="text-purple-600 text-sm" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Service ID</p>
                          <p className="font-mono font-semibold">{serviceId}</p>
                        </div>
                      </div>
                    </div>

                    {/* Quick Tips */}
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="font-bold text-blue-800 mb-2 flex items-center text-sm">
                        <FaInfoCircle className="mr-2" />
                        Quick Tips
                      </h4>
                      <ul className="text-xs text-blue-700 space-y-1">
                        <li>• Be specific in your service description</li>
                        <li>• Choose a convenient date and time</li>
                        <li>• Youll receive confirmation within hours</li>
                        <li>• Cancel anytime before service starts</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Booking Form */}
            <div className="lg:col-span-2 p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Booking Details
                </h2>
                <p className="text-gray-600">
                  Fill in the required information to request this service
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Date and Time Selection */}
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                    <FaCalendarAlt className="mr-3 text-blue-600" />
                    Select Date & Time
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Date Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Service Date *
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          name="date"
                          value={formData.date}
                          onChange={handleInputChange}
                          min={getMinDate()}
                          max={getMaxDate()}
                          className={`w-full px-4 py-3 pl-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                            errors.date
                              ? "border-red-500 bg-red-50"
                              : "border-gray-300 hover:border-blue-400"
                          }`}
                        />
                        <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      </div>
                      {errors.date && (
                        <p className="mt-2 text-sm text-red-600 flex items-center">
                          <FaExclamationCircle className="mr-2" /> {errors.date}
                        </p>
                      )}
                      <p className="mt-1 text-xs text-gray-500">
                        Select a date within the next 60 days
                      </p>
                    </div>

                    {/* Time Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Preferred Time *
                      </label>
                      <div className="relative">
                        <select
                          name="time"
                          value={formData.time}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 pl-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none transition-all ${
                            errors.time
                              ? "border-red-500 bg-red-50"
                              : "border-gray-300 hover:border-blue-400"
                          }`}
                        >
                          <option value="">Select time slot</option>
                          {timeSlots.map((time) => (
                            <option key={time} value={time}>
                              {time}
                            </option>
                          ))}
                        </select>
                        <FaClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                          ▼
                        </div>
                      </div>
                      {errors.time && (
                        <p className="mt-2 text-sm text-red-600 flex items-center">
                          <FaExclamationCircle className="mr-2" /> {errors.time}
                        </p>
                      )}
                      <p className="mt-1 text-xs text-gray-500">
                        Service hours: 9:00 AM - 7:00 PM
                      </p>
                    </div>
                  </div>

                  {/* Selected Date & Time Preview */}
                  {(formData.date || formData.time) && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-sm text-blue-800">
                        <span className="font-semibold">Selected:</span>{" "}
                        {formData.date && formatDate(formData.date)}{" "}
                        {formData.time}
                      </p>
                    </div>
                  )}
                </div>

                {/* Service Description */}
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                    <FaComment className="mr-3 text-blue-600" />
                    Service Requirements
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Describe what you need *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={4}
                      placeholder="Example: Need deep cleaning for my 2BHK apartment. Focus on kitchen and bathrooms. I have pets at home."
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        errors.message
                          ? "border-red-500 bg-red-50"
                          : "border-gray-300 hover:border-blue-400"
                      }`}
                    />
                    {errors.message && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <FaExclamationCircle className="mr-2" />{" "}
                        {errors.message}
                      </p>
                    )}
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-xs text-gray-500">
                        Be specific for better service. Minimum 10 characters
                        required.
                      </p>
                      <span
                        className={`text-xs ${
                          formData.message.length < 10
                            ? "text-red-500"
                            : "text-green-500"
                        }`}
                      >
                        {formData.message.length}/10
                      </span>
                    </div>

                    {/* Tips for good description */}
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="text-xs text-gray-600 bg-white p-3 rounded-lg border">
                        <span className="font-semibold">Good to include:</span>
                        <ul className="mt-1 space-y-1">
                          <li>• Size/area of service location</li>
                          <li>• Specific problems or requirements</li>
                          <li>• Any special circumstances</li>
                        </ul>
                      </div>
                      <div className="text-xs text-gray-600 bg-white p-3 rounded-lg border">
                        <span className="font-semibold">Examples:</span>
                        <ul className="mt-1 space-y-1">
                          <li>• Need plumbing fix for leaking kitchen sink</li>
                          <li>• AC service for 1.5 ton split AC</li>
                          <li>• Full home cleaning, 3 bedrooms</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Summary Section */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">
                    Booking Summary
                  </h3>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-blue-100">
                      <span className="text-gray-600">Service</span>
                      <span className="font-semibold">
                        {serviceDetails.serviceName}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-blue-100">
                      <span className="text-gray-600">Service ID</span>
                      <span className="font-mono font-semibold">
                        {serviceId}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-blue-100">
                      <span className="text-gray-600">Your User ID</span>
                      <span className="font-mono font-semibold">{userId}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600">Service Price</span>
                      <span className="text-2xl font-bold text-green-600">
                        ₹{serviceDetails.price}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Terms and Submit */}
                <div className="space-y-6">
                  {/* Terms Checkbox */}
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      id="terms"
                      required
                      className="mt-1 mr-3 h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="terms" className="text-sm text-gray-700">
                      I agree to the{" "}
                      <a
                        href="/terms"
                        className="text-blue-600 hover:text-blue-800 font-semibold"
                      >
                        Terms of Service
                      </a>{" "}
                      and understand that:
                      <ul className="mt-2 text-gray-600 space-y-1 text-xs">
                        <li>
                          • This is a service request, not a confirmed booking
                        </li>
                        <li>
                          • ServiceHub will connect you with available
                          professionals
                        </li>
                        <li>• Youll receive confirmation calls/texts</li>
                        <li>
                          • Payment details will be discussed with the
                          professional
                        </li>
                      </ul>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-1 active:translate-y-0 flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                        Submitting Request...
                      </>
                    ) : (
                      <>
                        <FaCheck className="mr-3 text-xl" />
                        Submit Service Request
                      </>
                    )}
                  </button>

                  {/* Additional Info */}
                  <div className="text-center">
                    <p className="text-sm text-gray-500">
                      Youll be redirected to your bookings page after successful
                      submission
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      API Endpoint: http://localhost:8080/bookservices/book
                    </p>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookServicePage;
