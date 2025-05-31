
/**
 * CVMHW Integration for Roger - Updated with Comprehensive Legal Information
 * 
 * Integrates practice policies and service information into Roger's responses
 */

import { 
  cvmhwServices, 
  insuranceProviders, 
  patientRights, 
  getCVMHWServiceInfo, 
  getAffordabilityOptions, 
  serviceDistinctions,
  mandatedReportingInfo,
  legalAgreements,
  financialPolicies,
  getLegalCompliance
} from './cvmhwKnowledgeBase';

export const detectCVMHWServiceInquiry = (userInput: string): string | null => {
  const input = userInput.toLowerCase();
  
  if (input.includes('cost') || input.includes('price') || input.includes('fee') || input.includes('afford') || input.includes('insurance') || input.includes('payment')) {
    return 'financial';
  }
  if (input.includes('therapy') || input.includes('counseling') || input.includes('psychotherapy') || input.includes('mental health')) {
    return 'psychotherapy';
  }
  if (input.includes('life coach') || input.includes('coaching') && !input.includes('athletic')) {
    return 'life-coaching';
  }
  if (input.includes('athletic') || input.includes('running') || input.includes('training') || input.includes('marathon')) {
    return 'athletic-coaching';
  }
  if (input.includes('rights') || input.includes('privacy') || input.includes('confidential') || input.includes('grievance')) {
    return 'patient-rights';
  }
  if (input.includes('sliding scale') || input.includes('pro bono') || input.includes('financial help') || input.includes('hardship')) {
    return 'financial-assistance';
  }
  if (input.includes('legal') || input.includes('mandated reporting') || input.includes('liability') || input.includes('agreement')) {
    return 'legal-information';
  }
  if (input.includes('disability') || input.includes('accommodation') || input.includes('ada')) {
    return 'disability-accommodations';
  }
  
  return null;
};

export const generateCVMHWResponse = (inquiryType: string, userInput: string): string => {
  switch (inquiryType) {
    case 'financial':
      return generateFinancialResponse();
    case 'psychotherapy':
      return generatePsychotherapyResponse();
    case 'life-coaching':
      return generateLifeCoachingResponse();
    case 'athletic-coaching':
      return generateAthleticCoachingResponse();
    case 'patient-rights':
      return generatePatientRightsResponse();
    case 'financial-assistance':
      return generateFinancialAssistanceResponse();
    case 'legal-information':
      return generateLegalInformationResponse();
    case 'disability-accommodations':
      return generateDisabilityAccommodationsResponse();
    default:
      return generateGeneralCVMHWResponse();
  }
};

const generateFinancialResponse = (): string => {
  return `I can help you understand CVMHW's comprehensive financial options:

**Standard Fees:**
• Psychotherapy: $120/hour (therapy), $100/hour (parent sessions), $150 (assessment)
• Life Coaching: $45/hour
• Athletic Coaching: $250-$850 (program-based), free intro consultation

**Financial Assistance Available:**
• Sliding scale fees based on household income from most recent tax year
• Pro-bono services for qualifying households with severe financial hardship
• Payment plans available with notarized agreement through legal counsel
• We accept most major insurance for psychotherapy services

**Payment Policy:** Payment due at time of service unless payment plan is executed. Good Faith Estimates provided within 1-3 business days (No Surprises Act compliant).

Would you like specific details about any of these options?`;
};

const generatePsychotherapyResponse = (): string => {
  return `CVMHW offers comprehensive psychotherapy services:

**What We Treat:** Anxiety, depression, trauma, autism spectrum concerns, and relationship/family issues

**Your Therapist:** Eric Riesterer, LPC, supervised by Wendy Nathan, LPCC-S

**Key Features:**
• HIPAA-compliant and confidential medical service
• Evidence-based treatment approaches
• Individual, family, and couples therapy
• Insurance accepted: ${insuranceProviders.slice(0, 4).join(', ')}, and others

**Fees:** $120/hour standard, sliding scale $45-$70 available based on income

**Important:** This is medical service for diagnosing and treating mental health conditions, unlike life coaching which is consultation.

**Mandated Reporting:** As required by Ohio law, suspected abuse/neglect or safety threats must be reported to authorities.

Would you like to know more about getting started or financial assistance options?`;
};

const generateLifeCoachingResponse = (): string => {
  return `CVMHW's Life Coaching is a wellness consultation service:

**What It Helps With:** Goal-setting, stress management, life transitions, personal empowerment

**Key Points:**
• Non-medical, non-psychological consultation service
• Can work alongside your outside therapist
• Walk & talk sessions available in various settings
• Action-oriented and personalized
• Non-HIPAA (consultation service, not medical)

**Fees:** $45/hour standard, sliding scale $25-$45 available

**Important Distinctions:**
• This is consultation, not therapy or medical treatment
• Cannot diagnose or treat mental health conditions
• Complements but does not replace psychotherapy

**Mandated Reporting:** Life coaches must report suspected abuse/neglect or safety threats as required by Ohio law.

Interested in learning more about how this consultation service might help you?`;
};

const generateAthleticCoachingResponse = (): string => {
  return `CVMHW offers athletic coaching consultation for runners and athletes:

**Programs Available:**
• Couch to 5K (16 weeks) - $250
• First Marathon (26 weeks) - $350
• Endurance Development (52 weeks) - $850
• Sprint/Distance Camps (12-20 weeks) - $300-$400
• Free intro consultation + race planning

**Training Methods:**
• Evidence-based: Dr. Jack Daniels VDOT, Dr. Thomas Schwartz "Tinman," Dr. Jay Johnson, Tom Holler "Feed the Cats"
• Customized plans for your goals
• Coach credentials: NCAA DII runner, elite post-collegiate career, OHSAA coaching experience

**Important:** This is consultation, not medical treatment. You're responsible for health clearance and assume physical risks.

**Refund Policy:** Full refund within 4 weeks; hardship refunds considered thereafter.

**Mandated Reporting:** Athletic coaches must report suspected abuse/neglect as required by Ohio law.

Would you like to know more about specific programs or getting started?`;
};

