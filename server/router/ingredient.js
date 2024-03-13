import express from "express";
import * as ingredientsController from '../controller/ingredient.js';

const router = express.Router();

// router.get('/:id', ingredientsController.getCategory)
// ingredient?categoryName=당뇨
router.get('/', ingredientsController.getCategory)

router.get('/detail/', ingredientsController.getOneEffect);

export default router;