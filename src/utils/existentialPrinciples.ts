
/**
 * Existential principles and concepts based on Viktor Frankl's Logotherapy
 * and broader existential psychology frameworks
 */

// Core concepts of existential psychology and logotherapy
export const existentialPrinciples = {
  // Freedom, responsibility, and meaning
  coreIdeas: {
    description: "Existential psychology emphasizes that humans have freedom to choose their response to any situation, bear responsibility for their choices, and can find meaning even in suffering.",
    keyIdeas: [
      "Freedom of response - While circumstances may be beyond our control, we always retain freedom to choose our attitude toward them.",
      "Responsibility - With freedom comes responsibility for our choices and their consequences.",
      "Will to meaning - Humans have a primary motivational drive to find meaning in life.",
      "Meaning in suffering - Even in unavoidable suffering, meaning can be found through one's attitude toward suffering.",
      "Self-transcendence - Meaning comes from transcending self-focus toward values, causes, or others beyond oneself."
    ]
  },

  // Tri-dimensional ontology from logotherapy
  dimensions: {
    description: "Humans exist in three overlapping dimensions: physical, psychological, and spiritual/noological (meaning-oriented).",
    implications: [
      "The spiritual dimension is what distinguishes humans and enables meaning-seeking.",
      "When physical or psychological dimensions are compromised, the spiritual dimension can still function.",
      "Healing can occur through accessing the spiritual dimension even when other dimensions are suffering."
    ]
  },

  // Ways of finding meaning according to logotherapy
  pathsToMeaning: {
    description: "According to Frankl, meaning can be discovered through three main avenues:",
    paths: [
      {
        name: "Creative values",
        description: "Finding meaning through what we give to the world - work, creativity, achievements."
      },
      {
        name: "Experiential values", 
        description: "Finding meaning through what we receive from the world - experiencing goodness, beauty, truth, nature, culture, or love."
      },
      {
        name: "Attitudinal values",
        description: "Finding meaning through the stance we take toward unavoidable suffering - courage, dignity, and growth in the face of adversity."
      }
    ]
  },

  // Existential vacuum and noogenic neurosis
  meaninglessness: {
    description: "The absence of meaning can lead to existential vacuum or frustration.",
    manifestations: [
      "Boredom and apathy ('just going through the motions')",
      "Conformism (doing what others do without question)",
      "Totalitarianism (doing what others tell you to do)",
      "The 'mass neurotic triad': aggression, depression, and addiction as attempts to fill the emptiness"
    ],
    noogenicNeurosis: "Distress arising specifically from existential frustration or crisis of meaning."
  },

  // Practical applications in supportive conversations
  application: {
    description: "Existential principles can be applied in supportive dialogue through specific approaches:",
    approaches: [
      "Affirming freedom and responsibility - Helping people recognize choices they still have",
      "Perspective shifting - Helping reframe situations to reveal potential meaning",
      "Values clarification - Exploring what matters most to the person",
      "Meaning-centered questions - Questions that invite reflection on purpose and values",
      "Socratic dialogue - Questions that help people discover their own wisdom and insights",
      "Self-distancing - Helping gain perspective through humor or by stepping back from immediate concerns"
    ]
  },
  
  // Logotherapeutic techniques
  techniques: {
    description: "Specific techniques developed in logotherapy to help individuals discover meaning:",
    methods: [
      {
        name: "Paradoxical intention",
        description: "A technique where the client is encouraged to intend or wish for the very thing feared, often with humor, to break the cycle of anticipatory anxiety."
      },
      {
        name: "Dereflection",
        description: "Redirecting attention away from excessive self-focus or symptom monitoring toward meaningful external values and purposes."
      },
      {
        name: "Socratic dialogue",
        description: "Using questions to help clients discover their own meanings, values, and wisdom rather than providing direct advice."
      },
      {
        name: "Attitude modification",
        description: "Helping clients shift attitudes toward situations that cannot be changed, finding freedom in their response to circumstances."
      },
      {
        name: "Mountain Range Exercise",
        description: "A values clarification exercise where individuals identify important people in their lives and what values they share with them."
      },
      {
        name: "Movies Exercise",
        description: "Creating a mental 'movie' of one's life (past to present, and present to future) to clarify personal meaning and direction."
      }
    ]
  },
  
  // Relationship to positive psychology and other therapies
  relationships: {
    description: "Logotherapy connects with many other therapeutic approaches:",
    connections: [
      "Precursor to aspects of cognitive therapy, particularly in attitude modification",
      "Complementary to humanistic approaches through focus on human potential",
      "Aligned with positive psychology through emphasis on meaning, resilience, and growth",
      "Compatible with spirituality-focused approaches (in the broad sense of meaning and purpose)"
    ]
  }
};