const generatePatientRightsResponse = (): string => {
  return `You have important rights as a CVMHW client:

**Your Key Rights:**
• Respectful, non-discriminatory treatment (ACA Section 1557, Civil Rights Act, ADA)
• Confidential, HIPAA-protected therapy sessions (consultation services have different privacy)
• Submit grievances without retaliation - written response within 5 business days
• Access to sliding scale fees and pro-bono services based on financial hardship
• Disability accommodations under ADA - reviewed within 5 business days
• Appropriate level of care referrals when needed

**Privacy & Safety:** 
• Psychotherapy is HIPAA-protected and confidential
• Life/Athletic coaching are consultation services with limited confidentiality
• All providers must report suspected abuse or safety concerns as required by Ohio law

**Questions or Concerns?** Contact Patient Rights Officer Wendy Nathan, LPCC-S at (419) 377-3057 or WNathanWellness@gmail.com

Is there a specific right or policy you'd like me to explain in more detail?`;
};

const generateFinancialAssistanceResponse = (): string => {
  return `CVMHW offers comprehensive financial assistance options:

**Sliding Scale Fees (based on household income from most recent tax year):**
• Psychotherapy: $45-$70/hour (vs $120 standard)
• Life Coaching: $25-$45/hour (vs $45 standard)  
• Athletic Coaching: 10-20% program discount

**Pro-Bono Services:**
• Available for severe financial hardship (unemployment, medical necessity)
• Requires written application and supporting documentation
• Subject to availability and level of care appropriateness

**Payment Options:**
• Payment due at time of service (standard)
• Notarized payment plans available through legal counsel and accounting services
• Insurance accepted for psychotherapy services

**Additional Policies:**
• Good Faith Estimates within 1-3 business days
• Athletic coaching: full refund within 4 weeks
• Collections may apply to unpaid balances

No one should avoid getting help due to financial concerns. Would you like help understanding how to apply for these options?`;
};

const generateLegalInformationResponse = (): string => {
  return `Here's important legal information about CVMHW services:

**Service Types & Legal Framework:**
• **Psychotherapy:** HIPAA-protected medical service under Ohio licensing (§ 4757)
• **Life Coaching:** Non-medical consultation service (no HIPAA protection)
• **Athletic Coaching:** Non-medical consultation service (not medical treatment)

**Mandated Reporting (All Services):**
All CVMHW providers must report suspected abuse/neglect or imminent safety threats under Ohio Rev. Code § 2151.421 and § 5101.63.

**Liability & Intellectual Property:**
• Company disclaims liability for consultation services (life/athletic coaching)
• All materials protected under U.S. Copyright Act (17 U.S.C. §§ 101-1332)
• Client assumes responsibility for health risks in consultation services

**Compliance:**
• Non-discrimination under federal laws (ACA, Civil Rights Act, ADA)
• Consumer protection for consultation services
• Professional supervision for psychotherapy services

Would you like more details about any specific legal aspect or service distinction?`;
};

const generateDisabilityAccommodationsResponse = (): string => {
  return `CVMHW provides disability accommodations under the Americans with Disabilities Act:

**Your Rights:**
• Reasonable accommodations for all services
• Non-discriminatory treatment regardless of disability
• Equal access to psychotherapy, life coaching, and athletic coaching services

**How to Request Accommodations:**
• Submit requests via the chat function (routed directly to legal partners)
• Email copies to wnathanwellness@gmail.com and cvmindfulhealthandwellness@outlook.com
• All requests reviewed by legal counsel within 5 business days

**Legal Compliance:**
• 42 U.S.C. §§ 12101 et seq. (Americans with Disabilities Act)
• 42 U.S.C. § 18116 (Section 1557 of the Affordable Care Act)
• Ohio Rev. Code § 4757 licensing standards

**What We Provide:**
• Modifications to service delivery as appropriate
• Alternative communication methods
• Accessible meeting locations when possible
• Reasonable adjustments to policies and procedures

Is there a specific accommodation you'd like to discuss or request?`;
};

const generateGeneralCVMHWResponse = (): string => {
  return `CVMHW offers three distinct service types with different legal frameworks:

**1. Clinical Psychotherapy** - HIPAA-protected medical service for mental health treatment
**2. Life Coaching** - Non-medical consultation for personal growth and wellness  
**3. Athletic Coaching** - Non-medical consultation for training and performance

**Key Features:**
• All services offer sliding scale fees and pro-bono options
• Insurance accepted for psychotherapy services
• Good Faith Estimates provided within 1-3 business days
• All providers are mandated reporters under Ohio law

**Important Distinctions:**
• Only psychotherapy is medical/psychological treatment
• Consultation services (life/athletic coaching) are not medical treatment
• Different privacy protections apply to each service type

What would you like to know more about? I can explain specific services, costs, your rights, legal policies, or help you understand which option might be appropriate for your needs.`;
};

export const shouldUseCVMHWKnowledge = (userInput: string): boolean => {
  return detectCVMHWServiceInquiry(userInput) !== null;
};

// Enhanced function to get service-specific legal information
export const getCVMHWLegalInfo = (serviceType: string) => {
  return legalAgreements.find(agreement => 
    agreement.serviceType.toLowerCase().includes(serviceType.toLowerCase())
  );
};

// Function to get financial policy information
export const getCVMHWFinancialInfo = () => {
  return financialPolicies;
};

// Function to get compliance information
export const getCVMHWComplianceInfo = () => {
  return getLegalCompliance();
};
