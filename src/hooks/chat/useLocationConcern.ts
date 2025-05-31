
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
            console.log("LOCATION: Got coordinates:", { latitude, longitude });
            
            // Use multiple geocoding services for better reliability
            let locationResult = null;
            
            // Try BigDataCloud first (no API key required)
            try {
              const bdcResponse = await fetch(
                `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
              );
              
              if (bdcResponse.ok) {
                const bdcData = await bdcResponse.json();
                locationResult = {
                  city: bdcData.city || bdcData.locality,
                  region: bdcData.principalSubdivision,
                  country: bdcData.countryName,
                  latitude,
                  longitude
                };
                console.log("LOCATION: BigDataCloud geocoding successful:", locationResult);
              }
            } catch (bdcError) {
              console.log("LOCATION: BigDataCloud failed, trying alternative");
            }
            
            // If BigDataCloud failed, try ipapi.co as fallback
            if (!locationResult) {
              try {
                const ipapiResponse = await fetch('https://ipapi.co/json/');
                if (ipapiResponse.ok) {
                  const ipapiData = await ipapiResponse.json();
                  locationResult = {
                    city: ipapiData.city,
                    region: ipapiData.region,
                    country: ipapiData.country_name,
                    latitude,
                    longitude
                  };
                  console.log("LOCATION: ipapi.co geocoding successful:", locationResult);
                }
              } catch (ipapiError) {
                console.log("LOCATION: ipapi.co also failed");
              }
            }
            
            // If both services failed, use Cleveland as fallback for testing
            if (!locationResult) {
              console.log("LOCATION: All geocoding services failed, using Cleveland fallback");
              locationResult = {
                city: "Cleveland",
                region: "Ohio",
                country: "United States",
                latitude,
                longitude
              };
            }
            
            setLocationData(locationResult);
            console.log("LOCATION: Final location data set:", locationResult);
            
          } catch (error) {
            console.error("Error processing location data:", error);
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
        },
        {
          timeout: 10000,
          enableHighAccuracy: false,
          maximumAge: 300000 // 5 minutes
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
