import { MessageType } from '../components/Message';
import { rogerianPrinciples, rogerianApplications, generateRogerianResponse } from './rogerianPrinciples';

// Initial messages for the chat
export const getInitialMessages = (): MessageType[] => [
  {
    id: '1',
    text: "Hi, I'm Roger, your peer support companion. I'm here to listen and offer support. How can I help you today?",
    sender: 'roger',
    timestamp: new Date(),
  },
];

// Create a new message with the given text and sender
export const createMessage = (
  text: string, 
  sender: 'user' | 'roger', 
  concernType: 'crisis' | 'medical' | 'mental-health' | 'eating-disorder' | 'substance-use' | null = null
): MessageType => {
  return {
    id: Date.now().toString(),
    text,
    sender,
    timestamp: new Date(),
    concernType
  };
};

// Get a crisis message
export const getCrisisMessage = (): string => {
  const crisisResponses = [
    "I'm really concerned about what you're going through. It sounds like you're in crisis. Please know that you're not alone and there are people who can help. I strongly recommend reaching out to one of the crisis resources listed below for immediate support.",
    
    "It sounds like you're going through a difficult time. I want you to know that I'm here for you, but I'm not equipped to handle crisis situations. Please contact one of the crisis resources listed below for immediate help.",
    
    "I'm very sorry to hear that you're going through such a tough time. It sounds like you need immediate support. Please reach out to one of the crisis resources listed below. They are available 24/7 and can provide the help you need.",
    
    "I can hear how much pain you're in. It's important that you get immediate support. Please contact one of the crisis resources listed below. They can provide the support you need right now.",
    
    "I'm really worried about you. It sounds like you're in a crisis situation. Please reach out to one of the crisis resources listed below. They can provide the support you need right now."
  ];
  
  // Select a random response
  return crisisResponses[Math.floor(Math.random() * crisisResponses.length)];
};

// Store feedback (this is a placeholder - replace with actual implementation)
export const storeFeedback = (messageId: string, feedback: 'positive' | 'negative') => {
  console.log(`Feedback for message ${messageId}: ${feedback}`);
  // In a real application, you would store this feedback in a database or other persistent storage
};

// Crisis keyword detection
export const detectCrisisKeywords = (message: string): boolean => {
  const crisisKeywords = [
    'suicide', 'kill myself', 'end my life', 'want to die', 'hopeless', 'worthless',
    'helpless', 'overwhelmed', 'panic attack', 'anxiety attack', 'self-harm', 'cutting',
    'abused', 'trauma', 'violent', 'assaulted', 'emergency', 'urgent', 'crisis',
    'mental breakdown'
  ];
  const lowerMessage = message.toLowerCase();
  return crisisKeywords.some(keyword => lowerMessage.includes(keyword));
};

// Medical concern detection
export const detectMedicalConcerns = (message: string): boolean => {
  const medicalKeywords = [
    'pain', 'hurt', 'ache', 'doctor', 'hospital', 'emergency', 'ambulance', 'injury', 
    'bleeding', 'wound', 'broken', 'fracture', 'concussion', 'dizzy', 'faint', 
    'fever', 'nausea', 'vomiting', 'chest pain', 'can\'t breathe', 'difficulty breathing',
    'heart attack', 'stroke', 'seizure', 'unconscious'
  ];
  const lowerMessage = message.toLowerCase();
  return medicalKeywords.some(keyword => lowerMessage.includes(keyword));
};

// Mental health concern detection
export const detectMentalHealthConcerns = (message: string): boolean => {
  const mentalHealthKeywords = [
    'bipolar', 'manic', 'mania', 'hypomania', 'schizophrenia', 'hallucination', 'voices',
    'psychosis', 'delusion', 'paranoid', 'racing thoughts', 'not sleeping', 'can\'t sleep',
    'haven\'t slept', 'disoriented', 'confused', 'don\'t know who I am', 'don\'t know where I am',
    'hearing things', 'seeing things'
  ];
  const lowerMessage = message.toLowerCase();
  return mentalHealthKeywords.some(keyword => lowerMessage.includes(keyword));
};