// Signs that may indicate someone is experiencing existential concerns
export const existentialIndicators = {
  meaningQuestions: [
    "what's the point",
    "why bother",
    "no purpose",
    "meaningless",
    "doesn't matter",
    "what am i doing with my life",
    "what's it all for",
    "why am i here",
    "purpose in life",
    "reason for living",
    "empty",
    "just going through the motions",
    "nothing matters"
  ],
  
  valuesConcerns: [
    "values",
    "what matters",
    "important to me",
    "care about",
    "priorities",
    "what i stand for",
    "believe in",
    "lost sight of",
    "reconnect with",
    "don't know what I value anymore",
    "not sure what's important"
  ],
  
  freedomAnxiety: [
    "too many choices",
    "don't know what to do",
    "overwhelmed by options",
    "afraid of making the wrong choice",
    "what if i regret",
    "responsibility",
    "weight of decisions",
    "stuck with my choices",
    "no way out"
  ],
  
  isolationConcerns: [
    "alone in this",
    "no one understands",
    "fundamentally alone",
    "disconnected",
    "separated from others",
    "gap between",
    "no real connection",
    "isolated",
    "no one gets it"
  ],
  
  mortalityConcerns: [
    "limited time",
    "life is short",
    "getting older",
    "before i die",
    "legacy",
    "mark on the world",
    "remember me",
    "death",
    "finitude",
    "impermanence",
    "running out of time"
  ],
  
  sufferingQuestions: [
    "why is this happening",
    "can't see any purpose in",
    "senseless suffering",
    "enduring this",
    "meaning in pain",
    "learn from this",
    "grow through this",
    "unfair",
    "why me",
    "can't bear this"
  ],
  
  existentialVacuum: [
    "feel empty",
    "just existing",
    "going through motions",
    "bored with everything",
    "nothing excites me",
    "nothing to look forward to",
    "no direction",
    "drifting",
    "hollow"
  ]
};

