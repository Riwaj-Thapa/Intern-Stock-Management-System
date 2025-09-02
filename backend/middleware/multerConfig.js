import multer from "multer";

// Use memory storage instead of disk
const storage = multer.memoryStorage();

// Filter files to accept only images
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const extName = allowedTypes.test(file.originalname.toLowerCase());
  const mimeType = allowedTypes.test(file.mimetype);

  if (extName && mimeType) {
    cb(null, true);
  } else {
    cb(new Error("Only images (jpeg, jpg, png) are allowed!"));
  }
};

// Create Multer instance
const upload = multer({
  storage, // memory storage
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter,
});

export { upload };
