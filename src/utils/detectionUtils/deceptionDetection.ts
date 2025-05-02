
/**
 * Utilities for detecting potential deception in crisis communication
 * Used specifically when patients may be backtracking on statements about harm
 */

export interface DeceptionAnalysis {
  isPotentialDeception: boolean;
  deceptionType: 'backtracking' | 'joking' | 'denial' | 'minimizing' | null;
  originalConcern: 'suicide' | 'self-harm' | 'harm-to-others' | 'crisis' | null;
  confidence: 'low' | 'medium' | 'high';
}

/**
 * Detects patterns that may indicate a patient is deceptively backtracking on crisis statements
 * This is only used in the specific safety context when someone has already mentioned harm
 */
export const detectPotentialDeception = (
  originalStatement: string,
  followUpStatement: string
): DeceptionAnalysis => {
  const lowerOriginal = originalStatement.toLowerCase();
  const lowerFollowUp = followUpStatement.toLowerCase();
  
  // Default result
  const result: DeceptionAnalysis = {
    isPotentialDeception: false,
    deceptionType: null,
    originalConcern: null,
    confidence: 'low'
  };
  
  // Detect original concern type
  if (/suicid|kill myself|end my life|take my life|don't want to live/i.test(lowerOriginal)) {
    result.originalConcern = 'suicide';
  } else if (/hurt myself|harm myself|cut myself|self.harm/i.test(lowerOriginal)) {
    result.originalConcern = 'self-harm';
  } else if (/hurt|kill|harm|attack someone|others/i.test(lowerOriginal)) {
    result.originalConcern = 'harm-to-others';
  } else if (/emergency|crisis|help me now|desperate/i.test(lowerOriginal)) {
    result.originalConcern = 'crisis';
  }
  
  // If no original concern detected, no deception to analyze
  if (!result.originalConcern) {
    return result;
  }
  
  // Detect backtracking indicators
  const jokeIndicators = /just kidding|jk|joking|joke|kidding|not serious|only joking|haha|lol|lmao|playing|trolling|fooling|messing/i;
  const denialIndicators = /didn't mean|not what i meant|wasn't serious|didn't say that|exaggerating|i lied|that's not true|wasn't being honest/i;
  const minimizingIndicators = /not that bad|overreacting|not a big deal|making too much|fine now|better now|changed my mind|feeling better|over it|wasn't real/i;
  
  // Check for laughter patterns that seem forced or excessive
  const forcedLaughterPattern = /haha{2,}|ha{3,}|!{3,}/i;
  
  // Analyze the potential deception type
  if (jokeIndicators.test(lowerFollowUp)) {
    result.isPotentialDeception = true;
    result.deceptionType = 'joking';
    result.confidence = forcedLaughterPattern.test(lowerFollowUp) ? 'high' : 'medium';
  } else if (denialIndicators.test(lowerFollowUp)) {
    result.isPotentialDeception = true;
    result.deceptionType = 'denial';
    result.confidence = 'medium';
  } else if (minimizingIndicators.test(lowerFollowUp)) {
    result.isPotentialDeception = true;
    result.deceptionType = 'minimizing';
    result.confidence = 'low';
  }
  
  // Increase confidence if there are multiple indicators or excessive punctuation/capitalization
  if (result.isPotentialDeception) {
    if (/!{3,}|[A-Z]{5,}/.test(followUpStatement)) {
      result.confidence = 'high';
    }
  }
  
  return result;
};

/**
 * Generate an appropriate response when potential deception about crisis is detected
 * Focuses on patient safety while respecting their agency
 */
export const generateDeceptionResponseMessage = (analysis: DeceptionAnalysis): string => {
  const concernType = analysis.originalConcern || 'crisis';
  
  // Base responses by concern type
  const responses = {
    suicide: "I appreciate you sharing those thoughts with me, even if you're now saying it was a joke. Thoughts of suicide are something we take very seriously because we care about your wellbeing. If you are experiencing thoughts of suicide, inpatient treatment is available and typically lasts 3-7 days, designed to provide stabilization and safety during a difficult time.",
    'self-harm': "I understand you're now indicating your statement about self-harm wasn't serious. However, I want you to know that if you are struggling with thoughts of harming yourself, there are supportive resources available. Brief inpatient stays of 3-7 days can provide a safe environment and help develop coping strategies.",
    'harm-to-others': "I notice you mentioned thoughts about harming others, though you've indicated you weren't being serious. These types of thoughts, if genuine, benefit from professional support. Inpatient treatment, typically lasting 3-7 days, can help process these feelings in a safe environment.",
    crisis: "I understand you may be feeling hesitant about the seriousness of what you shared. Crisis support is designed to meet you where you are, without judgment. If you're experiencing a crisis, short-term inpatient care usually lasts 3-7 days and focuses on stabilization and safety."
  };
  
  // Additional reassurance based on the type of deception
  let additionalReassurance = "";
  
  switch (analysis.deceptionType) {
    case 'joking':
      additionalReassurance = "Sometimes we use humor to distance ourselves from difficult feelings. It's also completely normal to feel worried about what might happen if you share these thoughts. I want to reassure you that seeking help is about support, not punishment.";
      break;
    case 'denial':
      additionalReassurance = "It's common to have second thoughts after sharing something deeply personal. Many people worry about the consequences of seeking help. I want to emphasize that mental health support is voluntary in most situations and focused on your wellbeing.";
      break;
    case 'minimizing':
      additionalReassurance = "It's understandable to try to downplay difficult feelings, especially when they're overwhelming. Many people worry about what happens after sharing these thoughts. Most inpatient experiences are brief, voluntary, and focused on helping you feel safer.";
      break;
    default:
      additionalReassurance = "It's completely normal to have mixed feelings about seeking help. Most people worry about what will happen if they share their struggles. Mental health support, including brief inpatient stays, is designed to be helpful, not restrictive.";
  }
  
  return `${responses[concernType]} ${additionalReassurance} Would it be helpful to talk more about what professional support options might look like?`;
};
