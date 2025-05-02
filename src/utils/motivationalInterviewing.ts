
/**
 * Motivational Interviewing principles and techniques
 * Based on the work of William Miller and Stephen Rollnick
 */

// Core principles of Motivational Interviewing
export const miPrinciples = {
  spirit: {
    description: "The underlying mindset and heart of Motivational Interviewing",
    elements: [
      {
        name: "Partnership",
        description: "MI is done WITH people, not TO them. It's a collaborative process between equals."
      },
      {
        name: "Acceptance",
        description: "Involves honoring the person's autonomy, affirming their strengths and efforts, and providing accurate empathy."
      },
      {
        name: "Compassion",
        description: "Actively promoting the other's welfare and giving priority to their needs."
      },
      {
        name: "Evocation",
        description: "Drawing out the person's own motivations for change rather than imposing them."
      }
    ]
  },
  
  principles: {
    description: "The RULE principles guide the approach to conversations",
    elements: [
      {
        name: "Resist the Righting Reflex",
        description: "Avoid the natural tendency to try to 'fix' the person's problems or persuade them what to do."
      },
      {
        name: "Understand the Person's Motivations",
        description: "Their motivations, not yours, are what will drive change."
      },
      {
        name: "Listen with Empathy",
        description: "Understanding their perspective is more important than you sharing yours."
      },
      {
        name: "Empower the Person",
        description: "Support their belief that they can make changes in their life."
      }
    ]
  },
  
  processes: {
    description: "The four overlapping processes in MI conversations",
    elements: [
      {
        name: "Engaging",
        description: "Establishing a helpful connection and working relationship.",
        practices: [
          "Allow time to develop a trusting relationship",
          "Listen to understand, not to respond",
          "Check how comfortable the person feels talking with you",
          "Use reflective listening to show understanding"
        ]
      },
      {
        name: "Focusing",
        description: "Developing and maintaining a specific direction in the conversation about change.",
        practices: [
          "Help the person prioritize areas of change",
          "Use agenda mapping to support focusing",
          "Clarify goals that the person genuinely wants",
          "Notice if you're dancing together or wrestling"
        ]
      },
      {
        name: "Evoking",
        description: "Eliciting the person's own motivations for change.",
        practices: [
          "Explore readiness, willingness, and ability to change",
          "Elicit and respond to change talk",
          "Consider whether reluctance is about confidence or importance",
          "Use evocative questions to draw out the person's own reasons for change"
        ]
      },
      {
        name: "Planning",
        description: "Developing commitment to change and formulating a concrete plan of action.",
        practices: [
          "Help establish reasonable next steps toward change",
          "Evoke rather than prescribe a plan",
          "Offer information or advice with permission",
          "Support self-efficacy for implementing the plan"
        ]
      }
    ]
  }
};

// Core skills of Motivational Interviewing (OARS)
export const miSkills = {
  description: "The foundational communication skills used in MI",
  skills: [
    {
      name: "Open Questions",
      description: "Questions that invite elaboration and thoughtful response rather than brief answers.",
      examples: [
        "What brings you here today?",
        "How would you like things to be different?",
        "What have you tried before that was helpful?",
        "How do you feel about making this change?"
      ]
    },
    {
      name: "Affirmations",
      description: "Statements that recognize the person's strengths, efforts, and worth.",
      examples: [
        "You've shown a lot of persistence in facing these challenges.",
        "That took a lot of courage to share.",
        "You're clearly someone who cares deeply about your family.",
        "You've put a lot of thought into this decision."
      ]
    },
    {
      name: "Reflective Listening",
      description: "Statements that convey understanding of what the person has said and often add meaning or emphasis.",
      types: [
        {
          name: "Simple Reflection",
          description: "Repeats or slightly rephrases what the person said.",
          examples: [
            "So you're finding it hard to manage your time.",
            "You're worried about how this might affect your relationship."
          ]
        },
        {
          name: "Complex Reflection",
          description: "Makes a guess about unspoken meaning, feeling, or implies what might come next.",
          examples: [
            "It sounds like you're feeling torn between what you want and what others expect of you.",
            "Underneath that frustration, there seems to be a real desire to improve this situation."
          ]
        }
      ],
      starters: [
        "Sounds like...",
        "What I'm hearing is...",
        "So you're saying that...",
        "You're feeling like...",
        "From your point of view...",
        "It seems to you that..."
      ]
    },
    {
      name: "Summarizing",
      description: "Pulling together what has been discussed, showing you've been listening and preparing to move forward.",
      purposes: [
        "To collect important points of the discussion",
        "To link together related ideas the person has expressed",
        "To transition to a new topic",
        "To highlight change talk that's been expressed"
      ]
    }
  ]
};

