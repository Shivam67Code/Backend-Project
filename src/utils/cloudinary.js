import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});


const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null
    // upload the file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: 'auto'
    })
    // file has been uploaded successfully
    // console.log("🌨️ File is uploaded on Cloudinary Successfully 🌩️ ", response.url)
    console.log("File uploaded to cloudinary succcessfully ! ");
    fs.unlinkSync(localFilePath)
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath) // just removes the lcoally saved temp file as the upload operatoin got failed.
    return null;
  }
}

const deleteFromCloudinary = async (imageURL) => {
  try {
    if (!imageURL) return null;
    const publicId = imageURL.split("/").pop().split('.')[0]
    //https://res.cloudinary.com/dmg3y2fmq/image/upload/v1758629205/fa2rtntoyrskfq2bq3y3.png IT RETURNS -> fa2rtntoyrskfq2bq3y3
    console.log("The public Id from cloudinary URL is : ", publicId)

    const result = await cloudinary.uploader.destroy(publicId);
    console.log("File deleted from Cloudinary: ", result);
    return result;
  } catch (error) {
    console.log("Error deleting file from Cloudinary:", error);
    return null;
  }

}

export { uploadOnCloudinary, deleteFromCloudinary }