
/**
 * Socratic dialogue methods based on Richard Paul and Linda Elder's expanded framework
 * from The Thinker's Guide to the Art of Socratic Questioning (2006)
 */

export interface SocraticQuestionType {
  type: string;
  description: string;
  examples: string[];
}

/**
 * Nine types of Socratic questions based on the expanded framework
 * from the Foundation for Critical Thinking
 */
export const socraticQuestionTypes: SocraticQuestionType[] = [
  {
    type: "clarification",
    description: "Questions that help clarify thinking and probe for deeper understanding",
    examples: [
      "What do you mean by that?",
      "Could you put that another way?",
      "What is your main point?",
      "How does this relate to our discussion?",
      "Could you give me an example?",
      "Would you say more about that?",
      "Let me see if I understand you; do you mean this or that?",
      "How does this relate to our issue?"
    ]
  },
  {
    type: "purpose",
    description: "Questions that probe the intentions, goals, and objectives",
    examples: [
      "What is the purpose of addressing this?",
      "What was your purpose when you said that?",
      "How do the purposes of these different perspectives vary?",
      "Was this purpose justifiable?",
      "What is the purpose of exploring this question now?"
    ]
  },
  {
    type: "assumptions",
    description: "Questions that probe presuppositions and unquestioned beliefs",
    examples: [
      "What are you assuming here?",
      "What could we assume instead?",
      "You seem to be assuming something. Do I understand correctly?",
      "How would you justify taking this for granted?",
      "Is it always the case? Why do you think the assumption holds here?"
    ]
  },
  {
    type: "information",
    description: "Questions that probe facts, reasons, evidence and causes",
    examples: [
      "How do you know this?",
      "What are your reasons for saying that?",
      "What evidence supports this view?",
      "What other information do we need?",
      "Is there reason to doubt this evidence?",
      "How did this come about?",
      "By what reasoning did you come to that conclusion?",
      "How could we find out if that's true?"
    ]
  },
  {
    type: "perspectives",
    description: "Questions that explore alternative viewpoints and perspectives",
    examples: [
      "You seem to be approaching this from a certain perspective. Have you considered others?",
      "How would other groups of people respond to this?",
      "Can anyone see this another way?",
      "What would someone who disagrees say?",
      "How are these different ideas alike or different?",
      "What is an alternative way of looking at this?"
    ]
  },
  {
    type: "implications",
    description: "Questions that explore consequences and implications",
    examples: [
      "What are you implying by that?",
      "If that happened, what else might happen as a result?",
      "What effect would that have?",
      "Would that necessarily happen or only probably happen?",
      "If these things are true, then what else must be true?"
    ]
  },
  {
    type: "meta-questions",
    description: "Questions about the question itself",
    examples: [
      "How can we find out more about this question?",
      "Is this the same issue as something else we've discussed?",
      "Is the question clear? Do we understand it?",
      "Why is this question important?",
      "To answer this question, what other questions would we have to answer first?",
      "How would you put this question differently?"
    ]
  },
  {
    type: "concepts",
    description: "Questions that probe concepts and ideas",
    examples: [
      "What is the main idea we're dealing with?",
      "Why is this idea important?",
      "Do these ideas conflict? If so, how?",
      "Which main theories should we consider here?",
      "Are you using this term in keeping with educated usage?",
      "Which main distinctions should we draw in reasoning through this?"
    ]
  },
  {
    type: "inferences",
    description: "Questions that probe inferences and interpretations",
    examples: [
      "What conclusions are we reaching about this?",
      "On what information are we basing this conclusion?",
      "Is there a more logical inference we might make?",
      "How are you interpreting this? Is there another possible interpretation?",
      "How did you reach that conclusion?",
      "Given all the facts, what is the best possible conclusion?"
    ]
  }
];

/**
 * Core principles of Socratic dialogue in a therapeutic context
 */
