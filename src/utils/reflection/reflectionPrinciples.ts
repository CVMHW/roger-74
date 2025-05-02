/**
 * Core reflection principles as described by Rogers
 */

import { ReflectionPrinciple } from './reflectionTypes';

export const reflectionPrinciples = [
  {
    name: "Empathic Understanding",
    description: "Genuinely trying to understand the client's experiences and feelings from their perspective.",
    examples: [
      "It sounds like you're feeling overwhelmed by the responsibilities at work.",
      "I hear that you're excited about this new opportunity, but also nervous about the changes it might bring.",
      "From what you're saying, it seems like this relationship has been a source of both joy and frustration for you."
    ],
    // Remove purpose property as it's not in the interface
  },
  {
    name: "Empathic Reflection",
    description: "A way of showing the client that the counselor understands what the client is communicating by restating the emotional part of the message",
    examples: ["It sounds like you're feeling frustrated with this situation", "I hear that you're worried about what might happen next"],
    approach: "Each response contains the unspoken question: 'Is this the way it is in you? Am I catching the personal meaning you are experiencing right now?'",
    goal: "To perceive the client's inner world as accurately as possible, bringing the helper's perception in line with the client's experience"
  }
];
