
/**
 * Phrases to use for different feeling categories
 */

import { ReflectionPhrases } from './reflectionTypes';

export const reflectionPhrases: ReflectionPhrases = {
  sad: [
    "I hear a sense of sadness in what you're sharing.",
    "It sounds like you're feeling down about this.",
    "There seems to be some sadness in your experience.",
    "I'm sensing that this has been really disappointing for you."
  ],
  angry: [
    "I'm hearing some frustration in your words.",
    "It seems like this situation has made you quite upset.",
    "There's a sense of anger coming through in what you're sharing.",
    "I can hear how frustrating this has been for you."
  ],
  anxious: [
    "I'm sensing some worry in what you're describing.",
    "It sounds like this situation has caused you some anxiety.",
    "There seems to be some concern about what might happen.",
    "I hear that you're feeling uncertain and nervous about this."
  ],
  happy: [
    "I can hear the joy in what you're sharing.",
    "It sounds like this has brought you real happiness.",
    "There's a sense of excitement coming through.",
    "I'm picking up on how pleased you are about this."
  ],
  confused: [
    "It seems like you're feeling unsure about how to proceed.",
    "I'm sensing some confusion as you try to make sense of this.",
    "It sounds like you're wrestling with some uncertainty here.",
    "I hear that you're feeling pulled in different directions."
  ],
  relieved: [
    "There seems to be a sense of relief in what you're sharing.",
    "I'm hearing that a weight has been lifted from you.",
    "It sounds like you're feeling more at ease now.",
    "I sense you're feeling some comfort after what happened."
  ],
  embarrassed: [
    "I'm sensing that this situation has left you feeling somewhat uncomfortable.",
    "It sounds like there's some embarrassment or guilt in your experience.",
    "I hear that you're feeling self-conscious about what occurred.",
    "There seems to be some regret in what you're describing."
  ],
  overwhelmed: [
    "It sounds like you've been dealing with a lot all at once.",
    "I'm hearing how overwhelming this situation has been for you.",
    "There's a sense that you're feeling quite burdened by everything.",
    "I can hear how much pressure you've been under."
  ],
  lonely: [
    "I'm sensing a feeling of isolation in what you're sharing.",
    "It sounds like you've been feeling rather alone with this.",
    "There's a sense of disconnection coming through in your words.",
    "I hear that you've been feeling somewhat separated from others."
  ],
  hopeful: [
    "I'm picking up on a sense of optimism in what you're sharing.",
    "It sounds like you're feeling positive about what's ahead.",
    "There seems to be hope in your perspective on this.",
    "I hear that you're feeling encouraged about the possibilities."
  ]
};

// General reflection responses when no specific emotion is detected
export const generalReflections = [
  "I'm trying to understand your experience. Could you tell me more about how that feels for you?",
  "I want to make sure I'm grasping what you're sharing. Could you elaborate on what this means to you?",
  "I'm listening to understand your perspective. What aspects of this feel most significant?",
  "I'd like to understand better what you're experiencing. Could you share more about how this affects you?",
  "I'm trying to picture this from your point of view. What parts of this experience stand out most for you?",
  "I want to make sure I'm following you correctly. What feelings come up for you when you think about this?"
];

// Phrases for meaning reflections
export const meaningReflections = [
  "I'm trying to understand what this means to you. Is it that...",
  "The way I understand what you're sharing is...",
  "If I'm grasping your meaning correctly, you're saying that...",
  "So from your perspective, this experience means...",
  "I'm wondering if what's important here for you is...",
  "It sounds like what matters to you in this situation is...",
  "I'm hearing that the significance of this for you is...",
  "From what you're sharing, I sense that what's meaningful is..."
];
