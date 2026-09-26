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