// Eating disorder concern detection
export const detectEatingDisorderConcerns = (message: string): boolean => {
  const eatingDisorderKeywords = [
    'anorexia', 'bulimia', 'binge eating', 'purge', 'throwing up food', 'not eating',
    'too fat', 'too thin', 'hate my body', 'overweight', 'underweight', 'starving myself',
    'calories', 'diet', 'weight loss', 'body image', 'eating disorder', 
    'can\'t eat', 'won\'t eat'
  ];
  const lowerMessage = message.toLowerCase();
  return eatingDisorderKeywords.some(keyword => lowerMessage.includes(keyword));
};

// Substance use concern detection
export const detectSubstanceUseConcerns = (message: string): boolean => {
  const substanceUseKeywords = [
    'alcohol', 'drunk', 'drinking', 'drugs', 'high', 'addiction', 'substance', 
    'heroin', 'cocaine', 'meth', 'opioid', 'overdose', 'withdrawal', 'relapse',
    'sober', 'gambling', 'betting', 'casino', 'lottery', 'scratch-offs'
  ];
  const lowerMessage = message.toLowerCase();
  return substanceUseKeywords.some(keyword => lowerMessage.includes(keyword));
};

// Get a message for medical concerns
export const getMedicalConcernMessage = (): string => {
  const medicalConcernResponses = [
    "I notice you're mentioning some physical health concerns. While I'm here to listen, please remember that I'm not a medical professional. It sounds like speaking with a healthcare provider would be really helpful for what you're experiencing. Would you like me to provide some resources where you can find medical assistance?",
    
    "It sounds like you're dealing with some physical discomfort or health concerns. I want to make sure you get the appropriate care. Since I'm not a medical professional, I'd strongly encourage you to contact your doctor or a healthcare provider about what you're experiencing. There are resources available in the crisis section below if you need immediate assistance.",
    
    "I can understand you're concerned about these physical symptoms. Physical health is really important, and what you're describing should be evaluated by a medical professional. Would it be possible for you to reach out to your doctor soon? The resources below can also help you find immediate medical support if needed.",
    
    "Thank you for sharing that with me. When it comes to physical health symptoms like what you're describing, it's important to get proper medical attention. While I'm here to support you emotionally, a healthcare provider can give you the medical guidance you need. The resources listed below can connect you with medical professionals.",
    
    "I appreciate you trusting me with this information about your physical health. These symptoms sound like they should be checked by a medical professional. While we wait for your therapist, would you like to discuss how you might approach getting medical help, or would you prefer to talk about something else?"
  ];
  
  // Select a random response
  return medicalConcernResponses[Math.floor(Math.random() * medicalConcernResponses.length)];
};

// Get a message for mental health concerns
export const getMentalHealthConcernMessage = (): string => {
  const mentalHealthResponses = [
    "I notice you're describing some experiences that could be related to serious mental health concerns. These are important to address with a qualified mental health professional. While I'm here to listen and provide support while you wait, your therapist will be able to give you the proper guidance. Would it help to talk about how you're feeling right now?",
    
    "What you're describing sounds like symptoms that should be evaluated by a mental health professional. It's important that you get the right kind of support for what you're experiencing. The resources below include mental health crisis lines that can provide immediate assistance. Would you like to talk more about what's been going on while you wait?",
    
    "Thank you for sharing these experiences with me. Changes in sleep, mood, or perception like you're describing are important to discuss with your therapist. They have the training to help with these specific concerns. In the meantime, is there anything that has helped you feel more grounded when you've experienced this before?",
    
    "I understand you're going through some challenging experiences with your mental health. These symptoms you're describing are important to address with a specialist. Your therapist will be able to work with you on these specific concerns. While we wait, would it help to talk about what coping strategies have worked for you in the past?",
    
    "What you're sharing sounds difficult to deal with. Experiences like these are best addressed with a qualified mental health professional who can provide proper evaluation and treatment. The resources below include emergency mental health services. While we wait for your therapist, is there something specific you'd like to talk about today?"
  ];
  
  // Select a random response
  return mentalHealthResponses[Math.floor(Math.random() * mentalHealthResponses.length)];
};

