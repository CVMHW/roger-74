
/**
 * CVMHW Integration for Roger
 * 
 * Integrates practice policies and service information into Roger's responses
 */

import { cvmhwServices, insuranceProviders, patientRights, getCVMHWServiceInfo, getAffordabilityOptions, serviceDistinctions } from './cvmhwKnowledgeBase';

export const detectCVMHWServiceInquiry = (userInput: string): string | null => {
  const input = userInput.toLowerCase();
  
  if (input.includes('cost') || input.includes('price') || input.includes('fee') || input.includes('afford') || input.includes('insurance')) {
    return 'financial';
  }
  if (input.includes('therapy') || input.includes('counseling') || input.includes('psychotherapy')) {
    return 'psychotherapy';
  }
  if (input.includes('life coach') || input.includes('coaching') && !input.includes('athletic')) {
    return 'life-coaching';
  }
  if (input.includes('athletic') || input.includes('running') || input.includes('training')) {
    return 'athletic-coaching';
  }
  if (input.includes('rights') || input.includes('privacy') || input.includes('confidential')) {
    return 'patient-rights';
  }
  if (input.includes('sliding scale') || input.includes('pro bono') || input.includes('financial help')) {
    return 'financial-assistance';
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
    default:
      return generateGeneralCVMHWResponse();
  }
};

const generateFinancialResponse = (): string => {
  const options = getAffordabilityOptions();
  return `I can help you understand CVMHW's financial options:

**Standard Fees:**
• Psychotherapy: $120/hour (therapy), $100/hour (parent sessions), $150 (assessment)
• Life Coaching: $45/hour
• Athletic Coaching: $250-$850 (program-based), free intro consultation

**Financial Assistance Available:**
• Sliding scale fees based on household income
• Pro-bono services for qualifying households
• Payment plans with written agreement
• We accept most major insurance including Medicaid

You'll receive a Good Faith Estimate within 1-3 business days. Would you like me to explain any of these options in more detail?`;
};

const generatePsychotherapyResponse = (): string => {
  const service = getCVMHWServiceInfo('psychotherapy');
  return `CVMHW offers comprehensive psychotherapy services:

**What We Treat:** Anxiety, depression, trauma, autism spectrum concerns, and relationship/family issues

**Your Therapist:** Eric Riesterer, LPC, supervised by Wendy Nathan, LPCC-S

**Key Features:**
• HIPAA-compliant and confidential
• Evidence-based treatment approaches
• Individual, family, and couples therapy
• Insurance accepted (${insuranceProviders.slice(0, 4).join(', ')}, and others)

**Fees:** $120/hour standard, sliding scale $45-$70 available based on income

This is different from life coaching - psychotherapy is a medical service for treating mental health conditions. Would you like to know more about getting started?`;
};

const generateLifeCoachingResponse = (): string => {
  return `CVMHW's Life Coaching is a wellness consultation service focused on:

**What It Helps With:** Goal-setting, stress management, life transitions, personal empowerment

**Key Points:**
• Non-medical consultation service (not therapy)
• Can work alongside your outside therapist
• Walk & talk sessions available
• Action-oriented and personalized

**Fees:** $45/hour standard, sliding scale $25-$45 available

This service complements but doesn't replace therapy. It's great for personal growth and achieving life goals. Interested in learning more about how this might help you?`;
};

const generateAthleticCoachingResponse = (): string => {
  return `CVMHW offers athletic coaching consultation for runners and athletes:

**Programs Available:**
• Couch to 5K (16 weeks) - $250
• First Marathon (26 weeks) - $350
• Advanced endurance training (52 weeks) - $850
• Sprint/distance camps - $300-$400

**What You Get:**
• Evidence-based training methods (Jack Daniels VDOT, Tinman, etc.)
• Customized plans for your goals
• Coach with elite racing background
• Free intro consultation + race planning

**Important:** This is consultation, not medical treatment. Full refund within 4 weeks. Would you like to know more about getting started?`;
};

const generatePatientRightsResponse = (): string => {
  return `You have important rights as a CVMHW patient:

**Your Key Rights:**
• Respectful, non-discriminatory treatment
• Confidential, HIPAA-protected therapy sessions
• Submit grievances without retaliation
• Access to sliding scale fees and financial assistance
• Disability accommodations under ADA
• Appropriate level of care referrals when needed

**Privacy & Safety:** Your therapy is confidential except when required by law to report suspected abuse or safety concerns.

**Questions or Concerns?** Contact Patient Rights Officer Wendy Nathan, LPCC-S at (419) 377-3057

There's also a Patient Rights tab at the bottom of this chat for more detailed information. Is there a specific right or policy you'd like me to explain?`;
};

const generateFinancialAssistanceResponse = (): string => {
  const options = getAffordabilityOptions();
  return `CVMHW offers several financial assistance options:

**Sliding Scale Fees:**
• Psychotherapy: $45-$70/hour (vs $120 standard)
• Life Coaching: $25-$45/hour (vs $45 standard)  
• Athletic Coaching: 10-20% program discount
• Based on household income from recent tax return

**Pro-Bono Services:**
• Available for severe financial hardship
• Requires written application and documentation
• Subject to availability

**Other Options:**
• Payment plans with written agreement
• Insurance accepted for psychotherapy
• Refund policies available for programs

No one should avoid getting help due to financial concerns. Would you like help understanding how to apply for these options?`;
};

const generateGeneralCVMHWResponse = (): string => {
  return `CVMHW offers three main services:

**1. Clinical Psychotherapy** - HIPAA-protected therapy for mental health conditions
**2. Life Coaching** - Non-clinical consultation for personal growth
**3. Athletic Coaching** - Training consultation for runners and athletes

All services offer sliding scale fees and work to make care accessible. We accept most major insurance for therapy services.

What would you like to know more about? I can explain services, costs, your rights as a patient, or help you understand which option might be best for your needs.`;
};

export const shouldUseCVMHWKnowledge = (userInput: string): boolean => {
  return detectCVMHWServiceInquiry(userInput) !== null;
};
