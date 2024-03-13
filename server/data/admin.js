import { User } from './auth.js';
import { Userdata } from './userdata.js'

import mongoose from 'mongoose';

const { ObjectId } = mongoose.Types;

const adminSchema = new mongoose.Schema({
    adminId: { type: String, required: true },
    adminPassword: { type: String, required: true }
},{
    collection: 'admin_accounts'
});

const noticeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    createdAt: {
      type: Date,
      default: Date.now,
}},{
    collection: 'notices_board'
});

const Admin = mongoose.model('Admin', adminSchema);
const Notice = mongoose.model('Notice', noticeSchema);

// [관리자] 계정 조회
export async function findByAdminid(adminId){
    try {
        return Admin.findOne({ adminId });
    } catch (error) {
        console.error(error)
        throw new Error('관리자 아이디를 가져오는 중 오류가 발생했습니다.')
    }
}

// [관리자] 모든 사용자 목록 가져오기
export async function getAllUsers(query = {}, skipIndex, limit) {
    try {
        return User.find(query).sort({ createdAt: -1 }).limit(limit).skip(skipIndex);
    } catch (error) {
        console.error(error)
        throw new Error('사용자 목록을 가져오는 중 오류가 발생했습니다.')
    }
}

// [관리자] 사용자 정보 업데이트
export async function updateUser(id, updateData) {
    try {
        const result = await User.updateOne({ _id: id }, { $set: updateData });
        return result.modifiedCount === 1;
    } catch (error) {
        console.error(error)
        throw new Error('사용자 정보 업데이트 중 오류가 발생했습니다.')
    }
}

// [관리자] 사용자 헬스 정보 업데이트
export async function updateUserHealthInfo(userId, healthInfo) {
    try {
        // 업데이트할 데이터를 동적으로 생성
        const updateData = {};
        if (healthInfo.weight !== undefined) updateData.weight = healthInfo.weight;
        if (healthInfo.height !== undefined) updateData.height = healthInfo.height;
        if (healthInfo.allergy !== undefined) updateData.allergy = healthInfo.allergy;
        if (healthInfo.energy !== undefined) updateData.energy = healthInfo.energy;

        // 업데이트 쿼리 구성
        const update = { $set: updateData };

        // 데이터베이스 업데이트
        const result = await Userdata.updateOne({ id: userId }, update, {returnDocument: "after"});

        return result.modifiedCount;
    } catch (error) {
        console.error(error);
        throw new Error('사용자 건강 정보 업데이트 중 오류가 발생했습니다.');
    }
}

// [관리자] 사용자 삭제
export async function deleteUser(id) {
    try {
        const result = await User.deleteOne({ _id: id });
        return result.deletedCount === 1;
    } catch (error) {
        console.error(error)
        throw new Error('사용자 삭제 중 오류가 발생했습니다.')
    }
}

// [관리자] 공지사항 생성
export async function createNotice(noticeData) {
    try {
        const notice = new Notice(noticeData);
        return notice.save();
    } catch (error) {
        console.error(error)
        throw new Error('공지사항 생성 중 오류가 발생했습니다.')
    }
}

// [관리자] 공지사항 수정
export async function updateNotice(id, title, content) {
    try {
        const updatenotice = await Notice.findByIdAndUpdate(id, { title, content }, { new: true });
    
        if (!updatenotice) {
            return null; 
        }
    
        return updatenotice;
    } catch (error) {
        console.error(error)
        throw new Error('공지사항 수정 중 오류가 발생했습니다.')
    }
}

// [관리자] 공지사항 삭제
export async function deleteNotice(id) {
    try {
        const result = await Notice.findByIdAndDelete(id);
    
        if(!result){
            console.error('공지사항을 찾지 못했습니다.')
        }
        return result
    } catch (error) {
        console.error(error)
        throw new Error('공지사항 삭제 중 오류가 발생했습니다.')
    }
}

// [관리자] 공지사항 조회
export async function getAllNotices(query, page, limit) {
    try {
        const skip = (page - 1) * limit;
        return Notice.find(query)
                     .sort({ createdAt: -1})
                     .skip(skip)
                     .limit(limit);
    } catch (error) {
        console.error(error)
        throw new Error('공지사항 목록을 가져오는 중 오류가 발생했습니다.')
    }
}

// [관리자] 공지사항 id조회
export async function getNoticeById(id){
    try {
        return Notice.findById(id);
    } catch (error) {
        console.error(error)
        throw new Error('공지사항 id을 가져오는 중 오류가 발생했습니다.')
    }
}

export async function countNotices(query) {
    try {
        return await Notice.countDocuments(query);
    } catch (error) {
        console.error(error);
        throw new Error('공지사항 수를 세는 중 오류가 발생했습니다.');
    }
}