// Generate existential responses to different types of concerns
export const generateExistentialResponse = (userInput: string): string | null => {
  const lowerInput = userInput.toLowerCase();
  
  // Check for meaning-related concerns
  const hasMeaningConcerns = existentialIndicators.meaningQuestions.some(phrase => 
    lowerInput.includes(phrase));
  
  if (hasMeaningConcerns) {
    const meaningResponses = [
      "I notice you're reflecting on questions of meaning and purpose. These are such important human questions. What kinds of things have felt meaningful to you in the past?",
      
      "Questions about meaning are at the heart of our human experience. Viktor Frankl suggested we can find meaning in three ways: through what we create or give, through what we experience and receive from the world, and through how we face unavoidable difficulties. Which of these resonates with you right now?",
      
      "It takes courage to face questions about meaning. In my understanding, meaning isn't something we simply find but something we actively create through our choices and values. What values feel most important to you, even in difficult times?",
      
      "Those questions about purpose are so deeply human. Many people find that meaning comes not from having all the answers, but from living according to what truly matters to them. What matters most to you, even when life feels challenging?",
      
      "The search for meaning can be both challenging and revealing. Sometimes when we feel a lack of meaning, it's pointing us toward what we truly value. What aspects of your life have felt meaningful, even if in small ways?"
    ];
    
    return meaningResponses[Math.floor(Math.random() * meaningResponses.length)];
  }
  
  // Check for existential vacuum indicators
  const hasExistentialVacuum = existentialIndicators.existentialVacuum.some(phrase => 
    lowerInput.includes(phrase));
    
  if (hasExistentialVacuum) {
    const vacuumResponses = [
      "That sense of emptiness you're describing is what Viktor Frankl called an 'existential vacuum' - a feeling that life lacks meaning or purpose. Sometimes this feeling actually invites us to discover what truly matters to us. What would a meaningful life look like for you?",
      
      "Feeling like you're just going through the motions can be really difficult. In logotherapy, this might be seen as an opportunity to reconnect with what gives your life meaning. What activities or relationships have helped you feel most alive or engaged in the past?",
      
      "That sense of emptiness is something many people experience at different points in life. Rather than seeing it as purely negative, it might be signaling an opportunity to explore what would bring more meaning to your life. What do you feel drawn toward, even if it seems distant right now?",
      
      "The feeling of 'just existing' rather than truly living is something many people face. Viktor Frankl might suggest this feeling can motivate us to discover or create meaning. What small thing might bring a sense of purpose to your day today?",
      
      "That hollowness you're describing is a deeply human experience. Sometimes it emerges when we're disconnected from our values or what matters to us. If you could live aligned with what's truly important to you, what might that look like?"
    ];
    
    return vacuumResponses[Math.floor(Math.random() * vacuumResponses.length)];
  }
  
  // Check for values-related concerns
  const hasValuesConcerns = existentialIndicators.valuesConcerns.some(phrase => 
    lowerInput.includes(phrase));
  
  if (hasValuesConcerns) {
    const valuesResponses = [
      "Values are like a compass that can guide us through difficult times. When you think about what truly matters to you, what comes to mind, even if it feels distant right now?",
      
      "Reconnecting with our values can be clarifying when life feels uncertain. If you were living fully aligned with what matters most to you, what might that look like, even in small ways?",
      
      "I appreciate you reflecting on what's important to you. Sometimes our challenges can actually help us clarify our values. Has this difficulty highlighted anything that you realize matters deeply to you?",
      
      "Our values can sometimes be revealed in what we find ourselves missing or longing for. What qualities or experiences do you find yourself drawn to, even if they're not fully present in your life right now?",
      
      "When we feel disconnected from what matters to us, that awareness itself can be the first step toward realignment. What small step might help you express or connect with something you value today?"
    ];
    
    return valuesResponses[Math.floor(Math.random() * valuesResponses.length)];
  }
  
  // Check for freedom/choice concerns
  const hasFreedomConcerns = existentialIndicators.freedomAnxiety.some(phrase => 
    lowerInput.includes(phrase));
  
  if (hasFreedomConcerns) {
    const freedomResponses = [
      "Having many choices can sometimes feel as challenging as having none. When you face important decisions, what has helped you find clarity in the past?",
      
      "The weight of responsibility that comes with freedom can feel heavy at times. What values might help guide your choices in this situation?",
      
      "It takes courage to make choices when the outcomes aren't certain. What would making a choice that you could stand behind look like, regardless of how things turn out?",
      
      "We can't control everything that happens, but we always retain the freedom to choose our attitude toward our circumstances. What perspective might make this situation more manageable for you?",
      
      "Sometimes when we feel overwhelmed by choices, it helps to connect with what matters most to us. Which option feels most aligned with who you want to be and what you value?"
    ];
    
    return freedomResponses[Math.floor(Math.random() * freedomResponses.length)];
  }
  
  // Check for isolation concerns
  const hasIsolationConcerns = existentialIndicators.isolationConcerns.some(phrase => 
    lowerInput.includes(phrase));
  
  if (hasIsolationConcerns) {
    const isolationResponses = [
      "That feeling of fundamental aloneness is something many people experience. While each of us has unique experiences that others can't fully understand, what helps you feel most connected to others despite these differences?",
      
      "The gap between ourselves and others can sometimes feel vast. Yet in sharing our authentic experiences, as you're doing now, we can create bridges of understanding. What would feeling genuinely understood look like for you?",
      
      "Many philosophers have reflected on how each person's experience is ultimately their own. Yet meaningful connection remains possible. What kinds of connections have felt most genuine to you in the past?",
      
      "That sense of separation is something many people grapple with. Sometimes, it's in acknowledging our separate experiences that we can paradoxically feel more connected through our shared humanity. What aspects of your experience do you think others might relate to?",
      
      "While we each journey through life in our own unique way, we can still walk alongside others. What qualities in relationships help you feel less alone in your experience?"
    ];
    
    return isolationResponses[Math.floor(Math.random() * isolationResponses.length)];
  }
  
  // Check for mortality concerns
  const hasMortalityConcerns = existentialIndicators.mortalityConcerns.some(phrase => 
    lowerInput.includes(phrase));
  
  if (hasMortalityConcerns) {
    const mortalityResponses = [
      "Awareness of life's finite nature can actually help clarify what matters most to us. How has thinking about the limited time we have influenced what you value?",
      
      "Many find that acknowledging life's temporal nature brings important questions into focus. What feels most worthy of your time and energy when you consider the preciousness of life?",
      
      "The recognition that our time is limited can be both challenging and clarifying. What would you like your days to reflect about what matters to you?",
      
      "Many meaningful lives have been shaped by the awareness that our time here is finite. How might this awareness guide your choices about what deserves your attention?",
      
      "Legacy can mean different things to different people - from relationships we nurture to work we create to values we embody. What aspects of your life feel most meaningful when you think about what endures?"
    ];
    
    return mortalityResponses[Math.floor(Math.random() * mortalityResponses.length)];
  }
  
  // Check for suffering-related concerns
  const hasSufferingConcerns = existentialIndicators.sufferingQuestions.some(phrase => 
    lowerInput.includes(phrase));
  
  if (hasSufferingConcerns) {
    const sufferingResponses = [
      "Viktor Frankl, who survived the concentration camps, suggested that meaning can be found even in unavoidable suffering - not in the suffering itself, but in how we face it. What strengths do you notice in yourself as you navigate this challenge?",
      
      "Some difficulties don't have clear meaning or purpose, and I wouldn't suggest that all suffering happens for a reason. But even in difficult circumstances, many people find they can still make meaningful choices about their response. What helps you maintain your sense of dignity through this?",
      
      "The question of why we suffer is one humans have grappled with throughout history. While I don't have answers about why specific hardships occur, I wonder what has helped sustain you through difficult times before?",
      
      "Even when circumstances are beyond our control, Viktor Frankl suggested we retain the freedom to choose our attitude toward those circumstances. What perspective helps you face this situation with the most strength?",
      
      "Finding meaning amid suffering doesn't make the suffering itself good or necessary, but it can help us bear it with more resilience. What values or sources of meaning help you navigate through challenging times?"
    ];
    
    return sufferingResponses[Math.floor(Math.random() * sufferingResponses.length)];
  }
  
  // No clear existential concerns detected
  return null;
};
