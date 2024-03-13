import express from "express";
import * as userController from '../controller/userdata.js';
import { body} from 'express-validator';
import { validate } from "../middleware/validator.js";
import {isAuth} from '../middleware/auth.js';
// import {body} from 'express-validator';
// import {validate} from '../middleware/validator.js';
// import {isAuth} from '../middleware/meal.js'
// import { config } from '../config.js';

const router = express.Router();

// 레시피, 건강정보, 식단 뽑아오기
router.get('/meal', isAuth, userController.getUser);

router.get('/ameal', isAuth, userController.getUserA);

router.get('/bmeal', isAuth, userController.getUserB);

// 건강정보 저장하기
router.post('/user',  isAuth, userController.saveUser);

// 건강정보 업데이트 하기
router.put('/newuser', isAuth, userController.updateUser)

// 식단 저장하기
router.post('/savelist',isAuth, userController.savelist);

// 아침 점심 저녁 식단 출력하기
router.get('/meallist', isAuth, userController.mealList)

// 라우터
router.get('/mealcheck', isAuth, userController.mealCheck);


export default router;