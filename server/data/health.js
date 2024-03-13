// import { dbConnection } from "../db/database.js";
import Mongoose from 'mongoose';
import mongoose from 'mongoose';
// import { getCollection, getsugars } from '../db/database.js';
// import moment from 'moment-timezone';

// 테이블 형식 
const sugarSchema = new Mongoose.Schema({
    userId: { type: String, required: true },
    date: { type: Date, required: true },
    sugarData: { type: Number, required: true },
    notepad: { type: String }
});

const bloodSchema = new Mongoose.Schema({
    userId: { type: String, required: true },
    date: { type: Date, required: true },
    lowData: { type: Number, required: true },
    highData: { type: Number, required: true },
    notepad: { type: String }
});

const weightSchema = new Mongoose.Schema({
    userId: { type: String, required: true },
    date: { type: Date, required: true },
    weightData: { type: Number, required: true },
    notepad: { type: String }
});

const Sugar = Mongoose.model('sugar', sugarSchema);
const Blood = Mongoose.model('blood', bloodSchema);
const Weight = Mongoose.model('weight', weightSchema);

export async function insertSugar(id, date, sugarData, notepad) {
    try {
        const sugarCollection = Sugar.collection;    

        // const newDate = new Date(date)
        // const utcMoment = moment.utc(newDate);
        // const kstMoment = utcMoment.add(9, 'hours');
        // const dateInKST = kstMoment.toISOString();
        // console.log(dateInKST)

        const newDate = new Date(date)
        const originData = await sugarCollection.find({ userId: id, date: newDate }).toArray();
        if(originData.length > 0){
            const updateResult = await sugarCollection.updateOne(
                { userId: id, date: newDate},
                { $set: { sugarData, notepad } }
            );

            if (updateResult.modifiedCount > 0) {
                return updateResult;
            } else {
                return false
            }
        }else{
            const savedData = new Sugar({
                userId: id,
                date: newDate, 
                sugarData: sugarData,
                notepad: notepad
            }).save();

            return savedData;
        }
    } catch (error) {
        throw error;
    }
}

export async function insertBlood(id, date, lowData, highData, notepad) {
    try {
        const bloodCollection = Blood.collection;
    
        const newDate = new Date(date)
        // const utcMoment = moment.utc(newDate);
        // const kstMoment = utcMoment.add(9, 'hours');
        // const dateInKST = kstMoment.toISOString();
        const originData = await bloodCollection.find({ userId: id, date: newDate }).toArray();
        if(originData.length > 0){
            const updateResult = await bloodCollection.updateOne(
                { userId: id, date: newDate},
                { $set: { lowData, highData, notepad } }
            );

            if (updateResult.modifiedCount > 0) {
                return updateResult;
            } else {
                return false
            }
        }
        const savedData = new Blood({
            userId: id,
            date: newDate,
            lowData: lowData,
            highData: highData,
            notepad: notepad
        }).save();
        return savedData; 
    } catch (error) {
        throw error;
    }
}

export async function insertWeight(id, date, weightData, notepad) {
    try {
        const weightCollection = Weight.collection;
        const newDate = new Date(date)
        // const utcMoment = moment.utc(newDate);
        // const kstMoment = utcMoment.add(9, 'hours');
        // const dateInKST = kstMoment.toISOString();

        const originData = await weightCollection.find({ userId: id, date: newDate}).toArray();
        if (originData.length > 0) {
            const updateResult = await weightCollection.updateOne(
                { userId: id, date: newDate},
                { $set: { weightData, notepad } }
            );

            if (updateResult.modifiedCount > 0) {
                return newDate;
            } else {
                return false
            }
        }else{
            const savedData = await new Weight({
                userId: id,
                date:newDate,
                weightData: weightData,
                notepad: notepad // Corrected from 'text' to 'notepad'
            }).save();
           
            return newDate;
        }
    } catch (error) {
        throw error;
    }
}

