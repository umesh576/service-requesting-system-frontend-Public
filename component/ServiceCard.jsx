"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaMapMarkerAlt, FaRupeeSign, FaStar } from "react-icons/fa";
// import { toast } from "react-toastify";
import { useState } from "react";
import { useRouter } from "next/navigation";

const ServiceCard = ({ service }) => {
  // const [userId, setUserid] = useState();
  const router = useRouter();

  const BookService = async (serviceId) => {
    // Fetch user details including ID from backend
    console.log("Service ID:", serviceId);
    // Only pass serviceId in URL, userId comes from token
    // router.push(`/book-service/${serviceId}`);
    router.push(`/bookedService/${serviceId}`);
  };
  const {
    id,
    serviceName = "Service",
    description = "No description available",
    price = "N/A",
    serviceImage,
    location = {},
    rating = 4.5,
    totalBookings = 0,
  } = service || {};

  const { locationName = "Location not specified", city = "" } = location;

  return (
    <div className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100">
      {/* Image Container */}
      <div className="relative h-56 w-full overflow-hidden">
        {serviceImage ? (
          <Image
            src={serviceImage}
            alt={serviceName}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw "
            loading="eager"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-gray-100 to-gray-300 flex items-center justify-center">
            <span className="text-gray-500 text-lg">Service Image</span>
          </div>
        )}

        {/* Price Badge */}
        <div className="absolute top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg">
          <div className="flex items-center">
            <FaRupeeSign className="text-sm" />
            <span className="text-lg font-bold ml-1">{price}</span>
          </div>
        </div>

        {/* Rating Badge */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center">
          <FaStar className="text-yellow-500 mr-1" />
          <span className="font-semibold">{rating}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Title and Location */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-2 truncate">
            {serviceName}
          </h3>
          <div className="flex items-center text-gray-600">
            <FaMapMarkerAlt className="text-blue-500 mr-2" />
            <span className="text-sm">
              {locationName}
              {city ? `, ${city}` : ""}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-6 line-clamp-3">{description}</p>

        {/* Stats */}
        <div className="flex justify-between text-sm text-gray-500 mb-6">
          <div className="flex items-center">
            <span className="font-medium">{totalBookings}</span>
            <span className="ml-1">Bookings</span>
          </div>
          <div className="text-green-600 font-medium">Available Now</div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          {/* Book Service Button */}
          <button
            onClick={() => {
              // Handle booking logic
              // console.log(`Booking service: ${serviceName} (ID: ${id})`);
              BookService(service.id);
              // You can also pass this to a modal or booking page
            }}
            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:-translate-y-1 shadow-md hover:shadow-lg"
          >
            Book Now
          </button>

          {/* View Details Button */}
          <Link
            href={`/services/${id}`}
            className="flex-1 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center"
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
