import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";


//cloudinary config
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "safai-mitra",
    allowed_formats: ["jpg", "png", "jpeg"],
    transformation: [{ width: 1000, height: 1000, crop: "limit" }],
  },
});

//file filter
const fileFilter = (req,file, cb)=>{
  if (file.mimetype.startsWith("image/")){
    cb(null, true);
  }else{
    cb(new Error("Only image files are allowed"), false);
  }
}

// multerupload.... 
const upload = multer({
  storage,
  limits:{
    fileSize: 5 *1024 *1024,    //5mb
  },
  fileFilter
});

export default upload;