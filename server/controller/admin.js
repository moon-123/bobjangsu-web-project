import * as userRepository from '../data/auth.js';
import * as adminRepository from '../data/admin.js'
import bcrypt from 'bcrypt';
import { config } from '../config.js';
import jwt from 'jsonwebtoken';
import { User } from '../data/auth.js'
import { Userdata } from '../data/userdata.js';
import { marked } from'marked';

export async function adminLogin(req, res) {
    try {
        const { adminId, adminPassword } = req.body;
    
        // 데이터베이스에서 사용자 조회
        const admin = await adminRepository.findByAdminid(adminId);
    
        if (!admin) {
            return res.status(401).json({ message: '아이디 혹은 비밀번호가 틀렸습니다.'});
        }
    
        const isValidpassword = await bcrypt.compare(adminPassword, admin.adminPassword);
    
    
        if(!isValidpassword){
            return res.status(401).json({message:'아이디 혹은 비밀번호가 틀렸습니다.'});
        }
    
        const token = createJwtToken(admin.adminId);
    
        res.status(200).json({ token, adminId });
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: '서버 오류'})
    }
}

function createJwtToken(adminId){
    return jwt.sign({ adminId }, config.jwt.secretKey, { expiresIn: config.jwt.expiresInSec });
};


// [관리자] 전체 조회 및 검색
export async function getUsersList(req, res) {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skipIndex = (page - 1) * limit;
        const searchQuery = req.query.search;
    
        let query = {};
    
        if (searchQuery) {
            // 아이디 또는 이름으로 검색
            query = {
                $or: [
                    { userid: { $regex: searchQuery, $options: 'i' } },
                    { username: { $regex: searchQuery, $options: 'i' } }
                ]
            };
        }
    
        const totalUsers = await User.countDocuments(query);
        const totalPages = Math.ceil(totalUsers / limit);
    
        const users = await adminRepository.getAllUsers(query, skipIndex, limit);
    
        res.status(200).json({ users, totalPages });
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: '서버 오류' })
    }
}

// [관리자] 사용자 생성
export async function createUser(req, res) {
    try {
        const { userid, userpassword, username, gender, birthday, phnumber } = req.body;
        
        // 중복 사용자 검사
        const existingUser = await userRepository.findByUserid(userid);
        if (existingUser) {
            return res.status(409).json({ message: '이미 존재하는 사용자입니다.' });
        }
    
        const birthdayData = {
            type: birthday.type,
            year: birthday.year
        }
    
        // 비밀번호 해시
        const hashedPassword = bcrypt.hashSync(userpassword, config.bcrypt.saltRounds);
    
        // 사용자 생성
        const createdUser = await userRepository.createUser({
            userid,
            userpassword: hashedPassword,
            username,
            gender,
            birthday: birthdayData,
            phnumber
        });
    
        res.status(201).json(createdUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '서버 오류' });
    }
}

// [관리자] 사용자 한개 정보 불러오기
export async function getOneUsers(req, res) {
    try {
        const userId = req.params.id;
        const user1 = await userRepository.findById(userId)
        const completeUserData = await userRepository.getUserCompleteData(userId);

        if (!user1) {
            return res.status(404).json({ message: '사용자 정보를 찾을 수 없습니다.' });
        }

        // birthdayData 구성
        const birthdayData = {
            type: user1.birthday.type,
            year: user1.birthday.year
        }

        const user = {
            userid: user1.userid,
            username: user1.username,
            gender: user1.gender,
            birthday: birthdayData,
            phnumber: user1.phnumber,
            height: completeUserData.height || '정보 없음',
            weight: completeUserData.weight || '정보 없음',
            allergy: completeUserData.allergy || '정보 없음',
            energy: completeUserData.energy || '정보 없음'
        };

        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '서버 오류' });
    }
}


