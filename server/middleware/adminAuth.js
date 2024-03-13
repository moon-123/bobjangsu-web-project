import jwt, { decode } from 'jsonwebtoken';
import { config } from '../config.js';
import * as adminRepository from '../data/admin.js';

const AUTH_ERROR = { message: '인증에러' }; // 에러 메시지 정의

export const isAdmin = async (req, res, next) => {
    const authHeader = req.get('Authorization');

    // 토큰이 있는지 확인
    if (!(authHeader && authHeader.startsWith('Bearer '))) {
        return res.status(401).json({ message: '인증되지 않은 토큰 입니다.' });
    }

    const token = authHeader.split(' ')[1];

    // 토큰 검증
    jwt.verify(
        token, config.jwt.secretKey, async (error, decoded) => {
            if (error) {
                return res.status(401).json(AUTH_ERROR);    
            }

            // decoded.id를 사용하여 관리자 조회
            const admin = await adminRepository.findByAdminid(decoded.adminId);
            
            if (!admin) {
                return res.status(401).json(AUTH_ERROR);
            }

            req.admin = admin.adminId;
            next();
        }
    );
};
