
/**
 * Knowledge Data for Vector Database - Updated with CVMHW Legal Information
 */

import { KnowledgeEntry } from './types';

export const rogerTherapeuticKnowledge: KnowledgeEntry[] = [
  // Basic Roger identity and limitations
  {
    content: "Roger is a peer support companion, not a licensed therapist or medical provider. Roger provides supportive conversation while you wait for professional services.",
    category: "roger_identity",
    importance: "critical",
    source: "core_system"
  },
  {
    content: "Roger cannot provide therapy, medical advice, or diagnose mental health conditions. Roger offers peer support and information about professional services.",
    category: "roger_limitations",
    importance: "critical",
    source: "core_system"
  },

  // CVMHW Service Information
  {
    content: "CVMHW offers three distinct services: Clinical Mental Health Counseling & Psychotherapy (HIPAA-protected medical service), Life Coaching Wellness Services (non-medical consultation), and Athletic Coaching Wellness Services (non-medical consultation).",
    category: "cvmhw_services",
    importance: "high",
    source: "cvmhw_knowledge_base"
  },
  {
    content: "Eric Riesterer, LPC, provides psychotherapy services under supervision of Wendy Nathan, LPCC-S. Psychotherapy costs $120/hour for standard sessions, $100/hour for parent therapy, $150 for assessments.",
    category: "cvmhw_psychotherapy",
    importance: "high",
    source: "cvmhw_knowledge_base"
  },
  {
    content: "CVMHW accepts major insurance including Aetna, Anthem BCBS, Beacon Health, Carelon, Cigna, Frontpath, Medical Mutual, Molina, OptumHealth, Paramount, United Healthcare, Medicare, and Medicaid.",
    category: "cvmhw_insurance",
    importance: "high",
    source: "cvmhw_knowledge_base"
  },
  {
    content: "Life coaching at CVMHW costs $45/hour and is non-medical consultation for goal-setting, stress management, and life transitions. It can work alongside outside therapy but is not medical treatment.",
    category: "cvmhw_life_coaching",
    importance: "high",
    source: "cvmhw_knowledge_base"
  },
  {
    content: "Athletic coaching at CVMHW offers programs from Couch to 5K ($250) to Endurance Development ($850). Uses evidence-based methods from Dr. Jack Daniels, Dr. Thomas Schwartz, and others.",
    category: "cvmhw_athletic_coaching",
    importance: "high",
    source: "cvmhw_knowledge_base"
  },

  // Financial and Legal Information
  {
    content: "CVMHW offers sliding scale fees based on household income: psychotherapy $45-$70/hour, life coaching $25-$45/hour, athletic coaching 10-20% discount. Pro-bono services available for severe financial hardship.",
    category: "cvmhw_financial_assistance",
    importance: "high",
    source: "cvmhw_knowledge_base"
  },
  {
    content: "All CVMHW service providers (therapists, life coaches, athletic coaches) are mandated reporters under Ohio Rev. Code § 2151.421 and must report suspected abuse, neglect, or imminent safety threats.",
    category: "cvmhw_mandated_reporting",
    importance: "critical",
    source: "cvmhw_knowledge_base"
  },
  {
    content: "CVMHW psychotherapy services are HIPAA-protected under 45 C.F.R. Parts 160-164. Life coaching and athletic coaching are consultation services and do not have HIPAA protection.",
    category: "cvmhw_privacy_legal",
    importance: "critical",
    source: "cvmhw_knowledge_base"
  },
  {
    content: "Good Faith Estimates are provided within 1-3 business days for all CVMHW services, compliant with the No Surprises Act (42 U.S.C. § 300gg-19a).",
    category: "cvmhw_billing_legal",
    importance: "medium",
    source: "cvmhw_knowledge_base"
  },

  // Patient Rights Information
  {
    content: "CVMHW patients have rights to respectful non-discriminatory treatment, confidentiality (for therapy), grievance submission, sliding scale fees, disability accommodations, and appropriate level of care referrals.",
    category: "cvmhw_patient_rights",
    importance: "high",
    source: "cvmhw_knowledge_base"
  },
  {
    content: "Patient Rights Officer Wendy Nathan, LPCC-S can be contacted at (419) 377-3057 or WNathanWellness@gmail.com for grievances. Written response within 5 business days.",
    category: "cvmhw_patient_rights",
    importance: "medium",
    source: "cvmhw_knowledge_base"
  },
  {
    content: "Disability accommodation requests should be submitted via chat function or emailed to wnathanwellness@gmail.com and cvmindfulhealthandwellness@outlook.com. Reviewed within 5 business days.",
    category: "cvmhw_disability_accommodations",
    importance: "medium",
    source: "cvmhw_knowledge_base"
  },
  {
    content: "CVMHW practice office number for questions and scheduling is (440) 294-8068. This is different from Wendy Nathan's supervision contact number.",
    category: "cvmhw_contact",
    importance: "medium",
    source: "cvmhw_knowledge_base"
  },

  // Legal Compliance and Distinctions
  {
    content: "CVMHW complies with Section 1557 of the Affordable Care Act, Civil Rights Act, Age Discrimination Act, and Americans with Disabilities Act for non-discriminatory service provision.",
    category: "cvmhw_legal_compliance",
    importance: "medium",
    source: "cvmhw_knowledge_base"
  },
  {
    content: "Payment is due at time of service unless notarized payment plan is executed with Legal Counsel and Accounting Services. Unpaid balances may be referred to collections.",
    category: "cvmhw_payment_policy",
    importance: "medium",
    source: "cvmhw_knowledge_base"
  },
  {
    content: "CVMHW disclaims liability for injuries from consultation services (life/athletic coaching). All materials are protected under U.S. Copyright Act (17 U.S.C. §§ 101-1332).",
    category: "cvmhw_liability_ip",
    importance: "low",
    source: "cvmhw_knowledge_base"
  }
];

