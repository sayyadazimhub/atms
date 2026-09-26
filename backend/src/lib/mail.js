import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const fromEmail = process.env.FROM_EMAIL || 'noreply@example.com';

export async function sendResetEmail(to, resetLink) {
  const { data, error } = await resend.emails.send({
    from: `ATMS <${fromEmail}>`,
    to: [to],
    subject: 'ATMS - Reset your password',
    html: `
      <p>You requested a password reset for your ATMS account.</p>
      <p>Click the link below to reset your password (valid for 1 hour):</p>
      <p>Don't share this link with anyone.</p>
      <p><a href="${resetLink}">${resetLink}</a></p>
      <p>If you didn't request this, you can ignore this email.</p>
    `,
  });
  if (error) throw new Error(error.message);
  return data;
}

/** Send OTP email for User (verification or password reset) via Resend */
export async function sendOtpEmail(to, otp, purpose = 'verification') {
  const subject =
    purpose === 'reset'
      ? 'ATMS - Your password reset OTP'
      : 'ATMS - Verify your email';
  const message =
    purpose === 'reset'
      ? `Use this OTP to reset your password: <strong>${otp}</strong>. It expires in 10 minutes.`
      : `Your email verification OTP is: <strong>${otp}</strong>. It expires in 10 minutes.`;
  const { data, error } = await resend.emails.send({
    from: `ATMS <${fromEmail}>`,
    to: [to],
    subject,
    html: `
      <p>${message}</p>
      <p>If you didn't request this, you can ignore this email.</p>
    `,
  });
  if (error) throw new Error(error.message);
  return data;
}

/** Send notification to admins about a new trader registration */
export async function sendNewTraderNotification(adminEmails, newTraderData) {
  if (!adminEmails || adminEmails.length === 0) return;
  
  const { data, error } = await resend.emails.send({
    from: `ATMS <${fromEmail}>`,
    to: adminEmails,
    subject: 'ATMS Alert - New Trader Registration',
    html: `
      <h2>New Trader Registered</h2>
      <p>A new trader has just registered on the ATMS Network.</p>
      <ul>
        <li><strong>Name:</strong> ${newTraderData.name}</li>
        <li><strong>Email:</strong> ${newTraderData.email}</li>
        <li><strong>Phone:</strong> ${newTraderData.phone || 'N/A'}</li>
      </ul>
      <p>Please log in to the admin dashboard to review their account.</p>
    `,
  });
  if (error) throw new Error(error.message);
  return data;
}

/** Send notification to trader upon verification approval */
export async function sendVerificationApprovalEmail(to, name) {
  const { data, error } = await resend.emails.send({
    from: `ATMS <${fromEmail}>`,
    to: [to],
    subject: 'ATMS - Verification Approved',
    html: `
      <h2>Verification Approved!</h2>
      <p>Hello ${name},</p>
      <p>Great news! Your trader verification application has been reviewed and <strong>approved</strong>.</p>
      <p>You now have full access to the ATMS platform and can start trading.</p>
      <p>Welcome aboard!</p>
    `,
  });
  if (error) throw new Error(error.message);
  return data;
}

/** Send notification to trader upon verification rejection */
export async function sendVerificationRejectionEmail(to, name, reason) {
  const { data, error } = await resend.emails.send({
    from: `ATMS <${fromEmail}>`,
    to: [to],
    subject: 'ATMS - Verification Needs Attention',
    html: `
      <h2>Verification Action Required</h2>
      <p>Hello ${name},</p>
      <p>Your trader verification application has been reviewed, but unfortunately it was <strong>rejected</strong> for the following reason:</p>
      <blockquote style="background-color: #f8717120; padding: 10px; border-left: 4px solid #ef4444; margin: 20px 0;">
        ${reason}
      </blockquote>
      <p>Please log back in to the ATMS platform to update your application and submit new proof documents.</p>
    `,
  });
  if (error) throw new Error(error.message);
  return data;
}
