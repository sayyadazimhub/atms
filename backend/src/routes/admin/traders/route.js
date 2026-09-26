

import { verifyUserToken } from '../../../lib/auth.js';
import { traderService } from '../../../services/adminService/traderService.js';
import { uploadToCloudinary } from '../../../lib/cloudinary.js';
import Busboy from 'busboy';


export async function GET(req, res) {
  const params = req.params || {};
    try {
        const token = req.cookies['auth-token'];
        if (!token) return res.status(401).json({ error: 'Unauthorized' });

        const decoded = await verifyUserToken(token);
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

export async function POST(req, res) {
    try {
        const token = req.cookies['auth-token'];
        if (!token) return res.status(401).json({ error: 'Unauthorized' });

        const decoded = await verifyUserToken(token);
        if (!decoded) return res.status(401).json({ error: 'Unauthorized' });

        return new Promise((resolve, reject) => {
            const busboy = Busboy({ headers: req.headers });
            const data = {};
            let fileBuffer = null;
            let fileName = '';

            busboy.on('field', (fieldname, val) => {
                data[fieldname] = val;
            });

            busboy.on('file', (fieldname, file, info) => {
                if (fieldname === 'proof') {
                    fileName = info.filename;
                    const chunks = [];
                    file.on('data', (chunk) => {
                        chunks.push(chunk);
                    });
                    file.on('end', () => {
                        fileBuffer = Buffer.concat(chunks);
                    });
                } else {
                    file.resume();
                }
            });

            busboy.on('finish', async () => {
                try {
                    if (!fileBuffer) {
                        return resolve(res.status(400).json({ error: 'Proof document is required' }));
                    }

                    // Upload to Cloudinary
                    const uploadResult = await uploadToCloudinary(fileBuffer, 'atms/proofs', fileName);
                    data.verificationProofUrl = uploadResult.secure_url;

                    const newTrader = await traderService.createTrader(data);
                    
                    const { password, ...traderData } = newTrader;
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


export async function PUT(req, res) {
  const params = req.params || {};
    try {
        const token = req.cookies['auth-token'];
        if (!token) return res.status(401).json({ error: 'Unauthorized' });

        const { id, status, name, phone } = req.body;

        if (status !== undefined) {
            const trader = await traderService.updateStatus(id, status);
            return res.status(200).json(trader);
        } else {
            const trader = await traderService.updateTrader(id, { name, phone });
            return res.json(trader);
        }
    } catch (error) {
        console.error('Update trader error:', error);
        return res.json({ error: 'Failed to update trader' });
    }
}

export async function DELETE(req, res) {
  const params = req.params || {};
    try {
        const token = req.cookies['auth-token'];
        if (!token) return res.status(401).json({ error: 'Unauthorized' });

        const decoded = await verifyUserToken(token);
        if (!decoded) return res.status(401).json({ error: 'Unauthorized' });

        const { id } = req.query;

        await traderService.deleteTrader(id);

        return res.status(200).json({
            message: 'Trader account and all associated data deleted successfully'
        });
    } catch (error) {
        console.error('Delete trader error:', error);

        if (error.code === 'P2025' || error.message.includes('not found')) {
            return res.json({ error: 'Trader not found or already deleted' });
        }

        return res.status(500).json({
            error: error.message || 'Failed to delete trader'
        });
    }
}
