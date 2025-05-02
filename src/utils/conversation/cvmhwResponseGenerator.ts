
/**
 * Functions to generate responses about CVMHW
 */

import { cvmhwInfo } from './cvmhwInfo';

// Function to generate appropriate responses about CVMHW
export const generateCVMHWInfoResponse = (userInput: string): string | null => {
  const lowerInput = userInput.toLowerCase();
  
  // Check if the user is asking about CVMHW
  const cvmhwKeywords = ['cvmhw', 'cuyahoga valley', 'mindful health', 'wellness', 'the company', 'cvmwh.com', 'eric riesterer'];
  
  if (!cvmhwKeywords.some(keyword => lowerInput.includes(keyword))) {
    return null; // Not asking about CVMHW
  }
  
  // Generate response based on specific topics
  if (lowerInput.includes('insurance') || lowerInput.includes('payment') || lowerInput.includes('cost')) {
    return `Cuyahoga Valley Mindful Health and Wellness accepts many major insurance providers including ${cvmhwInfo.insurance.accepted.slice(0, 5).join(', ')}, and many more. Individual sessions cost ${cvmhwInfo.fees.individual}, with sliding scale options available for qualifying families. They accept various payment methods including ${cvmhwInfo.fees.payment}. Copays may be waived for low-income families upon demonstration of financial need.`;
  }
  
  if (lowerInput.includes('life coaching') || lowerInput.includes('non-clinical')) {
    return `CVMHW offers Life Coaching services as a non-clinical alternative that provides flexibility and personalized guidance. These services include support for ${cvmhwInfo.services.lifeCoaching.services.slice(0, 5).join(', ')}, and many more. Life coaching can take place in various settings including ${cvmhwInfo.services.lifeCoaching.settings.slice(0, 3).join(', ')}, giving you more control over your helping experience. As their philosophy states, inspired by Viktor Frankl: "Love is the only way to grasp another human being in the innermost core of his personality."`;
  }
  
  if (lowerInput.includes('athletic') || lowerInput.includes('coaching') || lowerInput.includes('running') || lowerInput.includes('marathon')) {
    return `Eric Riesterer at CVMHW provides Athletic Coaching services including ${cvmhwInfo.services.athleticCoaching.services.slice(0, 3).join(', ')}. He has extensive coaching experience at middle school, high school, and collegiate levels, with his own impressive athletic background including marathon PRs of 2:45:54 and numerous race victories. His approach utilizes theories from Lydiard, Schwartz, Daniels, and Holler for optimal athletic development. Sliding fee scales are available for qualifying households.`;
  }
  
  if (lowerInput.includes('veteran') || lowerInput.includes('military') || lowerInput.includes('army')) {
    return `CVMHW offers specialized support for veterans and military families. Eric has 6 years of experience in the US Army Reserves and understands the unique challenges of military service and transition to civilian life. He provides counseling for military adjustment, PTSD, and finding balance after service.`;
  }
  
  if (lowerInput.includes('child') || lowerInput.includes('kid') || lowerInput.includes('family') || lowerInput.includes('teen') || lowerInput.includes('adolescent')) {
    return `CVMHW provides comprehensive services for children (as young as 4), adolescents, and families. Services include play therapy, family counseling, school-based support, and help with adjustment issues. Eric has extensive experience working with children in school settings and specializes in helping young clients communicate effectively and navigate challenges.`;
  }
  
  // General response about CVMHW
  return `Cuyahoga Valley Mindful Health and Wellness (CVMHW) provides comprehensive mental health services for clients of all ages, from children as young as 4 to adults and veterans. Led by Eric Riesterer, a Licensed Professional Counselor, they offer evidence-based therapies including cognitive-processing therapy, mindfulness techniques, and play therapy. They specialize in anxiety, depression, trauma treatment, family counseling, and military adjustment issues. They accept most major insurance providers and also offer Life Coaching and Athletic Coaching services.`;
};
