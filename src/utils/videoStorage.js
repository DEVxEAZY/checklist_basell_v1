// Video Storage Management System
// Handles temporary and permanent video storage for inspection checklists

class VideoStorageManager {
  constructor() {
    this.tempStorage = new Map(); // Temporary video storage
    this.permanentStorage = new Map(); // Permanent video storage
    this.storageKey = 'inspection_videos_temp';
    this.permanentKey = 'inspection_videos_permanent';
    
    // Initialize from localStorage if available
    this.loadFromLocalStorage();
  }

  // ==================== TEMPORARY STORAGE ====================
  
  /**
   * Store video temporarily during recording/inspection
   * @param {string} inspectionId - Unique inspection identifier
   * @param {Blob} videoBlob - Video blob data
   * @param {Object} metadata - Additional video metadata
   */
  storeTempVideo(inspectionId, videoBlob, metadata = {}) {
    console.log('📹 Storing temporary video for inspection:', inspectionId);
    
    const tempVideo = {
      id: inspectionId,
      blob: videoBlob,
      size: videoBlob.size,
      type: videoBlob.type,
      recordedAt: new Date().toISOString(),
      status: 'temporary',
      metadata: {
        ...metadata,
        tempStoredAt: new Date().toISOString()
      }
    };

    // Store in memory
    this.tempStorage.set(inspectionId, tempVideo);
    
    // Persist to localStorage for browser refresh recovery
    this.saveTempToLocalStorage();
    
    console.log('✅ Temporary video stored:', {
      inspectionId,
      size: videoBlob.size,
      type: videoBlob.type
    });

    return tempVideo;
  }

  /**
   * Get temporary video by inspection ID
   * @param {string} inspectionId - Inspection identifier
   * @returns {Object|null} Temporary video data
   */
  getTempVideo(inspectionId) {
    return this.tempStorage.get(inspectionId) || null;
  }

  /**
   * Get all temporary videos
   * @returns {Array} Array of temporary videos
   */
  getAllTempVideos() {
    return Array.from(this.tempStorage.values());
  }

  /**
   * Check if inspection has temporary video
   * @param {string} inspectionId - Inspection identifier
   * @returns {boolean} True if has temporary video
   */
  hasTempVideo(inspectionId) {
    return this.tempStorage.has(inspectionId);
  }

  // ==================== PERMANENT STORAGE ====================

  /**
   * Move video from temporary to permanent storage
   * @param {string} inspectionId - Inspection identifier
   * @param {string} checklistId - Parent checklist identifier
   * @param {Object} additionalData - Additional permanent storage data
   */
  async makePermanent(inspectionId, checklistId, additionalData = {}) {
    console.log('💾 Making video permanent:', { inspectionId, checklistId });
    
    const tempVideo = this.tempStorage.get(inspectionId);
    if (!tempVideo) {
      console.warn('⚠️ No temporary video found for inspection:', inspectionId);
      return null;
    }

    const permanentVideo = {
      ...tempVideo,
      checklistId,
      status: 'permanent',
      permanentStoredAt: new Date().toISOString(),
      ...additionalData
    };

    // Store in permanent storage
    this.permanentStorage.set(inspectionId, permanentVideo);
    
    // Remove from temporary storage
    this.tempStorage.delete(inspectionId);
    
    // Update localStorage
    this.saveTempToLocalStorage();
    this.savePermanentToLocalStorage();
    
    console.log('✅ Video made permanent:', {
      inspectionId,
      checklistId,
      size: permanentVideo.size
    });

    return permanentVideo;
  }

  /**
   * Save all temporary videos as permanent for a checklist
   * @param {string} checklistId - Checklist identifier
   * @param {Array} inspectionIds - Array of inspection IDs to make permanent
   */
  async saveChecklistVideos(checklistId, inspectionIds = []) {
    console.log('💾 Saving all checklist videos:', { checklistId, inspectionIds });
    
    const savedVideos = [];
    
    // If no specific inspections provided, save all temporary videos
    const idsToSave = inspectionIds.length > 0 ? 
      inspectionIds : 
      Array.from(this.tempStorage.keys());

    for (const inspectionId of idsToSave) {
      const permanentVideo = await this.makePermanent(inspectionId, checklistId);
      if (permanentVideo) {
        savedVideos.push(permanentVideo);
      }
    }

    console.log('✅ Checklist videos saved:', savedVideos.length, 'videos');
    return savedVideos;
  }

