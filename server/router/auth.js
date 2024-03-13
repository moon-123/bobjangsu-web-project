import express from "express";
import { body } from 'express-validator';
import { validate } from '../middleware/validator.js';
import * as authController from '../controller/auth.js'
import * as messageController from '../controller/message.js';
import { isAuth } from '../middleware/auth.js';
import adminRouter from './admin.js';
import rateLimit from "express-rate-limit";

const router = express.Router();

const createAccountLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1시간 정지
    max: 5, // 각 IP별 5번의 요청만 허용
    message: '1시간 동안 너무 많은 계정 생성 요청이 감지되었습니다. 나중에 다시 시도해주세요.'
});

// validation
const validateLogin = [
    body('userid').notEmpty().withMessage('아이디는 반드시 입력되어야 함.'),
    body('userpassword')
        .trim()
        .notEmpty()
        .withMessage('비밀번호 번호는 반드시 입력되어야 합니다.')
        .isLength({ max: 4}).withMessage('비밀번호는 4자리 입니다.'),
    validate
];

const validateSignup = [
    body('userid')
        .notEmpty().withMessage('아이디는 반드시 입력')
        .isLength({ max: 20 }).withMessage('아이디는 최대 20자 입니다.'),
    body('userpassword')
        .trim()
        .notEmpty().withMessage('비밀번호는 반드시 입력')
        .isNumeric().withMessage('비밀번호는 숫자만 포함해야 합니다.')
        .isLength({ max: 4 }).withMessage('비밀번호는 4자리 입니다.'),
    body('username')
        .notEmpty().withMessage('이름은 반드시 입력')
        .isLength({ max: 10 }),
    body('gender')
        .notEmpty().withMessage('성별타입은 반드시 입력해야 합니다.')
        .isIn(['male', 'female']).withMessage('유효한 성별을 입력해 주세요'),
    body('phnumber')
        .notEmpty().withMessage('핸드폰 번호는 반드시 입력')
        .isNumeric().withMessage('핸드폰 번호는 숫자만 포함해야 합니다.')
        .isLength({ max: 11 }).withMessage('핸드폰 번호는 11자리'),
    body('birthday.type')
        .notEmpty().withMessage('생년월일 타입은 반드시 입력해야 합니다.')
        .isIn(['solar', 'lunar']).withMessage('유효한 생년월일 타입을 입력해 주세요'),
    body('birthday.year')
        .notEmpty().withMessage('생년월일은 반드시 입력해야 합니다.'),
    validate
];

const validateSendVerification = [
    body('phnumber')
        .notEmpty().withMessage('핸드폰 번호는 반드시 입력')
        .isNumeric().withMessage('핸드폰 번호는 숫자만 포함해야 합니다.')
        .isLength({ max: 11 }).withMessage('핸드폰 번호는 11자리'),
    validate
];

const validateVerifyCode = [
    body('phnumber')
        .notEmpty().withMessage('핸드폰 번호는 반드시 입력')
        .isNumeric().withMessage('핸드폰 번호는 숫자만 포함해야 합니다.')
        .isLength({ max: 11 }).withMessage('핸드폰 번호는 11자리'),
    body('verificationCode').notEmpty().isNumeric().isLength({ max: 6 })
]

const validateSearchID = [
    body('username').notEmpty().withMessage('이름은 반드시 입력'),
    body('phnumber').notEmpty().isLength({ max: 11 }).withMessage('핸드폰 번호는 11자리'),
    validate
];

const validateSearchPw = [
    body('phnumber').notEmpty().isLength({ max: 11 }).withMessage('핸드폰 번호는 11자리'),
    body('verificationCode').notEmpty().isNumeric().isLength({ max: 6 }),
    validate
];

const validateNewPw = [
    body('newPassword').notEmpty().isNumeric().isLength({ max: 4 })
]

// 회원가입 및 로그인
router.post('/signup', validateSignup, authController.signup);
router.post('/login', validateLogin, authController.login);

// 사용자 아이디 찾기
router.post('/searchID', validateSearchID, authController.searchuserid);

// 사용자 비밀번호 찾기
router.post('/searchPW', validateSearchPw, authController.findPassword);

// 사용자 비밀번호 변경
router.post('/changePW', validateNewPw, authController.changePassword);

// 내 정보 보기
router.get('/me', isAuth, authController.me);

// 인증번호 전송을 위한 라우트
router.post('/sendVerification', createAccountLimiter, validateSendVerification, messageController.sendVerification);

// 인증번호 검증을 위한 라우트
router.post('/verifyCode', validateVerifyCode, messageController.verifyCode);

// 관리자 라우팅
router.use('/administrator', adminRouter);

// 개인 정보 보여주기
router.get('/myData', isAuth, authController.searchmyData)

// 개인 정보 수정 
router.post('/myData/update', isAuth, authController.updatemyData)

// 공지사항 가져오기
router.post('/noticesboard', authController.getnotice)

export default router;