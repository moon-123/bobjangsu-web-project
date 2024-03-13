import exporess from 'express'
import * as healthControllor from '../controller/health.js'
import { isAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validator.js';
import { body } from 'express-validator';

const router = exporess.Router()

const validateBlood = [
    body('date').notEmpty().withMessage('날짜는 반드시 입력되어야 함.'),
    body('lowData')
        .trim()
        .notEmpty().withMessage('저혈합값 무조건 입력')
        .isFloat({ min: 0, max: 250 }).withMessage('수치는 0과 250 사이여야 합니다.'),
    body('highData')
        .trim()
        .notEmpty().withMessage('고혈합값 무조건 입력')
        .isFloat({ min: 0, max: 250 }).withMessage('수치는 0과 250 사이여야 합니다.')
        .custom((value, { req }) => {
            // Custom validation: Ensure highData is greater than or equal to lowData
            const lowData = parseFloat(req.body.lowData);
            const highData = parseFloat(value);
            if (lowData > highData) {
                throw new Error('고혈압 값은 저혈압 값보다 커야 합니다.');
            }
            return true;
        }),
    validate
];

const validateSugar = [
    body('date').notEmpty().withMessage('날짜는 반드시 입력되어야 함.'),
    body('sugarData')
        .trim()
        .notEmpty().withMessage('혈당값 무조건 입력')
        .isFloat({ min: 0, max: 600 }).withMessage('수치는 0과 600 사이여야 합니다.'),
    validate
];

const validateWeight = [
    body('date').notEmpty().withMessage('날짜는 반드시 입력되어야 함.'),
    body('weightData')
        .trim()
        .notEmpty().withMessage('몸무게값 무조건 입력')
        .isFloat({ min: 20, max: 400 }).withMessage('수치는 0과 400 사이여야 합니다.'),
    validate
];

// 건강 부분 라우터
// 혈압
// localhost:8080/health/createdBlood
// {
//     date: { type: Date, required: true },
//     lowData: { type: Number, required: true },
//     highData: { type: Number, required: true },
//     notepad: { type: String }
// }
router.post('/createBlood', validateBlood, isAuth, healthControllor.createBlood)

// 혈당
// localhost:8080/health/createSugar
// {
//     date: { type: Date, required: true },
//     sugarData: { type: Number, required: true },
//     notepad: { type: String }
// }
router.post('/createSugar', validateSugar, isAuth , healthControllor.createSugar)

// 몸무게
// localhost:8080/health/createWeight
// {
//     date: { type: Date, required: true },
//     lowData: { type: Number, required: true },
//     highData: { type: Number, required: true },
//     notepad: { type: String }
// }
router.post('/createWeight', validateWeight, isAuth , healthControllor.createWeight)

// 건강 보기
// localhost:8080/health/countData/?category={혈당, 혈입}
// 각각 카테고리에 맞는 collection 연결 
// 시간별로 count 계산
router.get('/countData', isAuth , healthControllor.getAll);

// 건강보기 검색 기능 
// localhost:8080/health/serachData/?category={혈당, 혈압}&date={시간(YY-MM-DD형식)}
// 검색 기능 
// 특정 날짜 검색 하면 
// 그날짜의 count수 출력 
router.get('/serachData', isAuth , healthControllor.getByDate)

// 차트 만들기 
// localhost:8080/health//chartData/?category={혈당, 혈압}&date={시간(YY-MM-DD형식)}
// localhost:8080/health//chartData/?category={몸무게}
// 차트에 필요한 데이터 가져오기 
// 혈당, 혈압인 경우 당일 즉 하루치의 데이터만 가져오기 
// 몸무게 인 경우, 마지막 7개 데이터만 가져오기 
router.get('/chartData', isAuth , healthControllor.getChartData)

router.get('/serchDataByID', isAuth, healthControllor.getById)

router.post('/updateData', isAuth, healthControllor.updateData)

router.delete('/delDataById', isAuth,  healthControllor.delById)

export default router