  /**
   * Get permanent video by inspection ID
   * @param {string} inspectionId - Inspection identifier
   * @returns {Object|null} Permanent video data
   */
  getPermanentVideo(inspectionId) {
    return this.permanentStorage.get(inspectionId) || null;
  }

  /**
   * Get all permanent videos for a checklist
   * @param {string} checklistId - Checklist identifier
   * @returns {Array} Array of permanent videos
   */
  getChecklistVideos(checklistId) {
    return Array.from(this.permanentStorage.values())
      .filter(video => video.checklistId === checklistId);
  }

  // ==================== CLEANUP OPERATIONS ====================

  /**
   * Clean up temporary videos (user cancelled or didn't save)
   * @param {Array} inspectionIds - Specific inspections to clean, or all if empty
   */
  cleanupTempVideos(inspectionIds = []) {
    console.log('🧹 Cleaning up temporary videos:', inspectionIds.length || 'all');
    
    let cleanedCount = 0;
    
    if (inspectionIds.length > 0) {
      // Clean specific inspections
      inspectionIds.forEach(id => {
        if (this.tempStorage.delete(id)) {
          cleanedCount++;
        }
      });
    } else {
      // Clean all temporary videos
      cleanedCount = this.tempStorage.size;
      this.tempStorage.clear();
    }

    // Update localStorage
    this.saveTempToLocalStorage();
    
    console.log('✅ Cleaned up', cleanedCount, 'temporary videos');
    return cleanedCount;
  }

  /**
   * Clean up old temporary videos (older than specified hours)
   * @param {number} hoursOld - Hours threshold for cleanup
   */
  cleanupOldTempVideos(hoursOld = 24) {
    console.log('🧹 Cleaning up old temporary videos (older than', hoursOld, 'hours)');
    
    const cutoffTime = new Date(Date.now() - (hoursOld * 60 * 60 * 1000));
    const toDelete = [];
    
    this.tempStorage.forEach((video, id) => {
      const recordedAt = new Date(video.recordedAt);
      if (recordedAt < cutoffTime) {
        toDelete.push(id);
      }
    });

    return this.cleanupTempVideos(toDelete);
  }

  /**
   * Get storage statistics
   * @returns {Object} Storage statistics
   */
  getStorageStats() {
    const tempVideos = this.getAllTempVideos();
    const permanentVideos = Array.from(this.permanentStorage.values());
    
    const tempSize = tempVideos.reduce((sum, video) => sum + video.size, 0);
    const permanentSize = permanentVideos.reduce((sum, video) => sum + video.size, 0);
    
    return {
      temporary: {
        count: tempVideos.length,
        totalSize: tempSize,
        totalSizeMB: (tempSize / 1024 / 1024).toFixed(2)
      },
      permanent: {
        count: permanentVideos.length,
        totalSize: permanentSize,
        totalSizeMB: (permanentSize / 1024 / 1024).toFixed(2)
      },
      total: {
        count: tempVideos.length + permanentVideos.length,
        totalSize: tempSize + permanentSize,
        totalSizeMB: ((tempSize + permanentSize) / 1024 / 1024).toFixed(2)
      }
    };
  }

  // ==================== PERSISTENCE METHODS ====================

  /**
   * Save temporary videos to localStorage
   */
  saveTempToLocalStorage() {
    try {
      const tempData = {};
      this.tempStorage.forEach((video, id) => {
        // Store metadata only, not the blob (too large for localStorage)
        tempData[id] = {
          ...video,
          blob: null, // Remove blob for localStorage
          hasBlob: true // Flag to indicate blob exists in memory
        };
      });
      
      localStorage.setItem(this.storageKey, JSON.stringify(tempData));
    } catch (error) {
      console.error('❌ Error saving temp videos to localStorage:', error);
    }
  }

