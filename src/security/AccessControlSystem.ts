/**
 * Access Control System
 * 
 * Implements user-specific memory isolation and privacy controls for 5/5 access control
 */

export interface UserPermissions {
  canAccessMemory: boolean;
  canModifyMemory: boolean;
  canExportData: boolean;
  canDeleteData: boolean;
  memoryRetentionDays: number;
  privacyLevel: 'public' | 'shared' | 'private' | 'encrypted';
}

export interface UserSession {
  sessionId: string;
  userId: string;
  createdAt: number;
  expiresAt: number;
  permissions: UserPermissions;
  accessLog: AccessLogEntry[];
  memoryIsolation: {
    isolatedCollections: string[];
    sharedCollections: string[];
    readOnlyCollections: string[];
  };
}

export interface AccessLogEntry {
  timestamp: number;
  action: string;
  resource: string;
  success: boolean;
  metadata?: Record<string, any>;
}

export interface DataExportRequest {
  requestId: string;
  userId: string;
  requestedAt: number;
  dataTypes: string[];
  status: 'pending' | 'approved' | 'denied' | 'completed';
  exportedData?: any;
}

export class AccessControlSystem {
  private sessions: Map<string, UserSession> = new Map();
  private userPermissions: Map<string, UserPermissions> = new Map();
  private isolatedData: Map<string, Map<string, any>> = new Map();
  private accessLogs: Map<string, AccessLogEntry[]> = new Map();
  private exportRequests: Map<string, DataExportRequest> = new Map();
  private encryptionKeys: Map<string, string> = new Map();

