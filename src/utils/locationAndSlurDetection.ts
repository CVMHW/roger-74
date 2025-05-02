
/**
 * Utilities for detecting slurs and location-based referral needs
 */
import { ConcernType } from './reflection/reflectionTypes';

// Known substance-related slurs and terminology that might indicate substance abuse
const substanceAbuseSlurs = [
  // Alcohol terms
  'drunk', 'wasted', 'hammered', 'smashed', 'boozer', 'alchy', 'alcoholic',
  // Drug terms
  'junkie', 'addict', 'crackhead', 'meth head', 'dope fiend', 'stoner', 'pothead',
  'tweaker', 'fiend', 'pill popper', 'smackhead', 'druggie',
  // Street drug names
  'meth', 'crack', 'heroin', 'smack', 'dope', 'coke', 'blow', 'speed',
  'ice', 'crystal', 'x', 'molly', 'ecstasy', 'acid', 'fentanyl', 'oxy',
  'percs', 'percocet', 'xannies', 'xanax', 'bars', 'blues', 'roxies'
];

// Mental health related slurs that might indicate stigma or need for intervention
const mentalHealthSlurs = [
  'crazy', 'psycho', 'insane', 'nuts', 'mental', 'loony', 'schizo',
  'spastic', 'retard', 'retarded', 'deranged', 'lunatic', 'maniac',
  'demented', 'bipolar', 'manic', 'ocd'
];

// States with known high substance abuse rates
const highSubstanceAbuseStates = [
  'west virginia', 'new mexico', 'kentucky', 'nevada', 'ohio',
  'oregon', 'colorado', 'washington', 'montana', 'missouri',
  'michigan', 'indiana', 'pennsylvania', 'rhode island', 'delaware'
];

// States with high mental health facility concentration
const highMentalHealthResourceStates = [
  'massachusetts', 'connecticut', 'new york', 'california', 'maryland',
  'vermont', 'rhode island', 'pennsylvania', 'new jersey', 'minnesota'
];

// Major cities with robust substance abuse treatment options
const substanceAbuseTreatmentCities = [
  'new york', 'los angeles', 'chicago', 'houston', 'philadelphia', 
  'phoenix', 'san antonio', 'san diego', 'dallas', 'san jose',
  'san francisco', 'austin', 'boston', 'denver', 'minneapolis'
];

// Major cities with intensive mental health treatment facilities
const mentalHealthTreatmentCities = [
  'boston', 'new york', 'baltimore', 'philadelphia', 'chicago',
  'los angeles', 'san francisco', 'seattle', 'denver', 'minneapolis',
  'atlanta', 'houston', 'dallas', 'miami', 'orlando'
];

/**
 * Detects multiple substance abuse slurs in text
 * @returns Object with detection results and slur count
 */
export const detectSubstanceAbuseSlurs = (text: string): { 
  detected: boolean; 
  slurCount: number;
  intensityLevel: 'low' | 'moderate' | 'high';
  detectedTerms: string[];
} => {
  if (!text) return { 
    detected: false, 
    slurCount: 0, 
    intensityLevel: 'low',
    detectedTerms: []
  };
  
  const lowercaseText = text.toLowerCase();
  let detectedTerms: string[] = [];
  
  // Count how many different substance terms appear
  substanceAbuseSlurs.forEach(slur => {
    const slurRegex = new RegExp(`\\b${slur}\\b`, 'i');
    if (slurRegex.test(lowercaseText)) {
      detectedTerms.push(slur);
    }
  });
  
  const slurCount = detectedTerms.length;
  
  // Determine intensity based on number of different terms used
  let intensityLevel: 'low' | 'moderate' | 'high' = 'low';
  if (slurCount >= 3) {
    intensityLevel = 'high';
  } else if (slurCount >= 1) {
    intensityLevel = 'moderate';
  }
  
  return {
    detected: slurCount > 0,
    slurCount,
    intensityLevel,
    detectedTerms
  };
};

/**
 * Detects multiple mental health slurs in text
 * @returns Object with detection results and slur count
 */
export const detectMentalHealthSlurs = (text: string): { 
  detected: boolean; 
  slurCount: number;
  intensityLevel: 'low' | 'moderate' | 'high';
  detectedTerms: string[];
} => {
  if (!text) return { 
    detected: false, 
    slurCount: 0, 
    intensityLevel: 'low',
    detectedTerms: []
  };
  
  const lowercaseText = text.toLowerCase();
  let detectedTerms: string[] = [];
  
  // Count how many different mental health terms appear
  mentalHealthSlurs.forEach(slur => {
    const slurRegex = new RegExp(`\\b${slur}\\b`, 'i');
    if (slurRegex.test(lowercaseText)) {
      detectedTerms.push(slur);
    }
  });
  
  const slurCount = detectedTerms.length;
  
  // Determine intensity based on number of different terms used
  let intensityLevel: 'low' | 'moderate' | 'high' = 'low';
  if (slurCount >= 3) {
    intensityLevel = 'high';
  } else if (slurCount >= 1) {
    intensityLevel = 'moderate';
  }
  
  return {
    detected: slurCount > 0,
    slurCount,
    intensityLevel,
    detectedTerms
  };
};

/**
 * Extracts potential location information from text
 */
