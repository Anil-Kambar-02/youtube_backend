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

export { uploadOnCloudinary };
