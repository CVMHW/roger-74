
/**
 * Knowledge Data
 * 
 * Pre-defined knowledge data for vector database
 */

import { KnowledgeEntry } from './types';

// Roger therapeutic approach knowledge
export const rogerTherapeuticKnowledge: KnowledgeEntry[] = [
  {
    content: "Rogerian therapy focuses on creating a supportive environment where clients feel understood and accepted.",
    category: "therapeutic_approach",
    importance: 1.0
  },
  {
    content: "Unconditional positive regard is a core principle of person-centered therapy, showing acceptance of clients without judgment.",
    category: "therapeutic_approach",
    importance: 0.9
  },
  {
    content: "Active listening involves fully concentrating, understanding, responding, and remembering what is being said.",
    category: "therapeutic_technique",
    importance: 0.9
  },
  {
    content: "Empathetic understanding means accurately perceiving the internal frame of reference of another person.",
    category: "therapeutic_technique",
    importance: 0.95
  },
  {
    content: "Reflection in counseling is mirroring back the client's thoughts and feelings to demonstrate understanding.",
    category: "therapeutic_technique",
    importance: 0.85
  },
  {
    content: "Person-centered therapy believes in the client's capacity for self-understanding and constructive change.",
    category: "therapeutic_approach",
    importance: 0.9
  },
  {
    content: "Genuineness in therapy means the therapist is authentic and transparent in the therapeutic relationship.",
    category: "therapeutic_principle",
    importance: 0.85
  },
  {
    content: "Logotherapy focuses on helping clients find meaning in their lives, even in difficult circumstances.",
    category: "therapeutic_approach",
    importance: 0.8
  },
  {
    content: "Existential therapy explores themes of meaning, freedom, isolation, and mortality in a person's life.",
    category: "therapeutic_approach",
    importance: 0.8
  },
  {
    content: "Motivational interviewing helps clients resolve ambivalent feelings to find internal motivation for change.",
    category: "therapeutic_technique",
    importance: 0.75
  },
  {
    content: "Open-ended questions encourage detailed responses rather than simple yes/no answers.",
    category: "therapeutic_technique",
    importance: 0.7
  },
  {
    content: "Validation in therapy acknowledges and accepts a person's emotional experience as valid and understandable.",
    category: "therapeutic_technique",
    importance: 0.85
  },
  {
    content: "The therapeutic alliance is the relationship of trust and rapport between therapist and client.",
    category: "therapeutic_principle",
    importance: 0.9
  }
];

// Mental health facts
export const mentalHealthFacts: KnowledgeEntry[] = [
  {
    content: "Depression affects more than 264 million people worldwide according to the WHO.",
    category: "mental_health_facts",
    importance: 0.8,
    source: "WHO"
  },
  {
    content: "Anxiety disorders are the most common mental health condition, affecting about 18% of adults in the US.",
    category: "mental_health_facts",
    importance: 0.8,
    source: "NIMH"
  },
  {
    content: "Regular physical exercise has been shown to reduce symptoms of depression and anxiety.",
    category: "mental_health_facts",
    importance: 0.75,
    source: "Research studies"
  },
  {
    content: "Mindfulness meditation can help reduce stress and improve emotional regulation.",
    category: "coping_strategies",
    importance: 0.7,
    source: "Research studies"
  },
  {
    content: "Social connection is a key factor in maintaining good mental health and resilience.",
    category: "mental_health_facts",
    importance: 0.85,
    source: "Research studies"
  },
  {
    content: "Sleep plays a crucial role in mental health, with poor sleep linked to increased risk of depression and anxiety.",
    category: "mental_health_facts",
    importance: 0.8,
    source: "Research studies"
  }
];
