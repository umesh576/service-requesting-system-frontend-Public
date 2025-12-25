"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  FaCalendarAlt,
  FaClock,
  FaCheck,
  FaExclamationCircle,
  FaArrowLeft,
  FaComment,
  FaInfoCircle,
} from "react-icons/fa";

const BookservicePage = () => {
  const router = useRouter();
  const params = useParams();
  const serviceId = params.id;

  const [userId, setUserId] = useState(null);
  const [serviceDetails, setServiceDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    date: "",
    time: "",
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Get token from localStorage
        const token = localStorage.getItem("token");

        // Validate token and fetch user data
        const userResponse = await fetch(
          `http://localhost:8080/api/auth/validate?token=${token}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (userResponse.ok) {
          const userData = await userResponse.json();
          // Extract user ID from the response
          setUserId(userData.id || userData.user?.id);
        } else {
          // Token is invalid or expired
          toast.error("Session expired. Please login again.");

          router.push(`/login?redirect=/bookservice/${serviceId}`);
          return;
        }

        // Fetch service details
        const serviceResponse = await fetch(
          `http://localhost:8080/api/services/${serviceId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (serviceResponse.ok) {
          const serviceData = await serviceResponse.json();
          setServiceDetails(serviceData);
        } else {
          toast.error("Service not found");
          router.push("/services");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load booking details");
      } finally {
        setIsLoading(false);
      }
    };

    if (serviceId) {
      fetchData();
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

    if (!formData.date) newErrors.date = "Please select a date";
    if (!formData.time) newErrors.time = "Please select a time slot";
    if (!formData.message)
      newErrors.message = "Please describe your service requirement";

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

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    if (!userId || !serviceId) {
      toast.error("Missing required information");
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare booking data according to API requirements
      const bookingData = {
        serviceId: parseInt(serviceId),
        time: `${formatDate(formData.date)} ${formData.time}`,
        message: formData.message.trim(),
        userId: parseInt(userId),
      };

      console.log("Sending booking data:", bookingData);

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await fetch("http://localhost:8080/bookservices/book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bookingData),
      });

      const responseText = await response.text();
      let responseData;

      try {
        responseData = responseText ? JSON.parse(responseText) : {};
      } catch (parseError) {
        console.error("Error parsing response:", parseError);
        responseData = {};
      }

      if (response.ok) {
        toast.success(
          <div className="flex items-center">
            <FaCheck className="mr-2 text-green-500 text-xl" />
            <div>
              <p className="font-semibold">
                Booking Request Submitted Successfully!
              </p>
              <p className="text-sm">
                Confirmation email has been sent to your email address.
              </p>
            </div>
          </div>,
          { autoClose: 5000 }
        );

        // Redirect to home page
        setTimeout(() => {
          router.push("/");
        }, 2000);
      } else {
        // Handle specific error messages from backend
        let errorMessage = "Failed to book service";

        if (responseData) {
          if (typeof responseData === "string") {
            errorMessage = responseData;
          } else if (responseData.message) {
            errorMessage = responseData.message;
          } else if (responseData.error) {
            errorMessage = responseData.error;
          }
        }

        if (response.status === 400) {
          if (
            errorMessage.includes("User Id is required") ||
            errorMessage.includes("Service Id is required")
          ) {
            errorMessage = "Invalid booking data. Please try again.";
          } else if (errorMessage.includes("User not found")) {
            errorMessage = "User account not found. Please login again.";
            router.push("/login");
          } else if (errorMessage.includes("Service not found")) {
            errorMessage =
              "Service not found. Please select a different service.";
          }
        } else if (response.status === 401) {
          errorMessage = "Session expired. Please login again.";
          router.push("/login");
        } else if (response.status === 500) {
          errorMessage = "Server error. Please try again later.";
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

  // If not authenticated
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
              router.push(`/login?redirect=/bookservice/${serviceId}`)
            }
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Login to Continue
          </button>
        </div>
      </div>
    );
  }

  // If service not found
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
              Fill in the details below to request this service
            </p>
          </div>

          <div className="p-8">
            {/* Service Summary */}
            <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    {serviceDetails.serviceName}
                  </h2>
                  <p className="text-gray-600">{serviceDetails.description}</p>
                </div>
                <div className="mt-4 md:mt-0">
                  <div className="text-3xl font-bold text-green-600">
                    ₹{serviceDetails.price}
                  </div>
                  <p className="text-sm text-gray-500 text-right">
                    Service Fee
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Date and Time Selection */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-800 flex items-center">
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
                        className={`w-full px-4 py-3 pl-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
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
                        className={`w-full px-4 py-3 pl-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none ${
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

                {/* Selected Time Preview */}
                {(formData.date || formData.time) && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-800 font-medium">
                      Selected slot:{" "}
                      {formData.date && formatDate(formData.date)}{" "}
                      {formData.time}
                    </p>
                  </div>
                )}
              </div>

              {/* Service Requirements */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-800 flex items-center">
                  <FaComment className="mr-3 text-blue-600" />
                  Service Requirements
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Please describe your service needs *
                  </label>
                  <div className="relative">
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={6}
                      placeholder="Please provide detailed information about the service you need. For example:
• Specific areas that need attention
• Any special requirements or instructions
• Access instructions for the service professional
• Time constraints or deadlines"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.message
                          ? "border-red-500 bg-red-50"
                          : "border-gray-300 hover:border-blue-400"
                      }`}
                    />
                  </div>
                  {errors.message && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <FaExclamationCircle className="mr-2" /> {errors.message}
                    </p>
                  )}
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-xs text-gray-500">
                      Detailed description helps professionals understand your
                      needs better.
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
                </div>
              </div>

              {/* Helpful Tips */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5">
                <h4 className="font-bold text-yellow-800 mb-3 flex items-center">
                  <FaInfoCircle className="mr-2" />
                  Important Information
                </h4>
                <ul className="text-sm text-yellow-700 space-y-2">
                  <li>
                    • Youll receive a confirmation email once your booking is
                    processed
                  </li>
                  <li>
                    • A service professional will contact you within 24 hours
                  </li>
                  <li>
                    • You can cancel or reschedule up to 6 hours before the
                    service time
                  </li>
                  <li>
                    • Please ensure someone is available at the service location
                    during the scheduled time
                  </li>
                </ul>
              </div>

              {/* Submit Button */}
              <div className="pt-6 border-t">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transform hover:-translate-y-1 active:translate-y-0"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                      Processing Your Request...
                    </>
                  ) : (
                    <>
                      <FaCheck className="mr-3 text-xl" />
                      Submit Booking Request
                    </>
                  )}
                </button>

                <p className="text-center text-sm text-gray-500 mt-3">
                  By clicking submit, you agree to our Terms of Service. Youll
                  be redirected to the home page.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookservicePage;
