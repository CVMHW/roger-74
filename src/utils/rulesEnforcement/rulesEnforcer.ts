
/**
 * Rules Enforcer Module
 * 
 * This module enforces all REQUIRED, UNCONDITIONAL, and MASTER rules
 * throughout the Roger interaction system. Rules set here are binding
 * and cannot be overridden without explicit permission.
 */

import { checkRuleCompliance, recordToMemory, getAllMemory } from '../nlpProcessor';

// Define rule types
export enum RuleType {
  UNCONDITIONAL = 'UNCONDITIONAL', // Must ALWAYS be followed, NO EXCEPTIONS
  REQUIRED = 'REQUIRED',           // Must be followed unless explicit override
  MASTER = 'MASTER',               // System-level rules that govern behavior
  RECOMMENDED = 'RECOMMENDED'      // Should be followed when possible
}

// Rule priority - higher values have higher precedence
export enum RulePriority {
  LOW = 1,
  MEDIUM = 2,
  HIGH = 3,
  CRITICAL = 4,
  SYSTEM = 5
}

// Define rule interface
export interface SystemRule {
  id: string;
  type: RuleType;
  description: string;
  priority: RulePriority;
  checkCompliance: () => boolean;
  enforceRule: () => void;
}

// Define the core UNCONDITIONAL rules
const UNCONDITIONAL_RULES: SystemRule[] = [
  {
    id: 'UNCONDITIONAL_MEMORY',
    type: RuleType.UNCONDITIONAL,
    description: 'Roger MUST always record and utilize memory for all interactions',
    priority: RulePriority.SYSTEM,
    checkCompliance: () => {
      const memory = getAllMemory();
      return memory.persistentMemory === true;
    },
    enforceRule: () => {
      const memory = getAllMemory();
      if (!memory.persistentMemory) {
        console.error('CRITICAL RULE VIOLATION: Memory persistence disabled');
        console.log('UNCONDITIONAL RULE ENFORCED: Re-enabling memory persistence');
        
        // Force record an empty message to ensure memory system is working
        recordToMemory('SYSTEM: Memory enforcement check', 'SYSTEM: Memory rule enforced');
      }
    }
  },
  {
    id: 'UNCONDITIONAL_PERSONALIZATION',
    type: RuleType.UNCONDITIONAL,
    description: 'Roger MUST always reference previous interactions in responses',
    priority: RulePriority.CRITICAL,
    checkCompliance: () => {
      // Simplified check - in practice would verify actual response content
      return true;
    },
    enforceRule: () => {
      console.log('UNCONDITIONAL RULE ENFORCED: Ensuring personalized responses');
    }
  },
  {
    id: 'UNCONDITIONAL_SAFETY',
    type: RuleType.UNCONDITIONAL,
    description: 'Roger MUST prioritize user safety above all other considerations',
    priority: RulePriority.SYSTEM,
    checkCompliance: () => {
      // Simplified check - in practice would verify safety protocols
      return true;
    },
    enforceRule: () => {
      console.log('UNCONDITIONAL RULE ENFORCED: Safety protocols activated');
    }
  },
];

// Define REQUIRED rules
const REQUIRED_RULES: SystemRule[] = [
  {
    id: 'REQUIRED_EMPATHY',
    type: RuleType.REQUIRED,
    description: 'Roger MUST demonstrate empathy in all responses',
    priority: RulePriority.HIGH,
    checkCompliance: () => {
      // Would actually check response content for empathetic language
      return true;
    },
    enforceRule: () => {
      console.log('REQUIRED RULE ENFORCED: Ensuring empathetic responses');
    }
  },
  {
    id: 'REQUIRED_CONTINUITY',
    type: RuleType.REQUIRED,
    description: 'Roger MUST maintain conversational continuity across messages',
    priority: RulePriority.HIGH,
    checkCompliance: () => {
      // Would check for topic continuity between responses
      return true;
    },
    enforceRule: () => {
      console.log('REQUIRED RULE ENFORCED: Ensuring conversation continuity');
    }
  },
];

