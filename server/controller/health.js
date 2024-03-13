import * as healthRepository from '../data/health.js'
import * as authRespository from '../data/auth.js'

export async function createSugar(req, res, next) {
    const { date, sugarData, notepad } = req.body;
    const id = req.id    
    try {
        const data = await healthRepository.insertSugar(id, date, sugarData, notepad);
        if (data) {
            res.status(201).json({ message: 'Data created successfully' });
        } else {
            res.status(404).json({ message: 'Failed to create data' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}

// 건강 기록 등록
export async function createBlood(req, res, next) {
    const { date, lowData, highData, notepad } = req.body;
    const id = req.id

    try {
        const data = await healthRepository.insertBlood(id, date, lowData, highData, notepad);
        if (data) {
            res.status(201).json({ message: 'Data created successfully' });
        } else {
            res.status(404).json({ message: 'Failed to create data' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}

export async function createWeight(req, res, next) {
    // Destructuring the properties from req.body and req
    const { date, weightData, notepad } = req.body;
    const id = req.id;

    try {
        // Insert weight data into the database
        const data = await healthRepository.insertWeight(id, date, weightData, notepad);

        // Check if weight data was successfully inserted
        if (data) {
            // Get the last weight data for the user
            const lastWeightData = await healthRepository.selectWeight('weight', id);

            // Extract the last update date from the retrieved data
            let lastUpdateDate;
            if(lastWeightData.length === 1){
                lastUpdateDate = lastWeightData[0].date;
            }else{
                lastUpdateDate = lastWeightData[1].date;
            }
            // Check if the last update date is earlier than the current date
            if ( lastUpdateDate < new Date(date)) {
                // If true, prepare new data for updating user information
                const newData = { 'weight': Number(weightData) };

                // Update user information
                const userUpdate = await authRespository.updateUserInfo(id, newData);

                // Respond based on the success of user information update
                if (userUpdate) {
                    res.status(200).json({ message: 'Create and userInfo update success' });
                } else {
                    res.status(400).json({ message: 'Create success but userInfo update failed' });
                }
            } else {
                // If the last update date is not earlier than the current date
                res.status(301).json({ message: 'User weight has already been updated' });
            }
        } else {
            // If weight data was not successfully inserted
            res.status(500).json({ message: 'Failed to insert weight data' });
        }
    } catch (error) {
        // Handle errors during the process
        console.error(error);  // Log the error for debugging purposes
        res.status(500).json({ message: 'Internal server error' });
    }
}

export async function getAll(req, res, next) {
    const category = req.query.category;
    const userId = req.id

    let dbName;
    if (category == '혈당') {
        dbName = 'sugar';
    } else if (category == '혈압') {
        dbName = 'blood';
    }
    try {
        const allData = await healthRepository.selectAll(dbName, userId);
        if (allData) {
            res.status(200).json(allData);
        } else {
            res.status(404).json({ message: 'Data not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

export async function getByDate(req, res, next) {
    let dbName;

    const category = req.query.category
    const userId = req.id;

    if (category == '혈당') {
        dbName = 'sugar';
    } else {
        dbName = 'blood';
    }

    const dateTime = req.query.date;
    try {
        const data = await healthRepository.selectAll(dbName, userId);
        if (data) {
            const oneData = data.filter(item => item.date.toISOString().split('T')[0] === dateTime);

            if (oneData) {
                res.status(200).json(oneData);
            } else {
                res.status(404).json({ message: 'Data not found for the specified date' });
            }
        } else {
            res.status(404).json({ message: 'Data not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

export async function getChartData(req, res, next) {
    const category = req.query.category;
    const userId = req.id;
    let dbName;
    let data;

    try{
        if (category == '몸무게') {
            dbName = 'weight';
            data = await healthRepository.selectWeight(dbName, userId);
            
        } else if (category == '혈당' || category == '혈압') {
            const date = req.query.date;
            dbName = category == '혈당' ? 'sugar' : 'blood';
            data = await healthRepository.selectOther(dbName, userId, date);
        }
    
        if (data){
            if (category == '몸무게') {
                // If data length is greater than 7, slice it; otherwise, return all data
                if (data.length > 7) {
                    const weightData = data.slice(0, 7);
                    res.status(200).json(weightData);
                } else {
                    res.status(200).json(data);
                }
            } else {
                // For categories other than '몸무게', return all data
                res.status(200).json(data);
            }
        } else {
            // If data or date is not present, return a 404 status
            res.status(404).json({ message: 'Data not found' });
        }
    }catch{
        res.status(500).json({ message: 'Internal Server Error' });
    }
}


export async function getById(req, res, next){
    try{
        const id = req.query.dataId
        const category = req.query.category;
        const userId = req.id;

        let dbName

        if (category === '혈당') {
            dbName = 'sugar';
        }else if(category === '혈압') {
            dbName = 'blood';
        }else if(category === '몸무게'){
            dbName = 'weight';
        }
        const data = await healthRepository.selectById(dbName, userId, id);
        if(data){
            res.status(200).json(data);
        }else{
            res.status(404).json({ message: 'Data not found' });
        }
    }catch{
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

export async function updateData(req, res, next){
    try{
        const id = req.query.dataId
        const category = req.query.category;
        const userId = req.id;

        if (category === '혈당') {
            
            const { date, sugarData, notepad } = req.body;
            const data = await healthRepository.updateSugar( userId, id, date, sugarData, notepad);

            if(data){
                res.status(200).json(data);
            }else{
                res.status(404).json({ message: 'Update False' });
            }
        }else if(category === '혈압'){
            const { date, lowData, highData, notepad } = req.body;
            console.log(lowData, highData)
            const data = await healthRepository.updateBlood(userId, id, date, lowData, highData, notepad);

            if(data){
                res.status(200).json(data);
            }else{
                res.status(404).json({ message: 'Update False' });
            }
        }else if(category === '몸무게'){
            const { date, weightData, notepad } = req.body;
            const data = await healthRepository.updateWeight(userId, id, date, weightData, notepad);


            if(data){
                const lastWeightData = await healthRepository.selectWeight('weight', userId);
                console.log(lastWeightData)
                const newData = { 'weight': Number(lastWeightData[0].weightData) };

                const userUpdate = await authRespository.updateUserInfo(userId, newData);

                if (userUpdate) {
                    res.status(200).json({ message: 'Create and userInfo update success' });
                } else {
                    res.status(400).json({ message: 'Create success but userInfo update failed' });
                }

            }else{
                res.status(404).json({ message: 'Update False' });
            }
        }

    }catch{
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

export async function delById(req, res, next){
    try{
        const id = req.query.dataId
        const category = req.query.category;
        const userId = req.id;
        const data = await healthRepository.deleteById(userId, id, category);
        if(category === '몸무게'){
            const lastWeightData = await healthRepository.selectWeight('weight', userId);
            console.log(lastWeightData)
            const newData = { 'weight': Number(lastWeightData[0].weightData) };

            const userUpdate = await authRespository.updateUserInfo(userId, newData);

            if (userUpdate) {
                res.status(200).json({ message: 'Create and userInfo update success' });
            } else {
                res.status(400).json({ message: 'Create success but userInfo update failed' });
            }
        }else{
            res.status(201).json({message: "delete success"})
        }
    }catch{
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
