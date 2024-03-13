import { Recipes } from "./savedata.js";
import { Foodlist } from "./meal.js";

// recipe-all 안의 모든 데이터를 받아오는 함수
export async function getAll() {
    try {
        const informationCollection = Foodlist.collection;
        // recipes (x) recipe (o)
        const data = await informationCollection.find().toArray();
        return data;
    } catch (error) {
        
        throw error; // Rethrow the error to be handled by the calling code
    }
}

// 몽구스 커넥트 끊지 마세요


export async function getcategory(categoryId) {
    try {
        const informationCollection = Foodlist.collection;
        const data = await informationCollection.find({ RCP_PAT2: categoryId }).toArray();
        
        return data;
    } catch (error) {
        throw error; 
    }
}


export async function getname(foodName) {
    try{
        const informationCollection = Foodlist.collection;
        const data = await informationCollection.find({ RCP_NM: foodName }).toArray();
        return data;
    } catch(error){
        throw error;
    }
}