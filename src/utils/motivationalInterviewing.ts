
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
  },
  
  misconceptions: {
    description: "Common misconceptions about MI and their clarifications",
    items: [
      {
        misconception: "MI is a form of nondirective, Rogerian therapy.",
        clarification: "MI shares many principles of the humanistic, person-centered approach pioneered by Rogers, but it is not Rogerian therapy. Characteristics that differentiate MI include clearly identified target behaviors and change goals and differential evoking and strengthening of clients' motivation for changing target behavior. Unlike Rogerian therapy, MI has a strategic component that emphasizes helping clients move toward a specific behavioral change goal."
      },
      {
        misconception: "MI is a counseling technique.",
        clarification: "Although there are specific MI counseling strategies, MI is not a counseling technique. It is a style of being with people that uses specific clinical skills to foster motivation to change."
      },
      {
        misconception: "MI is a 'school' of counseling or psychotherapy.",
        clarification: "Some psychological theories underlie the spirit and style of MI, but it was not meant to be a theory of change with a comprehensive set of associated clinical skills."
      },
      {
        misconception: "MI and the SOC approach are the same.",
        clarification: "MI and the Stages of Change (SOC) were developed around the same time, and people confuse the two approaches. MI is not the SOC. MI is not an essential part of the SOC and vice versa. They are compatible and complementary. MI is also compatible with counseling approaches like cognitive-behavioral therapy (CBT)."
      },
      {
        misconception: "MI always uses assessment feedback.",
        clarification: "Assessment feedback delivered in the MI style was an adaptation of MI that became motivational enhancement therapy (MET). Although personalized feedback may be helpful to enhance motivation with clients who are on the lower end of the readiness to change spectrum, it is not a necessary part of MI."
      },
      {
        misconception: "Counselors can motivate clients to change.",
        clarification: "You cannot manufacture motivation that is not already in clients. MI does not motive clients to change or to move toward a predetermined treatment goal. It is a collaborative partnership between you and clients to discover their motivation to change. It respects client autonomy and self-determination about goals for behavior change."
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
        "How do you feel about making this change?",
        "How can I help you with ___?",
        "Help me understand ___?",
        "What are the good things about ___ and what are the less good things about it?",
        "When would you be most likely to___?",
        "What do you think you will lose if you give up ___?",
        "What have you tried before to make a change?",
        "What do you want to do next?"
      ],
      contrastWithClosed: [
        {
          closed: "Did you have a good relationship with your parents?",
          open: "What can you tell me about your relationship with your parents?"
        },
        {
          closed: "Do you want to change this behavior?",
          open: "What thoughts do you have about this behavior?"
        }
      ]
    },
    {
      name: "Affirmations",
      description: "Statements that recognize the person's strengths, efforts, and worth.",
      examples: [
        "You've shown a lot of persistence in facing these challenges.",
        "That took a lot of courage to share.",
        "You're clearly someone who cares deeply about your family.",
        "You've put a lot of thought into this decision.",
        "I appreciate that you are willing to meet with me today.",
        "You are clearly a very resourceful person.",
        "You handled yourself really well in that situation.",
        "That's a good suggestion.",
        "If I were in your shoes, I don't know if I could have managed nearly so well.",
        "I've enjoyed talking with you today."
      ],
      purpose: "Affirmations build confidence in one's ability to change. To be effective, affirmations must be genuine and congruent."
    },
    {
      name: "Reflective Listening",
      description: "Statements that convey understanding of what the person has said and often add meaning or emphasis.",
      importance: "Reflective listening is a primary skill in outreach. It is the pathway for engaging others in relationships, building trust, and fostering motivation to change. It takes hard work and skill to do well.",
      types: [
        {
          name: "Simple Reflection (Repeating or rephrasing)",
          description: "Listener repeats or substitutes synonyms or phrases, and stays close to what the speaker has said.",
          examples: [
            "So you're finding it hard to manage your time.",
            "You're worried about how this might affect your relationship."
          ]
        },
        {
          name: "Paraphrasing",
          description: "Listener makes a restatement in which the speaker's meaning is inferred.",
          examples: [
            "What I hear you saying is that this has been difficult but you're determined to get through it.",
            "It seems like you're torn between wanting to help and feeling overwhelmed."
          ]
        },
        {
          name: "Reflection of feeling",
          description: "Listener emphasizes emotional aspects of communication through feeling statements. This is the deepest form of listening.",
          examples: [
            "You're feeling hopeful about these changes.",
            "It sounds like you're frustrated that progress isn't happening faster."
          ]
        }
      ],
      starters: [
        "Sounds like...",
        "What I'm hearing is...",
        "So you're saying that...",
        "You're feeling like...",
        "From your point of view...",
        "It seems to you that...",
        "So you feel…",
        "It sounds like you…",
        "You're wondering if…"
      ],
      breakdowns: [
        "Speaker does not say what is meant",
        "Listener does not hear correctly",
        "Listener gives a different interpretation to what the words mean"
      ],
      techniques: [
        "Voice turns down at the end of a reflective listening statement",
        "Varying the levels of reflection is effective in listening",
        "Overstating a reflection may cause a person to back away from their position",
        "Understating a reflection may help a person explore a deeper commitment"
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
      ],
      structure: [
        "Begin with a statement indicating you are making a summary (e.g., 'Let me see if I understand so far…')",
        "Give special attention to Change Statements",
        "If the person expresses ambivalence, include both sides ('On the one hand...on the other hand...')",
        "Include objective information when relevant",
        "Be concise",
        "End with an invitation (e.g., 'Did I miss anything?')",
        "Based on response, may lead to planning concrete steps"
      ],
      starters: [
        "Let me see if I understand so far…",
        "Here is what I've heard. Tell me if I've missed anything.",
        "Let me try to summarize what we've discussed...",
        "So far you've shared..."
      ],
      endInvitations: [
        "Did I miss anything?",
        "If that's accurate, what other points are there to consider?",
        "Is there anything you want to add or correct?",
        "How does that sound to you?"
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
  },
  changeStatements: {
    description: "Four types of change statements identified by Miller and Rollnick",
    types: [
      {
        name: "Problem recognition",
        example: "My use has gotten a little out of hand at times."
      },
      {
        name: "Concern",
        example: "If I don't stop, something bad is going to happen."
      },
      {
        name: "Intent to change",
        example: "I'm going to do something, I'm just not sure what it is yet."
      },
      {
        name: "Optimism",
        example: "I know I can get a handle on this problem."
      }
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
  },
  
  patientAsOwnExpert: {
    description: "Core belief that the patient/client is the ultimate expert on their own life",
    principles: [
      "The person has unique insights into their own experiences that no practitioner can fully understand",
      "The person has the right to self-determination and making their own decisions",
      "The person brings their own wisdom, values, and perspective that should be honored",
      "The practitioner's role is to help the person access and apply their own expertise",
      "Enhancing the person's sense of autonomy increases their engagement and motivation"
    ],
    practices: [
      "Ask the person what has worked for them in the past",
      "Follow their lead when setting priorities and goals",
      "Explicitly acknowledge their unique expertise about their own situation",
      "View resistance as a sign that the practitioner may be imposing their own agenda",
      "Always check how suggestions or information fits with the person's understanding"
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
  const containsQuestionsAboutChange = detectQuestionsAboutChange(lowerMessage);
  const containsDoubtOrLackOfConfidence = detectDoubtOrLackOfConfidence(lowerMessage);
  
  // Generate appropriate MI-style responses based on what's detected
  if (containsQuestionsAboutChange) {
    return respondToQuestionsAboutChange(lowerMessage);
  } else if (containsChangeTalk) {
    return respondToChangeTalk(lowerMessage);
  } else if (containsAmbivalence) {
    return respondToAmbivalence(lowerMessage);
  } else if (containsReasons) {
    return respondToReasons(lowerMessage);
  } else if (containsDoubtOrLackOfConfidence) {
    return respondToDoubtOrLackOfConfidence(lowerMessage);
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

function detectQuestionsAboutChange(message: string): boolean {
  const questionPatterns = [
    'how can i', 'how do i', 'what should i', 'what could i', 'how would i',
    'how to', 'what if i', 'is it possible', 'do you think i should',
    'wondering if', 'not sure how', 'don\'t know how', 'help me'
  ];
  
  return questionPatterns.some(pattern => message.includes(pattern));
}

function detectDoubtOrLackOfConfidence(message: string): boolean {
  const doubtPatterns = [
    'don\'t think i can', 'not sure if i can', 'tried before', 'failed', 'difficult',
    'hard to', 'challenging', 'struggle', 'worried', 'fear', 'afraid', 'doubt',
    'not confident', 'impossible', 'too much', 'overwhelming'
  ];
  
  return doubtPatterns.some(pattern => message.includes(pattern));
}

function respondToChangeTalk(message: string): string {
  // Responses that reinforce change talk
  const changeTalkResponses = [
    "It sounds like making a change is important to you. What makes this matter to you right now?",
    "I'm hearing that you have some ideas about what you want to be different. Can you tell me more about what you're hoping for?",
    "It seems like you're considering some changes. What do you think would be different if you decided to move forward with this?",
    "You've mentioned some reasons why change might be beneficial. What else would improve in your life if you made this change?",
    "It sounds like you have some thoughts about making changes. What steps have you considered taking?",
    "I'm noticing your determination coming through. What gives you confidence that you could succeed with this change if you decided to move forward?",
    "You're starting to think about making a change. What might be some of the benefits if you decide to move in that direction?",
    "I appreciate you sharing your thoughts about making a change. What would success look like for you?"
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
    "You're noticing both reasons to change and reasons to stay the same. If we put those on a scale, which way does it tip for you right now?",
    "It makes sense that you'd have some mixed feelings about this. What's one thing that makes you think change might be beneficial?",
    "You've shared some thoughtful points both for and against making a change. What matters most to you when you think about your options?"
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
    "Those are thoughtful reasons. How long have these matters been important to you?",
    "You've given this careful thought. How do these reasons align with your broader goals?",
    "It sounds like you have several reasons for considering this change. How do these reasons affect your motivation to move forward?"
  ];
  
  return reasonResponses[Math.floor(Math.random() * reasonResponses.length)];
}

function respondToQuestionsAboutChange(message: string): string {
  // Responses that empower the person to explore their own answers
  const questionResponses = [
    "That's an important question. What ideas have you already considered?",
    "You're thinking about how to approach this situation. What has worked for you in similar situations in the past?",
    "I'm wondering what your thoughts are about that question. What options seem most promising to you?",
    "That's something many people wonder about. What would you see as a good first step?",
    "You're exploring how to move forward. What would be most important to you in finding an approach that works?",
    "It's great that you're thinking about these questions. What would success look like to you?",
    "You're considering how to approach this. What strengths do you have that might help you with this?",
    "That's a thoughtful question. What factors do you think would be most important to consider?"
  ];
  
  return questionResponses[Math.floor(Math.random() * questionResponses.length)];
}

function respondToDoubtOrLackOfConfidence(message: string): string {
  // Responses that explore and build confidence
  const confidenceResponses = [
    "It sounds like you have some concerns about whether you can make this change. What would help you feel more confident?",
    "Many people have doubts when they're considering a change. What's one small step that would feel manageable for you?",
    "You've mentioned some challenges you anticipate. What strengths or resources do you have that might help you overcome these?",
    "It's completely normal to have doubts. What's helped you succeed with difficult changes in the past?",
    "You're recognizing that this might be challenging. On a scale of 1 to 10, how confident do you feel that you could make this change if you decided to?",
    "When you've faced obstacles in the past, what strategies have helped you push through?",
    "It sounds like you're concerned about how difficult this might be. What would make this feel more doable for you?",
    "You're recognizing some barriers to change. Which of these feels most important to address first?"
  ];
  
  return confidenceResponses[Math.floor(Math.random() * confidenceResponses.length)];
}
