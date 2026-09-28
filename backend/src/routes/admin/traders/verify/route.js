import { Router } from 'express';
import { verifyAdminToken } from '../../../../lib/auth.js';
import { authDal } from '../../../../dal/userDal/authDal.js';
import {
  sendVerificationApprovalEmail,
  sendVerificationRejectionEmail,
} from '../../../../lib/mail.js';
import { deleteFromCloudinary } from '../../../../lib/cloudinary.js';
import { validateRequest } from '../../../../middleware/validateRequest.js';
import { traderVerificationSchema } from '../../../../validations/resources.js';

const router = Router({ mergeParams: true });

async function handlePut(req, res) {
  try {
    const token = req.cookies['auth-token'];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    const decoded = await verifyAdminToken(token);
    if (!decoded) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id, status, reason } = req.body;

    if (!['APPROVED', 'REJECTED'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    if (status === 'REJECTED' && !reason) {
      return res.status(400).json({ error: 'Rejection reason is required' });
    }

    const trader = await authDal.findById(id);

    if (!trader) {
      return res.status(404).json({ error: 'Trader not found' });
    }

    if (status === 'REJECTED' && trader.verificationProofUrl) {
      await deleteFromCloudinary(trader.verificationProofUrl);
    }

    const updatedTrader = await authDal.update(id, {
      verificationStatus: status,
      rejectionReason: status === 'REJECTED' ? reason : null,
      verificationProofUrl: status === 'REJECTED' ? null : trader.verificationProofUrl,
      reviewedByAdminId: decoded.id,
      verifiedAt: status === 'APPROVED' ? new Date() : null,
    });

    // Send emails
    try {
      if (status === 'APPROVED') {
        await sendVerificationApprovalEmail(updatedTrader.email, updatedTrader.name);
      } else {
        await sendVerificationRejectionEmail(updatedTrader.email, updatedTrader.name, reason);
      }
    } catch (mailError) {
      console.error('Failed to send verification email:', mailError);
      // Do not block the update if email fails
    }

    return res.status(200).json({ message: `Trader ${status.toLowerCase()} successfully` });
  } catch (error) {
    console.error('Admin verify trader error:', error);
    return res.status(500).json({ error: 'Failed to verify trader' });
  }
}

router.put('/', validateRequest(traderVerificationSchema), handlePut);

export default router;
