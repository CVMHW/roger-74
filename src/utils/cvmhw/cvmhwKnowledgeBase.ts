
/**
 * CVMHW Knowledge Base - Updated with Comprehensive Legal Information
 * 
 * Contains all practice information, policies, and service details
 */

export interface CVMHWService {
  name: string;
  description: string;
  fees: {
    standard: string;
    slidingScale?: string;
    proBono?: boolean;
  };
  features: string[];
  mandatedReporting: string;
  legalCompliance: string[];
}

export interface PatientRights {
  title: string;
  description: string;
  contact?: string;
  legalReference?: string;
}

export interface LegalAgreement {
  serviceType: string;
  scope: string;
  compliance: string[];
  limitations: string[];
  liability: string;
}

export const cvmhwServices: CVMHWService[] = [
  {
    name: "Clinical Mental Health Counseling & Psychotherapy",
    description: "Individual, family, and couples therapy for anxiety, depression, trauma, autism, and relationship issues. Provided by Eric Riesterer, LPC, supervised by Wendy Nathan, LPCC-S.",
    fees: {
      standard: "$120/hour (1hr session), $100/hour (parent therapy without patient), $150 (biopsychosocial assessment)",
      slidingScale: "$45-$70/hour based on household income from most recent tax year",
      proBono: true
    },
    features: [
      "HIPAA-compliant and confidential",
      "Evidence-based approaches",
      "Accepts Aetna, Anthem BCBS, Beacon Health, Carelon, Cigna, Frontpath, Medical Mutual, Molina, OptumHealth, Paramount, United Healthcare, Medicare, Medicaid",
      "Good Faith Estimate provided within 1-3 business days (No Surprises Act compliant)",
      "Specializes in anxiety, depression, trauma, autism, relationships"
    ],
    mandatedReporting: "Mental Health Therapists & Clinical Counselors are mandated reporters under Ohio law and must report suspected abuse or neglect (Ohio Rev. Code § 2151.421) or imminent threats to safety to appropriate authorities with HIPAA exceptions under 45 CFR Parts 160-164.",
    legalCompliance: [
      "HIPAA (45 C.F.R. Parts 160 and 164)",
      "Ohio Rev. Code § 4757 (LCSWMFT Standards)",
      "Ohio Rev. Code § 2151.421 (child abuse reporting)",
      "Ohio Rev. Code § 5101.63 (elder abuse reporting)",
      "42 U.S.C. § 1320d (HIPAA-Compliance in Mandated-Reporting)"
    ]
  },
  {
    name: "Life Coaching Wellness Services",
    description: "Non-clinical life coaching for goal-setting, stress management, life transitions, and personal empowerment. Complements but does not replace therapy. Non-HIPAA consultation service.",
    fees: {
      standard: "$45/hour",
      slidingScale: "$25-$45/hour based on household income",
      proBono: true
    },
    features: [
      "Non-HIPAA consultation service",
      "Action-oriented sessions",
      "Walk & talk sessions available",
      "Can work alongside outside therapist",
      "Focus on balance, purpose, and growth",
      "Personalized, non-medical consultation"
    ],
    mandatedReporting: "Life coaches are mandated reporters under Ohio law and must report suspected abuse or neglect (Ohio Rev. Code § 2151.421) or imminent threats to safety to appropriate authorities.",
    legalCompliance: [
      "Ohio Rev. Code § 2151.421 (mandated reporting)",
      "Non-medical consultation service",
      "15 U.S.C. §§ 41-58 (federal consumer protection)"
    ]
  },
  {
    name: "Athletic Coaching Wellness Services",
    description: "Running and athletic coaching consultation using evidence-based training methodologies. Not medical or psychological treatment. OHSAA-licensed coaching.",
    fees: {
      standard: "Couch to 5K (16 weeks) - $250, First Marathon (26 weeks) - $350, Endurance Development (52 weeks) - $850, Camps (12-20 weeks) - $300-$400, Free intro + race plan consultation",
      slidingScale: "10-20% discount based on household income",
      proBono: true
    },
    features: [
      "Programs for all levels (Couch to 5K through advanced)",
      "Evidence-based methods (Dr. Jack Daniels VDOT, Dr. Thomas Schwartz Tinman, Dr. Jay Johnson, Tom Holler Feed the Cats)",
      "Customized plans for goals",
      "Full refund within 4 weeks",
      "Coach credentials: 5yrs NCAA DII-Runner, Elite Post-Collegiate, OHSAA coaching, CPR/First Aid certified",
      "PRs: 4:12 1500m, 34:30 10km, 1:15:08 Half Marathon, 2:45 Marathon, 8hr 50mi Trail Ultra"
    ],
    mandatedReporting: "OHSAA-licensed athletic coaches are mandated reporters under Ohio law and must report suspected abuse or neglect (Ohio Rev. Code § 2151.421) or imminent threats to safety to appropriate authorities.",
    legalCompliance: [
      "Ohio Rev. Code § 2151.421 (mandated reporting)",
      "OHSAA licensing standards",
      "Non-medical consultation service",
      "17 U.S.C. §§ 101-1332 (intellectual property protection)"
    ]
  }
];

