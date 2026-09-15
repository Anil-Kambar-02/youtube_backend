import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

const uploadOnCloudinary = async (localFilePath) => {
  if (!localFilePath) return null;

  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    // Remove the temporary file locally after successful upload
    if (fs.existsSync(localFilePath)) {
      await fs.promises.unlink(localFilePath);
    }

    return response;
  } catch (error) {
    console.error("Cloudinary upload failed:", error.message);

    // Ensure temporary file is safely cleaned up on failure
    if (fs.existsSync(localFilePath)) {
      await fs.promises.unlink(localFilePath).catch(() => {});
    }

    return null;
  }
};

const extractPublicId = (cloudinaryUrl) => {
  if (!cloudinaryUrl) return null;

  const uploadPath = cloudinaryUrl.split("/upload/")[1];
  if (!uploadPath) return null;

  const pathWithoutVersion = uploadPath.replace(/^v\d+\//, "");
  return pathWithoutVersion.replace(/\.[^/.]+$/, "");
};

const deleteFromCloudinary = async (cloudinaryUrl) => {
  const publicId = extractPublicId(cloudinaryUrl);
  if (!publicId) return false;

  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });

    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: "image",
      invalidate: true,
    });

    return result.result === "ok" || result.result === "not found";
  } catch (error) {
    console.error("Cloudinary delete failed:", error.message);
    return false;
  }
};

export { uploadOnCloudinary, deleteFromCloudinary };
