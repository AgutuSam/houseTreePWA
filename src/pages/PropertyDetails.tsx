import React, { useState, useEffect } from 'react'
import { propertyService } from '../services/propertyService';
import { useParams, Link } from 'react-router-dom'
import { Property } from '../types/property';
import {
  MapPinIcon,
  BedIcon,
  BathIcon,
  SquareIcon,
  HeartIcon,
  ShareIcon,
  CalendarIcon,
  HomeIcon,
  CheckIcon,
  XIcon,
  StarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MessageSquareIcon,
  PhoneIcon,
  ClockIcon,
  CreditCardIcon,
  LockIcon,
  ShieldIcon,
} from 'lucide-react'

export const PropertyDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError('');
    propertyService.getProperty(id)
      .then((prop) => {
        setProperty(prop);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load property.');
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div className="container mx-auto px-4 py-12 text-center text-lg">Loading property...</div>;
  }

  if (error || !property) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Property Not Found
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {error || "The property you're looking for doesn't exist or has been removed."}
        </p>
        <Link
          to="/"
          className="inline-flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
        >
          <HomeIcon className="w-4 h-4 mr-2" />
          Back to Home
        </Link>
      </div>
    );
  }

  // Defensive helpers
  const price = typeof property.price === 'number' ? property.price : 0;
  const currency = typeof property.currency === 'String' ? property.currency : 'Kes';
  const squareFootage = typeof property.squareFootage === 'number' ? property.squareFootage : 0;
  const images = property.images && property.images.length > 0 ? property.images : ["/placeholder-property.jpg"];

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1,
    )
  }
  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1,
    )
  }
  const availableDates = [
    'Jul 15, 2023',
    'Jul 16, 2023',
    'Jul 17, 2023',
    'Jul 18, 2023',
    'Jul 19, 2023',
    'Jul 20, 2023',
  ]

  // Helper to format Firestore Timestamp or JS Date
  function formatDate(date: any): string {
    if (!date) return 'N/A';
    // Firestore Timestamp
    if (typeof date === 'object' && date.seconds && date.nanoseconds) {
      const jsDate = new Date(date.seconds * 1000);
      return jsDate.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    }
    // JS Date
    if (date instanceof Date) {
      return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    }
    // ISO string or fallback
    const parsed = new Date(date);
    if (!isNaN(parsed.getTime())) {
      return parsed.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    }
    return String(date);
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen pb-12">
      {/* Property Images Gallery */}
      <div className="relative bg-gray-900 h-[300px] md:h-[500px]">
        <img
          src={images[currentImageIndex]}
          alt={property.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        {/* Navigation Arrows */}
        <button
          onClick={prevImage}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white text-gray-800 transition-colors"
          aria-label="Previous image"
        >
          <ChevronLeftIcon className="w-6 h-6" />
        </button>
        <button
          onClick={nextImage}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white text-gray-800 transition-colors"
          aria-label="Next image"
        >
          <ChevronRightIcon className="w-6 h-6" />
        </button>
        {/* Image Counter */}
        <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
          {currentImageIndex + 1} / {images.length}
        </div>
        {/* Actions */}
        <div className="absolute top-4 right-4 flex space-x-2">
          <button className="p-2 rounded-full bg-white/80 hover:bg-white text-gray-700 hover:text-rose-500 transition-colors">
            <HeartIcon className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-full bg-white/80 hover:bg-white text-gray-700 transition-colors">
            <ShareIcon className="w-5 h-5" />
          </button>
        </div>
        {/* Back Button */}
        <Link
          to="/"
          className="absolute top-4 left-4 p-2 rounded-full bg-white/80 hover:bg-white text-gray-700 transition-colors"
        >
          <ChevronLeftIcon className="w-5 h-5" />
        </Link>
      </div>
      {/* Thumbnail Gallery */}
      <div className="container mx-auto px-4 -mt-12 relative z-10">
        <div className="bg-white dark:bg-gray-800 p-2 rounded-xl shadow-md mb-6 overflow-x-auto">
          <div className="flex space-x-2">
            {images.map((img, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 ${currentImageIndex === index ? 'border-emerald-500' : 'border-transparent'}`}
              >
                <img
                  src={img}
                  alt={`View ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Property Details */}
          <div className="lg:col-span-2">
            {/* Basic Info */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                    {property.title}
                  </h1>
                  <div className="flex items-center text-gray-500 dark:text-gray-400 mt-2">
                    <MapPinIcon className="h-5 w-5 mr-1" />
                    <span>{property.address}</span>
                  </div>
                </div>
                <div className="flex items-center bg-emerald-100 dark:bg-emerald-900/30 px-3 py-1 rounded-full">
                  <StarIcon className="h-4 w-4 text-amber-500 mr-1" />
                  <span className="font-medium text-emerald-800 dark:text-emerald-300">
                    {typeof property.rating === 'number' ? property.rating : 'N/A'}/5
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap gap-6 mt-6">
                <div className="flex items-center">
                  <BedIcon className="h-5 w-5 text-gray-400 mr-2" />
                  <div>
                    <span className="block text-lg font-medium text-gray-900 dark:text-white">
                      {property.bedrooms}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Bedrooms
                    </span>
                  </div>
                </div>
                <div className="flex items-center">
                  <BathIcon className="h-5 w-5 text-gray-400 mr-2" />
                  <div>
                    <span className="block text-lg font-medium text-gray-900 dark:text-white">
                      {property.bathrooms}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Bathrooms
                    </span>
                  </div>
                </div>
                <div className="flex items-center">
                  <SquareIcon className="h-5 w-5 text-gray-400 mr-2" />
                  <div>
                    <span className="block text-lg font-medium text-gray-900 dark:text-white">
                      {squareFootage.toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Square Feet
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Description
                </h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {property.description}
                </p>
              </div>
            </div>
            {/* Features & Amenities */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Features & Amenities
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                <div>
                  <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-3">
                    Property Features
                  </h3>
                  <ul className="space-y-2">
                    {(Array.isArray(property.features) ? property.features : []).map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-center text-gray-600 dark:text-gray-300"
                      >
                        <CheckIcon className="h-4 w-4 text-emerald-500 mr-2 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-3">
                    Building Amenities
                  </h3>
                  <ul className="space-y-2">
                    {(Array.isArray(property.amenities) ? property.amenities : []).map((amenity, index) => (
                      <li
                        key={index}
                        className="flex items-center text-gray-600 dark:text-gray-300"
                      >
                        <CheckIcon className="h-4 w-4 text-emerald-500 mr-2 flex-shrink-0" />
                        <span>{amenity}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div>
                  <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-3">
                    Additional Information
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start text-gray-600 dark:text-gray-300">
                      <CalendarIcon className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                      <div>
                        <span className="font-medium text-gray-700 dark:text-gray-200">
                          Available From:
                        </span>
                        <span className="block">{formatDate(property.availableFrom)}</span>
                      </div>
                    </li>
                    <li className="flex items-start text-gray-600 dark:text-gray-300">
                      <HomeIcon className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                      <div>
                        <span className="font-medium text-gray-700 dark:text-gray-200">
                          Pet Policy:
                        </span>
                        <span className="block">{property.petPolicy}</span>
                      </div>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-3">
                    Parking Information
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {property.parkingInfo}
                  </p>
                </div>
              </div>
            </div>
            {/* Reviews Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                  Reviews
                </h2>
                <div className="flex items-center">
                  <StarIcon className="h-5 w-5 text-amber-400 mr-1" />
                  <span className="font-medium text-gray-900 dark:text-white">
                    {property.rating}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400 ml-1">
                    ({Array.isArray(property.reviews) ? property.reviews.length : 0} reviews)
                  </span>
                </div>
              </div>
              <div className="space-y-6">
                {(Array.isArray(property.reviews) ? property.reviews : []).map((review, idx) => (
                  <div
                    key={review?.id || idx}
                    className="pb-6 border-b border-gray-200 dark:border-gray-700 last:border-0 last:pb-0"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {review?.author || 'Anonymous'}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {review?.date || ''}
                      </div>
                    </div>
                    <div className="flex items-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon
                          key={i}
                          className={`h-4 w-4 ${i < (review?.rating || 0) ? 'text-amber-400' : 'text-gray-300 dark:text-gray-600'}`}
                        />
                      ))}
                    </div>
                    <p className="text-gray-600 dark:text-gray-300">
                      {review?.comment || ''}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Right Column - Booking & Contact Info */}
          <div className="lg:col-span-1">
            {/* Booking Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Book This Property
              </h2>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                <div className="flex items-center">
                  <span className="text-2xl font-bold text-gray-900 dark:text-white mr-2">
                    {currency} {price.toFixed(2)}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    per night
                  </span>
                </div>
                <button
                  onClick={() => setShowPaymentModal(true)}
                  className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                >
                  <CreditCardIcon className="w-4 h-4 mr-2" />
                  Reserve Now
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Check-in Date
                  </label>
                  <select
                    value={selectedDate || ''}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="block w-full p-2 text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  >
                    <option value="">Select a date</option>
                    {availableDates.map((date) => (
                      <option key={date} value={date}>
                        {date}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Guests
                  </label>
                  <input
                    type="number"
                    min="1"
                    defaultValue="1"
                    className="block w-full p-2 text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>
            </div>
            {/* Contact Landlord Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Contact Landlord
              </h2>
              <div className="flex items-center mb-4">
                <PhoneIcon className="h-5 w-5 text-emerald-500 mr-3" />
                <div>
                  <span className="block text-gray-900 dark:text-white font-medium">
                    {property.landlord?.name}
                  </span>
                  <a
                    href={`tel:${property.landlord?.phone}`}
                    className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    {property.landlord?.phone}
                  </a>
                </div>
              </div>
              <div className="flex items-center mb-4">
                <MessageSquareIcon className="h-5 w-5 text-emerald-500 mr-3" />
                <div>
                  <span className="block text-gray-900 dark:text-white font-medium">
                    Send a Message
                  </span>
                  <a
                    href={`mailto:${property.landlord?.email}`}
                    className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    {property.landlord?.email}
                  </a>
                </div>
              </div>
              <div className="flex items-center">
                <ClockIcon className="h-5 w-5 text-emerald-500 mr-3" />
                <div>
                  <span className="block text-gray-900 dark:text-white font-medium">
                    Response Time
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {property.landlord?.responseTime}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 max-w-md mx-auto z-10">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Confirm Your Booking
            </h2>
            <div className="mb-4">
              <p className="text-gray-700 dark:text-gray-300">
                You are about to book{" "}
                <span className="font-semibold">{property.title}</span> from{" "}
                <span className="font-semibold">{property.landlord?.name}</span>.
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                Total Price:{" "}
                <span className="font-semibold text-lg">
                  ${price.toFixed(2)}
                </span>
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
              >
                Confirm and Pay
              </button>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
