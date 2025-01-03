import * as multer from 'multer';

export const multerConfig = {
  storage: multer.memoryStorage(
    
  ),
  limits: {
    fileSize: 1024 * 1024 * 5, // 5MB file size limit
  },
  fileFilter: (req, file, cb) => {
    // Only allow certain file types
    if (!file.originalname.match(/\.(jpg|jpeg|png|pdf)$/)) {
      return cb(new Error('Only image and PDF files are allowed'));
    }
    cb(null, true);
  },
};

