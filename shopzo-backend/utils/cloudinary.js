import cloudinary from "../config/cloudinary.js";

/**
 * Upload a single image to Cloudinary (expects multer memory storage – file.buffer).
 */
const uploadImage = async (file) => {
  const options = { folder: "shopzo/products" };
  const result = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (err, res) => {
      if (err) return reject(err);
      resolve(res);
    });
    stream.end(file.buffer);
  });
  return { url: result.secure_url, public_id: result.public_id };
};

/**
 * Upload multiple images
 */
const uploadImages = async (files) => {
  if (!files) return [];

  if (!Array.isArray(files)) files = [files];

  return Promise.all(files.map(uploadImage));
};

export { uploadImage, uploadImages };