  /**
   * Create user session with isolated memory
   */
  async createUserSession(
    userId: string,
    permissions?: Partial<UserPermissions>
  ): Promise<string> {
    const sessionId = `session_${userId}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    
    // Get or create user permissions
    let userPerms = this.userPermissions.get(userId);
    if (!userPerms) {
      userPerms = this.createDefaultPermissions();
      this.userPermissions.set(userId, userPerms);
    }
    
    // Apply any permission overrides
    const finalPermissions = { ...userPerms, ...permissions };
    
    const session: UserSession = {
      sessionId,
      userId,
      createdAt: Date.now(),
      expiresAt: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
      permissions: finalPermissions,
      accessLog: [],
      memoryIsolation: {
        isolatedCollections: [`user_${userId}_memory`, `user_${userId}_conversations`],
        sharedCollections: ['public_knowledge', 'educational_concepts'],
        readOnlyCollections: ['system_prompts', 'therapy_guidelines']
      }
    };
    
    this.sessions.set(sessionId, session);
    
    // Initialize isolated data storage for user
    if (!this.isolatedData.has(userId)) {
      this.isolatedData.set(userId, new Map());
    }
    
    // Initialize access logs
    if (!this.accessLogs.has(userId)) {
      this.accessLogs.set(userId, []);
    }
    
    this.logAccess(sessionId, 'session_created', 'user_session', true);
    
    console.log(`Created session ${sessionId} for user ${userId}`);
    return sessionId;
  }

  /**
   * Validate session and check permissions
   */
  validateAccess(
    sessionId: string,
    action: string,
    resource: string
  ): { valid: boolean; session?: UserSession; reason?: string } {
    const session = this.sessions.get(sessionId);
    
    if (!session) {
      return { valid: false, reason: 'Session not found' };
    }
    
    if (Date.now() > session.expiresAt) {
      this.sessions.delete(sessionId);
      return { valid: false, reason: 'Session expired' };
    }
    
    // Check permissions for action
    const hasPermission = this.checkPermission(session, action, resource);
    
    this.logAccess(sessionId, action, resource, hasPermission);
    
    if (!hasPermission) {
      return { valid: false, reason: 'Insufficient permissions' };
    }
    
    return { valid: true, session };
  }

  /**
   * Store data with user isolation
   */
  async storeUserData(
    sessionId: string,
    dataType: string,
    data: any,
    metadata?: Record<string, any>
  ): Promise<boolean> {
    const validation = this.validateAccess(sessionId, 'write', dataType);
    if (!validation.valid) {
      console.error(`Access denied for storing ${dataType}: ${validation.reason}`);
      return false;
    }
    
    const session = validation.session!;
    const userData = this.isolatedData.get(session.userId);
    
    if (!userData) {
      console.error('User data storage not initialized');
      return false;
    }
    
    // Encrypt data if required
    const finalData = session.permissions.privacyLevel === 'encrypted' 
      ? await this.encryptData(session.userId, data)
      : data;
    
    // Store with metadata
    const storageItem = {
      data: finalData,
      metadata: {
        ...metadata,
        storedAt: Date.now(),
        dataType,
        privacyLevel: session.permissions.privacyLevel
      }
    };
    
    userData.set(`${dataType}_${Date.now()}`, storageItem);
    
    this.logAccess(sessionId, 'data_stored', dataType, true, { size: JSON.stringify(data).length });
    return true;
  }

  /**
   * Retrieve user data with isolation
   */
  async retrieveUserData(
    sessionId: string,
    dataType: string,
    filters?: Record<string, any>
  ): Promise<any[]> {
    const validation = this.validateAccess(sessionId, 'read', dataType);
    if (!validation.valid) {
      console.error(`Access denied for retrieving ${dataType}: ${validation.reason}`);
      return [];
    }
    
    const session = validation.session!;
    const userData = this.isolatedData.get(session.userId);
    
    if (!userData) {
      return [];
    }
    
    const results: any[] = [];
    
    for (const [key, item] of userData.entries()) {
      if (key.startsWith(dataType)) {
        // Check retention policy
        const age = Date.now() - item.metadata.storedAt;
        const maxAge = session.permissions.memoryRetentionDays * 24 * 60 * 60 * 1000;
        
        if (age > maxAge) {
          userData.delete(key); // Auto-cleanup expired data
          continue;
        }
        
        // Apply filters if provided
        if (filters && !this.matchesFilters(item, filters)) {
          continue;
        }
        
        // Decrypt if necessary
        const finalData = session.permissions.privacyLevel === 'encrypted'
          ? await this.decryptData(session.userId, item.data)
          : item.data;
        
        results.push({
          ...finalData,
          metadata: item.metadata
        });
      }
    }
    
    this.logAccess(sessionId, 'data_retrieved', dataType, true, { count: results.length });
    return results;
  }

  /**
   * Delete user data with proper authorization
   */
  async deleteUserData(
    sessionId: string,
    dataType: string,
    itemId?: string
  ): Promise<boolean> {
    const validation = this.validateAccess(sessionId, 'delete', dataType);
    if (!validation.valid) {
      console.error(`Access denied for deleting ${dataType}: ${validation.reason}`);
      return false;
    }
    
    const session = validation.session!;
    const userData = this.isolatedData.get(session.userId);
    
    if (!userData) {
      return false;
    }
    
    let deletedCount = 0;
    
    if (itemId) {
      // Delete specific item
      if (userData.delete(itemId)) {
        deletedCount = 1;
      }
    } else {
      // Delete all items of this type
      for (const key of userData.keys()) {
        if (key.startsWith(dataType)) {
          userData.delete(key);
          deletedCount++;
        }
      }
    }
    
    this.logAccess(sessionId, 'data_deleted', dataType, true, { deletedCount });
    return deletedCount > 0;
  }

  /**
   * Request data export
   */
  async requestDataExport(
    sessionId: string,
    dataTypes: string[]
  ): Promise<string> {
    const validation = this.validateAccess(sessionId, 'export', 'user_data');
    if (!validation.valid) {
      throw new Error(`Access denied for data export: ${validation.reason}`);
    }
    
    const session = validation.session!;
    const requestId = `export_${session.userId}_${Date.now()}`;
    
    const exportRequest: DataExportRequest = {
      requestId,
      userId: session.userId,
      requestedAt: Date.now(),
      dataTypes,
      status: 'pending'
    };
    
    this.exportRequests.set(requestId, exportRequest);
    
    // Auto-approve for users with export permissions
    if (session.permissions.canExportData) {
      await this.processDataExport(requestId);
    }
    
    this.logAccess(sessionId, 'export_requested', 'user_data', true, { dataTypes });
    return requestId;
  }

  /**
   * Process data export request
   */
  private async processDataExport(requestId: string): Promise<void> {
    const request = this.exportRequests.get(requestId);
    if (!request) return;
    
    try {
      const userData = this.isolatedData.get(request.userId);
      if (!userData) {
        request.status = 'denied';
        return;
      }
      
      const exportData: Record<string, any[]> = {};
      
      for (const dataType of request.dataTypes) {
        exportData[dataType] = [];
        
        for (const [key, item] of userData.entries()) {
          if (key.startsWith(dataType)) {
            // Decrypt if necessary (for export, we provide decrypted data)
            const finalData = item.metadata.privacyLevel === 'encrypted'
              ? await this.decryptData(request.userId, item.data)
              : item.data;
            
            exportData[dataType].push({
              ...finalData,
              metadata: item.metadata
            });
          }
        }
      }
      
      request.exportedData = exportData;
      request.status = 'completed';
      
      console.log(`Data export completed for user ${request.userId}`);
      
    } catch (error) {
      console.error('Data export failed:', error);
      request.status = 'denied';
    }
  }

  /**
   * Get access logs for user
   */
  getAccessLogs(sessionId: string): AccessLogEntry[] {
    const validation = this.validateAccess(sessionId, 'read', 'access_logs');
    if (!validation.valid) {
      return [];
    }
    
    const session = validation.session!;
    return this.accessLogs.get(session.userId) || [];
  }

  /**
   * Update user permissions
   */
  updateUserPermissions(
    sessionId: string,
    newPermissions: Partial<UserPermissions>
  ): boolean {
    const validation = this.validateAccess(sessionId, 'admin', 'permissions');
    if (!validation.valid) {
      return false;
    }
    
    const session = validation.session!;
    const currentPermissions = this.userPermissions.get(session.userId);
    
    if (currentPermissions) {
      const updatedPermissions = { ...currentPermissions, ...newPermissions };
      this.userPermissions.set(session.userId, updatedPermissions);
      session.permissions = updatedPermissions;
      
      this.logAccess(sessionId, 'permissions_updated', 'user_permissions', true);
      return true;
    }
    
    return false;
  }

  /**
   * Private helper methods
   */
  private createDefaultPermissions(): UserPermissions {
    return {
      canAccessMemory: true,
      canModifyMemory: true,
      canExportData: true,
      canDeleteData: true,
      memoryRetentionDays: 30,
      privacyLevel: 'private'
    };
  }

  private checkPermission(session: UserSession, action: string, resource: string): boolean {
    const { permissions, memoryIsolation } = session;
    
    // Check basic permissions
    switch (action) {
      case 'read':
        if (!permissions.canAccessMemory) return false;
        break;
      case 'write':
      case 'modify':
        if (!permissions.canModifyMemory) return false;
        break;
      case 'delete':
        if (!permissions.canDeleteData) return false;
        break;
      case 'export':
        if (!permissions.canExportData) return false;
        break;
      case 'admin':
        // Only allow admin actions for specific resources
        return false;
    }
    
    // Check resource-specific permissions
    if (memoryIsolation.readOnlyCollections.includes(resource) && 
        ['write', 'modify', 'delete'].includes(action)) {
      return false;
    }
    
    if (!memoryIsolation.isolatedCollections.some(col => resource.startsWith(col)) &&
        !memoryIsolation.sharedCollections.includes(resource)) {
      return false;
    }
    
    return true;
  }

  private logAccess(
    sessionId: string,
    action: string,
    resource: string,
    success: boolean,
    metadata?: Record<string, any>
  ): void {
    const session = this.sessions.get(sessionId);
    if (!session) return;
    
    const logEntry: AccessLogEntry = {
      timestamp: Date.now(),
      action,
      resource,
      success,
      metadata
    };
    
    session.accessLog.push(logEntry);
    
    // Also add to user's permanent access log
    const userLogs = this.accessLogs.get(session.userId) || [];
    userLogs.push(logEntry);
    
    // Keep only last 1000 entries
    if (userLogs.length > 1000) {
      userLogs.splice(0, userLogs.length - 1000);
    }
    
    this.accessLogs.set(session.userId, userLogs);
  }

  private matchesFilters(item: any, filters: Record<string, any>): boolean {
    for (const [key, value] of Object.entries(filters)) {
      if (item.metadata[key] !== value) {
        return false;
      }
    }
    return true;
  }

  private async encryptData(userId: string, data: any): Promise<string> {
    // Simple encryption simulation (in production, use proper encryption)
    const key = this.getOrCreateEncryptionKey(userId);
    const dataString = JSON.stringify(data);
    return btoa(dataString + key); // Very simple "encryption"
  }

  private async decryptData(userId: string, encryptedData: string): Promise<any> {
    // Simple decryption simulation
    const key = this.getOrCreateEncryptionKey(userId);
    try {
      const decrypted = atob(encryptedData);
      const dataString = decrypted.replace(key, '');
      return JSON.parse(dataString);
    } catch (error) {
      console.error('Decryption failed:', error);
      return null;
    }
  }

  private getOrCreateEncryptionKey(userId: string): string {
    let key = this.encryptionKeys.get(userId);
    if (!key) {
      key = btoa(Math.random().toString(36).substring(2, 15));
      this.encryptionKeys.set(userId, key);
    }
    return key;
  }

  /**
   * Clean up expired sessions and data
   */
  performMaintenance(): void {
    const now = Date.now();
    
    // Clean up expired sessions
    for (const [sessionId, session] of this.sessions.entries()) {
      if (now > session.expiresAt) {
        this.sessions.delete(sessionId);
      }
    }
    
    // Clean up expired data based on retention policies
    for (const [userId, permissions] of this.userPermissions.entries()) {
      const userData = this.isolatedData.get(userId);
      if (!userData) continue;
      
      const maxAge = permissions.memoryRetentionDays * 24 * 60 * 60 * 1000;
      
      for (const [key, item] of userData.entries()) {
        const age = now - item.metadata.storedAt;
        if (age > maxAge) {
          userData.delete(key);
        }
      }
    }
    
    console.log('Access control maintenance completed');
  }

  /**
   * Get system status
   */
  getSystemStatus() {
    return {
      activeSessions: this.sessions.size,
      registeredUsers: this.userPermissions.size,
      totalDataItems: Array.from(this.isolatedData.values()).reduce(
        (sum, userData) => sum + userData.size, 0
      ),
      pendingExports: Array.from(this.exportRequests.values()).filter(
        req => req.status === 'pending'
      ).length
    };
  }
}

export const accessControlSystem = new AccessControlSystem();

// Schedule maintenance every hour
setInterval(() => {
  accessControlSystem.performMaintenance();
}, 60 * 60 * 1000);
