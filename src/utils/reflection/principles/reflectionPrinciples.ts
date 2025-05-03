
/**
 * Core reflection principles as described by Rogers
 */

import { ReflectionPrinciple } from '../core/types';

export const reflectionPrinciples: ReflectionPrinciple[] = [
  {
    name: "Empathic Understanding",
    description: "Genuinely trying to understand the client's experiences and feelings from their perspective.",
    examples: [
      "It sounds like you're feeling overwhelmed by the responsibilities at work.",
      "I hear that you're excited about this new opportunity, but also nervous about the changes it might bring.",
      "From what you're saying, it seems like this relationship has been a source of both joy and frustration for you."
    ],
    implementation: [
      "Listen carefully to the client's words and emotional tone",
      "Reflect back both content and feelings",
      "Use tentative language to check understanding",
      "Stay within the client's frame of reference"
    ]
  },
  {
    name: "Empathic Reflection",
    description: "A way of showing the client that the counselor understands what the client is communicating by restating the emotional part of the message",
    examples: [
      "It sounds like you're feeling frustrated with this situation", 
      "I hear that you're worried about what might happen next"
    ],
    implementation: [
      "Identify the core emotion being expressed",
      "Use phrases like 'It sounds like...' or 'I hear that...'",
      "Keep the reflection brief and focused",
      "Pause after reflecting to allow client response"
    ]
  }
];
