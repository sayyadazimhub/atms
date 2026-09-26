import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Uploads a file buffer to Cloudinary
 * @param {Buffer} fileBuffer - The file buffer to upload
 * @param {string} folder - The folder in Cloudinary to upload to
 * @param {string} originalFilename - The original filename
 * @returns {Promise<Object>} - The Cloudinary upload result
 */
export const uploadToCloudinary = (fileBuffer, folder, originalFilename) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        resource_type: 'auto',
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    uploadStream.end(fileBuffer);
  });
};

/**
 * Deletes a file from Cloudinary given its secure URL
 * @param {string} url - The Cloudinary URL of the file to delete
 * @returns {Promise<any>}
 */
export const deleteFromCloudinary = async (url) => {
  if (!url || typeof url !== 'string' || !url.includes('cloudinary.com')) return;
  
  try {
    const parts = url.split('/');
    const uploadIndex = parts.findIndex(p => p === 'upload');
    if (uploadIndex === -1) return;
    
    const isRaw = parts.includes('raw');
    
    let publicIdStartIndex = uploadIndex + 1;
    // Skip the version string (e.g. 'v1234567890')
    if (parts[publicIdStartIndex].startsWith('v') && !isNaN(parts[publicIdStartIndex].substring(1))) {
       publicIdStartIndex++;
    }
    
    const publicIdWithExt = parts.slice(publicIdStartIndex).join('/');
    
    // Cloudinary requires public_id WITHOUT extension for images, but WITH extension for raw files
    let publicId = publicIdWithExt;
    if (!isRaw) {
       const lastDotIndex = publicIdWithExt.lastIndexOf('.');
       if (lastDotIndex !== -1) {
         publicId = publicIdWithExt.substring(0, lastDotIndex);
       }
    }
    
    const resourceType = isRaw ? 'raw' : 'image';
    return await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (error) {
    console.error('Cloudinary delete error:', error);
  }
};
