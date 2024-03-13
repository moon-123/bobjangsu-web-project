import express from "express";
import userRouter from './user.js';
import notiRouter from './notice.js';
import { isAdmin } from '../middleware/adminAuth.js';
import * as adminController from '../controller/admin.js';
import { getSystemInfo } from './systeminfo.js';

const router = express.Router();

router.post('/login', adminController.adminLogin)
router.use('/userinformation', isAdmin, userRouter);
router.use('/noticesboard', isAdmin, notiRouter);
router.get('/systeminfo', isAdmin, getSystemInfo);

export default router;