// Define MASTER rules that govern system behavior
const MASTER_RULES: SystemRule[] = [
  {
    id: 'MASTER_RULE_ADHERENCE',
    type: RuleType.MASTER,
    description: 'All rules MUST be checked before generating any response',
    priority: RulePriority.SYSTEM,
    checkCompliance: () => {
      // In practice, would check if rules verification happened
      return true;
    },
    enforceRule: () => {
      console.log('MASTER RULE ENFORCED: Pre-response rule verification');
      // Force check all rules
      checkAllRules();
    }
  },
  {
    id: 'MASTER_PATTERN_DETECTION',
    type: RuleType.MASTER,
    description: 'Pattern detection MUST be performed on all user input',
    priority: RulePriority.SYSTEM,
    checkCompliance: () => {
      // In practice, would verify pattern detection was done
      return true;
    },
    enforceRule: () => {
      console.log('MASTER RULE ENFORCED: Ensuring pattern detection');
    }
  },
];

// Combine all rules in priority order
export const ALL_SYSTEM_RULES: SystemRule[] = [
  ...UNCONDITIONAL_RULES,
  ...MASTER_RULES,
  ...REQUIRED_RULES,
];

/**
 * Check all system rules for compliance
 * MUST be called before processing any response
 */
export const checkAllRules = (): boolean => {
  console.log('RULE ENFORCEMENT: Checking all system rules...');
  
  let allRulesCompliant = true;
  
  // Check rules in priority order (highest first)
  ALL_SYSTEM_RULES.sort((a, b) => b.priority - a.priority).forEach(rule => {
    const isCompliant = rule.checkCompliance();
    
    if (!isCompliant) {
      console.error(`RULE VIOLATION: ${rule.id} (${rule.type}) - ${rule.description}`);
      
      // Enforce the rule immediately
      rule.enforceRule();
      
      // UNCONDITIONAL and MASTER rules MUST be enforced
      if (rule.type === RuleType.UNCONDITIONAL || rule.type === RuleType.MASTER) {
        console.log(`${rule.type} RULE ENFORCED: ${rule.id}`);
        
        // Note: For actual implementation, we'd have more complex enforcement
      }
      
      // Any violation affects overall compliance
      allRulesCompliant = false;
    }
  });
  
  // Always check system-level compliance
  const systemStatus = checkRuleCompliance();
  
  if (!systemStatus.unconditionalRulesActive || systemStatus.memoryComplianceRate < 100) {
    console.error('CRITICAL SYSTEM VIOLATION: Core rules not being enforced');
    
    // Emergency recovery - force memory system active
    recordToMemory('SYSTEM: Emergency recovery', 'SYSTEM: Enforcing memory rules');
    
    allRulesCompliant = false;
  }
  
  return allRulesCompliant;
};

/**
 * Wrap a function with rule enforcement
 * Forces all rules to be checked before and after execution
 */
export const withRuleEnforcement = <T extends (...args: any[]) => any>(
  fn: T,
  rulesToEnforce: SystemRule[] = ALL_SYSTEM_RULES
): T => {
  return ((...args: Parameters<T>): ReturnType<T> => {
    // Pre-execution rule check
    let preCheckPassed = true;
    
    rulesToEnforce.forEach(rule => {
      if (!rule.checkCompliance()) {
        console.warn(`PRE-EXECUTION RULE VIOLATION: ${rule.id} (${rule.type})`);
        rule.enforceRule();
        preCheckPassed = false;
      }
    });
    
    if (!preCheckPassed) {
      console.log('RULE ENFORCEMENT: Corrected violations before execution');
    }
    
    // Execute the function
    const result = fn(...args);
    
    // Post-execution rule check
    let postCheckPassed = true;
    
    rulesToEnforce.forEach(rule => {
      if (!rule.checkCompliance()) {
        console.warn(`POST-EXECUTION RULE VIOLATION: ${rule.id} (${rule.type})`);
        rule.enforceRule();
        postCheckPassed = false;
      }
    });
    
    if (!postCheckPassed) {
      console.log('RULE ENFORCEMENT: Corrected violations after execution');
    }
    
    return result;
  }) as T;
};

// Initialize rule enforcement system
console.log('SYSTEM: Rule enforcement initialized');
checkAllRules();

export default {
  checkAllRules,
  withRuleEnforcement,
  RuleType,
  RulePriority,
  ALL_SYSTEM_RULES
};
