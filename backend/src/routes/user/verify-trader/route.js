import { verifyUserToken } from '../../../lib/auth.js';
import db from '../../../config/db.js';
import { uploadToCloudinary } from '../../../lib/cloudinary.js';
import Busboy from 'busboy';

export async function POST(req, res) {
  const params = req.params || {};
  try {
    const token = req.cookies['user-token'];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    const decoded = await verifyUserToken(token);
    if (!decoded) return res.status(401).json({ error: 'Unauthorized' });

    return new Promise((resolve) => {
      const busboy = Busboy({ headers: req.headers });
      const fields = {};
      let fileBuffer = null;
      let fileName = '';

      busboy.on('field', (fieldname, value) => {
        fields[fieldname] = value;
      });

      busboy.on('file', (fieldname, file, info) => {
        if (fieldname !== 'proof') {
          file.resume();
          return;
        }

        fileName = info.filename;
        const chunks = [];
        file.on('data', (chunk) => chunks.push(chunk));
        file.on('end', () => {
          fileBuffer = Buffer.concat(chunks);
        });
      });

      busboy.on('finish', async () => {
        try {
          if (!fileBuffer) {
            return resolve(res.status(400).json({ error: 'Proof document is required' }));
          }

          const { state, district } = fields;
          if (!state || !district) {
            return resolve(res.status(400).json({ error: 'State and district are required' }));
          }

          const uploadResult = await uploadToCloudinary(fileBuffer, 'atms/proofs', fileName);
          await db.user.update({
            where: { id: decoded.id },
            data: {
              state,
              district,
              verificationProofUrl: uploadResult.secure_url,
              verificationStatus: 'PENDING',
              rejectionReason: null,
            },
          });

          return resolve(res.status(200).json({ message: 'Verification application submitted successfully' }));
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
