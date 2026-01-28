const fs = require('fs').promises;
const path = require('path');
const sharp = require('sharp');

class StorageService {
  constructor() {
    this.uploadDir = path.join(__dirname, '../../uploads');
    this.ensureUploadDirExists();
  }

  async ensureUploadDirExists() {
    try {
      await fs.access(this.uploadDir);
    } catch (error) {
      await fs.mkdir(this.uploadDir, { recursive: true });
    }
  }

  // Save file
  async saveFile(file, folder = '') {
    try {
      const uploadPath = path.join(this.uploadDir, folder);
      await fs.mkdir(uploadPath, { recursive: true });

      const filename = `${Date.now()}-${file.originalname}`;
      const filepath = path.join(uploadPath, filename);

      await fs.writeFile(filepath, file.buffer);

      return {
        success: true,
        filename,
        path: filepath,
        url: `/uploads/${folder}/${filename}`
      };
    } catch (error) {
      console.error('File save failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Save and optimize image
  async saveImage(file, folder = 'images', sizes = []) {
    try {
      const uploadPath = path.join(this.uploadDir, folder);
      await fs.mkdir(uploadPath, { recursive: true });

      const filename = `${Date.now()}-${path.parse(file.originalname).name}.webp`;
      const filepath = path.join(uploadPath, filename);

      // Optimize and convert to WebP
      await sharp(file.buffer)
        .webp({ quality: 85 })
        .toFile(filepath);

      const result = {
        success: true,
        filename,
        path: filepath,
        url: `/uploads/${folder}/${filename}`,
        thumbnails: {}
      };

      // Generate thumbnails if sizes are specified
      for (const size of sizes) {
        const thumbFilename = `${Date.now()}-${size.name}-${path.parse(file.originalname).name}.webp`;
        const thumbPath = path.join(uploadPath, thumbFilename);

        await sharp(file.buffer)
          .resize(size.width, size.height, { fit: 'cover' })
          .webp({ quality: 80 })
          .toFile(thumbPath);

        result.thumbnails[size.name] = `/uploads/${folder}/${thumbFilename}`;
      }

      return result;
    } catch (error) {
      console.error('Image save failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Delete file
  async deleteFile(filepath) {
    try {
      const fullPath = path.join(this.uploadDir, filepath);
      await fs.unlink(fullPath);
      return { success: true };
    } catch (error) {
      console.error('File deletion failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Get file info
  async getFileInfo(filepath) {
    try {
      const fullPath = path.join(this.uploadDir, filepath);
      const stats = await fs.stat(fullPath);
      
      return {
        success: true,
        size: stats.size,
        createdAt: stats.birthtime,
        modifiedAt: stats.mtime
      };
    } catch (error) {
      console.error('Get file info failed:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = new StorageService();