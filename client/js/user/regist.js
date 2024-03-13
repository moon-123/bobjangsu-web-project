let isVerified = false;

function formatPhoneNumber(phnumber) {
    phnumber = phnumber.trim();
    phnumber = phnumber.replace(/-/g, '');
    const phoneRegex = /^01([0|1|6|7|8|9])([0-9]{3,4})([0-9]{4})$/;
    if (!phoneRegex.test(phnumber)) {
        alert('올바른 전화번호 형식이 아닙니다.');
        return null;
    }
    return phnumber;
}

// 유효성 검사 함수
function validateInput() {
    const userid = document.getElementById('userid').value.trim();
    const userpassword = document.getElementById('userpassword').value;
    const checkuserpassword = document.getElementById('checkuserpassword').value;

    // 아이디
    if (userid.length > 20) {
        alert('사용자 아이디는 20자를 초과할 수 없습니다.');
        return false;
    }

    if (/\s/.test(userid)) {
        alert('아이디에 띄어쓰기를 사용할 수 없습니다.');
        return false;
    }
    
    // 비밀번호
    const passwordRegex = /^\d{4}$/;
    if (!passwordRegex.test(userpassword)) {
        alert('비밀번호는 숫자 4자리여야 합니다.');
        return false;
    }

    // 비밀번호 일치 여부
    if(userpassword !== checkuserpassword){
        alert('비밀번호가 일치하지 않습니다.');
        return false;
    }
    return true;
}

let verificationAttemptCount = 0;
const maxVerificationAttempts = 3;
let timerInterval;

function startTimer(duration, callback) {
    let timer = duration;
    document.getElementById('sendVerification').style.display = 'none';
    timerInterval = setInterval(() => {
        let minutes = parseInt(timer / 60, 10);
        let seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        document.getElementById('time').textContent = minutes + ":" + seconds;

        if (timer <= 0) {
            clearInterval(timerInterval);
            callback();
        }
        timer--;
    }, 1000);
}

function enableVerificationButton() {
    document.getElementById('sendVerification').style.display = 'block';
    document.getElementById('sendVerification').disabled = false;
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('sendVerification').addEventListener('click', async function(event) {
        event.preventDefault();

        if (verificationAttemptCount >= maxVerificationAttempts) {
            alert(`인증번호 요청은 최대 ${maxVerificationAttempts}회까지 가능합니다.`);
            return;
        }

        const phnumber = formatPhoneNumber(document.getElementById('phnumber').value);
        if (!phnumber) {
            return;
        }

        try {
            const response = await fetch('https://port-0-server-57lz2alpj8pw34.sel5.cloudtype.app/auth/sendVerification', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ phnumber: phnumber })
            });

            if (response.status === 200) {
                alert('인증번호가 전송되었습니다. 문자를 확인해주세요.');
                document.getElementById('verificationSection').style.display = 'block';
                startTimer(180, enableVerificationButton);
                this.disabled = true;
            } else {
                alert('인증번호 전송에 실패했습니다.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('인증번호 전송에 실패했습니다.');
        }

        verificationAttemptCount++;

        if (verificationAttemptCount >= maxVerificationAttempts) {
            document.getElementById('sendVerification').style.display = 'none';
            alert(`더 이상 인증번호를 요청할 수 없습니다.`);
        }
    });
});

    // 인증번호 검증 버튼 이벤트 리스너
    document.getElementById('verifyCode').addEventListener('click', async function(event) {
        event.preventDefault();
        const phnumber = formatPhoneNumber(document.getElementById('phnumber').value);
        const inputVerificationCode = document.getElementById('verificationCode').value;
    
        try {
            const response = await fetch('https://port-0-server-57lz2alpj8pw34.sel5.cloudtype.app/auth/verifyCode', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ phnumber, verificationCode: inputVerificationCode })
            });
    
            const data = await response.json();
            if (response.status === 200) {
                isVerified = true;
                document.getElementById('sendVerification').style.display = 'none';
                document.getElementById('hp').style.display = 'none';
                alert('인증 성공 : ' + data.message);
            } else {
                isVerified = false;
                alert('인증 실패 : ' + data.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('인증 검증 중 오류가 발생했습니다.');
        }
        if (isVerified) {
            document.getElementById('verificationSection').style.display = 'none';
            document.getElementById('verificationCode').required = false;
            document.getElementById('checkMessage').style.display = 'block';
            
        }
    });


// 회원가입 폼 제출 이벤트 리스너
document.getElementById('registForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const userid = document.getElementById('userid').value.trim();
    const userpassword = document.getElementById('userpassword').value;
    const username = document.getElementById('username').value;
    const gender = document.querySelector('input[name="gender"]:checked').value;
    const birthdayType = document.querySelector('input[name="birthday_type"]:checked').value;
    
    const year = document.getElementById('year').value
    const month = document.getElementById('month').value
    const day = document.getElementById('day').value
    const birthdayYear = year + '-' + month + '-' + day

    const phnumber = `${document.getElementById('phnumber').value.trim()}`;
    const verificationCode = document.getElementById('verificationCode').value;
// "2023-12-14"

    if (!userid || !userpassword || !username || !gender || !birthdayType || !birthdayYear || !phnumber) {
        alert('모든 값을 입력해 주세요.');
        return;
    }

    if (!isVerified) {
        document.getElementById('verificationCode').required = true;
        event.preventDefault();
        alert('핸드폰번호 인증을 받아야합니다.');
        return;
    }

    if (!validateInput()) {
        event.preventDefault();
        return;
    }

    // 서버로 전송할 데이터 객체
    const data = {
        userid,
        userpassword,
        username,
        gender,
        birthday: {
            type: birthdayType,
            year: birthdayYear,
        },
        phnumber,
        verificationCode
    };

    // 서버 요청 부분
    try {
        const response = await fetch('https://port-0-server-57lz2alpj8pw34.sel5.cloudtype.app/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        const result = await response.json()

        if (response.status === 201) {
            localStorage.setItem('jwt', result.token);
            alert('회원가입이 완료되었습니다.');
            window.location.href = '../index.html';
        } else {
            alert(result.message || '회원가입에 실패했습니다.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('회원가입에 실패했습니다.');
    }
});