
/**
 * CVMHW Knowledge Base
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
}

export interface PatientRights {
  title: string;
  description: string;
  contact?: string;
}

export const cvmhwServices: CVMHWService[] = [
  {
    name: "Clinical Mental Health Counseling & Psychotherapy",
    description: "Individual, family, and couples therapy for anxiety, depression, trauma, autism, and relationship issues. Provided by Eric Riesterer, LPC, supervised by Wendy Nathan, LPCC-S.",
    fees: {
      standard: "$120/hour (1hr session), $100/hour (parent therapy), $150 (assessment)",
      slidingScale: "$45-$70/hour based on household income",
      proBono: true
    },
    features: [
      "HIPAA-compliant and confidential",
      "Evidence-based approaches",
      "Accepts most major insurance",
      "Good Faith Estimate provided (1-3 business days)",
      "Specializes in anxiety, depression, trauma, autism, relationships"
    ]
  },
  {
    name: "Life Coaching Wellness Services",
    description: "Non-clinical life coaching for goal-setting, stress management, life transitions, and personal empowerment. Complements but does not replace therapy.",
    fees: {
      standard: "$45/hour",
      slidingScale: "$25-$45/hour based on household income",
      proBono: true
    },
    features: [
      "Non-HIPAA, consultation service",
      "Action-oriented sessions",
      "Walk & talk sessions available",
      "Can work alongside your outside therapist",
      "Focus on balance, purpose, and growth"
    ]
  },
  {
    name: "Athletic Coaching",
    description: "Running and athletic coaching consultation using proven training methodologies. Not medical or psychological treatment.",
    fees: {
      standard: "Programs range $250-$850, Free intro consultation",
      slidingScale: "10-20% discount based on household income",
      proBono: true
    },
    features: [
      "Programs for all levels (Couch to 5K through advanced)",
      "Evidence-based training methods",
      "Customized plans for your goals",
      "Full refund within 4 weeks",
      "Coach has elite racing background"
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
    description: "You have the right to receive respectful treatment regardless of race, color, national origin, sex, age, or disability."
  },
  {
    title: "Confidentiality & Privacy",
    description: "Your therapy sessions are confidential and HIPAA-protected. Information is only shared when required by law or for your safety."
  },
  {
    title: "Submit Grievances",
    description: "You can voice concerns about services without fear of retaliation.",
    contact: "Contact Wendy Nathan, LPCC-S at (419) 377-3057 or WNathanWellness@gmail.com"
  },
  {
    title: "Sliding Scale & Financial Assistance",
    description: "Sliding fee scales and pro-bono services available based on financial hardship and household income."
  },
  {
    title: "Good Faith Estimates",
    description: "You'll receive written cost estimates within 1-3 business days (No Surprises Act compliant)."
  },
  {
    title: "Disability Accommodations",
    description: "Reasonable accommodations provided under ADA. Requests reviewed within 5 business days."
  },
  {
    title: "Appropriate Level of Care",
    description: "If outpatient therapy isn't sufficient, we'll help connect you with higher levels of care including IOP, inpatient, or medication management."
  }
];

export const mandatedReportingInfo = {
  description: "Mental health professionals are required by Ohio law to report suspected abuse, neglect, or imminent safety threats to appropriate authorities.",
  lawReference: "Ohio Rev. Code § 2151.421 (child abuse) and § 5101.63 (elder abuse)",
  purpose: "This protects vulnerable individuals and is a legal requirement, not a choice."
};

export const serviceDistinctions = {
  psychotherapy: "HIPAA-protected medical service for diagnosing and treating mental health conditions",
  lifeCoaching: "Non-medical consultation for personal growth and goal achievement",
  athleticCoaching: "Non-medical consultation for athletic training and performance"
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
    paymentPlans: "Available with notarized agreement through legal counsel",
    refunds: "Athletic coaching: full refund within 4 weeks; therapy/coaching: case-by-case basis"
  };
};
