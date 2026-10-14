import multer from "multer"
import path from "path"


const storage = multer.diskStorage({
  destination: "uploads/", // stating this is where teh uploaded files are gonna stay
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + Math.round(Math.random() * 1e9) + path.extname(file.originalname) 
    cb(null, uniqueName)
  }
}) // cb takes up two arguments the first one is null meaing nothing, the second one is the file name we had set
// we set the file name as a concatenation of "timestamp", "randomNumber", "path's extension". So that when two people uplad a file with the same name it doesnt get overwritten by each other.

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    const err = new Error("Only image files are allowed");
    err.statusCode = 400;
    cb(err, false);
  }
}; // this is a gatekeep type which checks the mime type of the file and and only allows images 

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB
  }
}) // this is the final upload middleware that we are gonna use in our routes
  
export default upload