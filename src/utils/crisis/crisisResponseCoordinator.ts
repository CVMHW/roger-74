/**
 * Crisis Response Coordinator
 * 
 * Provides coordinated crisis responses based on detected crisis types and location
 */

import { CrisisType } from '../../hooks/chat/crisisDetection';
import { ConcernType } from '../reflection/reflectionTypes';

/**
 * Get an appropriate crisis response based on the detected crisis type and location
 */
export const getCrisisResponse = (crisisType: CrisisType | ConcernType, locationInfo?: LocationInfo): string => {
  const baseResponse = getBaseCrisisResponse(crisisType);
  
  // If we have location info, enhance with local resources
  if (locationInfo && locationInfo.region) {
    const localResources = getLocalResourcesForResponse(crisisType, locationInfo);
    if (localResources) {
      return `${baseResponse} ${localResources}`;
    }
  }
  
  return baseResponse;
};

/**
 * Get base crisis response without location enhancement
 */
const getBaseCrisisResponse = (crisisType: CrisisType | ConcernType): string => {
  switch (crisisType) {
    case 'suicide':
      return getSuicideResponse();
    case 'self-harm':
    case 'tentative-harm':
      return getSelfHarmResponse();
    case 'eating-disorder':
      return getEatingDisorderCrisisResponse();
    case 'substance-use':
      return getSubstanceUseCrisisResponse();
    case 'crisis':
      return getSuicideResponse();
    case 'general-crisis':
      return getGeneralCrisisResponse();
    default:
      return getGeneralCrisisResponse();
  }
};

/**
 * Enhanced response that includes location inquiry when location is unknown
 */
export const getCrisisResponseWithLocationInquiry = (
  crisisType: CrisisType | ConcernType, 
  locationInfo?: LocationInfo,
  hasAskedForLocation: boolean = false
): { response: string; needsLocation: boolean; hasLocalResources: boolean } => {
  const baseResponse = getBaseCrisisResponse(crisisType);
  
  // If we have location, provide local resources
  if (locationInfo && (locationInfo.region || locationInfo.city)) {
    const localResources = getLocalResourcesForResponse(crisisType, locationInfo);
    return {
      response: localResources ? `${baseResponse} ${localResources}` : baseResponse,
      needsLocation: false,
      hasLocalResources: !!localResources
    };
  }
  
  // If we don't have location and haven't asked yet, include thoughtful location inquiry
  if (!hasAskedForLocation && !locationInfo) {
    const locationInquiry = getLocationInquiry(crisisType);
    return {
      response: `${baseResponse} ${locationInquiry}`,
      needsLocation: true,
      hasLocalResources: false
    };
  }
  
  // Default response without location enhancement
  return {
    response: baseResponse,
    needsLocation: false,
    hasLocalResources: false
  };
};

/**
 * Get thoughtful location inquiry based on crisis type
 */
const getLocationInquiry = (crisisType: CrisisType | ConcernType): string => {
  switch (crisisType) {
    case 'suicide':
    case 'crisis':
      return "To help connect you with the most appropriate local crisis services and support, could you let me know what area or city you're in right now?";
    
    case 'eating-disorder':
      return "I'd like to help you find specialized eating disorder treatment resources in your area. What city or region are you located in?";
    
    case 'substance-use':
      return "To provide you with the best local treatment options and support services, could you share what area you're in?";
    
    case 'self-harm':
    case 'tentative-harm':
      return "I want to help you find immediate local support services. What city or area are you currently in?";
    
    default:
      return "To connect you with the most helpful local resources and support services, could you tell me what area you're in?";
  }
};

/**
 * Get local resources based on crisis type and location
 */
const getLocalResourcesForResponse = (
  crisisType: CrisisType | ConcernType, 
  locationInfo: LocationInfo
): string | null => {
  const region = detectOhioRegion(locationInfo);
  
  if (!region) return null;
  
  switch (crisisType) {
    case 'suicide':
    case 'crisis':
    case 'self-harm':
    case 'tentative-harm':
      return getLocalCrisisResourcesText(region);
    
    case 'eating-disorder':
      return getLocalEatingDisorderResourcesText(region);
    
    case 'substance-use':
      return getLocalSubstanceUseResourcesText(region);
    
    default:
      return getLocalCrisisResourcesText(region);
  }
};

/**
 * Detect Ohio region from location info
 */
