import { Router } from 'express';

import adminAdminsRouter from './admin/admins/route.js';
import adminChangePasswordRouter from './admin/auth/change-password/route.js';
import adminForgotPasswordRouter from './admin/auth/forgot-password/route.js';
import adminLoginRouter from './admin/auth/login/route.js';
import adminLogoutRouter from './admin/auth/logout/route.js';
import adminRegisterRouter from './admin/auth/register/route.js';
import adminResetPasswordRouter from './admin/auth/reset-password/route.js';
import adminDashboardRouter from './admin/dashboard/route.js';
import adminProfileRouter from './admin/profile/route.js';
import adminReportsRouter from './admin/reports/route.js';
import adminSettingsRouter from './admin/settings/route.js';
import adminTraderDetailsRouter from './admin/traders/[id]/route.js';
import adminTradersRouter from './admin/traders/route.js';
import adminVerifyTraderRouter from './admin/traders/verify/route.js';
import adminContactMessagesRouter from './admin/contact-messages/route.js';
import adminTestimonialsRouter from './admin/testimonials/route.js';
import publicSettingsRouter from './settings/public/route.js';
import publicContactRouter from './public/contact/route.js';
import publicTestimonialsRouter from './public/testimonials/route.js';
import userForgotPasswordRouter from './user/auth/forgot-password/route.js';
import userLoginRouter from './user/auth/login/route.js';
import userLogoutRouter from './user/auth/logout/route.js';
import userRegisterRouter from './user/auth/register/route.js';
import userResetPasswordRouter from './user/auth/reset-password/route.js';
import userVerifyOtpRouter from './user/auth/verify-otp/route.js';
import customerDetailsRouter from './user/customers/[id]/route.js';
import customersRouter from './user/customers/route.js';
import userDashboardRouter from './user/dashboard/route.js';
import productDetailsRouter from './user/products/[id]/route.js';
import productsRouter from './user/products/route.js';
import userProfileRouter from './user/profile/route.js';
import providerDetailsRouter from './user/providers/[id]/route.js';
import providersRouter from './user/providers/route.js';
import purchaseDetailsRouter from './user/purchases/[id]/route.js';
import purchasesRouter from './user/purchases/route.js';
import userReportsRouter from './user/reports/route.js';
import saleDetailsRouter from './user/sales/[id]/route.js';
import salesRouter from './user/sales/route.js';
import userSettingsRouter from './user/settings/route.js';
import userVerificationRouter from './user/verify-trader/route.js';

import { requireAdminSession } from '../middleware/requireAdminSession.js';
import { requireUserSession } from '../middleware/requireUserSession.js';

const apiRouter = Router();

// Admin Auth (Public)
apiRouter.use('/admin/auth/login', adminLoginRouter);
apiRouter.use('/admin/auth/logout', adminLogoutRouter);
apiRouter.use('/admin/auth/register', adminRegisterRouter);
apiRouter.use('/admin/auth/forgot-password', adminForgotPasswordRouter);
apiRouter.use('/admin/auth/reset-password', adminResetPasswordRouter);

// Admin Protected
apiRouter.use('/admin/admins', requireAdminSession, adminAdminsRouter);
apiRouter.use('/admin/auth/change-password', requireAdminSession, adminChangePasswordRouter);
apiRouter.use('/admin/dashboard', requireAdminSession, adminDashboardRouter);
apiRouter.use('/admin/profile', requireAdminSession, adminProfileRouter);
apiRouter.use('/admin/reports', requireAdminSession, adminReportsRouter);
apiRouter.use('/admin/settings', requireAdminSession, adminSettingsRouter);
apiRouter.use('/admin/traders/verify', requireAdminSession, adminVerifyTraderRouter);
apiRouter.use('/admin/traders/:id', requireAdminSession, adminTraderDetailsRouter);
apiRouter.use('/admin/traders', requireAdminSession, adminTradersRouter);
apiRouter.use('/admin/contact-messages', requireAdminSession, adminContactMessagesRouter);
apiRouter.use('/admin/testimonials', requireAdminSession, adminTestimonialsRouter);

// Public Settings & General
apiRouter.use('/settings/public', publicSettingsRouter);
apiRouter.use('/contact', publicContactRouter);
apiRouter.use('/testimonials', publicTestimonialsRouter);

// User Auth (Public)
apiRouter.use('/user/auth/login', userLoginRouter);
apiRouter.use('/user/auth/logout', userLogoutRouter);
apiRouter.use('/user/auth/register', userRegisterRouter);
apiRouter.use('/user/auth/forgot-password', userForgotPasswordRouter);
apiRouter.use('/user/auth/reset-password', userResetPasswordRouter);
apiRouter.use('/user/auth/verify-otp', userVerifyOtpRouter);

// User Protected
apiRouter.use('/user/customers/:id', requireUserSession, customerDetailsRouter);
apiRouter.use('/user/customers', requireUserSession, customersRouter);
apiRouter.use('/user/dashboard', requireUserSession, userDashboardRouter);
apiRouter.use('/user/products/:id', requireUserSession, productDetailsRouter);
apiRouter.use('/user/products', requireUserSession, productsRouter);
apiRouter.use('/user/profile', requireUserSession, userProfileRouter);
apiRouter.use('/user/providers/:id', requireUserSession, providerDetailsRouter);
apiRouter.use('/user/providers', requireUserSession, providersRouter);
apiRouter.use('/user/purchases/:id', requireUserSession, purchaseDetailsRouter);
apiRouter.use('/user/purchases', requireUserSession, purchasesRouter);
apiRouter.use('/user/reports', requireUserSession, userReportsRouter);
apiRouter.use('/user/sales/:id', requireUserSession, saleDetailsRouter);
apiRouter.use('/user/sales', requireUserSession, salesRouter);
apiRouter.use('/user/settings', requireUserSession, userSettingsRouter);
apiRouter.use('/user/verify-trader', requireUserSession, userVerificationRouter);

export default apiRouter;
