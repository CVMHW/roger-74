
import { handleEatingPatterns, enhanceEatingDisorderResponse } from './response/handlers/eatingPatternHandler';

export const getEatingDisorderMessage = (userInput: string): string => {
  const specializedResponse = handleEatingPatterns(userInput);
  
  if (specializedResponse) {
    return enhanceEatingDisorderResponse(specializedResponse, userInput);
  }
  
  return "I notice you're mentioning some concerns about eating or body image. These thoughts can be really challenging, and they're also very common. The Emily Program (1-888-364-5977) offers specialized support for these feelings. Would it help to talk more about how these thoughts have been affecting you?";
};

const getCrisisMessage = (userInput: string): string => {
  if (/plan/i.test(userInput)) {
    return "It sounds like you have a plan for how to harm yourself. That's extremely serious, and I want to help you get to safety. Please call 911 or go to the nearest emergency room immediately.";
  }
  
  if (/method/i.test(userInput)) {
    return "It sounds like you're thinking about how you might attempt suicide. That's extremely serious, and I want to help you get to safety. Please call 911 or go to the nearest emergency room immediately.";
  }
  
  if (/access to/i.test(userInput)) {
    return "It sounds like you have access to the means to harm yourself. That's extremely serious, and I want to help you get to safety. Please call 911 or go to the nearest emergency room immediately.";
  }
  
  return "It sounds like you're in crisis. If you're having thoughts of harming yourself, please reach out to a crisis hotline or emergency services immediately. I'm here to support you.";
};

const getMedicalConcernMessage = (userInput: string): string => {
  if (/chest pain/i.test(userInput)) {
    return "Chest pain can be a sign of a serious medical condition. Please seek immediate medical attention by calling 911 or going to the nearest emergency room.";
  }
  
  if (/stroke/i.test(userInput)) {
    return "A stroke requires immediate medical attention. Please call 911 or go to the nearest emergency room right away.";
  }
  
  if (/unconscious/i.test(userInput)) {
    return "If someone is unconscious, it's critical to get immediate medical help. Please call 911 without delay.";
  }
  
  return "It sounds like you have a medical concern. Please consult with a healthcare professional for proper diagnosis and treatment.";
};

const getMentalHealthConcernMessage = (userInput: string): string => {
  if (/suicidal thoughts/i.test(userInput)) {
    return "It sounds like you're having suicidal thoughts. Please know that you're not alone and there's help available. Reach out to a crisis hotline or mental health professional for support.";
  }
  
  if (/anxiety attack/i.test(userInput)) {
    return "It sounds like you're experiencing an anxiety attack. Try some relaxation techniques like deep breathing or meditation. If it's severe, consider reaching out to a mental health professional.";
  }
  
  if (/panic attack/i.test(userInput)) {
    return "It sounds like you're having a panic attack. Focus on your breathing and try to stay grounded in the present moment. If it's a recurring issue, consider seeking help from a mental health professional.";
  }
  
  return "It sounds like you have a mental health concern. Please consider reaching out to a mental health professional for guidance and support.";
};

const getSubstanceUseMessage = (userInput: string): string => {
  if (/overdose/i.test(userInput)) {
    return "If you suspect an overdose, it's critical to get immediate medical help. Please call 911 without delay.";
  }
  
  if (/withdrawal symptoms/i.test(userInput)) {
    return "Withdrawal symptoms can be dangerous. Please consult with a healthcare professional or addiction specialist for safe detoxification and treatment options.";
  }
  
  if (/relapse/i.test(userInput)) {
    return "Relapse is a part of the recovery process. Please reach out to your support network or addiction specialist for guidance and support.";
  }
  
  return "It sounds like you have a substance use concern. Please consider seeking help from an addiction specialist or support group for guidance and recovery.";
};

const getTentativeHarmMessage = (userInput: string): string => {
  if (/want to die/i.test(userInput)) {
    return "It sounds like you don't want to be alive anymore. That's extremely serious, and I want to help you get to safety. Please call 911 or go to the nearest emergency room immediately.";
  }
  
  if (/wish i was dead/i.test(userInput)) {
    return "It sounds like you wish you were dead. That's extremely serious, and I want to help you get to safety. Please call 911 or go to the nearest emergency room immediately.";
  }
  
  if (/might kill myself/i.test(userInput)) {
    return "It sounds like you're thinking about killing yourself. That's extremely serious, and I want to help you get to safety. Please call 911 or go to the nearest emergency room immediately.";
  }
  
  return "It sounds like you're having thoughts of harming yourself. Please know that you're not alone and there's help available. Reach out to a crisis hotline or emergency services immediately.";
};

const getPTSDMessage = (userInput: string): string => {
    if (/flashback/i.test(userInput)) {
        return "It sounds like you're experiencing a flashback. Grounding techniques can sometimes help manage flashbacks. Would you like me to share some grounding techniques with you?";
    }

    if (/trigger/i.test(userInput)) {
        return "It sounds like you've been triggered. It's understandable that you're feeling overwhelmed right now. What coping strategies have been helpful for you in the past?";
    }

    return "It sounds like you're dealing with PTSD. It's important to remember that you're not alone and there are resources available to support you. Would you like me to help you find some resources?";
};

const getMildPTSDResponse = (userInput: string): string => {
    if (/nightmare/i.test(userInput)) {
        return "I hear you've been having nightmares. Nightmares can be really distressing. Have you found anything that helps you calm down after a nightmare?";
    }

    if (/hypervigilant/i.test(userInput)) {
        return "I hear you've been feeling hypervigilant. It sounds like you're on high alert. Have you found any strategies that help you feel safer?";
    }

    return "I hear you've been experiencing some symptoms related to a traumatic event. It's important to be gentle with yourself and allow yourself time to heal. What kind of support feels most helpful to you right now?";
};

// Helper function for de-escalation responses
export const generateDeescalationResponse = (userInput: string): string => {
    if (/not listen/i.test(userInput)) {
        return "I hear that you're feeling frustrated. I want to make sure I'm really understanding what you're saying. Could we take a step back so I can listen more carefully?";
    }
    
    if (/wrong/i.test(userInput)) {
        return "I appreciate you letting me know I misunderstood. Could you help me better understand what you meant?";
    }
    
    return "I want to make sure I'm understanding you correctly. Could you tell me more about what's on your mind?";
};

export {
  getCrisisMessage,
  getMedicalConcernMessage,
  getMentalHealthConcernMessage,
  getSubstanceUseMessage,
  getTentativeHarmMessage,
  getPTSDMessage,
  getMildPTSDResponse
};