const detectOhioRegion = (locationInfo: LocationInfo): 'summit' | 'stark' | 'cuyahoga' | 'ashtabula' | 'lake' | null => {
  const city = locationInfo.city?.toLowerCase();
  const region = locationInfo.region?.toLowerCase();
  
  // Ashtabula County
  if (city?.includes('ashtabula') || city?.includes('jefferson') || city?.includes('geneva') || 
      city?.includes('conneaut') || region?.includes('ashtabula')) {
    return 'ashtabula';
  }
  
  // Summit County (Akron area)
  if (city?.includes('akron') || city?.includes('cuyahoga falls') || city?.includes('barberton') ||
      city?.includes('hudson') || city?.includes('stow') || region?.includes('summit')) {
    return 'summit';
  }
  
  // Stark County (Canton area)
  if (city?.includes('canton') || city?.includes('massillon') || city?.includes('alliance') ||
      city?.includes('north canton') || region?.includes('stark')) {
    return 'stark';
  }
  
  // Lake County
  if (city?.includes('mentor') || city?.includes('eastlake') || city?.includes('willoughby') ||
      city?.includes('chardon') || region?.includes('lake')) {
    return 'lake';
  }
  
  // Cuyahoga County (Cleveland area)
  if (city?.includes('cleveland') || city?.includes('lakewood') || city?.includes('parma') ||
      city?.includes('strongsville') || city?.includes('westlake') || region?.includes('cuyahoga')) {
    return 'cuyahoga';
  }
  
  return null;
};

/**
 * Get local crisis resources text
 */
const getLocalCrisisResourcesText = (region: string): string => {
  switch (region) {
    case 'ashtabula':
      return "For immediate local support, you can contact Ashtabula County 24/7 Crisis Hotline at 1-800-577-7849, or Frontline Services at 1-440-381-8347.";
    
    case 'summit':
      return "For immediate local support in your area, Summit County Mobile Crisis is available at 330-434-9144.";
    
    case 'stark':
      return "For immediate local support in your area, Stark County Mobile Crisis is available at 330-452-6000.";
    
    case 'cuyahoga':
      return "For immediate local support in your area, Cuyahoga County Mobile Crisis is available at 1-216-623-6555.";
    
    case 'lake':
      return "For immediate local support in your area, Lake County Frontline Services is available at 1-440-381-8347.";
    
    default:
      return null;
  }
};

/**
 * Get local eating disorder resources text
 */
const getLocalEatingDisorderResourcesText = (region: string): string => {
  switch (region) {
    case 'cuyahoga':
      return "In your area, The Emily Program Cleveland offers specialized eating disorder treatment and can be reached at 1-888-272-0836 for residential care.";
    
    default:
      return "The Emily Program Cleveland (1-888-272-0836) offers specialized eating disorder treatment and may be able to help with resources in your area.";
  }
};

/**
 * Get local substance use resources text
 */
const getLocalSubstanceUseResourcesText = (region: string): string => {
  switch (region) {
    case 'ashtabula':
      return "In your area, Rock Creek Glenbeigh Substance Abuse Hospital specializes in addiction treatment and can be reached at 1-877-487-5126. The Ashtabula County 24/7 Substance Use Crisis Hotline is also available at 1-800-577-7849.";
    
    default:
      return "Glenbeigh Hospital (1-877-487-5126) offers specialized substance abuse treatment and may be able to help with resources in your area.";
  }
};

// Keep existing functions unchanged
const getSuicideResponse = (): string => {
  return "I'm very concerned about what you're sharing regarding thoughts of suicide. This is serious, and it's important you speak with a crisis professional right away. Please call the 988 Suicide & Crisis Lifeline (call or text 988) immediately, or go to your nearest emergency room. Would you like me to provide additional resources?";
};

const getSelfHarmResponse = (): string => {
  return "I'm very concerned about what you're sharing regarding self-harm. Your safety is important, and it would be beneficial to speak with a crisis professional who can provide immediate support. The 988 Suicide & Crisis Lifeline (call or text 988) is available 24/7. Would it be possible for you to reach out to them today?";
};

const getEatingDisorderCrisisResponse = (): string => {
  return "I'm concerned about what you're sharing regarding your eating patterns. This sounds serious, and it's important that you speak with a healthcare professional. The National Eating Disorders Association (NEDA) helpline (1-800-931-2237) can provide immediate support and resources. Would it be possible for you to reach out to them today?";
};

const getSubstanceUseCrisisResponse = (): string => {
  return "I'm concerned about what you're sharing regarding substance use. This situation sounds serious, and it's important that you speak with a healthcare professional. The SAMHSA National Helpline (1-800-662-4357) provides free, confidential, 24/7 treatment referral and information. Would it help to discuss resources available to you?";
};

