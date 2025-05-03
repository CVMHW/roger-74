/**
 * Logotherapy Response Generators
 * 
 * Specialized response generators based on Viktor Frankl's logotherapy
 * UNIVERSAL LAW: Roger must incorporate meaning, purpose, and values
 * Enhanced with cultural and age-appropriate variations
 */

import { getCulturalContext, getAgeAppropriateContext } from './contextDetection';

/**
 * Generate a response focused on finding meaning through creativity and contribution
 * (Creative values - the first pathway to meaning in logotherapy)
 * Now with cultural and age-appropriate variations
 */
export const generateCreativeValuesResponse = (userInput: string): string => {
  // Detect cultural and age contexts
  const culturalContext = getCulturalContext(userInput);
  const ageContext = getAgeAppropriateContext(userInput);
  
  // Base creative values responses
  const baseResponses = [
    "Finding meaning often involves discovering how we can uniquely contribute to the world. What activities make you lose track of time because they feel so purposeful?",
    "Viktor Frankl observed that one pathway to meaning is through what we create or give to the world. In what ways do you feel you make a meaningful contribution?",
    "When we engage in work that feels meaningful, it connects us to something larger than ourselves. What kind of work or activities give you that sense of purpose?",
    "Creating something of value - whether through our work, relationships, or personal projects - can be a powerful source of meaning. What have you created that has felt meaningful to you?",
    "Sometimes our unique purpose reveals itself through the ways we naturally want to contribute. What problems in the world do you feel drawn to help solve?",
    "Meaning often emerges when we use our unique talents in service of something we value. What talents or strengths do you feel called to express?"
  ];
  
  // Cultural variations
  const culturalVariations: Record<string, string[]> = {
    collectivist: [
      "In many traditions, finding meaning through how we contribute to family and community is essential. How do your contributions to others reflect what you value?",
      "Many cultures emphasize that our purpose is revealed through how we serve our community. What ways of contributing to your community feel most meaningful to you?",
      "The unique gifts we bring to our families and communities often reveal our purpose. How do you feel you make a difference for those around you?"
    ],
    individualist: [
      "Finding your unique way to contribute to the world often reveals your personal purpose. What kind of impact do you want to have?",
      "Your individual gifts and talents are meant to be expressed. What creative work or contribution feels most authentic to you?",
      "Your unique perspective and abilities can create meaningful change. In what areas do you feel called to make your mark?"
    ],
    spiritual: [
      "Many spiritual traditions suggest our gifts are meant to serve a higher purpose. How do you feel called to use your talents?",
      "Finding meaning often involves aligning our work with our deepest values and beliefs. How does your spiritual perspective influence what you create or contribute?",
      "Many find that using their gifts in service to others connects them to something greater than themselves. How might your contributions reflect your spiritual values?"
    ]
  };
  
  // Age-appropriate variations
  const ageVariations: Record<string, string[]> = {
    youth: [
      "Even at a young age, you can discover activities that feel especially meaningful. What things do you do that make you feel proud or excited?",
      "Finding what you're naturally good at and enjoy can be clues to how you might make a difference. What activities do you find most engaging?",
      "Your unique interests and talents are already developing. What kinds of activities make you feel like you're doing something important?"
    ],
    teen: [
      "As you're discovering who you are, you might notice certain activities feel more meaningful than others. What kinds of things do you do that feel worthwhile?",
      "Finding your unique way to contribute starts with exploring what matters to you. What causes or activities are you drawn to?",
      "Your generation has unique perspectives to offer. What issues or areas do you feel passionate about changing or improving?"
    ],
    adult: [
      "Our work and creative pursuits often reveal what gives our lives meaning. What aspects of your work or creative activities feel most purposeful?",
      "Making a contribution that aligns with your values can transform ordinary work into meaningful purpose. How do your current activities reflect what matters to you?",
      "Finding meaning through our work and creative contributions is a lifelong journey. What changes might help align your daily activities with your deeper values?"
    ],
    elder: [
      "At this stage of life, sharing wisdom and leaving a legacy becomes particularly meaningful. What knowledge or values do you hope to pass on?",
      "Many find that mentoring others or contributing in new ways brings fresh purpose. What ways of contributing feel meaningful to you now?",
      "The perspective gained through life experience offers unique value to others. How might you share the wisdom you've gained in ways that feel purposeful?"
    ]
  };
  
  // Select the most appropriate response based on detected contexts
  let responses = [...baseResponses];
  
  // Add cultural variations if detected
  if (culturalContext && culturalVariations[culturalContext]) {
    responses = [...responses, ...culturalVariations[culturalContext]];
  }
  
  // Add age-appropriate variations if detected
  if (ageContext && ageVariations[ageContext]) {
    responses = [...responses, ...ageVariations[ageContext]];
  }
  
  // Return a random response from the appropriate pool
  return responses[Math.floor(Math.random() * responses.length)];
};

