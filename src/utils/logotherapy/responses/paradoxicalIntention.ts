
/**
 * Paradoxical intention responses for logotherapy
 */

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
