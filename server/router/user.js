import express from "express";
import * as adminController from '../controller/admin.js';

const router = express.Router();

// 사용자 관련 라우팅

// 사용자 목록 조회
router.get('/users', adminController.getUsersList); 

// 사용자 한개 조회
router.get('/users/:id', adminController.getOneUsers); 

// 사용자 생성
router.post('/users', adminController.createUser); 

// 사용자 정보 업데이트
router.put('/users/:id', adminController.updateUser); 

// 사용자 삭제
router.delete('/users/:id', adminController.deleteUser); 

export default router;