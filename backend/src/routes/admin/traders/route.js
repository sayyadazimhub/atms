import { Router } from 'express';

import { verifyAdminToken } from '../../../lib/auth.js';
import { traderService } from '../../../services/adminService/traderService.js';
import { uploadToCloudinary } from '../../../lib/cloudinary.js';
import Busboy from 'busboy';
import { parseRequest, validateRequest } from '../../../middleware/validateRequest.js';
import { idQuerySchema, adminTraderQuerySchema } from '../../../validations/queries.js';
import {
  traderRegistrationFieldsSchema,
  traderUpdateSchema,
} from '../../../validations/resources.js';

const router = Router({ mergeParams: true });

function serializeTrader(trader) {
  return {
    id: trader.id,
    name: trader.name,
    email: trader.email,
    phone: trader.phone,
    is_active: trader.is_active,
    emailVerified: trader.emailVerified,
    verificationStatus: trader.verificationStatus,
    verificationProofUrl: trader.verificationProofUrl,
    state: trader.state,
    district: trader.district,
    rejectionReason: trader.rejectionReason,
    verifiedAt: trader.verifiedAt,
    createdAt: trader.createdAt,
  };
}

async function handleGet(req, res) {
  try {
    const token = req.cookies['auth-token'];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    const decoded = await verifyAdminToken(token);
    if (!decoded) return res.status(401).json({ error: 'Unauthorized' });

    const { search = '', page: pageParam, limit: limitParam } = req.query;
    const page = parseInt(pageParam, 10) || 1;
    const limit = parseInt(limitParam, 10) || 10;

    const data = await traderService.getTraders(search, page, limit);

    return res.status(200).json(data);
  } catch (error) {
    console.error('Admin traders API error:', error);
    return res.json({ error: 'Internal Server Error' });
  }
}

async function handlePost(req, res) {
  try {
    const token = req.cookies['auth-token'];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    const decoded = await verifyAdminToken(token);
    if (!decoded) return res.status(401).json({ error: 'Unauthorized' });

    return new Promise((resolve, reject) => {
      const busboy = Busboy({
        headers: req.headers,
        limits: { fileSize: 5 * 1024 * 1024, files: 1, fields: 10, fieldSize: 10 * 1024 },
      });
      const data = {};
      let fileBuffer = null;
      let fileName = '';
      let fileTooLarge = false;
      let tooManyFields = false;

      busboy.on('field', (fieldname, val) => {
        data[fieldname] = val;
      });
      busboy.on('fieldsLimit', () => {
        tooManyFields = true;
      });

      busboy.on('file', (fieldname, file, info) => {
        if (fieldname === 'proof') {
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
        } else {
          file.resume();
        }
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

          const parsedFields = parseRequest(traderRegistrationFieldsSchema, data);
          if (!parsedFields.success) {
            const errors = Object.fromEntries(
              parsedFields.error.issues.map((issue) => [
                issue.path.join('.') || 'body',
                issue.message,
              ]),
            );
            return resolve(res.status(400).json({ errors }));
          }

          // Upload to Cloudinary
          const uploadResult = await uploadToCloudinary(fileBuffer, 'atms/proofs', fileName);
          const validatedTraderData = {
            ...parsedFields.data,
            verificationProofUrl: uploadResult.secure_url,
          };

          const newTrader = await traderService.createTrader(validatedTraderData);

          const traderData = {
            id: newTrader.id,
            name: newTrader.name,
            email: newTrader.email,
            phone: newTrader.phone,
            is_active: newTrader.is_active,
            emailVerified: newTrader.emailVerified,
            verificationStatus: newTrader.verificationStatus,
            state: newTrader.state,
            district: newTrader.district,
            createdAt: newTrader.createdAt,
          };
          resolve(res.status(201).json(traderData));
        } catch (error) {
          console.error('Create trader error:', error);
          resolve(res.status(400).json({ error: error.message || 'Failed to create trader' }));
        }
      });

      busboy.on('error', (error) => {
        console.error('Busboy error:', error);
        resolve(res.status(400).json({ error: 'Failed to parse form data' }));
      });

      req.pipe(busboy);
    });
  } catch (error) {
    console.error('Create trader error:', error);
    return res.status(400).json({ error: error.message || 'Failed to create trader' });
  }
}

async function handlePut(req, res) {
  try {
    const token = req.cookies['auth-token'];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    const decoded = await verifyAdminToken(token);
    if (!decoded) return res.status(401).json({ error: 'Unauthorized' });

    const { id, status, name, phone } = req.body;

    if (status !== undefined) {
      const trader = await traderService.updateStatus(id, status);
      return res.status(200).json(serializeTrader(trader));
    }

    const trader = await traderService.updateTrader(id, { name, phone });
    return res.status(200).json(serializeTrader(trader));
  } catch (error) {
    console.error('Update trader error:', error);
    return res.json({ error: 'Failed to update trader' });
  }
}

async function handleDelete(req, res) {
  try {
    const token = req.cookies['auth-token'];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    const decoded = await verifyAdminToken(token);
    if (!decoded) return res.status(401).json({ error: 'Unauthorized' });

    const { id } = req.query;

    await traderService.deleteTrader(id);

    return res.status(200).json({
      message: 'Trader account and all associated data deleted successfully',
    });
  } catch (error) {
    console.error('Delete trader error:', error);

    if (error.code === 'P2025' || error.message.includes('not found')) {
      return res.json({ error: 'Trader not found or already deleted' });
    }

    return res.status(500).json({
      error: error.message || 'Failed to delete trader',
    });
  }
}

router.get('/', validateRequest(adminTraderQuerySchema, 'query'), handleGet);
router.post('/', handlePost);
router.put('/', validateRequest(traderUpdateSchema), handlePut);
router.delete('/', validateRequest(idQuerySchema, 'query'), handleDelete);

export default router;