// Change talk concepts in Motivational Interviewing
export const changeLanguage = {
  description: "Types of self-motivational statements that indicate movement toward change",
  preparatoryChangeTalk: {
    description: "DARN - Statements that pave the way for change",
    types: [
      {
        name: "Desire",
        description: "Statements about wanting change",
        examples: ["I want to...", "I wish I could...", "I'd like to..."]
      },
      {
        name: "Ability",
        description: "Statements about capability",
        examples: ["I could...", "I can...", "I might be able to..."]
      },
      {
        name: "Reasons",
        description: "Specific arguments for change",
        examples: ["I would probably feel better if...", "This would help me to...", "If I stopped, my health would improve..."]
      },
      {
        name: "Need",
        description: "Statements about necessities",
        examples: ["I need to...", "I have to...", "I've got to..."]
      }
    ]
  },
  mobilizingChangeTalk: {
    description: "CAT - Statements that signal the person is moving toward action",
    types: [
      {
        name: "Commitment",
        description: "Statements that signal likelihood of action",
        examples: ["I will...", "I'm going to...", "I promise...", "I intend to..."]
      },
      {
        name: "Activation",
        description: "Statements indicating readiness, willingness, or anticipation",
        examples: ["I'm ready to...", "I'm prepared to...", "I'm willing to..."]
      },
      {
        name: "Taking Steps",
        description: "Statements about actions already taken",
        examples: ["I've started...", "This week I began to...", "I'm already doing..."]
      }
    ]
  },
  sustainTalk: {
    description: "Statements that favor maintaining the current behavior rather than changing",
    examples: [
      "I don't see why I need to change.",
      "I've tried before and it didn't work.",
      "I enjoy it too much to give it up.",
      "I don't think I can do it."
    ]
  }
};

// Strategies for evoking change talk
export const evokingStrategies = {
  description: "Techniques for drawing out the person's own motivations for change",
  strategies: [
    {
      name: "Ask Evocative Questions",
      description: "Open questions that elicit change talk as the answer",
      examples: [
        "What would you like to be different about your current situation?",
        "What makes you think you need to make a change?",
        "How would you like your life to be in five years?",
        "What do you think would work for you if you decided to change?"
      ]
    },
    {
      name: "Explore Decisional Balance",
      description: "Explore pros and cons of both changing and not changing",
      process: "Ask first about the good aspects of the status quo, then about the not-so-good aspects. Then explore the potential benefits of change and the potential costs of change."
    },
    {
      name: "Ask for Elaboration",
      description: "When change talk emerges, ask for more details",
      examples: [
        "In what ways?",
        "Tell me more about that.",
        "What does that look like?",
        "How does that affect you?"
      ]
    },
    {
      name: "Ask for Examples",
      description: "Request specific instances that illustrate the general statement",
      examples: [
        "When was the last time that happened?",
        "Give me an example of how this has affected you.",
        "What else has happened as a result?"
      ]
    },
    {
      name: "Look Back",
      description: "Ask about a time before the current concern emerged",
      examples: [
        "What were things like before this problem?",
        "How were things different before?",
        "What were you like before this started?"
      ]
    },
    {
      name: "Look Forward",
      description: "Ask about how the future might be after making a change",
      examples: [
        "If you decided to make this change, what might be different?",
        "If you succeed in making this change, how would things be better?",
        "What are your hopes for the future?"
      ]
    },
    {
      name: "Query Extremes",
      description: "Ask about the best and worst consequences of changing or not changing",
      examples: [
        "What are the worst things that might happen if you don't make this change?",
        "What are the best things that might happen if you do make this change?",
        "What concerns you the most about making this change?"
      ]
    },
    {
      name: "Use Change Rulers",
      description: "Scaling questions to explore importance, confidence, or readiness",
      example: "On a scale from 0 to 10, where 0 is not at all important and 10 is extremely important, how important is it to you to make this change right now?",
      followUp: [
        "Why are you at [their number] and not at 0?",
        "What would it take for you to go from [their number] to [a higher number]?"
      ]
    },
    {
      name: "Explore Goals and Values",
      description: "Discuss what matters most to the person and how current behavior fits",
      examples: [
        "What do you want in life?",
        "What sort of person do you want to be?",
        "How does your current situation fit with your values?"
      ]
    },
    {
      name: "Come Alongside",
      description: "Temporarily side with the status quo to reduce defensiveness",
      example: "Perhaps this [behavior] is so important to you that you won't give it up, no matter what the cost."
    }
  ]
};

