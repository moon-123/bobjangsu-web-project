import express from "express";
import * as saveController from '../controller/savedata.js';
import * as recipeController from '../controller/recipe.js';
import { body } from 'express-validator';
import { validate } from '../middleware/validator.js'
import { isAuth } from "../middleware/auth.js";


const router = express.Router();

// recipe/:id?type=rice
// recipe/:id?type=soup
// recipe/:id?type=side
// recipe/:id?type=etc
// recipe/:id?type=my

// recipe-all 컬렉션(모든 레시피 데이터)에서 국 or 반찬 or 기타 or 밥만 걸러서 fetch하는 함수
router.get('/', recipeController.getByType);
// 요리 이름의 정보만 fetch하는 함수
router.get('/detail/', recipeController.getRecipe);

// 내 정보 (내 레시피) 정보 뽑아오기
router.get('/my/category/',isAuth, saveController.getByType); 
router.get('/my/detail/',isAuth, saveController.getRecipe);   


router.post('/saveData',isAuth,saveController.saveData);
router.delete('/deleteData/',isAuth,saveController.deleteData);


export default router;