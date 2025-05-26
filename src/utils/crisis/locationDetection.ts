
/**
 * Location Detection for Crisis Response
 * 
 * Detects user location from various sources and manages location-based crisis responses
 */

import { LocationInfo } from './crisisResponseCoordinator';

/**
 * Extract location information from user input text
 */
export const extractLocationFromText = (userInput: string): LocationInfo | null => {
  if (!userInput) return null;
  
  const text = userInput.toLowerCase();
  
  // Ohio cities and regions
  const ohioLocations = {
    // Ashtabula County
    'ashtabula': { city: 'Ashtabula', region: 'Ashtabula County' },
    'jefferson': { city: 'Jefferson', region: 'Ashtabula County' },
    'geneva': { city: 'Geneva', region: 'Ashtabula County' },
    'conneaut': { city: 'Conneaut', region: 'Ashtabula County' },
    
    // Summit County
    'akron': { city: 'Akron', region: 'Summit County' },
    'cuyahoga falls': { city: 'Cuyahoga Falls', region: 'Summit County' },
    'barberton': { city: 'Barberton', region: 'Summit County' },
    'hudson': { city: 'Hudson', region: 'Summit County' },
    'stow': { city: 'Stow', region: 'Summit County' },
    
    // Stark County
    'canton': { city: 'Canton', region: 'Stark County' },
    'massillon': { city: 'Massillon', region: 'Stark County' },
    'alliance': { city: 'Alliance', region: 'Stark County' },
    'north canton': { city: 'North Canton', region: 'Stark County' },
    
    // Cuyahoga County
    'cleveland': { city: 'Cleveland', region: 'Cuyahoga County' },
    'lakewood': { city: 'Lakewood', region: 'Cuyahoga County' },
    'parma': { city: 'Parma', region: 'Cuyahoga County' },
    'strongsville': { city: 'Strongsville', region: 'Cuyahoga County' },
    'westlake': { city: 'Westlake', region: 'Cuyahoga County' },
    
    // Lake County
    'mentor': { city: 'Mentor', region: 'Lake County' },
    'eastlake': { city: 'Eastlake', region: 'Lake County' },
    'willoughby': { city: 'Willoughby', region: 'Lake County' },
    'chardon': { city: 'Chardon', region: 'Lake County' }
  };
  
  // Check for exact city matches
  for (const [locationKey, locationInfo] of Object.entries(ohioLocations)) {
    if (text.includes(locationKey)) {
      return {
        city: locationInfo.city,
        region: locationInfo.region,
        country: 'United States'
      };
    }
  }
  
  // Check for county mentions
  if (text.includes('ashtabula county') || text.includes('ashtabula co')) {
    return { region: 'Ashtabula County', country: 'United States' };
  }
  if (text.includes('summit county') || text.includes('summit co')) {
    return { region: 'Summit County', country: 'United States' };
  }
  if (text.includes('stark county') || text.includes('stark co')) {
    return { region: 'Stark County', country: 'United States' };
  }
  if (text.includes('cuyahoga county') || text.includes('cuyahoga co')) {
    return { region: 'Cuyahoga County', country: 'United States' };
  }
  if (text.includes('lake county') || text.includes('lake co')) {
    return { region: 'Lake County', country: 'United States' };
  }
  
  // Check for general Ohio mention
  if (text.includes('ohio') || text.includes('oh')) {
    return { region: 'Ohio', country: 'United States' };
  }
  
  return null;
};

/**
 * Get user location from browser geolocation API
 */
export const getBrowserLocation = (): Promise<LocationInfo | null> => {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null);
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          
          // Use a geocoding service to get location details
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          
          if (!response.ok) {
            resolve(null);
            return;
          }
          
          const data = await response.json();
          
          resolve({
            city: data.city || data.locality,
            region: data.principalSubdivision,
            country: data.countryName,
            latitude,
            longitude
          });
        } catch (error) {
          console.error('Error fetching location data:', error);
          resolve(null);
        }
      },
      (error) => {
        console.log('Geolocation error:', error);
        resolve(null);
      },
      {
        timeout: 10000,
        enableHighAccuracy: false
      }
    );
  });
};

/**
 * Check if location information is sufficient for crisis response
 */
export const isLocationSufficient = (locationInfo: LocationInfo | null): boolean => {
  if (!locationInfo) return false;
  
  // We need at least city or region information
  return !!(locationInfo.city || locationInfo.region);
};

/**
 * Determine if we should ask for location based on crisis type and current information
 */
export const shouldRequestLocation = (
  crisisType: string,
  locationInfo: LocationInfo | null,
  hasAskedBefore: boolean
): boolean => {
  // Don't ask again if we already asked
  if (hasAskedBefore) return false;
  
  // Don't ask if we already have sufficient location info
  if (isLocationSufficient(locationInfo)) return false;
  
  // Ask for location for all crisis types to provide better local resources
  const crisisTypesThatNeedLocation = [
    'suicide',
    'crisis',
    'self-harm',
    'tentative-harm',
    'eating-disorder',
    'substance-use'
  ];
  
  return crisisTypesThatNeedLocation.includes(crisisType);
};

/**
 * Get a user-friendly location description for logging
 */
export const getLocationDescription = (locationInfo: LocationInfo | null): string => {
  if (!locationInfo) return 'Unknown location';
  
  if (locationInfo.city && locationInfo.region) {
    return `${locationInfo.city}, ${locationInfo.region}`;
  }
  
  if (locationInfo.city) {
    return locationInfo.city;
  }
  
  if (locationInfo.region) {
    return locationInfo.region;
  }
  
  return 'Unknown location';
};