// MI application for peer support specialists
export const miForPeerSupport = {
  description: "How Motivational Interviewing can be integrated into peer support work",
  adaptations: [
    {
      name: "Honoring the Person as Their Own Expert",
      description: "Recognize that the person is the ultimate authority on their own life and experiences",
      practices: [
        "Avoid positioning yourself as having the answers",
        "Validate the person's expertise about their own situation",
        "Use your knowledge as a supplement to their wisdom, not a replacement",
        "Offer information with permission and in a way that preserves their autonomy"
      ]
    },
    {
      name: "Supporting Without Directing",
      description: "Help the person explore their options without steering them toward your preferred outcome",
      practices: [
        "Provide a safe space for exploration of ambivalence",
        "Respect the person's right to make decisions you might not agree with",
        "Focus on understanding rather than convincing",
        "Recognize that even small steps toward positive change are valuable"
      ]
    },
    {
      name: "Addressing Crisis Situations",
      description: "Balancing MI principles with appropriate crisis response",
      practices: [
        "Recognize when immediate safety concerns require a more directive approach",
        "Even in crisis, maintain respect for the person's dignity and autonomy where possible",
        "Return to a more collaborative approach as soon as acute crisis has passed",
        "Help connect to appropriate professional resources while maintaining rapport"
      ]
    },
    {
      name: "Cultural Responsiveness",
      description: "Adapting MI to respect cultural diversity and values",
      practices: [
        "Recognize that concepts like 'autonomy' and 'change' may have different meanings across cultures",
        "Be aware of how your own cultural background influences your perspectives",
        "Explore how cultural values and community expectations influence the person's choices",
        "Adapt communication style to honor cultural norms while maintaining MI spirit"
      ]
    },
    {
      name: "Time-Limited Support",
      description: "Making the most of brief support opportunities",
      practices: [
        "Focus on establishing rapport quickly without rushing the person",
        "Help identify one or two priority areas rather than trying to address everything",
        "Use summarizing to highlight key points and change talk",
        "Ensure connection to ongoing resources when your time with the person ends"
      ]
    }
  ],
  
  integrationWithRogerianPrinciples: {
    description: "How MI builds on and complements person-centered therapy",
    connections: [
      {
        rogerian: "Empathic Understanding",
        mi: "OARS skills, especially reflective listening",
        integration: "Both approaches emphasize deep understanding of the person's internal frame of reference, though MI adds more structure to the reflection process."
      },
      {
        rogerian: "Unconditional Positive Regard",
        mi: "MI Spirit of acceptance and compassion",
        integration: "Both approaches affirm the inherent worth of the person, though MI explicitly extends this to respecting autonomy about change decisions."
      },
      {
        rogerian: "Genuineness",
        mi: "Partnership element of MI Spirit",
        integration: "Both value authentic relationship, though MI focuses this authenticity more specifically on collaboration around change."
      },
      {
        rogerian: "Nondirectiveness",
        mi: "Evocation and resisting the righting reflex",
        integration: "MI modifies nondirectiveness by strategically guiding toward change talk while still honoring autonomy."
      }
    ]
  }
};