/**
 * Generate a response focused on finding meaning through experiences and love
 * (Experiential values - the second pathway to meaning in logotherapy)
 */
export const generateExperientialValuesResponse = (userInput: string): string => {
  const experientialValuesResponses = [
    "Another pathway to meaning is through what we experience and receive from the world - like love, beauty, or truth. What experiences have felt particularly meaningful to you?",
    "Deep connections with others can be profound sources of meaning. Which relationships in your life feel most meaningful, and what makes them so?",
    "Sometimes meaning reveals itself in moments of beauty or awe. Have you had experiences that gave you a sense of being connected to something larger than yourself?",
    "Frankl observed that experiencing something fully - or loving someone deeply - can provide a powerful sense of meaning. What experiences in your life have felt most meaningful?",
    "The capacity to appreciate beauty, connection, or truth can reveal what we value most. What experiences move you or touch you deeply?",
    "Being fully present to experience life's moments - both joyful and difficult - can be a source of meaning. What helps you be more present in your experiences?"
  ];
  
  return experientialValuesResponses[Math.floor(Math.random() * experientialValuesResponses.length)];
};

/**
 * Generate a response focused on finding meaning through attitude toward suffering
 * (Attitudinal values - the third pathway to meaning in logotherapy)
 */
export const generateAttitudinalValuesResponse = (userInput: string): string => {
  const attitudinalValuesResponses = [
    "Viktor Frankl found that even in unavoidable suffering, we retain the freedom to choose our attitude. How have difficult experiences in your life shaped who you are today?",
    "Sometimes our greatest meaning comes from how we face unavoidable challenges. What has helped you find strength during difficult times?",
    "The third pathway to meaning involves the stance we take toward suffering we cannot avoid. How have you been able to make sense of difficult experiences?",
    "Even in circumstances we can't control, we retain the freedom to choose our response to them. What has helped you face challenges with dignity?",
    "Meaning can emerge from how we choose to face unavoidable suffering. Have there been times when a difficult experience eventually led to growth or new perspective?",
    "Our attitude toward circumstances we cannot change reveals our deepest values. What values have helped you navigate difficult situations?"
  ];
  
  return attitudinalValuesResponses[Math.floor(Math.random() * attitudinalValuesResponses.length)];
};

/**
 * Generate a response addressing the existential vacuum (feelings of emptiness or meaninglessness)
 */
export const generateExistentialVacuumResponse = (userInput: string): string => {
  const existentialVacuumResponses = [
    "That feeling of emptiness or lack of purpose is what Frankl called the 'existential vacuum.' It often signals we're ready to discover more authentic meaning in our lives. What activities make you lose track of time?",
    "Feelings of emptiness often point us toward our need for meaning. What activities or experiences have felt genuinely meaningful to you, even if just briefly?",
    "The existential vacuum - that sense that something is missing - can actually be the beginning of a meaningful search. What matters most to you, beyond achievement or pleasure?",
    "Frankl believed that when we feel empty or without purpose, it's not a pathology but a call to discover authentic meaning. What values would you want to express more in your life?",
    "That sense of meaninglessness is actually a human response to the absence of something vital - purpose. What gives you even a glimpse of meaning or purpose?",
    "The feeling that something is missing can be the first step toward discovering what truly matters to you. When have you felt most alive or purposeful?"
  ];
  
  return existentialVacuumResponses[Math.floor(Math.random() * existentialVacuumResponses.length)];
};

/**
 * Generate a response using the paradoxical intention technique from logotherapy
 * (Used for anxiety, phobias, insomnia, etc.)
 */
export const generateParadoxicalIntentionResponse = (userInput: string): string => {
  const paradoxicalIntentionResponses = [
    "There's an interesting technique called 'paradoxical intention' where instead of fighting against your anxiety, you might humorously wish for the very thing you fear. This breaks the cycle of anticipatory anxiety. What might that look like in your situation?",
    "Sometimes when we try too hard to avoid something, it creates more tension. What if, just as an experiment, you were to exaggerate or even wish for the very anxiety you're experiencing? This approach often helps reduce the power of anticipatory fear.",
    "Frankl developed an approach where people facing anxiety are encouraged to humorously exaggerate the very thing they fear. This creates distance and often diminishes the anxiety. How might you apply this perspective to what you're experiencing?",
    "There's a therapeutic approach that suggests that deliberately trying to do or experience the very thing you fear, with a sense of humor, can break anxiety's grip. It's like the fear can't survive being approached with playfulness rather than dread.",
    "What would happen if, instead of trying to stop this anxiety, you deliberately tried to make it worse in a humorous way? This paradoxical approach often helps people break free from the cycle of fear about fear.",
    "When we face our fears with a bit of humor and exaggeration, they often lose their power over us. What would it be like to playfully lean into this fear rather than struggling against it?"
  ];
  
  return paradoxicalIntentionResponses[Math.floor(Math.random() * paradoxicalIntentionResponses.length)];
};

