import * as userRepository from '../data/userdata.js';
import * as mealRepository from '../data/meal.js'
import * as genderCheck from '../data/auth.js'
import * as healthRepository from '../data/health.js'
// import {getSocketIO} from  '../connection/socket.js';

// 식단, 고객 건강 기록 출력
export async function getUser(req, res, next){
    const total = []
    const id = req.id
    // const data = await mealRepository.getAll()
    // total.push(data)
    const userInfo = await genderCheck.findById(id)
    // console.log(userInfo);
    if(id === userInfo.id){
        total.push(userInfo)
    }else{
        const test2 = {}
        total.push(test2)
    }

    // console.log(total)

    const user = await userRepository.getById(id);
    // console.log(user);
    
    if(user[0] === undefined){
        const test = {}
        total.push(test)
        return res.status(200).json(total) 
    }

    else if(id === user[0].id){
        total.push(user[0])
    }
    // console.log("tototo", total);
    res.status(200).json(total) 
}

export async function getUserA(req, res, next){
    const total = []
    const id = req.id
    const user = await userRepository.getById(id);
    if(user[0] === undefined){
        return res.status(200).json(null)
    }
    if(id === user[0].id){
        total.push(user[0])
    }else{
        res.status(400).json({message: '건강정보 출력에 실패했습니다'});
    }
    const data = await mealRepository.getAll()
    total.push(data)
    const userInfo = await genderCheck.findById(id)
    if(id === user[0].id){
        total.push(userInfo)
    }else{
        res.status(400).json({message: '고객정보 출력에 실패했습니다'});
    }
    res.status(200).json(total) 
}

export async function getUserB(req, res, next){
    const total = []
    const id = req.id
    const user = await userRepository.getById(id);
    if(user[0] === undefined){
        return res.status(200).json(null)
    }
    if(id === user[0].id){
        total.push(user[0])
    }else{
        res.status(400).json({message: '건강정보 출력에 실패했습니다'});
    }
    const data = await mealRepository.getFoodInfo()
    total.push(data)
    const userInfo = await genderCheck.findById(id)
    if(id === user[0].id){
        total.push(userInfo)
    }else{
        res.status(400).json({message: '고객정보 출력에 실패했습니다'});
    }
    res.status(200).json(total) 
}

// 식단 저장 
export async function savelist(req, res, next){
    try {
        const id = req.id;
        const name = req.body.name;
        const user = req.body.user;
        const per = req.body.per;
        // console.log(name);
        if (name === 'morning') {
            const morninglist = await mealRepository.morning(id,name,user,per)
            res.status(200).json(morninglist);
        }
        else if (name === 'lunch') {
            const lunchlist = await mealRepository.lunch(id,name,user,per)
            res.status(200).json(lunchlist);
        }
        else if (name === 'dinner') {
            const dinnerlist = await mealRepository.dinner(id,name,user,per)
            res.status(200).json(dinnerlist);
        }
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

// 키, 몸무게, 알러지, 운동량 저장
export async function saveUser(req, res, next) {
    try {
        const id = req.id;
        const weight = req.body.weight;
        const height = req.body.height;
        const allergy = req.body.allergy;
        const energy = req.body.energy;
        let allergyString = ""
        allergy.forEach((all, idx) => {

            if (all.length !== 0 & idx !== 0){
                allergyString += ", "
            }
            allergyString += all

            console.log('allergyString: ', allergyString);
        });

        // allergy가 배열이 아닌 경우는 없음
        // const allergyString = Array.isArray(allergy) ? allergy.join(', ') : allergy;

        const user = await userRepository.getById(id);
        if (!user) {
            return res.status(404).json({ Message: `User id(${id}) not found` });
        }
        
        const save = await userRepository.save(id, weight, height, allergyString, energy);
        const insertDate = Date.now();  
        const save2 = await healthRepository.insertWeight(id, insertDate, weight);
        return res.status(200).json(save);
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

// 키, 몸무게, 알러지 업데이트
export async function updateUser(req, res, next) {
    try {
        const id = req.id;
        const weight = req.body.weight;
        const height = req.body.height;
        const allergy = req.body.allergy;
        const energy = req.body.energy;
        let allergyString = ""
        allergy.forEach((all, idx) => {
            console.log(all);
            if (all.length !== 0 & idx !== 0){
                allergyString += ", "
            }
            allergyString += all

            console.log('allergyString: ', allergyString);
        });

        // const allergyString = Array.isArray(allergy) ? allergy.join(', ') : allergy;
        const user = await userRepository.getById(id);
        if (!user) {
            return res.status(404).json({ Message: `User id(${id}) not found` });
        }
        
        if(user[0] === undefined){
            const save = await userRepository.save(id, weight, height, allergyString, energy);
            return res.status(200).json(save);
        }
    
        else if(id === user[0].id){
            const updated = await userRepository.update(id, weight, height, allergyString, energy);
            return res.status(200).json(updated);
        }
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}


// 아침 점심 저녁 출력
export async function mealList(req, res, next){
    let total = []
    const id = req.id
    const morninglist = await mealRepository.getMorning(id);

    if(morninglist === undefined){
        res.status(400).json({message: '아침 식단 출력에 실패했습니다'})
    }

    for(let morning of morninglist){
        if(id === morning.id) {
            total.push(morning)
        }
    }

// -------
    const lunchlist = await mealRepository.getLunch(id);

    if(lunchlist === undefined){
        res.status(400).json({message: '점심 식단 출력에 실패했습니다'})
    }

    for(let lunch of lunchlist){
        if(id === lunch.id) {
            total.push(lunch)
        }
    }

    // ------
    const dinnerlist = await mealRepository.getDinner(id);

    if(dinnerlist === undefined){
        res.status(400).json({message: '저녁 식단 출력에 실패했습니다'})
    }

    for(let dinner of dinnerlist){
        if(id === dinner.id) {
            total.push(dinner)
        }
    }

    return res.status(200).json(total)
}

export async function mealCheck(req, res, next){
    try {
        let total = []
        const id = req.id
        const morninglist = await mealRepository.getTodayMorning(id);
        total.push(morninglist)
        console.log(total);

        const lunchlist = await mealRepository.getTodayLunch(id);
        total.push(lunchlist)

        const dinnerlist = await mealRepository.getTodayDinner(id);
        total.push(dinnerlist)
        return res.status(200).json(total)
    } catch(error) {
        return res.status(500).json({ error: 'Internal Server Error' })
    }
}
