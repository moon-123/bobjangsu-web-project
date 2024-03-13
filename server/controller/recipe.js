// 민주
import * as RecipeRepository from '../data/recipe.js'

// 밥, 국, 반찬, 기타로 나누는 함수
export async function getByType(req,res){
    try {
        // 파람에 국, 밥, 반찬, 기타가 있다
        const categoryName = req.query.categoryName;
        const data = await RecipeRepository.getcategory(categoryName);

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: '1.Internal Server Error' });
    }
}

// 레시피 이름만 받아오는 함수
export async function getRecipe(req, res) {
    try {
        // const ingredientID = req.params.id;
        const foodName = req.query.foodName;
        // 일단 모든 레시피 정보를 받아온다
        const data = await RecipeRepository.getname(foodName);
        // 이후 레시피 하나만 뽑아 정보를 받아온다
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: '2.Internal Server Error' });
    }
}

// // 데이터베이스의 모든 데이터를 받아와서 대분류별로 분류하는 함수
// export async function filterDataByCategory(categoryId) {
//     const data = await RecipeRepository.getcategory(categoryId);
//     return data;
// }