/**
 * Generate a response using Socratic dialogue approach
 * (Based on logotherapy's approach to helping people discover meaning)
 */
export const generateSocraticLogotherapyResponse = (userInput: string): string => {
  const socraticResponses = [
    "What would you say gives your life meaning right now, even in small ways?",
    "If you were to imagine your life as meaningful and purposeful, what would be different from how things are now?",
    "What activities make you lose track of time because you find them so engaging and worthwhile?",
    "When have you felt most alive or like you were living with purpose?",
    "What legacy would you like to leave, or what difference would you like to make in the world?",
    "What values would you want to guide your choices, regardless of your circumstances?",
    "When you think about what gives life meaning, what comes to mind for you personally?",
    "What strengths or gifts do you have that you feel called to express or contribute?",
    "If meaning comes from what we give to the world, what we experience, or how we face suffering - which of these pathways feels most relevant to you right now?",
    "What helps you transcend your immediate concerns and connect to something larger than yourself?"
  ];
  
  return socraticResponses[Math.floor(Math.random() * socraticResponses.length)];
};

/**
 * Detect which logotherapy approach might be most relevant based on user input
 */
export const detectLogotherapyApproach = (userInput: string): string => {
  const lowerInput = userInput.toLowerCase();
  
  // Check for existential vacuum indicators
  if (lowerInput.includes('empty') || 
      lowerInput.includes('pointless') || 
      lowerInput.includes('no purpose') || 
      lowerInput.includes('meaningless') ||
      lowerInput.includes('what\'s the point')) {
    return 'existentialVacuum';
  }
  
  // Check for anxiety/fear indicators for paradoxical intention
  if (lowerInput.includes('anxious') || 
      lowerInput.includes('anxiety') || 
      lowerInput.includes('afraid') || 
      lowerInput.includes('fear') ||
      lowerInput.includes('panic') ||
      lowerInput.includes('insomnia')) {
    return 'paradoxicalIntention';
  }
  
  // Check for creative values (work, contribution)
  if (lowerInput.includes('work') || 
      lowerInput.includes('create') || 
      lowerInput.includes('make') || 
      lowerInput.includes('build') ||
      lowerInput.includes('contribute') ||
      lowerInput.includes('accomplish')) {
    return 'creativeValues';
  }
  
  // Check for experiential values (relationships, experiences)
  if (lowerInput.includes('love') || 
      lowerInput.includes('relationship') || 
      lowerInput.includes('experience') || 
      lowerInput.includes('feel') ||
      lowerInput.includes('connection') ||
      lowerInput.includes('beauty')) {
    return 'experientialValues';
  }
  
  // Check for attitudinal values (facing suffering)
  if (lowerInput.includes('suffer') || 
      lowerInput.includes('pain') || 
      lowerInput.includes('difficult') || 
      lowerInput.includes('challenge') ||
      lowerInput.includes('struggle') ||
      lowerInput.includes('attitude')) {
    return 'attitudinalValues';
  }
  
  // Add cultural and age-specific indicators
  const culturalContext = getCulturalContext(userInput);
  const ageContext = getAgeAppropriateContext(userInput);
  
  // Adjust approach based on cultural and age contexts if strongly indicated
  if (culturalContext === 'collectivist' && 
      (lowerInput.includes('family') || lowerInput.includes('community') || lowerInput.includes('tradition'))) {
    return 'creativeValues'; // Often emphasizes contribution to community
  }
  
  if (culturalContext === 'spiritual' && 
      (lowerInput.includes('faith') || lowerInput.includes('belief') || lowerInput.includes('god'))) {
    return 'experientialValues'; // Often emphasizes transcendent experiences
  }
  
  if (ageContext === 'youth' || ageContext === 'teen') {
    return 'socraticDialogue'; // Often better for younger individuals
  }
  
  if (ageContext === 'elder' && 
      (lowerInput.includes('legacy') || lowerInput.includes('wisdom') || lowerInput.includes('life story'))) {
    return 'attitudinalValues'; // Often relevant for life review
  }
  
  // Default to Socratic approach for exploration
  return 'socraticDialogue';
};

/**
 * Generate appropriate logotherapy response based on user input
 */
export const generateLogotherapyResponse = (userInput: string): string => {
  const approach = detectLogotherapyApproach(userInput);
  
  switch (approach) {
    case 'existentialVacuum':
      return generateExistentialVacuumResponse(userInput);
    case 'paradoxicalIntention':
      return generateParadoxicalIntentionResponse(userInput);
    case 'creativeValues':
      return generateCreativeValuesResponse(userInput);
    case 'experientialValues':
      return generateExperientialValuesResponse(userInput);
    case 'attitudinalValues':
      return generateAttitudinalValuesResponse(userInput);
    case 'socraticDialogue':
    default:
      return generateSocraticLogotherapyResponse(userInput);
  }
};