// Get a message for eating disorder concerns
export const getEatingDisorderMessage = (): string => {
  const eatingDisorderResponses = [
    "I notice you're talking about concerns related to eating, body image, or weight. These are important topics that benefit from specialized support. The Emily Program for Eating Disorders in Cleveland provides excellent care for these concerns. Would you like to discuss how you've been feeling about this while you wait for your therapist?",
    
    "Thank you for sharing these thoughts about your body and eating patterns. These concerns deserve compassionate, specialized care. The Emily Program (listed in the resources) specializes in supporting people with similar experiences. While we wait, I'm here to listen without judgment if you'd like to talk more about what you're going through.",
    
    "I hear that you're having some difficult feelings about your body and eating. Many people struggle with these issues, and you deserve supportive, specialized care. The Emily Program listed in our resources can provide that specialized support. Would it help to talk about what's been most challenging for you lately?",
    
    "What you're describing about your relationship with food and your body sounds really challenging. It's important that you know specialized support is available through programs like the Emily Program (listed in our resources). While we wait for your therapist, I'm here to listen if you want to share more about what you're going through.",
    
    "I appreciate you being open about these struggles with food and body image. These concerns are important and deserve specialized care. The Emily Program (1-888-272-0836) provides support specifically for these types of concerns. In the meantime, what would feel most supportive to discuss while you wait for your therapist?"
  ];
  
  // Select a random response
  return eatingDisorderResponses[Math.floor(Math.random() * eatingDisorderResponses.length)];
};

// Get a message for substance use concerns
export const getSubstanceUseMessage = (): string => {
  const substanceUseResponses = [
    "I notice you're mentioning concerns about substance use or gambling. These are important topics that often benefit from specialized support. There are resources listed below that can provide guidance specific to these concerns. Would you like to talk more about what's been going on while you wait for your therapist?",
    
    "Thank you for sharing about your experience with substances/gambling. Many people face similar challenges, and specialized support can make a real difference. The resources section below includes helplines specifically for substance use and gambling concerns. Is there something specific about your experience that you'd like to discuss while you wait?",
    
    "What you're sharing about substance use/gambling is important. These challenges can be complex, and you deserve supportive, specialized care. The resources below include several options for getting more support. While we wait for your therapist, would it help to talk about what prompted you to seek support today?",
    
    "I appreciate your openness about these substance/gambling concerns. It takes courage to talk about these experiences. Specialized services (listed in the resources) can provide support tailored to these specific challenges. While we wait, I'm here to listen if you'd like to share more about what you're going through.",
    
    "The substance use/gambling concerns you're describing are important to address. There are dedicated resources available to help with these specific challenges, including several listed below. While we wait for your therapist, would you like to talk about what has been most difficult for you lately?"
  ];
  
  // Select a random response
  return substanceUseResponses[Math.floor(Math.random() * substanceUseResponses.length)];
};

