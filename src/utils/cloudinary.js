// Import the Cloudinary library's v2 client
import cloudinaryPackage from "cloudinary";
import fs from "fs";

const { v2: cloudinary } = cloudinaryPackage;

// Return "https" URLs by setting secure: true
cloudinary.config({
  secure: true,
});

// Log the configuration
// console.log(cloudinary.config());

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    console.log("File is uploaded on cloudinary", response.url);
    return response;
  } catch (error) {
    fs.unlink(localFilePath); // remove the locally saved temproary file as the upload operation got failed
    return null;
  }
};

export { uploadOnCloudinary };
