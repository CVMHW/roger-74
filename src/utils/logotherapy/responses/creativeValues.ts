
/**
 * Creative values responses for logotherapy
 */
import { getCulturalContext, getAgeAppropriateContext } from './utils/contextDetection';

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