// CVMHW company information and services
const cvmhwInfo = {
  generalInfo: {
    name: "Cuyahoga Valley Mindful Health and Wellness",
    abbreviation: "CVMHW",
    mission: "Providing comprehensive mental health services for all ages, with a focus on evidence-based practices and personalized care.",
    ageRange: "Serving clients from age 4 to adults, including veterans and families.",
    mainPractitioner: "Eric Riesterer, Licensed Professional Counselor pursuing LPCC licensure in Cuyahoga Falls & Jefferson Ohio.",
    supervision: "Supervised by Wendy Nathan, LPCC-S through Group Supervision and Work Supervision."
  },
  services: {
    counseling: [
      "Individual therapy for children (as young as 4), adolescents, adults, and veterans",
      "Evidence-based approaches including cognitive-processing therapy, mindfulness techniques, and play therapy",
      "Trauma treatment and PTSD/C-PTSD care with specialized veteran services",
      "Family counseling and sibling relationship therapy",
      "Child and adolescent counseling with play therapy",
      "Anxiety, depression, and adjustment disorder treatment",
      "School-based counseling and academic support",
      "Boys' and men's mental health",
      "Telehealth services via Doxy.me (HIPAA-compliant)"
    ],
    lifeCoaching: [
      "Non-clinical services for real-world problems",
      "More flexibility with meeting locations (parks, libraries, coffee shops, etc.)",
      "Support for ADD/ADHD, academic challenges, career development",
      "Parenting education and family stressors",
      "Finding balance, purpose, and meaning",
      "Social skill development",
      "Work and school-related stressors"
    ],
    athleticCoaching: [
      "Physical wellness services with sliding fee scales available",
      "Running programs from Couch to 5K to Marathon training",
      "Sprint, middle-distance, and distance development camps",
      "Race plan consultations and performance visualization",
      "Coaching experience at middle school, high school, and collegiate levels"
    ]
  },
  credentials: {
    education: "Master's in Counseling and Human Developmental Therapy at Walsh University with research focus in trauma psychotherapy",
    experience: "4.5+ years of counseling experience through non-profit work, school-based services, and private practice",
    specialties: "Trauma counseling, play therapy, mindfulness, cognitive-behavioral therapy, military adjustment",
    coaching: "Track & Field/Cross-Country Coach in Hudson, Louisville, Burton, and Jefferson",
    military: "6 years in the US Army Reserves working in petroleum/oil engineering"
  },
  insurance: {
    accepted: [
      "Aetna", "AmeriHealth", "Anthem", "Blue Cross", "Blue Shield", "BlueCross and BlueShield", 
      "Buckeye", "Carelon Behavioral Health", "CareSource", "FrontPath", "Humana", 
      "Medicaid", "Medical Mutual", "Molina Healthcare", "Paramount", "UnitedHealthcare"
    ],
    additionalInfo: [
      "Copays Waived for Low-Income Families upon Demonstration of Financial Need",
      "Sliding Fee Scale Available for Low-Income Families",
      "OH Medicaid Healthcare Insurance Enrollment Assistance available FREE of charge for eligible families"
    ]
  },
  fees: {
    individual: "$120 per session",
    couples: "$120 per session",
    slidingScale: "Available for qualifying low-income families",
    payment: "Apple Cash, Cash, Check, Health Savings Account, Venmo"
  },
  locations: {
    offices: ["Cuyahoga Falls", "Jefferson Ohio"],
    telehealth: "Available via Doxy.me (HIPAA-compliant)"
  },
  contactInfo: "For appointments or questions, please contact your provider directly."
};

// Collaborative support principles from person-centered and collaborative psychotherapy
const collaborativeSupportPrinciples = {
  core: {
    description: "The collaborative relationship in peer support is guided by principles from Carl Rogers' person-centered approach and collaborative psychotherapy, as described by Peggy Natiello and others.",
    values: [
      "Human nature is basically trustworthy and positive - individuals can be trusted to make decisions and solve problems given an appropriately supportive climate",
      "Collaborative relationships are more growth-promoting than authoritarian or power-over relationships",
      "In a collaborative relationship, both persons may be positively changed by the interaction",
      "Psychological health includes the capacity for healthy interdependence and connectedness",
      "In collaborative support, the person seeking help influences the process as much as the helper does"
    ]
  },
  characteristics: [
    "Commitment to being real, transparent, and fully present as a person rather than acting as the expert",
    "Openness, responsiveness, and dignity in interactions",
    "Personal empowerment and alternating influence",
    "Cooperation rather than control",
    "Being responsible to each other rather than for each other",
    "Fostering trust in the person's capacity for self-direction"
  ],
  approach: [
    "Creating a safe space for exploration without judgment",
    "Listening deeply to understand rather than to diagnose or fix",
    "Respecting the person's wisdom about their own life",
    "Sharing personal experience when appropriate to demonstrate shared humanity",
    "Recognizing that healing happens through authentic connection",
    "Trusting in the person's natural movement toward growth"
  ],
  quotes: [
    "A collaborative relationship is defined as a relationship in which the capacity to act or effect change is shared by all persons in the relationship rather than being assigned to one person who is seen as the authority or expert.",
    "Rogers clearly appreciated the value of the relationship and the potential for growth in both persons that comes from the connectedness present in the relationship.",
    "Collaborative relationships are characterized by openness, responsiveness, dignity, personal empowerment, alternating influence, and cooperation.",
    "Healing responses cannot be taught, but they become clear as the collaborative relationship matures and as helpers enhance their self-awareness and their understanding of collaboration.",
    "It is important to convey that we are in this journey together, and the person will ultimately be the one who has the answers for themselves."
  ]
};

