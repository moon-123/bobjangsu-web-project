import Mongoose from "mongoose";
import { Userdata } from "./userdata.js";
import moment from 'moment-timezone';


const foodSchemaNoUserId = new Mongoose.Schema({
    RCP_PARTS_DTLS: String,
    RCP_WAY2: String,
    RCP_SEQ: String,
    INFO_NA: String,
    INFO_WGT: String,
    INFO_PRO: String,
    INFO_FAT: String,
    INFO_CAR: String,
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

const newDate = new Date(Date.now())
const utcMoment = moment.utc(newDate);
const kstMoment = utcMoment.add(9, 'hours');
const dateInKST = kstMoment.toISOString();
const convertedDate = new Date(dateInKST);

// 식단 저장을 위한 스키마
const morningSchema = new Mongoose.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    // 'user'와 'per'를 배열로 정의
    user: [{ rice: { type: String }, soup: { type: String }, main1: { type: String }, main2: { type: String } }],
    per: [{ tan: { type: String }, ji: { type: String }, dan: { type: String }, kal: { type: String },total: { type: String } }],
    createdAt: { type: Date, default: convertedDate }
});
const lunchSchema = new Mongoose.Schema({
    id: {type: String, required: true},
    name: {type: String, required: true},
    user: [{ rice: { type: String }, soup: { type: String }, main1: { type: String }, main2: { type: String } }],
    per: [{ tan: { type: String }, ji: { type: String }, dan: { type: String }, kal: { type: String },total: { type: String } }],
    createdAt: {type: Date,
        default: convertedDate }
})
const dinnerSchema = new Mongoose.Schema({
    id: {type: String, required: true},
    name: {type: String, required: true},
    user: [{ rice: { type: String }, soup: { type: String }, main1: { type: String }, main2: { type: String } }],
    per: [{ tan: { type: String }, ji: { type: String }, dan: { type: String }, kal: { type: String },total: { type: String }  }],
    createdAt: {type: Date, default: convertedDate }
})
const Foodlist = Mongoose.model('recipe', foodSchemaNoUserId)
const Morninglist = Mongoose.model('menulist_morning', morningSchema);
const Lunchlist = Mongoose.model('menulist_lunch', lunchSchema);
const Dinnerlist = Mongoose.model('menulist_dinner', dinnerSchema);


export { Foodlist }



// 아침 식단 저장 함수
export async function morning(id, name, user, per) {
    try {

        const newMorning = new Morninglist({
            id: id,
            name: name,
            user: [{ rice: user.rice, soup: user.soup, main1: user.main1, main2: user.main2 }],       
            per: [{ tan: per.tan, ji: per.ji, dan: per.dan, kal: per.kal,total:per.total  }],
        });
        const result = await newMorning.save();
        return result;
    } catch (error) {
        throw error;
    }
}
// 점심 식단 저장 함수
export async function lunch(id,name,user,per) {
    try {
        // await lunchlist();
        const newLunch = new Lunchlist({
            id: id,
            name: name,
            user: [{ rice: user.rice, soup: user.soup, main1: user.main1, main2: user.main2 }],  
            per: [{ tan: per.tan, ji: per.ji, dan: per.dan, kal: per.kal,total:per.total }],
        }).save()
        return newLunch;
    } catch (error) {
        throw error;
    } 
}
// 저녁 식단 저장 함수
export async function dinner(id,name,user,per) {
    try {
        // await dinnerlist();
        const newDinner = new Dinnerlist({
            id: id,
            name: name,
            user: [{ rice: user.rice, soup: user.soup, main1: user.main1, main2: user.main2 }],
            per: [{ tan: per.tan, ji: per.ji, dan: per.dan, kal: per.kal,total:per.total }],
        }).save()
        return newDinner;
    } catch (error) {
        throw error;
    } 
}


// 레시피(메뉴) 데이터를 가지고 오는 함수
export async function getAll() {
    try {
        const informationCollection = Foodlist.collection;        
        const data = await informationCollection.find().toArray();
        return data;
    } catch (error) {
        throw error; // Rethrow the error to be handled by the calling code
    }
}

