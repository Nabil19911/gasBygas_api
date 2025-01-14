import multer from "multer";
import Path from "path";
import fs from "fs";

const filePath = "upload/brFiles";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      fs.mkdirSync(filePath, { recursive: true });
      console.log("upload/brFiles directories created successfully!");
      cb(null, filePath);
    } catch (err) {
      console.error("Error creating directories:", err);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileName = `brFile-${uniqueSuffix}${Path.extname(file.originalname)}`;
    cb(null, fileName);
  },
});

export const upload = multer({ storage });
