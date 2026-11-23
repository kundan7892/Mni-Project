import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import express from 'express';
import multer from 'multer';
import { protect } from '../middleware/authMiddleware.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const UPLOAD_DIR = path.resolve(__dirname, '..', 'uploads');
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const ALLOWED_TYPES = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
  'image/avif': '.avif',
  'application/pdf': '.pdf'
};

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const upload = multer({
  storage: multer.diskStorage({
    destination: UPLOAD_DIR,
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${ALLOWED_TYPES[file.mimetype]}`);
    }
  }),
  limits: { fileSize: MAX_FILE_SIZE, files: 8 },
  fileFilter: (req, file, cb) => {
    if (ALLOWED_TYPES[file.mimetype]) return cb(null, true);
    cb(new Error('Only JPG, PNG, WEBP, GIF, AVIF images or PDF documents are allowed.'));
  }
});

const router = express.Router();

/**
 * @route   POST /api/uploads
 * @desc    Upload up to 8 files (field name "files"). Returns absolute URLs.
 * @access  Private
 */
router.post('/', protect, (req, res) => {
  upload.array('files', 8)(req, res, (err) => {
    if (err) {
      const message =
        err.code === 'LIMIT_FILE_SIZE' ? 'Each file must be 5 MB or smaller.' : err.message;
      return sendError(res, { statusCode: 400, message });
    }
    if (!req.files?.length) {
      return sendError(res, { statusCode: 400, message: 'No files were uploaded.' });
    }

    const origin = `${req.protocol}://${req.get('host')}`;
    const files = req.files.map((f) => ({
      name: f.originalname,
      size: f.size,
      mimeType: f.mimetype,
      url: `${origin}/uploads/${f.filename}`
    }));

    return sendSuccess(res, { statusCode: 201, message: 'Upload complete.', data: { files } });
  });
});

export default router;
