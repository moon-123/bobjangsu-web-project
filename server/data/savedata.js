// 하나로통일할거면 이거 connectDB로 변경
// 민주
import { connectDB } from "../db/database.js";
import Mongoose from "mongoose";
// import { getAll } from "./recipe.js";


// 저장할 레시피 테이블 형식
// 꼭 모든 레시피를 저장해야하는지?
const foodSchema = new Mongoose.Schema({
    userid:String,
    RCP_PARTS_DTLS: String,
    RCP_WAY2: String,
    RCP_SEQ: String,
    INFO_NA: String,
    INFO_WGT: String,
    INFO_PRO: String,
    INFO_FAT: String,
    HASH_TAG: String,
    RCP_PAT2: String,
    RCP_NA_TIP: String,
    INFO_ENG: String,
    RCP_NM: String,
    MANUAL01: String,
    MANUAL02: String,
    MANUAL03: String,
    MANUAL04: String,
    MANUAL05: String,
    MANUAL06: String,
    MANUAL07: String,
    MANUAL08: String,
    MANUAL09: String,
    MANUAL10: String,
    MANUAL11: String,
    MANUAL12: String,
    MANUAL13: String,
    MANUAL14: String,
    MANUAL15: String,
    MANUAL16: String,
    MANUAL17: String,
    MANUAL18: String,
    MANUAL19: String,
    MANUAL20: String,
    MANUAL_IMG01: String,
    MANUAL_IMG02: String,
    MANUAL_IMG03: String,
    MANUAL_IMG04: String,
    MANUAL_IMG05: String,
    MANUAL_IMG06: String,
    MANUAL_IMG07: String,
    MANUAL_IMG08: String,
    MANUAL_IMG09: String,
    MANUAL_IMG10: String,
    MANUAL_IMG11: String,
    MANUAL_IMG12: String,
    MANUAL_IMG13: String,
    MANUAL_IMG14: String,
    MANUAL_IMG15: String,
    MANUAL_IMG16: String,
    MANUAL_IMG17: String,
    MANUAL_IMG18: String,
    MANUAL_IMG19: String,
    MANUAL_IMG20: String,
    ATT_FILE_NO_MK: String,
    ATT_FILE_NO_MAIN: String,
});


const recipeSchema = new Mongoose.Schema({
    userid:String,
    RCP_PAT2: String,
    RCP_NM: String,
});

// user_recipe에 넣는다
const Recippy = Mongoose.model('new_userRecipe', recipeSchema);


// user_recipe에 넣는다
const Recipes = Mongoose.model('user_recipe', foodSchema);
export { Recipes }
// 저장 누르면 삭제로 돌릴라고 몽구스 연결 끊는건가?
// 전송 두번하면 에러 발생하는데 잡긴 해야할듯.
// 대충 connectDB 형식 수정했는데 해결 안됨.

// 위의 Recipes의 테이블 중 하나인 userid를 받아와서 해당 아이디가 존재하는 데이터만 뽑는 함수. 내 레시피 보기 기능에 쓰는 함수
export async function getByUserid(userid) {
    try {
        const recipeCollection = Recippy.collection;
        const data = await recipeCollection.find({ userid: userid.trim() }).toArray();
        return data;
    } catch (error) {
        throw error;
    }
}

// 레시피 저장 함수
export async function saveData(userid,RCP_PAT2,RCP_NM) {
        try {
            // 이것을 connectDB로 바꿔도 될 듯 합니다
            const newRecipe = new Recippy({
                userid,RCP_PAT2,RCP_NM
            });
    
            await newRecipe.save();
    
        } catch (error) {
            throw error;
        }
}

// 저장된 레시피를 삭제하는 함수. userid와 레시피 이름을 받아와서 두 개가 겹치는 데이터를 삭제
export async function deleteData(id,rcpname) {
    try {
        // 얘도 connectDB로 바꿀거라면 다 바꿨는지 check
        const result = await Recippy.deleteOne({ RCP_NM: rcpname.trim(), userid: id });
    } catch (error) {
        throw error;
    }
}