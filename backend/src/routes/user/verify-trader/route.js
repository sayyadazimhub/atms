import { Router } from 'express';
import { authDal } from '../../../dal/userDal/authDal.js';
import { uploadToCloudinary } from '../../../lib/cloudinary.js';
import Busboy from 'busboy';
import { parseRequest } from '../../../middleware/validateRequest.js';
import { verificationUploadFieldsSchema } from '../../../validations/resources.js';

const router = Router({ mergeParams: true });

async function handlePost(req, res) {
  try {
    return new Promise((resolve) => {
      const busboy = Busboy({
        headers: req.headers,
        limits: { fileSize: 5 * 1024 * 1024, files: 1, fields: 5, fieldSize: 10 * 1024 },
      });
      const fields = {};
      let fileBuffer = null;
      let fileName = '';
      let fileTooLarge = false;
      let tooManyFields = false;

      busboy.on('field', (fieldname, value) => {
        fields[fieldname] = value;
      });
      busboy.on('fieldsLimit', () => {
        tooManyFields = true;
      });

      busboy.on('file', (fieldname, file, info) => {
        if (fieldname !== 'proof') {
          file.resume();
          return;
        }

        fileName = info.filename;
        const chunks = [];
        file.on('data', (chunk) => {
          if (!fileTooLarge) chunks.push(chunk);
        });
        file.on('limit', () => {
          fileTooLarge = true;
        });
        file.on('end', () => {
          if (!fileTooLarge) fileBuffer = Buffer.concat(chunks);
        });
      });

      busboy.on('finish', async () => {
        try {
          if (fileTooLarge) {
            return resolve(
              res.status(413).json({ error: 'Proof document must be 5 MB or smaller' }),
            );
          }
          if (tooManyFields) {
            return resolve(res.status(400).json({ error: 'Too many form fields' }));
          }
          if (!fileBuffer) {
            return resolve(res.status(400).json({ error: 'Proof document is required' }));
          }

          const parsedFields = parseRequest(verificationUploadFieldsSchema, fields);
          if (!parsedFields.success) {
            const errors = Object.fromEntries(
              parsedFields.error.issues.map((issue) => [
                issue.path.join('.') || 'body',
                issue.message,
              ]),
            );
            return resolve(res.status(400).json({ errors }));
          }

          const { state, district } = parsedFields.data;

          const uploadResult = await uploadToCloudinary(fileBuffer, 'atms/proofs', fileName);
          await authDal.update(req.auth.id, {
            state,
            district,
            verificationProofUrl: uploadResult.secure_url,
            verificationStatus: 'PENDING',
            rejectionReason: null,
          });

          return resolve(
            res.status(200).json({ message: 'Verification application submitted successfully' }),
          );
        } catch (error) {
          console.error('Verify trader error:', error);
          return resolve(res.status(500).json({ error: 'Failed to submit verification' }));
        }
      });

      busboy.on('error', (error) => {
        console.error('Verify trader form parsing error:', error);
        resolve(res.status(400).json({ error: 'Failed to parse form data' }));
      });

      req.pipe(busboy);
    });
  } catch (error) {
    console.error('Verify trader error:', error);
    return res.status(500).json({ error: 'Failed to submit verification' });
  }
}

router.post('/', handlePost);

export default router;
