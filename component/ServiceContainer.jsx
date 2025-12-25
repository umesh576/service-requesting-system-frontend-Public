"use client";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ServiceCard from "./ServiceCard";

const ServiceContainer = () => {
  const [isServiceFetched, setIsServiceFetched] = useState(false);
  const [serviceDetails, setServiceDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchService = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("http://localhost:8080/api/services/", {
          method: "GET",
        });

        if (res.ok) {
          const result = await res.json();
          console.log("response", result);

          // Handle both array and single object response
          const services = Array.isArray(result) ? result : [result];
          setIsServiceFetched(true);
          setServiceDetails(services);
        } else {
          setIsServiceFetched(false);
          toast.error("Failed to fetch services");
        }
      } catch (error) {
        setIsServiceFetched(false);
        console.error("Fetch error:", error);
        toast.error("Failed to connect to server");
      } finally {
        setIsLoading(false);
      }
    };

    fetchService();
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-md overflow-hidden"
          >
            <div className="h-48 bg-gray-200 animate-pulse"></div>
            <div className="p-5">
              <div className="h-6 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse mb-4"></div>
              <div className="flex space-x-3">
                <div className="flex-1 h-10 bg-gray-200 rounded animate-pulse"></div>
                <div className="flex-1 h-10 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Available Services
      </h1>

      {isServiceFetched && serviceDetails.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {serviceDetails.map((service, index) => (
            <ServiceCard key={service.id || index} service={service} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🔧</div>
          <h3 className="text-xl font-medium text-gray-700 mb-2">
            No Services Available
          </h3>
          <p className="text-gray-500 mb-6">
            Check back later for new services
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Refresh
          </button>
        </div>
      )}
    </div>
  );
};

export default ServiceContainer;