export async function getFoodInfo(){
    try {
        const foodInfoCollection = Foodlist.collection;
        const data = await Foodlist.find({}, 
            {
                "INFO_ENG":1,
                "INFO_FAT":1,
                "INFO_NA":1,
                "INFO_PRO":1,
                "INFO_CAR":1,
                "RCP_NM":1,
                "RCP_PAT2":1,
                "RCP_PARTS_DTLS":1
            }).exec();
        return data
    } catch (error) {
        throw error;
    }
}
// 고객 건강 정보 출력
export async function getById(id) {
    try {
        const tableConnection = Userdata.collection; // Assuming getUsers is a Mongoose model
        // userdata 함수로부터 반환된 데이터베이스 연결을 사용하여 데이터를 가져오기
        const user = await tableConnection.find({ id: id }).toArray();
        return user;
    } catch (error) {
        throw error;
    }
}

// 아침 데이터를 가지고 오는 함수
export async function getMorning(id) {
    try {
        const informationCollection = Morninglist.collection;        
        const data = await informationCollection.find({id}).sort({ createdAt: -1 }).limit(1).toArray();
        return data;
    } catch (error) {
        throw error; // Rethrow the error to be handled by the calling code
    }
}

export async function getTodayMorning(id) {
    try {      
        const informationCollection = Morninglist.collection;        
        const data = await informationCollection.find({id}).sort({ createdAt: -1 }).limit(1).toArray();
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1; // 월은 0부터 시작하므로 +1 해줍니다.
        const day = currentDate.getDate();

        if(data.length === 0){
            return []
        }else{
            let option = data[0].createdAt
            if(option.getFullYear() === year){
                if(option.getMonth() + 1 === month){
                    if(option.getDate() === day){
                        return data[0]
                    }
                }
            }
            else { 
                return [];
            }
        }

    } catch (error) {
        throw error; // Rethrow the error to be handled by the calling code
    }
}

// 점심 데이터를 가지고 오는 함수
export async function getLunch(id) {
    try {
        const informationCollection = Lunchlist.collection;        
        const data = await informationCollection.find({id}).sort({ createdAt: -1 }).limit(1).toArray();
        return data;
    } catch (error) {
        throw error; // Rethrow the error to be handled by the calling code
    }
}

export async function getTodayLunch(id) {
    try {
        const informationCollection = Lunchlist.collection;        
        const data = await informationCollection.find({id}).sort({ createdAt: -1 }).limit(1).toArray();
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1; // 월은 0부터 시작하므로 +1 해줍니다.
        const day = currentDate.getDate();
        if(data.length === 0){
            return []
        }else{
            let option = data[0].createdAt
            if(option.getFullYear() === year){
                if(option.getMonth() + 1 === month){
                    if(option.getDate() === day){
                        return data[0]
                    }
                }
            }
            else { 
                return [];
            }
        }
    } catch (error) {
        throw error; // Rethrow the error to be handled by the calling code
    }
}


// 저녁 데이터를 가지고 오는 함수
export async function getDinner(id) {
    try {
        const informationCollection = Dinnerlist.collection;        
        const data = await informationCollection.find({id}).sort({ createdAt: -1 }).limit(1).toArray();
        return data;
    } catch (error) {
        throw error; // Rethrow the error to be handled by the calling code
    }
} 

export async function getTodayDinner(id) {
    try {
        const informationCollection = Dinnerlist.collection;        
        const data = await informationCollection.find({id}).sort({ createdAt: -1 }).limit(1).toArray();
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1; // 월은 0부터 시작하므로 +1 해줍니다.
        const day = currentDate.getDate();
        if(data.length === 0){
            return []
        }else{
            let option = data[0].createdAt
            if(option.getFullYear() === year){
                if(option.getMonth() + 1 === month){
                    if(option.getDate() === day){
                        return data[0]
                    }
                }
            }
            else { 
                return [];
            }
        }
    } catch (error) {
        throw error; // Rethrow the error to be handled by the calling code
    }
}