export const socraticPrinciples = {
  patientAsExpert: {
    description: "The fundamental principle that the patient is always their own expert",
    principles: [
      "The patient holds the ultimate expertise about their own experiences, feelings, and needs",
      "Socratic questioning aims to help the patient discover their own wisdom, not to impose external views",
      "The role of the helper is to facilitate exploration, not to direct or instruct",
      "This principle is only suspended in cases of imminent harm to self or others",
      "Even when safety concerns arise, the patient's perspective remains central to the approach"
    ]
  },
  
  socraticApproach: {
    description: "Key aspects of the Socratic questioning approach based on Intel® Teach Program",
    principles: [
      "Based on disciplined, thoughtful dialogue that examines ideas logically",
      "The questioner adopts a position of not-knowing to engage in deeper exploration",
      "Helps develop fullest possible knowledge about a topic through guided discovery",
      "Promotes independent thinking and gives ownership of learning to the person",
      "Cultivates higher-level thinking skills through discussion, debate, and analysis"
    ]
  },
  
  implementationTips: {
    description: "Practical guidelines for effective Socratic questioning",
    tips: [
      "Plan significant questions that provide meaning and direction to the dialogue",
      "Use wait time: Allow at least thirty seconds for the person to respond",
      "Follow up on responses with further exploration",
      "Ask probing questions that deepen reflection",
      "Periodically summarize key points that have been discussed",
      "Let the person discover knowledge on their own through well-crafted questions"
    ]
  },

  safetyException: {
    description: "The one exception to the patient-as-expert principle",
    details: [
      "If a person expresses intent to harm themselves or others, safety takes precedence",
      "In crisis situations, the approach shifts to appropriate crisis management",
      "Even in crisis, the person's perspective remains valued and central",
      "The goal becomes connecting the person with appropriate resources while maintaining respect",
      "This exception is applied only when absolutely necessary for safety reasons"
    ]
  }
};

/**
 * Generates an appropriate Socratic question based on the conversation context
 * @param questionType - Type of Socratic question to generate
 * @param context - Optional context for more targeted questions
 * @returns A relevant Socratic question
 */
export const generateSocraticQuestion = (
  questionType: string,
  context?: string
): string => {
  // Find questions matching the requested type
  const matchingType = socraticQuestionTypes.find(type => type.type === questionType);
  
  if (!matchingType) {
    // If type not found, return a generic clarification question
    const clarificationQuestions = socraticQuestionTypes.find(type => type.type === "clarification");
    return clarificationQuestions?.examples[Math.floor(Math.random() * clarificationQuestions.examples.length)] || 
           "Could you tell me more about what you mean?";
  }
  
  // Return a random question from the matching type
  return matchingType.examples[Math.floor(Math.random() * matchingType.examples.length)];
};

/**
 * Selects the most appropriate type of Socratic question based on context
 * @param userInput - The user's last message
 * @returns The most suitable question type for the context
 */
export const selectSocraticQuestionType = (userInput: string): string => {
  const lowerInput = userInput.toLowerCase();
  
  // Analyze input to determine which type of question would be most helpful
  if (lowerInput.includes('why') || 
      lowerInput.includes('because') || 
      lowerInput.includes('reason')) {
    return "information";
  }
  
  if (lowerInput.includes('think') || 
      lowerInput.includes('believe') || 
      lowerInput.includes('view') ||
      lowerInput.includes('opinion')) {
    return "perspectives";
  }
  
  if (lowerInput.includes('if') || 
      lowerInput.includes('then') || 
      lowerInput.includes('result') ||
      lowerInput.includes('outcome')) {
    return "implications";
  }
  
  if (lowerInput.includes('mean') || 
      lowerInput.includes('definition') || 
      lowerInput.includes('explain')) {
    return "concepts";
  }
  
  if (lowerInput.includes('assume') || 
      lowerInput.includes('presume') || 
      lowerInput.includes('given that')) {
    return "assumptions";
  }
  
  if (lowerInput.includes('purpose') || 
      lowerInput.includes('goal') || 
      lowerInput.includes('trying to')) {
    return "purpose";
  }
  
  if (lowerInput.includes('conclude') || 
      lowerInput.includes('therefore') || 
      lowerInput.includes('thus')) {
    return "inferences";
  }
  
  // Default to clarification questions when no specific context is detected
  return "clarification";
};

/**
 * Generates a Socratic response to help clients explore their thinking
 * while honoring that they are the expert on their own experience
 * @param userInput - The client's message
 * @returns A Socratic question to deepen exploration
 */
export const generateSocraticResponse = (userInput: string): string => {
  // Determine the most appropriate question type for this context
  const questionType = selectSocraticQuestionType(userInput);
  
  // Generate an appropriate question
  const question = generateSocraticQuestion(questionType);
  
  // Create a supportive preface for the question that honors the client's expertise
  const prefaces = [
    "I'm curious to explore that further.",
    "That's an interesting perspective.",
    "I'd like to understand your thinking better.",
    "Let's explore that together.",
    "To help me understand better,",
    "Building on what you've shared,",
    "That's worth exploring deeper.",
    "You know your experience best, and I'm wondering,",
    "Since you're the expert on your own experience,",
    "Reflecting on what you've shared,"
  ];
  
  const preface = prefaces[Math.floor(Math.random() * prefaces.length)];
  
  // Return the formatted response
  return `${preface} ${question}`;
};

// Default export
export default {
  socraticQuestionTypes,
  socraticPrinciples,
  generateSocraticQuestion,
  selectSocraticQuestionType,
  generateSocraticResponse
};
