import express from "express";
import morgan from "morgan";
import cors from 'cors';
import { config } from './config.js';
import healthRouter from './router/health.js'

// router
import mealRouter from './router/meal.js';
import recipeRouter from './router/recipe.js';
import ingredientRouter from './router/ingredient.js';
import authRouter from './router/auth.js';

// db
import { connectDB } from './db/database.js';


const app = express();


// 미들웨어
app.use(express.json());
app.use(morgan("dev")); 
app.use(cors());

// 라우터
app.use('/auth', authRouter);
app.use('/uploads', express.static('uploads'));
app.use('/ingredient', ingredientRouter);
app.use('/meal', mealRouter);
app.use('/recipe', recipeRouter);
app.use('/health', healthRouter)


app.use((req, res, next) => {
    res.sendStatus(404);
});

connectDB().then(() => {
        const server = app.listen(config.host.port);
        console.log("Server started successfully");
    })
    .catch(console.error);
 