import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

export default function GoogleMapComponent({ listings }) {
  // Calculate center based on first listing or default to a location
  const center = listings && listings.length > 0 && listings[0].geolocation
    ? { lat: listings[0].geolocation.lat, lng: listings[0].geolocation.lng }
    : { lat: 51.505, lng: -0.09 }; // Default center (London)

  return (
    <div className="w-full h-full">
      <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
        <GoogleMap
          mapContainerClassName="w-full h-full"
          center={center}
          zoom={13}
        >
          {listings && listings.map((listing) => {
            // Check if listing has valid geolocation data
            if (!listing.geolocation || !listing.geolocation.lat || !listing.geolocation.lng) {
              return null; // Skip this marker if no valid geolocation
            }
            
            return (
              <Marker
                key={listing._id}
                position={{
                  lat: parseFloat(listing.geolocation.lat),
                  lng: parseFloat(listing.geolocation.lng)
                }}
              />
            );
          })}
        </GoogleMap>
      </LoadScript>
    </div>
  );
}
