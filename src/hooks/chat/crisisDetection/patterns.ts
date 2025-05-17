
/**
 * Pattern matching for crisis detection
 */

/**
 * Regular expression patterns for detecting crisis content
 * Organized by crisis type for better maintainability
 */
export const crisisPatterns = {
  suicide: [
    /suicid|kill (myself|me)|end (my|this) life|don'?t want to (live|be alive)|take my (own )?life/i,
    /fatal overdose|hang myself|jump off|i wish i was dead|i want to die|i might kill/,
    /no (point|reason) (in|to) (living|life)|better off dead/i
  ],
  selfHarm: [
    /harm (myself|me)|cut (myself|me)|hurt (myself|me)|self.harm|cutting/i
  ],
  eatingDisorder: [
    /can't stop eating|binge eating|overeating|eating too much|compulsive eating/i,
    /eaten [0-9]+ .+ in a row|not eating|haven't been eating|struggling not eating|can't eat|don't eat/i
  ],
  substanceUse: [
    /overdose|addicted|withdrawal|relapse|heroin|cocaine|meth|substance abuse/i,
    /substance use disorder|alcoholic|alcoholism|alcohol problem|drug problem/i,
    /can't stop (drinking|using)/i
  ],
  generalCrisis: [
    /crisis|emergency|urgent|help me|desperate|need help now/i,
    /severe (depression|anxiety|panic)/i,
    /voices telling me|hearing voices|seeing things|government watching|paranoid|psychotic/i,
    /homicid|kill (them|him|her|someone)|shoot|stab|attack|murder/i
  ]
};

/**
 * Test if a string matches any of the patterns in the array
 */
export function matchesAnyPattern(input: string, patterns: RegExp[]): boolean {
  return patterns.some(pattern => pattern.test(input));
}