  /**
   * Save permanent videos to localStorage
   */
  savePermanentToLocalStorage() {
    try {
      const permanentData = {};
      this.permanentStorage.forEach((video, id) => {
        // Store metadata only for localStorage
        permanentData[id] = {
          ...video,
          blob: null, // Remove blob for localStorage
          hasBlob: true
        };
      });
      
      localStorage.setItem(this.permanentKey, JSON.stringify(permanentData));
    } catch (error) {
      console.error('❌ Error saving permanent videos to localStorage:', error);
    }
  }

  /**
   * Load videos from localStorage (metadata only)
   */
  loadFromLocalStorage() {
    try {
      // Load temporary video metadata
      const tempData = localStorage.getItem(this.storageKey);
      if (tempData) {
        const parsed = JSON.parse(tempData);
        // Note: Blobs are not restored from localStorage
        // This is just for metadata recovery after page refresh
        console.log('📱 Loaded temporary video metadata from localStorage:', Object.keys(parsed).length);
      }

      // Load permanent video metadata
      const permanentData = localStorage.getItem(this.permanentKey);
      if (permanentData) {
        const parsed = JSON.parse(permanentData);
        console.log('📱 Loaded permanent video metadata from localStorage:', Object.keys(parsed).length);
      }
    } catch (error) {
      console.error('❌ Error loading videos from localStorage:', error);
    }
  }

  // ==================== UTILITY METHODS ====================

  /**
   * Create video URL for playback
   * @param {string} inspectionId - Inspection identifier
   * @param {boolean} preferPermanent - Prefer permanent over temporary
   * @returns {string|null} Video URL or null
   */
  createVideoURL(inspectionId, preferPermanent = true) {
    let video = null;
    
    if (preferPermanent) {
      video = this.getPermanentVideo(inspectionId) || this.getTempVideo(inspectionId);
    } else {
      video = this.getTempVideo(inspectionId) || this.getPermanentVideo(inspectionId);
    }

    if (video && video.blob) {
      return URL.createObjectURL(video.blob);
    }

    return null;
  }

  /**
   * Download video file
   * @param {string} inspectionId - Inspection identifier
   * @param {string} filename - Custom filename
   */
  downloadVideo(inspectionId, filename = null) {
    const video = this.getPermanentVideo(inspectionId) || this.getTempVideo(inspectionId);
    
    if (!video || !video.blob) {
      console.warn('⚠️ No video found for download:', inspectionId);
      return false;
    }

    const url = URL.createObjectURL(video.blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || `inspection_${inspectionId}_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.webm`;
    link.click();
    URL.revokeObjectURL(url);
    
    console.log('📥 Video download initiated:', inspectionId);
    return true;
  }
}

// Create singleton instance
export const videoStorageManager = new VideoStorageManager();

// Export class for testing or multiple instances
export { VideoStorageManager };

// Utility functions for easy access
export const storeTempVideo = (inspectionId, videoBlob, metadata) => 
  videoStorageManager.storeTempVideo(inspectionId, videoBlob, metadata);

export const getTempVideo = (inspectionId) => 
  videoStorageManager.getTempVideo(inspectionId);

export const makePermanent = (inspectionId, checklistId, additionalData) => 
  videoStorageManager.makePermanent(inspectionId, checklistId, additionalData);

export const saveChecklistVideos = (checklistId, inspectionIds) => 
  videoStorageManager.saveChecklistVideos(checklistId, inspectionIds);

export const cleanupTempVideos = (inspectionIds) => 
  videoStorageManager.cleanupTempVideos(inspectionIds);

export const getStorageStats = () => 
  videoStorageManager.getStorageStats();

export const createVideoURL = (inspectionId, preferPermanent) => 
  videoStorageManager.createVideoURL(inspectionId, preferPermanent);

export const downloadVideo = (inspectionId, filename) => 
  videoStorageManager.downloadVideo(inspectionId, filename);