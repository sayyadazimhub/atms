
import { authService } from '../../../../services/userService/authService.js';
import db from '../../../../config/db.js';

export async function POST(req, res) {
  const params = req.params || {};
  try {
    const settings = await db.systemSetting.findFirst();
    if (settings && !settings.traderSelfRegistration) {
      return res.status(403).json({ error: 'Registration is currently disabled by the administrator' });
    }

    const body = req.body;
    const { name, email, password, phone } = body;

    if (!name || !email || !password || !phone) {
      let fieldErrors = {};
      if (!name) fieldErrors.name = 'Full Name is required';
      if (!phone) fieldErrors.phone = 'Phone Number is required';
      if (!email) fieldErrors.email = 'Email Address is required';
      if (!password) fieldErrors.password = 'Password is required';
      
      return res.status(400).json({ errors: fieldErrors });
    }

    const { email: registeredEmail } = await authService.register({ name, email, password, phone });

    // Send admin notification if enabled
    if (settings && settings.notifyOnNewTrader) {
      try {
        const { sendNewTraderNotification } = await import('@/lib/mail');
        // Fetch active admin emails
        const activeAdmins = await db.admin.findMany({
          where: { is_active: true },
          select: { email: true }
        });
        const adminEmails = activeAdmins.map(a => a.email);
        
        if (adminEmails.length > 0) {
          await sendNewTraderNotification(adminEmails, { name, email, phone });
        }
      } catch (mailError) {
        console.error('Failed to send admin notification email:', mailError);
        // Do not block registration if email fails
      }
    }

    return res.status(201).json({ message: 'Registration successful. Check your email for the OTP to verify your account.', email: registeredEmail });
  } catch (err) {
    console.error('User register error:', err);
    return res.status(500).json({ error: err.message || 'Registration failed' });
  }
}
