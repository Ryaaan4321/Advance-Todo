import express from 'express'
import { logout, refresh, signin, signup } from '../../controllers/auth_controllers/auth.controller.js';

const authRouter = express.Router();

authRouter.post('/register', signup);
authRouter.post('/login', signin);
authRouter.post('/refresh', refresh)
authRouter.post('/logout', logout);

export default authRouter;