//[관리자] 사용자 정보 수정 
export async function updateUser(req, res) {   
    try {
        const id = req.params.id;
        const { username, gender, birthday, phnumber, weight, height, allergy, energy } = req.body;

        // 사용자 존재 여부 확인
        const user = await userRepository.findById(id);
        if (!user) {
            return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
        }

        // 사용자 기본 정보 업데이트
        await adminRepository.updateUser(id, { username, gender, birthday, phnumber });

        // 사용자 건강 정보 업데이트
        await adminRepository.updateUserHealthInfo(id, { weight, height, allergy, energy });

        res.status(200).json({ message: '사용자 정보가 업데이트 되었습니다.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '서버 오류' });
    }
}


//[관리자] 사용자 삭제
export async function deleteUser(req, res) {
    try {
        const userId = req.params.id;
    
        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) {
            return res.status(404).json({ message: '해당 사용자를 찾을 수 없습니다.' });
        }

        await Userdata.deleteMany({ id: userId });

        res.status(200).json({ message: '사용자와 관련된 모든 정보가 삭제되었습니다.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '서버 오류' });
    }
}

// [관리자] 공지사항 생성
export async function createNotice(req, res) {
    try {
        const { title, content } = req.body;
        const createdAt = new Date(); // 현재 시간으로 작성시간 설정
        const htmlContent = marked(content);
    
        const notice = {
            title,
            content: htmlContent,
            createdAt
        };
    
        // 공지사항을 데이터베이스에 저장
        const createdNotice = await adminRepository.createNotice(notice);
        res.status(201).json(createdNotice); // 생성된 공지사항 반환
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '서버 오류' });
    }
}

//[관리자] 공지사항 수정
export async function updateNotice(req, res) {
    try {
        const id = req.params.id;
        const { title, content } = req.body;
    
        // 마크다운을 HTML로 변환
        const htmlContent = marked(content);
    
        const success = await adminRepository.updateNotice(id, title, htmlContent);
    
        if (!success) {
            return res.status(404).json({ message: '공지사항을 찾을 수 없습니다.' });
        }
    
        res.status(200).json({ message: '공지사항이 업데이트 되었습니다.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '서버 오류' });
    }
}

//[관리자] 공지사항 삭제
export async function deleteNotice(req, res) {
    try {
        const id = req.params.id;
        const deletedNotice = await adminRepository.deleteNotice(id);
        if (!deletedNotice) {
            return res.status(404).json({ message: '공지사항을 찾을 수 없습니다.' });
        }
        res.status(200).json({ message: '공지사항이 삭제되었습니다.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '서버 오류' });
    }
}

//[관리자] 전체 공지사항 조회
export async function getNotices(req, res) {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const title = req.query.title || '';
    
        const query = {};
        if (title) {
            query.title = { $regex: title, $options: 'i' }; // 대소문자 구분 없는 부분 일치 검색
        }
    
        const totalNotices = await adminRepository.countNotices(query);
        const totalPages = Math.ceil(totalNotices / limit);
        const notices = await adminRepository.getAllNotices(query, page, limit);
    
        // 각 공지사항의 내용을 마크다운에서 HTML로 변환
        const noticesWithHtml = notices.map(notice => ({
            ...notice._doc,
            content: marked(notice.content)
        }));
    
        res.status(200).json({ notices: noticesWithHtml, totalPages });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '서버 오류' });
    }
}

// [관리자]공지사항 한개 가져오기
export async function OneNotices(req, res) {
    try {
        const id = req.params.id;
        const notice = await adminRepository.getNoticeById(id);

        if (!notice) {
            return res.status(404).json({ message: '공지사항을 찾을 수 없습니다.' });
        }

        // 마크다운 내용을 HTML로 변환
        const htmlContent = marked(notice.content);

        // 가져온 공지사항 정보를 클라이언트에게 응답
        res.status(200).json({ ...notice._doc, content: htmlContent });
    } catch (error) {
        res.status(500).json({ message: '서버 오류 발생' });
    }
}