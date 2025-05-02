
/**
 * Functions to generate collaborative responses
 */

// Function to generate collaborative support responses
export const generateCollaborativeResponse = (userInput: string): string | null => {
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
