import * as userRepository from '../data/auth.js';
import * as adminRepository from '../data/admin.js'
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import { verificationStorage } from './message.js';
import { marked } from'marked';

export async function signup(req, res){
    try {
        const { userid, userpassword, username, gender, birthday, phnumber, verificationCode } = req.body;

        const existingUserWithPhone = await userRepository.findByPhone(phnumber);
        if (existingUserWithPhone) {
            return res.status(409).json({ message: '이미 사용중인 핸드폰 번호입니다.' });
        }
    
        const storedData = verificationStorage[phnumber];
        if (!storedData || storedData.code !== verificationCode) {
            return res.status(401).json({ message: '잘못된 인증번호입니다.' });
        }
    
        // 인증번호의 유효 시간 검사 (예: 3분)
        if (Date.now() - storedData.timestamp > 3 * 60 * 1000) {
            return res.status(401).json({ message: '인증번호가 만료되었습니다.' });
        }
    
        // 인증번호 재시도 횟수 검사
        if (storedData.attempts >= 3) {
            return res.status(401).json({ message: '인증번호 재시도 횟수 초과' });
        }
    
        const userdata = await userRepository.findByUserid(userid);
    
        if (userdata) {
            return res.status(409).json({ message: '이미 사용중인 아이디입니다.' });
        }
    
        const birthdayData = {
            type: birthday.type,
            year: birthday.year
        }
    
        const hashed = bcrypt.hashSync(userpassword, config.bcrypt.saltRounds);
    
        const result = await userRepository.createUser({
            userid,
            userpassword: hashed,
            username,
            gender,
            birthday: birthdayData,
            phnumber
        });
    
        const token = createJwtToken(result);
        res.status(201).json({ token, userid });
    
        delete verificationStorage[phnumber];
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '서버 오류' });
    }
};

// 존맛탱 토큰 만드는 함수, 매개변수 헷갈림 주의
function createJwtToken(id){
    return jwt.sign({ id }, config.jwt.secretKey, { expiresIn: config.jwt.expiresInSec });
};

export async function login(req, res) {
    try {
        const { userid, userpassword } = req.body;
    
        const userdata = await userRepository.findByUserid(userid);
    
        if (!userdata) {
            return res.status(401).json({ message: '아이디 혹은 비밀번호가 틀렸습니다.'});
        }
    
        const isValidpassword = await bcrypt.compare(userpassword, userdata.userpassword);
    
        if(!isValidpassword){
            return res.status(401).json({message:'아이디 혹은 비밀번호가 틀렸습니다.'});
        }
    
        const token = createJwtToken(userdata.id);
        res.status(200).json({ token, userid });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '서버 오류' });
    }
}

export async function me(req, res, next) {
    try {
        const user = await userRepository.findById(req.id);
    
        if (!user) {
            return res.status(404).json({ message: `사용자를 찾을 수 없습니다.` });
        }
    
        res.status(200).json({ 
            username: user.username
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '서버 오류' });
    }
}

export async function updateme(req, res, next){
    try {
        const id = req.params.id;
        const { username, gender, birthday, phnumber } = req.body;
        const user = await userRepository.findById(id);
        if (!user) {
            return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
        }
    
        // 사용자 정보 업데이트
        await userRepository.updateUser(id, { username, gender, birthday, phnumber });
        res.status(200).json({ message: '사용자 정보가 업데이트 되었습니다.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '서버 오류' });
    }
}

export async function searchuserid(req, res, next){
    try {
        const { username, phnumber } = req.body;
    
        const user = await userRepository.findByUsernamephnumber(username, phnumber);
    
        if (user) {
            res.status(200).json({ userId: user.userid });
        } else {
            res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '서버 오류' });
    }
}

export async function findPassword(req, res, next){
    try {
        const { userid, phnumber, verificationCode } = req.body;
    
        const user = await userRepository.findByUserid(userid);
    
        if (!user) {
            return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
        }
    
        const storedPhNumber = user.phnumber;
        if (phnumber !== storedPhNumber) {
            return res.status(400).json({ message: '잘못된 핸드폰 번호 입니다.' });
        }
    
        // 저장된 인증번호와 제출된 인증번호를 비교
        const storedData = verificationStorage[phnumber];
        if (!storedData || storedData.code !== verificationCode) {
            return res.status(400).json({ message: '잘못된 인증번호 입니다.' });
        }
    
        // 인증번호의 유효 시간 검사
        if (Date.now() - storedData.timestamp > 3 * 60 * 1000) {
            return res.status(401).json({ message: '인증번호가 만료되었습니다.' });
        }
    
        // 인증번호 재시도 횟수 검사
        if (storedData.attempts >= 3) {
            return res.status(401).json({ message: '인증번호 재시도 횟수 초과' });
        }
    
        const token = createJwtToken(user._id);
        
        delete verificationStorage[phnumber];
    
        res.status(200).json({ message: '인증 성공', token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '서버 오류' });
    }
}

export async function changePassword(req, res) {
    try {
        const { newPassword } = req.body;
        const authHeader = req.headers.authorization;
    
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: '인증이 필요합니다.' });
        }
    
        const token = authHeader.split(' ')[1];
    
        const decoded = jwt.verify(token, config.jwt.secretKey);
        const userId = decoded.id;
    
        const user = await userRepository.findById(userId);
        if (!user) {
            return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
        }
    
        const hashedNewPassword = bcrypt.hashSync(newPassword, config.bcrypt.saltRounds);
    
        await userRepository.updatePassword(userId, hashedNewPassword);
    
        res.status(200).json({ message: '비밀번호가 성공적으로 변경되었습니다.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '서버 오류' });
    }
}

export async function searchmyData(req, res, next){
    try {
        const userid = req.id
        const data  = await userRepository.findUserAllData(userid);

        if (data) {
            res.status(200).json({ data });
        } else {
            res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }

}

export async function updatemyData(req, res, next){
    try {
        const id = req.id
        const data  = await userRepository.updateUserInfo(id, req.body);
        if (data) {
            res.status(200).json({ data });
        } else {
            res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
}

// 공지 사항 가져오기 
export async function getnotice(req, res, next){
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 2;

    const query = {};

    try {
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
        res.status(500).json({ message: '서버 오류 발생' });
    }
}
