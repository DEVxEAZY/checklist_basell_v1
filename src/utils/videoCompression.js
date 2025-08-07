// Video Compression Utility
// Compresses videos before uploading to database to improve performance

class VideoCompressor {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
  }

  /**
   * Compress video blob before upload
   * @param {Blob} videoBlob - Original video blob
   * @param {Object} options - Compression options
   * @returns {Promise<Blob>} Compressed video blob
   */
  async compressVideo(videoBlob, options = {}) {
    const {
      maxWidth = 640,
      maxHeight = 480,
      quality = 0.7,
      frameRate = 15,
      bitRate = 500000 // 500kbps
    } = options;

    try {
      console.log('🎬 Starting video compression...');
      console.log('Original size:', (videoBlob.size / 1024 / 1024).toFixed(2), 'MB');

      // Create video element to read the original video
      const video = document.createElement('video');
      const videoUrl = URL.createObjectURL(videoBlob);
      
      return new Promise((resolve, reject) => {
        video.onloadedmetadata = async () => {
          try {
            // Calculate new dimensions maintaining aspect ratio
            const { width: newWidth, height: newHeight } = this.calculateDimensions(
              video.videoWidth, 
              video.videoHeight, 
              maxWidth, 
              maxHeight
            );

            console.log(`📐 Resizing from ${video.videoWidth}x${video.videoHeight} to ${newWidth}x${newHeight}`);

            // Set canvas dimensions
            this.canvas.width = newWidth;
            this.canvas.height = newHeight;

            // Create MediaRecorder for compression
            const stream = this.canvas.captureStream(frameRate);
            const mediaRecorder = new MediaRecorder(stream, {
              mimeType: 'video/webm;codecs=vp9',
              videoBitsPerSecond: bitRate
            });

            const chunks = [];
            
            mediaRecorder.ondataavailable = (event) => {
              if (event.data.size > 0) {
                chunks.push(event.data);
              }
            };

            mediaRecorder.onstop = () => {
              const compressedBlob = new Blob(chunks, { type: 'video/webm' });
              const compressionRatio = ((videoBlob.size - compressedBlob.size) / videoBlob.size * 100).toFixed(1);
              
              console.log('✅ Video compression completed!');
              console.log('Compressed size:', (compressedBlob.size / 1024 / 1024).toFixed(2), 'MB');
              console.log('Compression ratio:', compressionRatio + '%');
              
              URL.revokeObjectURL(videoUrl);
              resolve(compressedBlob);
            };

            mediaRecorder.onerror = (error) => {
              console.error('❌ MediaRecorder error:', error);
              URL.revokeObjectURL(videoUrl);
              reject(error);
            };

            // Start recording
            mediaRecorder.start();

            // Play and draw video frames
            video.currentTime = 0;
            video.play();

            const drawFrame = () => {
              if (video.ended || video.paused) {
                mediaRecorder.stop();
                return;
              }

              // Draw current frame to canvas (resized)
              this.ctx.drawImage(video, 0, 0, newWidth, newHeight);
              
              // Continue to next frame
              requestAnimationFrame(drawFrame);
            };

            video.onplay = () => {
              drawFrame();
            };

          } catch (error) {
            console.error('❌ Error during compression:', error);
            URL.revokeObjectURL(videoUrl);
            reject(error);
          }
        };

        video.onerror = (error) => {
          console.error('❌ Video loading error:', error);
          URL.revokeObjectURL(videoUrl);
          reject(error);
        };

        video.src = videoUrl;
        video.load();
      });

    } catch (error) {
      console.error('❌ Video compression failed:', error);
      // Return original blob if compression fails
      return videoBlob;
    }
  }

  /**
   * Calculate new dimensions maintaining aspect ratio
   * @param {number} originalWidth 
   * @param {number} originalHeight 
   * @param {number} maxWidth 
   * @param {number} maxHeight 
   * @returns {Object} New dimensions
   */
  calculateDimensions(originalWidth, originalHeight, maxWidth, maxHeight) {
    let newWidth = originalWidth;
    let newHeight = originalHeight;

    // Scale down if necessary
    if (newWidth > maxWidth) {
      newHeight = (newHeight * maxWidth) / newWidth;
      newWidth = maxWidth;
    }

    if (newHeight > maxHeight) {
      newWidth = (newWidth * maxHeight) / newHeight;
      newHeight = maxHeight;
    }

    // Ensure even numbers for better encoding
    newWidth = Math.floor(newWidth / 2) * 2;
    newHeight = Math.floor(newHeight / 2) * 2;

    return { width: newWidth, height: newHeight };
  }

  /**
   * Quick compression for small videos
   * @param {Blob} videoBlob 
   * @returns {Promise<Blob>}
   */
  async quickCompress(videoBlob) {
    return this.compressVideo(videoBlob, {
      maxWidth: 480,
      maxHeight: 360,
      quality: 0.6,
      frameRate: 12,
      bitRate: 300000 // 300kbps
    });
  }

  /**
   * High quality compression for important videos
   * @param {Blob} videoBlob 
   * @returns {Promise<Blob>}
   */
  async highQualityCompress(videoBlob) {
    return this.compressVideo(videoBlob, {
      maxWidth: 720,
      maxHeight: 540,
      quality: 0.8,
      frameRate: 20,
      bitRate: 800000 // 800kbps
    });
  }

  /**
   * Get video information
   * @param {Blob} videoBlob 
   * @returns {Promise<Object>}
   */
  async getVideoInfo(videoBlob) {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      const videoUrl = URL.createObjectURL(videoBlob);

      video.onloadedmetadata = () => {
        const info = {
          width: video.videoWidth,
          height: video.videoHeight,
          duration: video.duration,
          size: videoBlob.size,
          sizeMB: (videoBlob.size / 1024 / 1024).toFixed(2),
          type: videoBlob.type
        };

        URL.revokeObjectURL(videoUrl);
        resolve(info);
      };

      video.onerror = (error) => {
        URL.revokeObjectURL(videoUrl);
        reject(error);
      };

      video.src = videoUrl;
    });
  }

  /**
   * Check if video needs compression
   * @param {Blob} videoBlob 
   * @param {number} maxSizeMB 
   * @returns {boolean}
   */
  needsCompression(videoBlob, maxSizeMB = 5) {
    const sizeMB = videoBlob.size / 1024 / 1024;
    return sizeMB > maxSizeMB;
  }
}

// Create singleton instance
export const videoCompressor = new VideoCompressor();

// Utility functions for easy access
export const compressVideo = (videoBlob, options) => 
  videoCompressor.compressVideo(videoBlob, options);

export const quickCompressVideo = (videoBlob) => 
  videoCompressor.quickCompress(videoBlob);

export const highQualityCompressVideo = (videoBlob) => 
  videoCompressor.highQualityCompress(videoBlob);

export const getVideoInfo = (videoBlob) => 
  videoCompressor.getVideoInfo(videoBlob);

export const needsVideoCompression = (videoBlob, maxSizeMB) => 
  videoCompressor.needsCompression(videoBlob, maxSizeMB);

export default videoCompressor;