// 건강 기록 검색
export async function selectAll(dbName, userId) {
    try {
        let tableCollection
        if(dbName === 'sugar'){
            tableCollection = Sugar.collection
        }
        else{
            tableCollection = Blood.collection
        }
        const allData = await tableCollection.find({ userId: userId }).toArray();


        const dateCounts = allData.reduce((counts, item) => {
            const dateKey = item.date.toISOString().split('T')[0]; 
            counts[dateKey] = (counts[dateKey] || 0) + 1;
            return counts;
        }, {});

        const result = Object.entries(dateCounts).map(([date, count]) => ({
            date: new Date(date),
            count: count
        }));
        return result;
    } catch (error) {
        throw error;
    }
}

export async function selectWeight(dbName, userId) {

    const tableCollection = Weight.collection

    // const tableCollection = getCollection(dbName + 's');

    try {
        const data = await tableCollection.find({ userId: userId }).sort({ date: -1 }).toArray();
        return data;
    } catch (error) {
        throw error;
    }
}

export async function selectOther(dbName, userId, dateString){
    let tableCollection
    if(dbName === 'sugar'){
        tableCollection = Sugar.collection
    }
    else{
        tableCollection = Blood.collection
    }

    const date = new Date(dateString);

    const endDate = new Date(date);
    endDate.setHours(32, 59, 59, 999);

    try {
        const data = await tableCollection.find({
            userId: userId,
            date: {
                $gte: date,
                $lte: endDate
            }
        }).sort({ date: 1 }).toArray();
        return data;
    } catch (error) {
        throw error;
    }
}

export async function selectById(dbName, userId, id){
    try {
        let tableCollection;

        if (dbName === 'sugar') {
            tableCollection = Sugar.collection;
        } else if(dbName === 'blood') {
            tableCollection = Blood.collection;
        } else if(dbName === 'weight'){
            tableCollection = Weight.collection;
        }

        const objectId = new mongoose.Types.ObjectId(id);
        const data = await tableCollection.findOne({
            _id: objectId,
            userId: userId,
        });

        return data;
    } catch (error) {
        throw error;
    }
}

export async function updateSugar( userId, id, date, sugarData, notepad){
    try {
        let tableCollection;

        tableCollection = Sugar.collection;
        const objectId = new mongoose.Types.ObjectId(id);
        const dateObject = new Date(date);
        const parsedSugarData = parseFloat(sugarData); 

        const data = await tableCollection.updateOne(
            {
                _id: objectId,
                userId: userId,
            },
            {
                $set: {
                    date: dateObject,
                    sugarData: parsedSugarData,
                    notepad: notepad,
                },
            }
        )
        return data;

    } catch (error) {
        throw error;
    }
}

export async function updateBlood(userId, id, date, lowData, highData, notepad){
    try {
        let tableCollection;

        tableCollection = Blood.collection;
        const objectId = new mongoose.Types.ObjectId(id);
        const dateObject = new Date(date);
        const parsedlowData = parseFloat(lowData); 
        const parsedhighData = parseFloat(highData); 

        const data = await tableCollection.updateOne(
            {
                _id: objectId,
                userId: userId,
            },
            {
                $set: {
                    date: dateObject,
                    lowData: parsedlowData,
                    highgData: parsedhighData,
                    notepad: notepad,
                },
            }
        )
        return data;

    } catch (error) {
        throw error;
    }
}

export async function updateWeight(userId, id, date, weightData, notepad){
    try {
        let tableCollection;

        tableCollection = Weight.collection;
        const objectId = new mongoose.Types.ObjectId(id);
        const dateObject = new Date(date);
        const parsedWeightData = parseFloat(weightData); 
        

        const data = await tableCollection.updateOne(
            {
                _id: objectId,
                userId: userId,
            },
            {
                $set: {
                    date: dateObject,
                    weightData: parsedWeightData,
                    notepad: notepad,
                },
            }
        )
        return data;

    } catch (error) {
        throw error;
    }
}

export async function deleteById(userId, id, category){
    try{
        let tableCollection;
        if (category === '혈당') {
            tableCollection = Sugar.collection;
        } else if(category === '혈압') {
            tableCollection = Blood.collection;
        } else if(category === '몸무게'){
            tableCollection = Weight.collection;
        }

        const objectId = new mongoose.Types.ObjectId(id);
        const data = await tableCollection.deleteOne(
            {
                _id: objectId,
                userId: userId,
            }
        )
        return data;


    } catch (error) {
        throw error;
    }
}

