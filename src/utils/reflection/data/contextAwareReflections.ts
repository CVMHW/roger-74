
import { ContextAwareReflection } from '../core/types';

// Define context-aware reflections
export const contextAwareReflections: ContextAwareReflection[] = [
  {
    context: "work stress",
    reflection: "It sounds like your work environment has been creating significant stress for you.",
    examples: [
      "The pressure at work seems to be taking a toll on your wellbeing.",
      "Managing these work responsibilities has been overwhelming lately.",
      "The demands at your job appear to be affecting your sense of balance."
    ],
    trigger: ["work", "job", "boss", "coworker", "colleague", "workplace", "office", "stress", "overworked"],
    response: [
      "It sounds like your work environment has been creating significant stress for you.",
      "The pressure at work seems to be taking a toll on your wellbeing.",
      "Managing these work responsibilities seems overwhelming right now."
    ]
  },
  {
    context: "relationship conflict",
    reflection: "I hear that this relationship conflict has been difficult to navigate.",
    examples: [
      "These tensions in your relationship seem to be creating a lot of emotional strain.",
      "It sounds like you're feeling caught between different needs in this relationship.",
      "Navigating this conflict appears to be taking significant emotional energy."
    ],
    trigger: ["relationship", "partner", "spouse", "boyfriend", "girlfriend", "conflict", "fight", "argument", "tension"],
    response: [
      "I hear that this relationship conflict has been difficult to navigate.",
      "These tensions in your relationship seem to be creating emotional strain.",
      "It sounds like you're feeling caught between different needs in this relationship."
    ]
  },
  {
    context: "general anxiety",
    reflection: "The anxiety you're describing seems to be affecting multiple areas of your life.",
    examples: [
      "This persistent worry appears to be making it difficult to find moments of peace.",
      "The anxiety you're experiencing seems to create a constant state of alertness.",
      "These anxious feelings appear to be making everyday tasks more challenging."
    ],
    trigger: ["anxious", "anxiety", "worried", "nervous", "stress", "tense", "on edge", "panic", "fear"],
    response: [
      "The anxiety you're describing seems to be affecting multiple areas of your life.",
      "This persistent worry appears to be making it difficult to find moments of peace.",
      "These anxious feelings seem to be making everyday tasks more challenging."
    ]
  }
];
