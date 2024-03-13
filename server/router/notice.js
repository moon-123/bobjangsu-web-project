import express from "express";
import * as adminController from '../controller/admin.js';
import { uploadMiddleware, upload} from './image.js';

const router = express.Router();

// 공지사항 관련 라우팅

// 공지사항 목록 조회
router.get('/notices', adminController.getNotices); 

// 공지사항 한개 조회
router.get('/notices/:id', adminController.OneNotices); 

// 공지사항 생성
router.post('/notices', adminController.createNotice); 

// 공지사항 업데이트
router.put('/notices/:id', adminController.updateNotice); 

// 공지사항 삭제
router.delete('/notices/:id', adminController.deleteNotice); 

// 공지사항 이미지 첨가
router.post('/notices/images', uploadMiddleware.single('image'), upload);

export default router;