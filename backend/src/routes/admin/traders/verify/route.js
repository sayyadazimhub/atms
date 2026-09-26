import { verifyUserToken } from '../../../../lib/auth.js';
import db from '../../../../config/db.js';
import { sendVerificationApprovalEmail, sendVerificationRejectionEmail } from '../../../../lib/mail.js';
import { deleteFromCloudinary } from '../../../../lib/cloudinary.js';

export async function PUT(req, res) {
  const params = req.params || {};
  try {
    const token = req.cookies['auth-token'];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    const decoded = await verifyUserToken(token);
    if (!decoded || decoded.role !== 'admin') {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id, status, reason } = req.body;

    if (!['APPROVED', 'REJECTED'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
    }

    if (status === 'REJECTED' && !reason) {
        return res.status(400).json({ error: 'Rejection reason is required' });
    }

    const trader = await db.user.findUnique({
        where: { id }
    });

    if (!trader) {
        return res.status(404).json({ error: 'Trader not found' });
    }

    if (status === 'REJECTED' && trader.verificationProofUrl) {
        await deleteFromCloudinary(trader.verificationProofUrl);
    }

    const updatedTrader = await db.user.update({
      where: { id },
      data: {
        verificationStatus: status,
        rejectionReason: status === 'REJECTED' ? reason : null,
        verificationProofUrl: status === 'REJECTED' ? null : trader.verificationProofUrl,
        reviewedByAdminId: decoded.id,
        verifiedAt: status === 'APPROVED' ? new Date() : null,
      },
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