export const insuranceProviders = [
  'Aetna', 'Anthem BCBS', 'Beacon Health', 'Carelon', 'Cigna', 
  'Frontpath', 'Medical Mutual', 'Molina', 'OptumHealth', 
  'Paramount', 'United Healthcare', 'Medicare', 'Medicaid'
];

export const patientRights: PatientRights[] = [
  {
    title: "Respectful, Non-Discriminatory Care",
    description: "You have the right to receive respectful treatment regardless of race, color, national origin, sex, age, or disability.",
    legalReference: "42 U.S.C. § 18116 (Section 1557 of the Affordable Care Act), Title VI Civil Rights Act, Age Discrimination Act, Americans with Disabilities Act"
  },
  {
    title: "Confidentiality & Privacy",
    description: "Your therapy sessions are confidential and HIPAA-protected. Information is only shared when required by law for mandated reporting or safety.",
    legalReference: "45 C.F.R. Parts 160 and 164 (HIPAA)"
  },
  {
    title: "Submit Grievances",
    description: "You can voice concerns about services without fear of retaliation. Written response within 5 business days.",
    contact: "Contact Patient Rights Officer Wendy Nathan, LPCC-S at (419) 377-3057 or WNathanWellness@gmail.com"
  },
  {
    title: "Sliding Scale & Financial Assistance",
    description: "Sliding fee scales and pro-bono services available based on financial hardship and household income from most recent tax year.",
    legalReference: "Compliance with federal non-discrimination laws"
  },
  {
    title: "Good Faith Estimates",
    description: "You'll receive written cost estimates within 1-3 business days (No Surprises Act compliant).",
    legalReference: "42 U.S.C. § 300gg-19a (No Surprises Act)"
  },
  {
    title: "Disability Accommodations",
    description: "Reasonable accommodations provided under ADA. Submit requests via chat function or email. Reviewed within 5 business days.",
    contact: "Email requests to wnathanwellness@gmail.com and cvmindfulhealthandwellness@outlook.com",
    legalReference: "42 U.S.C. §§ 12101 et seq. (Americans with Disabilities Act)"
  },
  {
    title: "Appropriate Level of Care",
    description: "If outpatient therapy isn't sufficient, we'll help connect you with higher levels of care including IOP, inpatient, or medication management."
  }
];

export const mandatedReportingInfo = {
  description: "All CVMHW service providers (therapists, life coaches, athletic coaches) are required by Ohio law to report suspected abuse, neglect, or imminent safety threats to appropriate authorities.",
  lawReference: "Ohio Rev. Code § 2151.421 (child abuse), § 5101.63 (elder abuse), with HIPAA exceptions under 45 CFR Parts 160-164",
  purpose: "This protects vulnerable individuals and is a legal requirement for all service types, not a choice.",
  scope: "Applies to psychotherapy (HIPAA-protected), life coaching (consultation), and athletic coaching (consultation) services"
};