// Function to generate appropriate responses about CVMHW
const generateCVMHWInfoResponse = (userInput: string): string | null => {
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
    return `CVMHW offers Life Coaching services as a non-clinical alternative that provides flexibility and personalized guidance. These services include support for ${cvmhwInfo.lifeCoaching.services.slice(0, 5).join(', ')}, and many more. Life coaching can take place in various settings including ${cvmhwInfo.lifeCoaching.settings.slice(0, 3).join(', ')}, giving you more control over your helping experience. As their philosophy states, inspired by Viktor Frankl: "Love is the only way to grasp another human being in the innermost core of his personality."`;
  }
  
  if (lowerInput.includes('athletic') || lowerInput.includes('coaching') || lowerInput.includes('running') || lowerInput.includes('marathon')) {
    return `Eric Riesterer at CVMHW provides Athletic Coaching services including ${cvmhwInfo.athleticCoaching.services.slice(0, 3).join(', ')}. He has extensive coaching experience at middle school, high school, and collegiate levels, with his own impressive athletic background including marathon PRs of 2:45:54 and numerous race victories. His approach utilizes theories from Lydiard, Schwartz, Daniels, and Holler for optimal athletic development. Sliding fee scales are available for qualifying households.`;
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

// Function to generate collaborative support responses
const generateCollaborativeResponse = (userInput: string): string | null => {
  const lowerInput = userInput.toLowerCase();
  
  // Check if the user is asking about the approach or relationship
  if (lowerInput.includes('approach') || lowerInput.includes('relationship') || 
      lowerInput.includes('collaborate') || lowerInput.includes('rogers') || 
      lowerInput.includes('person-centered') || lowerInput.includes('how do you help')) {
    
    // Generate response based on collaborative principles
    if (lowerInput.includes('listen') || lowerInput.includes('understand')) {
      return "I believe in listening deeply to understand rather than to diagnose or fix. My approach is based on Carl Rogers' person-centered principles, where I trust in your natural capacity to move toward growth and healing if given the right supportive environment. I'm here to listen and understand your perspective without judgment.";
    }
    
    if (lowerInput.includes('expert') || lowerInput.includes('advice') || lowerInput.includes('tell me what to do')) {
      return "Rather than positioning myself as an expert on your life, I believe in a collaborative approach where we work together. I trust that you have wisdom about your own life and experiences. My role is to provide a supportive space where you can explore your thoughts and feelings, not to direct your decisions or provide expert advice.";
    }
    
    if (lowerInput.includes('helpful') || lowerInput.includes('benefit')) {
      return "In our conversations, I aim to create a supportive environment characterized by authenticity, deep listening, and respect for your self-direction. I believe that healing happens through genuine connection and that you have within yourself the capacity to work through challenges when given the right supportive climate.";
    }
    
    // General response about the approach
    return "My approach is collaborative and based on person-centered principles developed by Carl Rogers and elaborated by practitioners like Peggy Natiello. I believe that you are the expert on your own life and that my role is to provide genuine presence, deep listening, and a supportive climate where you can explore your thoughts and feelings. I trust in your natural capacity for growth and self-direction.";
  }
  
  return null;
};

// Function to generate appropriate conversational responses based on user input context
export const generateConversationalResponse = (userInput: string): string => {
  // First check if the user is asking about CVMHW specifically
  const cvmhwResponse = generateCVMHWInfoResponse(userInput);
  if (cvmhwResponse) {
    return cvmhwResponse;
  }
  
  // Next check if the user is asking about the collaborative approach
  const collaborativeResponse = generateCollaborativeResponse(userInput);
  if (collaborativeResponse) {
    return collaborativeResponse;
  }
  
  // Check if a Rogerian-specific response is appropriate
  const rogerianResponse = generateRogerianResponse(userInput);
  if (rogerianResponse) {
    return rogerianResponse;
  }
  
  // If no specific pattern is matched, use the general human-like responses
  // that embody Rogerian principles
  return rogerianApplications.appropriateResponses[
    Math.floor(Math.random() * rogerianApplications.appropriateResponses.length)
  ];
};
