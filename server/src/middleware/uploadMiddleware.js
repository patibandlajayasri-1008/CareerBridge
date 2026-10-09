import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { sendError } from '../utils/responseFormatter.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads/resumes directory exists
const UPLOAD_DIR = path.resolve(__dirname, '../../uploads/resumes');
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Storage configuration with sanitized naming
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const userId = req.user?._id?.toString() || 'student';
    const timestamp = Date.now();
    const randomSuffix = Math.round(Math.random() * 1e6);
    const sanitizedName = `resume-${userId}-${timestamp}-${randomSuffix}.pdf`;
    cb(null, sanitizedName);
  },
});

// Strict PDF-only validation filter
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const isPdfMime = file.mimetype === 'application/pdf';
  const isPdfExt = ext === '.pdf';

  if (isPdfMime && isPdfExt) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file format. Only PDF documents (.pdf) are permitted.'), false);
  }
};

// 5 MB maximum file size limit
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 1,
  },
});

/**
 * Express middleware wrapper to catch Multer errors and format standard responses
 */
export const handleResumeUpload = (req, res, next) => {
  const singleUpload = upload.single('resume');

  singleUpload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return sendError(res, 400, 'File size exceeds the 5 MB limit. Please upload a smaller PDF file.');
      }
      return sendError(res, 400, `File upload error: ${err.message}`);
    } else if (err) {
      return sendError(res, 400, err.message || 'Error occurred while uploading resume file.');
    }

    if (!req.file) {
      return sendError(res, 400, 'Please select a valid PDF resume file to upload.');
    }

    next();
  });
};

export { UPLOAD_DIR };
