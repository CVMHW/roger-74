
/**
 * Phrases to use for different feeling categories
 */

import { ReflectionPhrases } from './reflectionTypes';

export const reflectionPhrases: ReflectionPhrases = {
  opening: [],
  middle: [],
  closing: [],
  sad: [
    "I hear a sense of sadness in what you're sharing.",
    "It sounds like you're feeling down about this situation.",
    "There seems to be some sadness in your experience with this.",
    "I'm sensing that this has been really disappointing for you.",
    "I can hear how this loss is affecting you emotionally.",
    "The way you describe this suggests you're feeling quite sad about it.",
    "It seems like you're experiencing some grief around this situation."
  ],
  angry: [
    "I'm hearing some frustration in your words.",
    "It seems like this situation has made you quite upset.",
    "There's a sense of anger coming through in what you're sharing.",
    "I can hear how frustrating this has been for you.",
    "Your words convey a strong sense of irritation with what happened.",
    "It sounds like this experience has left you feeling quite angry.",
    "I'm picking up on some resentment in how you describe this."
  ],
  anxious: [
    "I'm sensing some worry in what you're describing.",
    "It sounds like this situation has caused you some anxiety.",
    "There seems to be some concern about what might happen.",
    "I hear that you're feeling uncertain and nervous about this.",
    "Your words suggest you're feeling rather anxious about this situation.",
    "I can sense the worry you're experiencing around this.",
    "It sounds like there's some apprehension in how you're approaching this."
  ],
  happy: [
    "I can hear the joy in what you're sharing.",
    "It sounds like this has brought you real happiness.",
    "There's a sense of excitement coming through.",
    "I'm picking up on how pleased you are about this.",
    "Your words convey genuine happiness about what's happened.",
    "I can sense how much joy this brings you.",
    "It sounds like this experience has made you truly happy."
  ],
  confused: [
    "It seems like you're feeling unsure about how to proceed.",
    "I'm sensing some confusion as you try to make sense of this.",
    "It sounds like you're wrestling with some uncertainty here.",
    "I hear that you're feeling pulled in different directions.",
    "There's a sense that you're trying to navigate through some confusion.",
    "I notice you seem uncertain about what this means or what to do next.",
    "It sounds like you're having difficulty making sense of this situation."
  ],
  relieved: [
    "There seems to be a sense of relief in what you're sharing.",
    "I'm hearing that a weight has been lifted from you.",
    "It sounds like you're feeling more at ease now.",
    "I sense you're feeling some comfort after what happened.",
    "Your words suggest a newfound sense of relief about this.",
    "I can hear how relieved you are that this situation has changed.",
    "It seems like you've found some peace with how things turned out."
  ],
  embarrassed: [
    "I'm sensing that this situation has left you feeling somewhat uncomfortable.",
    "It sounds like there's some embarrassment or guilt in your experience.",
    "I hear that you're feeling self-conscious about what occurred.",
    "There seems to be some regret in what you're describing.",
    "Your words suggest you're feeling embarrassed about what happened.",
    "I can sense that this experience has been uncomfortable for you.",
    "It sounds like you're feeling some shame around this situation."
  ],
  overwhelmed: [
    "It sounds like you've been dealing with a lot all at once.",
    "I'm hearing how overwhelming this situation has been for you.",
    "There's a sense that you're feeling quite burdened by everything.",
    "I can hear how much pressure you've been under.",
    "Your words convey how overwhelmed you're feeling right now.",
    "It seems like you're carrying a heavy load with all of this.",
    "I sense that you're feeling stretched beyond your capacity at the moment."
  ],
  lonely: [
    "I'm sensing a feeling of isolation in what you're sharing.",
    "It sounds like you've been feeling rather alone with this.",
    "There's a sense of disconnection coming through in your words.",
    "I hear that you've been feeling somewhat separated from others.",
    "Your words suggest you're experiencing a sense of loneliness.",
    "It seems like you're missing that feeling of connection right now.",
    "I can sense how isolated you've been feeling through this experience."
  ],
  hopeful: [
    "I'm picking up on a sense of optimism in what you're sharing.",
    "It sounds like you're feeling positive about what's ahead.",
    "There seems to be hope in your perspective on this.",
    "I hear that you're feeling encouraged about the possibilities.",
    "Your words convey a sense of hope about the future.",
    "It sounds like you're seeing some promising possibilities ahead.",
    "I can sense the optimism you're feeling about this situation."
  ]
};

// General reflection responses when no specific emotion is detected
export const generalReflections = [
  "I'm trying to understand your experience. Could you tell me more about how that feels for you?",
  "I want to make sure I'm grasping what you're sharing. Could you elaborate on what this means to you?",
  "I'm listening to understand your perspective. What aspects of this feel most significant?",
  "I'd like to understand better what you're experiencing. Could you share more about how this affects you?",
  "I'm trying to picture this from your point of view. What parts of this experience stand out most for you?",
  "I want to make sure I'm following you correctly. What feelings come up for you when you think about this?",
  "I notice that seems important to you. Could you share more about why this matters so much?",
  "I'm curious about your experience with this. What's been most challenging for you?",
  "I'd like to explore this further with you. What aspects would be helpful to talk about?"
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
  "From what you're sharing, I sense that what's meaningful is...",
  "It seems like the core of what you're expressing is...",
  "What I'm understanding from your words is that...",
  "The heart of what you're sharing seems to be..."
];
