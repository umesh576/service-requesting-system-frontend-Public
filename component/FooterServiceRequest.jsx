"use client";

import React, { useState } from "react";
import { toast } from "react-toastify";
import {
  FaPlus,
  FaTools,
  FaArrowRight,
  FaCheck,
  FaPhone,
  FaEnvelope,
  FaCalendar,
  FaMoneyBillWave,
  FaClock,
} from "react-icons/fa";

const FooterServiceRequest = () => {
  const [isRequestOpen, setIsRequestOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    serviceName: "",
    description: "",
    category: "",
    budget: "",
    urgency: "medium", // low, medium, high
    contactEmail: "",
    phoneNumber: "",
    preferredDate: "",
    location: "",
  });

  const serviceCategories = [
    "Home Repair & Maintenance",
    "Cleaning Services",
    "Electrical Work",
    "Plumbing",
    "Painting & Decorating",
    "Carpentry & Woodwork",
    "Appliance Repair",
    "AC & Refrigeration",
    "Pest Control",
    "Gardening & Landscaping",
    "Moving & Packing",
    "Computer & IT Services",
    "Beauty & Salon",
    "Tuition & Education",
    "Health & Fitness",
    "Event Planning",
    "Photography",
    "Other",
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Get user token if available
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;

      const requestData = {
        ...formData,
        userId: token ? "logged-in-user" : "guest",
        requestedAt: new Date().toISOString(),
        status: "pending",
      };

      const response = await fetch(
        "http://localhost:8080/api/service-requests",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          body: JSON.stringify(requestData),
        }
      );

      if (response.ok) {
        toast.success(
          <div className="flex items-center">
            <FaCheck className="mr-2 text-green-500" />
            Service request submitted successfully! Our experts will contact you
            soon.
          </div>,
          { autoClose: 5000 }
        );

        // Reset form
        setFormData({
          serviceName: "",
          description: "",
          category: "",
          budget: "",
          urgency: "medium",
          contactEmail: "",
          phoneNumber: "",
          preferredDate: "",
          location: "",
        });

        setIsRequestOpen(false);
      } else {
        throw new Error("Failed to submit request");
      }
    } catch (error) {
      console.error("Error submitting service request:", error);
      toast.error(
        <div>
          <p className="font-semibold">Submission Failed</p>
          <p className="text-sm">Please try again or contact support</p>
        </div>,
        { autoClose: 4000 }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickRequest = (category) => {
    setFormData((prev) => ({
      ...prev,
      category,
      serviceName: `${category} Service`,
    }));
    setIsRequestOpen(true);

    toast.info(`Quick request started for ${category}`, {
      icon: <FaTools className="text-blue-500" />,
      autoClose: 3000,
    });
  };

  return (
    <>
      {/* Floating Request Button */}
      <button
        onClick={() => setIsRequestOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 group animate-bounce-slow"
        aria-label="Request a Service"
      >
        <FaPlus className="text-xl group-hover:rotate-90 transition-transform duration-300" />
        <span className="absolute -top-10 right-0 bg-gray-900 text-white text-xs px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
          Request a Service
        </span>
      </button>

      {/* Request Modal/Form */}
      {isRequestOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold flex items-center">
                    <FaTools className="mr-3" />
                    Request a New Service
                  </h2>
                  <p className="text-blue-100 mt-1">
                    ServiceHub - Connect with trusted professionals
                  </p>
                </div>
                <button
                  onClick={() => setIsRequestOpen(false)}
                  className="text-white hover:text-gray-200 text-2xl"
                  aria-label="Close"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Quick Request Buttons */}
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Quick Request
              </h3>
              <div className="flex flex-wrap gap-2">
                {["Plumbing", "Electrical", "Cleaning", "Repair"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleQuickRequest(cat)}
                    className="px-4 py-2 bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-700 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center"
                  >
                    <FaPlus className="mr-2 text-xs" />
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Main Form */}
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Service Name */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    What service do you need? *
                  </label>
                  <input
                    type="text"
                    name="serviceName"
                    value={formData.serviceName}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., Kitchen sink installation, House cleaning, etc."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select a category</option>
                    {serviceCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Budget */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <FaMoneyBillWave className="mr-2 text-gray-500" />
                    Estimated Budget
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      ₹
                    </span>
                    <input
                      type="number"
                      name="budget"
                      value={formData.budget}
                      onChange={handleInputChange}
                      placeholder="Enter your budget"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Urgency */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <FaClock className="mr-2 text-gray-500" />
                    Urgency Level
                  </label>
                  <div className="flex space-x-3">
                    {[
                      {
                        value: "low",
                        label: "Low",
                        color: "bg-green-100 text-green-800",
                      },
                      {
                        value: "medium",
                        label: "Medium",
                        color: "bg-yellow-100 text-yellow-800",
                      },
                      {
                        value: "high",
                        label: "High",
                        color: "bg-red-100 text-red-800",
                      },
                    ].map((level) => (
                      <button
                        key={level.value}
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            urgency: level.value,
                          }))
                        }
                        className={`flex-1 py-2 rounded-lg border transition-all ${
                          formData.urgency === level.value
                            ? `${level.color} border-${
                                level.color.split("-")[1]
                              }-300`
                            : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                        }`}
                      >
                        {level.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Preferred Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <FaCalendar className="mr-2 text-gray-500" />
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    name="preferredDate"
                    value={formData.preferredDate}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                    placeholder="City/Area"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Contact Information */}
                <div className="md:col-span-2 border-t pt-6 mt-2">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">
                    Contact Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <FaEnvelope className="mr-2 text-gray-500" />
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="contactEmail"
                        value={formData.contactEmail}
                        onChange={handleInputChange}
                        required
                        placeholder="you@example.com"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <FaPhone className="mr-2 text-gray-500" />
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        required
                        placeholder="+91 9876543210"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Detailed Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    placeholder="Please describe your service requirements in detail..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Be specific for better quotes from professionals
                  </p>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex flex-col sm:flex-row justify-between items-center mt-8 pt-6 border-t gap-4">
                <div className="text-sm text-gray-600">
                  <p className="flex items-center">
                    <FaCheck className="mr-2 text-green-500" />
                    Get quotes from 3+ verified professionals
                  </p>
                </div>
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsRequestOpen(false)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors duration-200"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium flex items-center transition-all duration-200 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        Submit Request
                        <FaArrowRight className="ml-2" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add CSS for animation */}
      <style jsx>{`
        @keyframes bounce-slow {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s infinite;
        }
      `}</style>
    </>
  );
};

export default FooterServiceRequest;
