
/**
 * Service Manager
 * 
 * Manages initialization and health monitoring of all services
 */

import { HealthCheckResult } from './types';
import { RAGService } from '../services/RAGService';
import { MemoryService } from '../services/MemoryService';
import { ResponseService } from '../services/ResponseService';
import { HIPAACompliance } from '../utils/HIPAACompliance';
import { CrisisInterventionService } from '../services/CrisisInterventionService';
import { EmotionAnalysisService } from '../services/EmotionAnalysisService';
import { PersonalityService } from '../services/PersonalityService';

export class ServiceManager {
  public readonly ragService: RAGService;
  public readonly memoryService: MemoryService;
  public readonly responseService: ResponseService;
  public readonly hipaaCompliance: HIPAACompliance;
  public readonly crisisService: CrisisInterventionService;
  public readonly emotionService: EmotionAnalysisService;
  public readonly personalityService: PersonalityService;

  constructor() {
    this.ragService = new RAGService();
    this.memoryService = new MemoryService();
    this.responseService = new ResponseService();
    this.hipaaCompliance = new HIPAACompliance();
    this.crisisService = new CrisisInterventionService();
    this.emotionService = new EmotionAnalysisService();
    this.personalityService = new PersonalityService();
  }

  /**
   * Health check for all pipeline components
   */
  async healthCheck(): Promise<HealthCheckResult> {
    const services = {
      rag: await this.ragService.isHealthy(),
      memory: await this.memoryService.isHealthy(),
      response: await this.responseService.isHealthy(),
      crisis: await this.crisisService.isHealthy(),
      emotion: await this.emotionService.isHealthy(),
      personality: await this.personalityService.isHealthy(),
      hipaa: await this.hipaaCompliance.isHealthy()
    };

    const healthy = Object.values(services).every(status => status);
    return { healthy, services };
  }
}