export const mentalHealthFacts: KnowledgeEntry[] = [
  // Crisis response information
  {
    content: "For immediate suicide risk: Call 988 Suicide & Crisis Lifeline, text 741741 for Crisis Text Line, or go to nearest emergency room. These are 24/7 resources.",
    category: "crisis_resources",
    importance: "critical",
    source: "mental_health_standards"
  },
  {
    content: "Warning signs of suicide include talking about death, expressing hopelessness, withdrawing from activities, giving away possessions, or sudden mood changes.",
    category: "suicide_warning_signs", 
    importance: "critical",
    source: "mental_health_standards"
  },

  // General mental health information
  {
    content: "Depression is characterized by persistent sadness, loss of interest, changes in sleep/appetite, fatigue, and feelings of worthlessness lasting more than two weeks.",
    category: "depression_symptoms",
    importance: "high",
    source: "mental_health_standards"
  },
  {
    content: "Anxiety disorders involve excessive worry, fear, or nervousness that interferes with daily activities. Professional treatment is highly effective.",
    category: "anxiety_disorders",
    importance: "high", 
    source: "mental_health_standards"
  },
  {
    content: "Trauma responses can include flashbacks, nightmares, avoidance, hypervigilance, and emotional numbing. Professional trauma therapy is recommended.",
    category: "trauma_responses",
    importance: "high",
    source: "mental_health_standards"
  },

  // Treatment and support information
  {
    content: "Therapy approaches like CBT, DBT, and trauma-focused therapy have strong evidence for treating depression, anxiety, and PTSD.",
    category: "therapy_approaches",
    importance: "medium",
    source: "mental_health_standards"
  },
  {
    content: "Peer support involves people with lived experience providing encouragement and practical guidance, but it does not replace professional treatment.",
    category: "peer_support_definition",
    importance: "high",
    source: "mental_health_standards"
  },
  {
    content: "Self-care practices like regular sleep, exercise, social connection, and stress management support mental health but are not treatments for clinical conditions.",
    category: "self_care_vs_treatment",
    importance: "medium",
    source: "mental_health_standards"
  }
];

// Combined export for easy access
export const allKnowledgeData = {
  rogerTherapeuticKnowledge,
  mentalHealthFacts
};
