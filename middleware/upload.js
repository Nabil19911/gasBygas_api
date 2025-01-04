import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/brFiles");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileName = `brFile-${uniqueSuffix}${path.extname(file.originalname)}`;
    cb(null, fileName);
  },
});

export const upload = multer({ storage });
