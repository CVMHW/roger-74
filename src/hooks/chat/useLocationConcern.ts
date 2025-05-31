
import { useState, useEffect } from 'react';

interface LocationData {
  city?: string;
  region?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
}

/**
 * Hook for detecting location-specific concerns
 * Uses a browser-compatible approach for location detection
 */
export const useLocationConcern = () => {
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [isLocationRelevant, setIsLocationRelevant] = useState<boolean>(false);
  const [activeLocationConcern, setActiveLocationConcern] = useState<string | null>(null);

  // Get location data if available and permitted by user
  useEffect(() => {
    const getLocation = async () => {
      // Modern browser geolocation API
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              const { latitude, longitude } = position.coords;
              console.log("LOCATION: Got coordinates:", { latitude, longitude });
              
              // Use BigDataCloud first (no API key required)
              try {
                const response = await fetch(
                  `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
                );
                
                if (response.ok) {
                  const data = await response.json();
                  const locationResult = {
                    city: data.city || data.locality,
                    region: data.principalSubdivision,
                    country: data.countryName,
                    latitude,
                    longitude
                  };
                  console.log("LOCATION: BigDataCloud geocoding successful:", locationResult);
                  setLocationData(locationResult);
                  return;
                }
              } catch (error) {
                console.log("LOCATION: BigDataCloud failed, using fallback");
              }
              
              // Fallback to Cleveland, OH for testing
              setLocationData({
                city: "Cleveland",
                region: "Ohio",
                country: "United States",
                latitude,
                longitude
              });
              
            } catch (error) {
              console.error("Error processing location data:", error);
              // Fallback to Cleveland, OH
              setLocationData({
                city: "Cleveland",
                region: "Ohio",
                country: "United States"
              });
            }
          },
          (error) => {
            console.log("Geolocation permission denied or error:", error);
            // Fallback to Cleveland, OH
            setLocationData({
              city: "Cleveland",
              region: "Ohio",
              country: "United States"
            });
          },
          {
            timeout: 10000,
            enableHighAccuracy: false,
            maximumAge: 300000 // 5 minutes
          }
        );
      } else {
        console.log("Geolocation not supported");
        // Fallback to Cleveland, OH
        setLocationData({
          city: "Cleveland",
          region: "Ohio",
          country: "United States"
        });
      }
    };

    getLocation();
  }, []);

  // Function to handle location data from user input
  const handleLocationData = (userInput: string, activeConcern: string | null): boolean => {
    if (!activeConcern) return false;
    
    // Check if the user input contains location-related information
    const containsLocationInfo = /\b(city|town|region|state|country|area|neighborhood|location)\b/i.test(userInput);
    
    if (containsLocationInfo) {
      // Reset the active location concern since it's been addressed
      setActiveLocationConcern(null);
      return true;
    }
    
    return false;
  };

  return {
    locationData,
    isLocationRelevant,
    setIsLocationRelevant,
    activeLocationConcern,
    setActiveLocationConcern,
    handleLocationData
  };
};

export default useLocationConcern;
