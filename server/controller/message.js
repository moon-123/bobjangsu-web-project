import coolsms from 'coolsms-node-sdk';
import { config } from '../config.js';

const apiKey = config.message.apiKey;
const apiSecret = config.message.apiSecret;

const sms = coolsms.default;
const messageService = new sms(apiKey, apiSecret);

export let verificationStorage = {};

function generateVerificationCode(length) {
    const numbers = '0123456789';
    let code = '';
    for (let i = 0; i < length; i++) {
        code += numbers.charAt(Math.floor(Math.random() * numbers.length));
    }
    return code;
}

function cleanUpExpiredCodes() {
    const currentTime = Date.now();
    for (const [phoneNumber, { code, timestamp, attempts }] of Object.entries(verificationStorage)) {
        if (currentTime - timestamp > 5 * 60 * 1000) { // 5분
            // console.log(`Deleting expired code for number: ${phoneNumber}`);
            delete verificationStorage[phoneNumber];
        }
    }
}

export async function sendVerificationMessage(phoneNumber) {
    cleanUpExpiredCodes(); // 기존 인증번호 제거

    const verificationCode = generateVerificationCode(6);
    const timestamp = Date.now();
    try {
        const params = {
            to: phoneNumber,
            from: config.message.senderNumber,
            text: `인증 번호는 ${verificationCode}입니다.`,
        };
        
        const response = await messageService.sendOne(params);
        verificationStorage[phoneNumber] = { code: verificationCode, timestamp, attempts: 0 };
        // console.log(`Verification code sent to ${phoneNumber}:`, verificationStorage[phoneNumber]);
        return { verificationCode, response };
    } catch (error) {
        throw error;
    }
}

export function getVerificationCode(phoneNumber) {
    const storedData = verificationStorage[phoneNumber];
    return storedData ? storedData.code : null;
}

export async function sendVerification(req, res) {
    const phoneNumber = req.body.phnumber;
    try {
        const { verificationCode } = await sendVerificationMessage(phoneNumber);
        res.status(200).json({ message: '인증번호가 전송되었습니다.' });
    } catch (error) {
        res.status(500).json({ message: '인증번호 전송 실패', error: error.toString() });
    }
}

export async function verifyCode(req, res) {
    const { phnumber, verificationCode } = req.body;
    try {
        const storedData = verificationStorage[phnumber];

        if (!storedData) {
            return res.status(400).json({ message: '인증번호가 만료되었거나 존재하지 않습니다.' });
        }

        if (verificationCode === storedData.code) {
            res.status(200).json({ message: '인증 성공' });
        } else {
            storedData.attempts = (storedData.attempts || 0) + 1;
            if (storedData.attempts >= 3) {
                delete verificationStorage[phnumber];
                res.status(400).json({ message: '인증번호 재시도 횟수 초과' });
            } else {
                res.status(400).json({ message: '잘못된 인증번호' });
            }
        }
    } catch (error) {
        res.status(500).json({ message: '인증 검증 실패', error: error.toString() });
    }
}
