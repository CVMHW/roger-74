
/**
 * Utilities for generating conversational responses
 */
import { 
  generateRogerianResponse
} from './rogerianPrinciples';

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
    lifeCoaching: {
      services: [
        "Non-clinical services for real-world problems",
        "More flexibility with meeting locations",
        "Support for ADD/ADHD, academic challenges, career development",
        "Parenting education and family stressors",
        "Finding balance, purpose, and meaning",
        "Social skill development",
        "Work and school-related stressors"
      ],
      settings: [
        "Cuyahoga Valley National Metroparks",
        "Local libraries",
        "Neighborhood walks",
        "Home visits (case-by-case)",
        "Coffee shops",
        "Restaurants",
        "Office-based services",
        "HIPAA-compliant telehealth"
      ],
      philosophy: "Love is the only way to grasp another human being in the innermost core of his personality. - Viktor E. Frankl"
    },
    athleticCoaching: {
      services: [
        "Physical wellness services with sliding fee scales available",
        "Running programs from Couch to 5K to Marathon training",
        "Sprint, middle-distance, and distance development camps",
        "Race plan consultations and performance visualization",
        "Coaching experience at middle school, high school, and collegiate levels"
      ],
      credentials: [
        "Coaching experience at middle school, high school, and collegiate levels",
        "Competitive running background with marathon PR of 2:45:54",
        "Utilizes theories from Lydiard, Schwartz, Daniels, and Holler"
      ]
    }
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

// Client-centered therapy insights for peer support
const clientCenteredApproach = {
  definition: "Client-centered therapy, developed by Carl Rogers, is a non-directive, humanistic approach that focuses on the client's perspective and emphasizes creating a supportive environment for self-discovery and personal growth.",
  coreConditions: [
    {
      name: "Psychological Contact",
      description: "A working connection between helper and client - the fundamental precondition for therapeutic change."
    },
    {
      name: "Client Incongruence",
      description: "The client is in a state of inner conflict or distress, often experiencing a discrepancy between their self-concept and actual experience."
    },
    {
      name: "Congruence (Genuineness)",
      description: "The helper is real, transparent, and authentic within the relationship, without presenting a facade."
    },
    {
      name: "Unconditional Positive Regard",
      description: "The helper fully accepts the client without judgment, prizing them as a person of inherent worth."
    },
    {
      name: "Empathic Understanding",
      description: "The helper deeply understands the client's feelings from their internal frame of reference."
    },
    {
      name: "Client Perception",
      description: "The client must at least minimally perceive the helper's acceptance and understanding for positive change to occur."
    }
  ],
  nondirectiveness: {
    description: "Nondirectiveness is a key attitude that enables the helper to genuinely embody the core conditions from a stance of deep respect and trust in the client.",
    principles: [
      "A commitment stemming from deep respect for the client's self-realizing capacities and right to self-determination",
      "The helper does not set goals for the client, give assignments, or direct the process based on their own beliefs",
      "While no helping relationship is entirely free of influence, the disciplined attempt to minimize influence and power over the client is central",
      "This empowers the client to become more authoritative in their own life"
    ]
  },
  actualizing: {
    description: "Central to Rogers's theory is the belief in an innate drive toward self-actualization, meaning that given the right conditions, individuals naturally strive toward growth and fulfilling their potential.",
    implications: [
      "The helper's role is to create an environment conducive to personal growth",
      "Psychological distress arises from distortions in the self-concept, often developed through internalized 'conditions of worth'",
      "These conditions, typically absorbed from significant others or society, lead individuals to deny or distort their true feelings",
      "The core conditions are designed specifically to counteract these damaging conditions of worth"
    ]
  },
  culturalConsiderations: {
    description: "Effective peer support requires cultural humility and adaptability to meet diverse needs and perspectives.",
    principles: [
      "Recognize that the concept of self and personal growth varies across cultures",
      "Acknowledge how cultural contexts shape experiences, expressions of distress, and help-seeking behaviors",
      "Remain open to learning about cultural perspectives different from your own",
      "Adapt communication style and support approaches to respect cultural values and norms",
      "Be mindful of power dynamics that may exist due to cultural differences or marginalized identities"
    ]
  },
  peerSupportAdaptation: {
    description: "While Roger.AI incorporates principles from client-centered therapy, it adapts them to a peer support context with important ethical boundaries:",
    principles: [
      "Roger provides peer support companionship, not clinical therapy or professional counseling",
      "Roger maintains a non-directive, person-centered approach while recognizing the limits of his role",
      "Roger prioritizes connecting clients with their therapist for clinical concerns",
      "Roger embodies the core conditions of empathy, genuineness, and unconditional positive regard within a peer support framework",
      "Roger recognizes crisis situations and directs clients to appropriate professional resources",
      "Roger helps clients feel heard and understood while they wait for their therapist"
    ]
  }
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
    
    if (lowerInput.includes('culture') || lowerInput.includes('background') || lowerInput.includes('diverse')) {
      return "I strive to be adaptable and respectful of diverse cultural perspectives and backgrounds. I recognize that experiences, expressions of distress, and approaches to healing can vary greatly across different cultures and communities. My aim is to create a space where you feel respected and understood in the context of your unique cultural identity and experiences.";
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
  const appropriateResponses = [
    "I'm interested in understanding more about what that's like for you.",
    "That sounds challenging. How are you feeling about it right now?",
    "I appreciate your openness in sharing that with me.",
    "I'm here to listen without judgment. Would you like to tell me more?",
    "I can see this matters deeply to you. What aspects feel most important?",
    "I'm wondering how this experience has affected you.",
    "What would be most helpful for you right now as we talk?",
    "That's a lot to carry. How have you been managing with all of this?",
    "I'm curious about what you're hoping for as you work through this.",
    "I notice you mentioned [specific point]. Could you share more about what that means for you?",
    "Your perspective on this is really important. How do you see the situation?",
    "It sounds like you've been going through some challenging experiences. What has been most difficult for you?",
    "I'm wondering what aspects of this feel most significant to you right now.",
    "What are your thoughts about how you might like to approach this?",
    "Everyone's experience is unique. I'd like to understand how this is specifically affecting you."
  ];
  
  return appropriateResponses[Math.floor(Math.random() * appropriateResponses.length)];
};
