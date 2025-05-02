
/**
 * Mental Health Topic Mapping for Ohio References
 * 
 * Maps local Ohio references to relevant mental health topics for conversation.
 */

// Structure for reference to mental health mapping
interface MentalHealthTopic {
  type: string;
  description: string;
  engagingQuestions: string[];
}

// Map of references to mental health topics
const referenceToMentalHealthMap: Record<string, MentalHealthTopic> = {
  'weather': {
    type: 'environment',
    description: 'Cleveland weather and its impact on mood',
    engagingQuestions: [
      "How does Cleveland's changing weather affect how you feel?",
      "Have you noticed any connections between weather and your mood?",
      "Some people find the lake effect weather challenging. How about you?"
    ]
  },
  'browns': {
    type: 'hobby',
    description: 'Cleveland Browns and sports as stress relief',
    engagingQuestions: [
      "Do you find watching the Browns helps take your mind off stress?",
      "Sports can be a great emotional outlet. Is following the Browns that for you?",
      "Many fans ride the emotional rollercoaster with Cleveland sports. How does that affect you?"
    ]
  },
  'cavaliers': {
    type: 'hobby',
    description: 'Cleveland Cavaliers and sports as community connection',
    engagingQuestions: [
      "Do the Cavs games help you feel connected to the Cleveland community?",
      "Sports teams can bring people together. Has that been your experience?"
    ]
  },
  'guardians': {
    type: 'hobby',
    description: 'Cleveland Guardians and recreation for mental wellness',
    engagingQuestions: [
      "Baseball season can be a nice routine. Does following the Guardians provide structure?",
      "Do you find baseball games relaxing or exciting?"
    ]
  },
  'west side market': {
    type: 'community',
    description: 'West Side Market as a social and cultural hub',
    engagingQuestions: [
      "Places like the West Side Market can help us feel connected. Do you enjoy visiting there?",
      "Community spaces are important for wellbeing. Is that market one of your go-to places?"
    ]
  },
  'metroparks': {
    type: 'nature',
    description: 'Cleveland Metroparks system for nature therapy',
    engagingQuestions: [
      "The Metroparks are wonderful for reducing stress. Do you spend time there?",
      "Nature can be healing. Do you find the parks help with your mental wellbeing?"
    ]
  },
  'lake erie': {
    type: 'nature',
    description: 'Lake Erie and water as calming elements',
    engagingQuestions: [
      "Many find the lake calming to look at. Do you ever go there when stressed?",
      "Water can have a soothing effect. Does Lake Erie have that impact for you?"
    ]
  },
  'international food': {
    type: 'food',
    description: "Cleveland's diverse food scene including West Side Market international vendors and Asia Plaza",
    engagingQuestions: [
      "Have you found foods from your home country in Cleveland?",
      "Familiar foods can be comforting when adjusting to a new place. Have you found comfort foods here?"
    ]
  }
};

/**
 * Maps a detected Ohio reference to a relevant mental health topic
 */
export const mapReferenceToMentalHealthTopic = (reference: string): string => {
  const lowerRef = reference.toLowerCase();
  
  // Check for direct matches
  for (const [key, value] of Object.entries(referenceToMentalHealthMap)) {
    if (lowerRef.includes(key)) {
      // Get a random engaging question
      const randomQuestion = value.engagingQuestions[
        Math.floor(Math.random() * value.engagingQuestions.length)
      ];
      
      return ` ${randomQuestion}`;
    }
  }
  
  // Handle general types of references
  if (lowerRef.includes('park') || lowerRef.includes('garden')) {
    return " Nature spaces like this can be great for reducing stress. Do you find outdoor areas help your mental wellbeing?";
  }
  
  if (lowerRef.includes('museum') || lowerRef.includes('art')) {
    return " Cultural spaces can stimulate our minds in positive ways. Do you find places like this help your mood?";
  }
  
  if (lowerRef.includes('food') || lowerRef.includes('restaurant')) {
    return " Food experiences can be comforting. Do you have places here that remind you of happy memories?";
  }
  
  // Default connection
  return " These local connections can be important for feeling a sense of belonging. How has your experience been in Cleveland?";
};
