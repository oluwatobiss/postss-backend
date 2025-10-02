import path from "path";
import { v2 as cloudinary } from "cloudinary";
import { rm } from "fs/promises";

export async function uploadMediaToCloudinary(file: Express.Multer.File) {
  try {
    let media = { destination: "", filename: "", originalname: "" };
    if (file) {
      const { destination, filename, originalname } = file;
      media = { destination, filename, originalname };
    }
    const mediaName = path.parse(media.originalname).name.trim();
    const filePath = `${media.destination}/${media.filename}`;
    const cloudinaryOptions = {
      folder: media.destination,
      public_id: mediaName,
      unique_filename: false,
      overwrite: true,
      resource_type: "auto" as "auto",
    };
    const uploadFileData =
      file && (await cloudinary.uploader.upload(filePath, cloudinaryOptions));
    await rm(media.destination, { recursive: true, force: true });
    return {
      destination: media.destination,
      name: mediaName,
      path: uploadFileData.secure_url,
    };
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}
