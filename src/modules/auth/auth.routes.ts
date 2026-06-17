import { Router } from 'express';
import { validateBody } from '../../shared/utils/validate';
import { asyncHandler } from '../../shared/utils/async-handler';
import { requireAuth } from '../../shared/middlewares/auth';
import { registerSchema, loginSchema } from './auth.schemas';
import { register, login, me } from './auth.controller';

export const authRouter: Router = Router();

authRouter.post('/register', validateBody(registerSchema), asyncHandler(register));
authRouter.post('/login', validateBody(loginSchema), asyncHandler(login));
authRouter.get('/me', requireAuth, asyncHandler(me));