// Function to generate MI-inspired responses based on change readiness
export const generateMIResponse = (userMessage: string): string | null => {
  const lowerMessage = userMessage.toLowerCase();
  
  // Detect potential change talk or ambivalence
  const containsChangeTalk = detectChangeTalk(lowerMessage);
  const containsAmbivalence = detectAmbivalence(lowerMessage);
  const containsReasons = detectReasons(lowerMessage);
  
  // Generate appropriate MI-style responses based on what's detected
  if (containsChangeTalk) {
    return respondToChangeTalk(lowerMessage);
  } else if (containsAmbivalence) {
    return respondToAmbivalence(lowerMessage);
  } else if (containsReasons) {
    return respondToReasons(lowerMessage);
  }
  
  return null; // Return null if no MI-specific response is appropriate
};

// Helper functions for MI response generation
function detectChangeTalk(message: string): boolean {
  const changeKeywords = [
    'want to', 'like to', 'need to', 'have to', 'should', 'could', 'can', 'will', 
    'going to', 'plan to', 'trying to', 'thinking about', 'considering', 'change', 
    'different', 'better', 'improve', 'start', 'stop', 'reduce', 'increase',
    'goal', 'hope', 'wish', 'dream'
  ];
  
  return changeKeywords.some(keyword => message.includes(keyword));
}

function detectAmbivalence(message: string): boolean {
  const ambivalencePatterns = [
    'want to but', 'should but', 'need to but', 'part of me', 'on the other hand',
    'not sure if', 'might', 'maybe', 'conflicted', 'torn', 'mixed feelings',
    'sometimes I', 'confused about', 'don\'t know if', 'in two minds',
    'yes and no', 'back and forth'
  ];
  
  return ambivalencePatterns.some(pattern => message.includes(pattern));
}

function detectReasons(message: string): boolean {
  const reasonPatterns = [
    'because', 'since', 'so that', 'in order to', 'the reason', 
    'that\'s why', 'would help', 'would make', 'would be better',
    'would improve', 'for my', 'for the', 'benefit'
  ];
  
  return reasonPatterns.some(pattern => message.includes(pattern));
}

function respondToChangeTalk(message: string): string {
  // Responses that reinforce change talk
  const changeTalkResponses = [
    "It sounds like making a change is important to you. What makes this matter to you right now?",
    "I'm hearing that you have some ideas about what you want to be different. Can you tell me more about what you're hoping for?",
    "It seems like you're considering some changes. What do you think would be different if you decided to move forward with this?",
    "You've mentioned some reasons why change might be beneficial. What else would improve in your life if you made this change?",
    "It sounds like you have some thoughts about making changes. What steps have you considered taking?",
    "I'm noticing your determination coming through. What gives you confidence that you could succeed with this change if you decided to move forward?"
  ];
  
  return changeTalkResponses[Math.floor(Math.random() * changeTalkResponses.length)];
}

function respondToAmbivalence(message: string): string {
  // Responses that explore ambivalence
  const ambivalenceResponses = [
    "I can hear that you have mixed feelings about this. On one hand... but on the other hand... Is that accurate?",
    "It sounds like part of you wants to make a change, while another part has some hesitations. What are the different sides telling you?",
    "You seem to be weighing both the benefits and the challenges of making a change. What feels most important to you as you consider this decision?",
    "I'm hearing some uncertainty in your thoughts about this. What would help you gain more clarity about what you want to do?",
    "It's completely normal to have these mixed feelings when considering a change. What are the main things pulling you in different directions?",
    "You're noticing both reasons to change and reasons to stay the same. If we put those on a scale, which way does it tip for you right now?"
  ];
  
  return ambivalenceResponses[Math.floor(Math.random() * ambivalenceResponses.length)];
}

function respondToReasons(message: string): string {
  // Responses that explore and reinforce the person's reasons
  const reasonResponses = [
    "Those sound like meaningful reasons to consider making a change. How important are these reasons to you personally?",
    "You've identified some compelling reasons for change. How might your life be different if you moved in that direction?",
    "Thank you for sharing those reasons with me. What else matters to you about making this change?",
    "Those are important considerations. How do these reasons connect to what you value most in life?",
    "I appreciate you explaining your thinking behind this. Of all the reasons you mentioned, which one feels most significant to you?",
    "Those are thoughtful reasons. How long have these matters been important to you?"
  ];
  
  return reasonResponses[Math.floor(Math.random() * reasonResponses.length)];
}

