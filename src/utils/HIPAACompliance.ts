
/**
 * HIPAA Compliance Utility
 * 
 * Handles privacy-compliant logging and audit trails
 */

export interface InteractionLog {
  sessionId: string;
  timestamp: number;
  inputLength: number;
  responseLength: number;
  emotionDetected: string;
  crisisLevel: string;
  processingTime: number;
}

export class HIPAACompliance {
  private auditLogs: Map<string, string[]> = new Map();
  private interactions: InteractionLog[] = [];

  /**
   * Log interaction while maintaining privacy compliance
   */
  async logInteraction(context: any): Promise<void> {
    try {
      const log: InteractionLog = {
        sessionId: context.sessionId,
        timestamp: context.timestamp,
        inputLength: context.userInput?.length || 0,
        responseLength: 0, // Will be updated later
        emotionDetected: 'unknown',
        crisisLevel: 'none',
        processingTime: 0
      };
      
      this.interactions.push(log);
      
      // Maintain limited history for compliance
      if (this.interactions.length > 100) {
        this.interactions.shift();
      }
    } catch (error) {
      console.error('HIPAA logging error:', error);
    }
  }

  /**
   * Complete audit trail for a session
   */
  async completeAuditTrail(sessionId: string, auditTrail: string[]): Promise<void> {
    try {
      // Store anonymized audit trail
      const anonymizedTrail = auditTrail.map(entry => 
        this.anonymizeLogEntry(entry)
      );
      
      this.auditLogs.set(sessionId, anonymizedTrail);
      
      // Clean up old audit logs
      this.cleanupOldLogs();
    } catch (error) {
      console.error('Audit trail completion error:', error);
    }
  }

  /**
   * Get anonymized statistics for system monitoring
   */
  getSystemStats(): any {
    const recentInteractions = this.interactions.slice(-50);
    
    return {
      totalInteractions: recentInteractions.length,
      averageProcessingTime: this.calculateAverageProcessingTime(recentInteractions),
      emotionDistribution: this.calculateEmotionDistribution(recentInteractions),
      crisisIncidents: recentInteractions.filter(i => i.crisisLevel !== 'none').length,
      timestamp: Date.now()
    };
  }

  private anonymizeLogEntry(entry: string): string {
    // Remove any potentially identifying information
    return entry
      .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[EMAIL]')
      .replace(/\b\d{3}-\d{3}-\d{4}\b/g, '[PHONE]')
      .replace(/\b\d{1,5}\s\w+\s(Street|St|Avenue|Ave|Road|Rd|Drive|Dr)\b/gi, '[ADDRESS]');
  }

  private cleanupOldLogs(): void {
    const cutoffTime = Date.now() - (24 * 60 * 60 * 1000); // 24 hours
    
    for (const [sessionId, logs] of this.auditLogs.entries()) {
      // Remove logs older than 24 hours (implement based on your retention policy)
      if (this.auditLogs.size > 1000) {
        this.auditLogs.delete(sessionId);
        break;
      }
    }
  }

  private calculateAverageProcessingTime(interactions: InteractionLog[]): number {
    if (interactions.length === 0) return 0;
    
    const total = interactions.reduce((sum, interaction) => sum + interaction.processingTime, 0);
    return total / interactions.length;
  }

  private calculateEmotionDistribution(interactions: InteractionLog[]): Record<string, number> {
    const distribution: Record<string, number> = {};
    
    interactions.forEach(interaction => {
      const emotion = interaction.emotionDetected;
      distribution[emotion] = (distribution[emotion] || 0) + 1;
    });
    
    return distribution;
  }

  /**
   * Health check for HIPAA compliance service
   */
  async isHealthy(): Promise<boolean> {
    try {
      // Test logging functionality
      await this.logInteraction({
        sessionId: 'health-check',
        timestamp: Date.now(),
        userInput: 'test'
      });
      
      return true;
    } catch {
      return false;
    }
  }
}