export const extractLocationInfo = (text: string): {
  state?: string;
  city?: string;
  hasLocation: boolean;
} => {
  if (!text) return { hasLocation: false };
  
  const lowercaseText = text.toLowerCase();
  
  // Check for states
  let state: string | undefined;
  for (const s of [...highSubstanceAbuseStates, ...highMentalHealthResourceStates]) {
    if (lowercaseText.includes(s)) {
      state = s;
      break;
    }
  }
  
  // Check for cities
  let city: string | undefined;
  for (const c of [...substanceAbuseTreatmentCities, ...mentalHealthTreatmentCities]) {
    if (lowercaseText.includes(c)) {
      city = c;
      break;
    }
  }
  
  return {
    state,
    city,
    hasLocation: Boolean(state || city)
  };
};

/**
 * Integrated function to determine if location-based substance abuse referral is needed
 */
export const needsLocationBasedSubstanceReferral = (
  text: string, 
  ipBasedLocation?: { state?: string; city?: string; }
): {
  needsReferral: boolean;
  locationInfo: { state?: string; city?: string; hasLocation: boolean; };
  slurAnalysis: { detected: boolean; slurCount: number; intensityLevel: 'low' | 'moderate' | 'high'; detectedTerms: string[]; };
  referralQuality: 'standard' | 'location-enhanced';
  concernType: ConcernType;
} => {
  // Check for substance abuse slurs
  const slurAnalysis = detectSubstanceAbuseSlurs(text);
  
  // Extract location info from text
  const textLocationInfo = extractLocationInfo(text);
  
  // Combine text-based location with IP-based location, prioritizing text
  const locationInfo = {
    state: textLocationInfo.state || ipBasedLocation?.state,
    city: textLocationInfo.city || ipBasedLocation?.city,
    hasLocation: textLocationInfo.hasLocation || Boolean(ipBasedLocation?.state || ipBasedLocation?.city)
  };
  
  // Determine if referral is needed based on slur intensity and location info
  const needsReferral = slurAnalysis.intensityLevel !== 'low';
  
  // Determine quality of referral based on location info
  const referralQuality = locationInfo.hasLocation ? 'location-enhanced' : 'standard';
  
  // Determine appropriate concern type based on intensity
  let concernType: ConcernType = 'substance-use';
  if (slurAnalysis.intensityLevel === 'high') {
    concernType = 'substance-use';  // High intensity always gets full substance use concern
  } else if (slurAnalysis.intensityLevel === 'moderate') {
    // For moderate cases, look for location-based decision
    if (locationInfo.state && highSubstanceAbuseStates.includes(locationInfo.state.toLowerCase())) {
      concernType = 'substance-use';  // High risk state gets more intense intervention
    } else {
      concernType = 'mild-gambling';  // Use mild gambling as a milder intervention path
    }
  }
  
  return {
    needsReferral,
    locationInfo,
    slurAnalysis,
    referralQuality,
    concernType
  };
};

/**
 * Integrated function to determine if location-based mental health referral is needed
 */
export const needsLocationBasedMentalHealthReferral = (
  text: string, 
  ipBasedLocation?: { state?: string; city?: string; }
): {
  needsReferral: boolean;
  locationInfo: { state?: string; city?: string; hasLocation: boolean; };
  slurAnalysis: { detected: boolean; slurCount: number; intensityLevel: 'low' | 'moderate' | 'high'; detectedTerms: string[]; };
  referralQuality: 'standard' | 'location-enhanced';
  concernType: ConcernType;
  recommendedCareLevel: 'outpatient' | 'intensive-outpatient' | 'partial-hospitalization' | 'residential' | 'inpatient';
} => {
  // Check for mental health slurs
  const slurAnalysis = detectMentalHealthSlurs(text);
  
  // Extract location info from text
  const textLocationInfo = extractLocationInfo(text);
  
  // Combine text-based location with IP-based location, prioritizing text
  const locationInfo = {
    state: textLocationInfo.state || ipBasedLocation?.state,
    city: textLocationInfo.city || ipBasedLocation?.city,
    hasLocation: textLocationInfo.hasLocation || Boolean(ipBasedLocation?.state || ipBasedLocation?.city)
  };
  
  // Determine if referral is needed based on slur intensity
  const needsReferral = slurAnalysis.intensityLevel !== 'low';
  
  // Determine quality of referral based on location info
  const referralQuality = locationInfo.hasLocation ? 'location-enhanced' : 'standard';
  
  // Determine concern type based on slur analysis
  // Look for specific high-risk terms
  const highRiskTerms = ['schizo', 'bipolar', 'manic', 'psycho', 'insane'];
  const hasHighRiskTerms = slurAnalysis.detectedTerms.some(term => 
    highRiskTerms.includes(term.toLowerCase()));
  
  let concernType: ConcernType = 'mental-health';
  let recommendedCareLevel: 'outpatient' | 'intensive-outpatient' | 'partial-hospitalization' | 'residential' | 'inpatient' = 'outpatient';
  
  // Determine care level based on intensity and specific terms
  if (slurAnalysis.intensityLevel === 'high' || hasHighRiskTerms) {
    // High risk gets more intensive recommendation
    recommendedCareLevel = hasHighRiskTerms ? 'partial-hospitalization' : 'intensive-outpatient';
    concernType = 'mental-health';
  } else if (slurAnalysis.intensityLevel === 'moderate') {
    // For moderate cases, recommend outpatient unless in high resource area
    if (locationInfo.state && highMentalHealthResourceStates.includes(locationInfo.state.toLowerCase())) {
      recommendedCareLevel = 'intensive-outpatient';
    } else {
      recommendedCareLevel = 'outpatient';
    }
    concernType = 'mental-health';
  } else {
    // Low intensity, just outpatient
    recommendedCareLevel = 'outpatient';
    concernType = 'mental-health';
  }
  
  return {
    needsReferral,
    locationInfo,
    slurAnalysis,
    referralQuality,
    concernType,
    recommendedCareLevel
  };
};
