
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
    // Modern browser geolocation API
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            // Use a browser-compatible approach to fetch location data
            const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
            const data = await response.json();
            
            setLocationData({
              city: data.city || data.locality,
              region: data.principalSubdivision,
              country: data.countryName,
              latitude,
              longitude
            });
          } catch (error) {
            console.error("Error getting location data:", error);
            // Fallback to Cleveland, OH for testing
            setLocationData({
              city: "Cleveland",
              region: "Ohio",
              country: "United States"
            });
          }
        },
        (error) => {
          console.log("Geolocation permission denied or error:", error);
          // Fallback to Cleveland, OH for testing
          setLocationData({
            city: "Cleveland",
            region: "Ohio",
            country: "United States"
          });
        }
      );
    } else {
      console.log("Geolocation not supported");
      // Fallback to Cleveland, OH for testing
      setLocationData({
        city: "Cleveland",
        region: "Ohio",
        country: "United States"
      });
    }
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