const getGeneralCrisisResponse = (): string => {
  return "I'm concerned about what you're sharing. This sounds like a difficult situation that would benefit from immediate professional support. The 988 Suicide & Crisis Lifeline (call or text 988) can provide guidance and resources. Would it be helpful if I shared some additional support options?";
};

// Keep existing export functions unchanged
export const getCrisisResponseFromConcernType = (concernType: ConcernType | CrisisType): string => {
  switch (concernType) {
    case 'crisis':
      return getSuicideResponse();
    case 'tentative-harm':
    case 'self-harm':
      return getSelfHarmResponse();
    case 'eating-disorder':
      return getEatingDisorderCrisisResponse();
    case 'substance-use':
      return getSubstanceUseCrisisResponse();
    default:
      return getGeneralCrisisResponse();
  }
};

// ... keep existing code (getCrisisResources and getLocalCrisisResources functions) the same

export const getCrisisResources = (crisisType: CrisisType | ConcernType): string => {
  switch (crisisType) {
    case 'suicide':
    case 'crisis':
    case 'self-harm':
    case 'tentative-harm':
      return "- National Suicide Prevention Lifeline: 988 or 1-800-273-8255\n" +
             "- Crisis Text Line: Text 241-241\n" +
             "- Ohio Veteran Crisis Line: 1-800-273-8255\n" +
             "- Summit County Mobile Crisis: 330-434-9144\n" +
             "- Stark County Mobile Crisis: 330-452-6000\n" +
             "- Cuyahoga County Mobile Crisis: 1-216-623-6555\n" +
             "- Your nearest emergency room\n" +
             "- 911 for immediate danger";
    
    case 'eating-disorder':
      return "- Cleveland Emily Program Eating Disorders Residential Hospital: 1-888-272-0836\n" +
             "- National Eating Disorders Association (NEDA) Helpline: 1-800-931-2237\n" +
             "- NEDA Crisis Text Line: Text 'NEDA' to 741741\n" +
             "- The Emily Program: 1-888-364-5977\n" +
             "- Eating Recovery Center: 1-877-825-8584";
    
    case 'substance-use':
      return "- Ashtabula County 24/7 Substance Use Disorder Crisis Hotline: 1-800-577-7849\n" +
             "- SAMHSA National Helpline: 1-800-662-4357\n" +
             "- Opiate Hotline: 330-453-4357\n" +
             "- Rock Creek Glenbeigh Substance Abuse Hospital: 1-877-487-5126\n" +
             "- Alcoholics Anonymous: http://aa.org\n" +
             "- Narcotics Anonymous: http://na.org";
    
    default:
      return "- National Crisis Hotline: 988\n" +
             "- Crisis Text Line: Text 241-241\n" +
             "- United Way of Ohio: 211\n" +
             "- Your nearest emergency room\n" +
             "- 911 for immediate emergency";
  }
};

export const getLocalCrisisResources = (region: 'summit' | 'stark' | 'cuyahoga' | 'ashtabula' | 'general' = 'general'): string => {
  switch (region) {
    case 'summit':
      return "- Summit County Mobile Crisis: 330-434-9144\n" +
             "- Akron Children's Crisis Line: 330-543-7472\n" +
             "- Homeless Hotline Summit County: 330-615-0577";
    
    case 'stark':
      return "- Stark County Mobile Crisis: 330-452-6000\n" +
             "- Homeless Hotline Stark County: 330-452-4363";
    
    case 'cuyahoga':
      return "- Cuyahoga County Mobile Crisis: 1-216-623-6555\n" +
             "- Cleveland Emergency Medical Services: 1-216-664-2555\n" +
             "- Homeless Hotline Cuyahoga County: 1-216-674-6700\n" +
             "- Cleveland Project DAWN Expanded Mobile Unit: 1-216-387-6290";
    
    case 'ashtabula':
      return "- Ashtabula County 24/7 Substance Use Disorder Crisis Hotline: 1-800-577-7849\n" +
             "- Ashtabula Rape Crisis Center Hotline: 1-440-354-7364\n" +
             "- Ashtabula County Children Services 24/7 Hotline: 1-888-998-1811\n" +
             "- Ashtabula Homesafe Domestic Violence Hotline: 1-800-952-2873";
    
    default:
      return "- National Suicide Prevention Lifeline: 988\n" +
             "- Crisis Text Line: Text 241-241\n" +
             "- United Way of Ohio: 211\n" +
             "- 911 for immediate emergency";
  }
};

// Add location types
export interface LocationInfo {
  city?: string;
  region?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
}