export const legalAgreements: LegalAgreement[] = [
  {
    serviceType: "Clinical Mental Health Counseling & Psychotherapy",
    scope: "HIPAA-protected medical services for diagnosing and treating mental health conditions under clinical supervision",
    compliance: ["HIPAA 45 C.F.R. Parts 160-164", "Ohio Rev. Code § 4757", "Mandated reporting requirements"],
    limitations: ["Services provided under supervision", "Confidentiality exceptions for safety/legal requirements"],
    liability: "Professional liability coverage for licensed medical services"
  },
  {
    serviceType: "Life Coaching Wellness Services", 
    scope: "Non-medical, non-psychological consultation for personal growth and wellness",
    compliance: ["Ohio Rev. Code § 2151.421 (mandated reporting)", "15 U.S.C. §§ 41-58 (consumer protection)"],
    limitations: ["Not medical/psychological treatment", "No HIPAA protection", "Cannot diagnose or treat mental health conditions"],
    liability: "Company disclaims liability for consultation services - client assumes responsibility"
  },
  {
    serviceType: "Athletic Coaching Wellness Services",
    scope: "Non-medical consultation for athletic training and performance",
    compliance: ["Ohio Rev. Code § 2151.421 (mandated reporting)", "OHSAA licensing", "17 U.S.C. §§ 101-1332 (IP protection)"],
    limitations: ["Not medical treatment", "Client responsible for health clearance", "No guaranteed outcomes"],
    liability: "Company disclaims liability for injuries or health complications from coaching"
  }
];

export const serviceDistinctions = {
  psychotherapy: "HIPAA-protected medical service for diagnosing and treating mental health conditions under clinical supervision",
  lifeCoaching: "Non-medical, non-psychological consultation for personal growth and goal achievement",
  athleticCoaching: "Non-medical consultation for athletic training and performance enhancement"
};

export const financialPolicies = {
  payment: "Payment due at time of service unless notarized payment plan executed with Legal Counsel and Accounting Services",
  slidingScale: {
    eligibility: "Based on household income from most recent federal tax return",
    psychotherapy: "$45-$70/hour (vs $120 standard)",
    lifeCoaching: "$25-$45/hour (vs $45 standard)",
    athleticCoaching: "10-20% program discount"
  },
  proBono: {
    eligibility: "Severe financial hardship (unemployment, medical necessity), subject to availability",
    requirements: "Written application and supporting documentation",
    scope: "Available for all service types based on level of care appropriateness"
  },
  refunds: {
    athleticCoaching: "Full refund within 4 weeks; hardship refunds thereafter with 10% admin fee",
    psychotherapy: "Non-refundable after service delivery except Company error",
    lifeCoaching: "Non-refundable after service delivery except Company error"
  },
  collections: "Unpaid balances may be referred to third-party collector with non-PHI data disclosure"
};

export const getCVMHWServiceInfo = (serviceType?: string) => {
  if (serviceType) {
    return cvmhwServices.find(service => 
      service.name.toLowerCase().includes(serviceType.toLowerCase())
    );
  }
  return cvmhwServices;
};

export const getAffordabilityOptions = () => {
  return {
    slidingScale: "Available for all services based on household income from most recent tax year",
    proBono: "Available for qualifying households demonstrating severe financial hardship",
    paymentPlans: "Available with notarized agreement through legal counsel and accounting services",
    refunds: "Athletic coaching: full refund within 4 weeks; therapy/coaching: case-by-case basis per Company error policy"
  };
};

export const getLegalCompliance = () => {
  return {
    hipaa: "Psychotherapy services only - 45 C.F.R. Parts 160-164",
    mandatedReporting: "All service providers under Ohio Rev. Code § 2151.421 and § 5101.63",
    nonDiscrimination: "42 U.S.C. § 18116, Title VI Civil Rights Act, ADA compliance",
    consumerProtection: "15 U.S.C. §§ 41-58 for consultation services",
    intellectualProperty: "17 U.S.C. §§ 101-1332 for all proprietary materials"
  };
};
