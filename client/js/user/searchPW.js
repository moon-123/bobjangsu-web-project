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

function isValidPassword(password) {
    const passwordRegex = /^\d{4}$/;
    return passwordRegex.test(password);
}

let timerInterval;

function startTimer(duration, callback) {
    let timer = duration;
    document.getElementById('sendVerification').style.display = 'none'; 
    document.getElementById('phnumber').style.display = 'none'; 
    document.getElementById('textphnumber').style.display = 'none'; 
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
    document.getElementById('phnumber').style.display = 'block';
    document.getElementById('textphnumber').style.display = 'block';
    document.getElementById('textverificationCode').style.display = 'block';
    document.getElementById('verificationCode').style.display = 'block';
    document.getElementById('verifyCode').style.display = 'block';
    document.getElementById('checkMessage').style.display = 'none';
}

document.getElementById('sendVerification').addEventListener('click', async function(event) {
    event.preventDefault();
    const phnumber = formatPhoneNumber(document.getElementById('phnumber').value.trim());
    if (!phnumber) {
        return;
    }

    try {
        const response = await fetch('https://port-0-server-57lz2alpj8pw34.sel5.cloudtype.app/auth/sendVerification', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ phnumber })
        });
        if (response.status === 200) {
            alert('인증번호가 전송되었습니다. 문자를 확인해주세요.');
            startTimer(180, enableVerificationButton);
        } else {
            alert('인증번호 전송에 실패했습니다.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('인증번호 전송에 실패했습니다.');
    }
});

// 인증번호 검증
document.getElementById('verifyCode').addEventListener('click', async function(event) {
    event.preventDefault();
    const phnumber = formatPhoneNumber(document.getElementById('phnumber').value);
        if (!phnumber) {
            return;
        }
    const verificationCode = document.getElementById('verificationCode').value;

    // 서버에 인증번호 검증 요청을 보내는 코드
    try {
        const response = await fetch('https://port-0-server-57lz2alpj8pw34.sel5.cloudtype.app/auth/verifyCode', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ phnumber, verificationCode })
        });
        if (response.status === 200) {
            document.getElementById('verificationCode').style.display='none';
            document.getElementById('time').style.display='none'
            document.getElementById('textverificationCode').style.display='none'
            document.getElementById('verifyCode').style.display='none'
            document.getElementById('checkMessage').style.display='block'
;            alert('인증 성공');
        } else {
            alert('잘못된 코드');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('인증번호 검증에 실패했습니다.');
    }
});

let loginAttemptCount = 0;
const maxLoginAttempts = 3;

// 비밀번호 찾기 폼 제출
document.getElementById('searchPW-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    var userid = document.getElementById('userid').value.trim();
    const phnumber = formatPhoneNumber(document.getElementById('phnumber').value);
        if (!phnumber) {
            return;
        }
    var verificationCode = document.getElementById('verificationCode').value;

    // 서버에 비밀번호 찾기 요청을 보내는 코드
    try {
        const response = await fetch('https://port-0-server-57lz2alpj8pw34.sel5.cloudtype.app/auth/searchPW', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userid, phnumber, verificationCode })
        });

        const data = await response.json();

        if (response.status === 200) {
            localStorage.setItem('jwt', data.token);
            document.getElementById('display-flag1').style.display = 'none';
            document.getElementById('display-flag2').style.display = 'block';
            loginAttemptCount = 0;
        } else {
            loginAttemptCount++;
            if (loginAttemptCount >= maxLoginAttempts) {
                alert('아이디를 3회 틀렸습니다. 메인 페이지로 이동합니다.');
                window.location.href = '../index.html';
            } else {
                alert(`아이디가 틀렸습니다. 남은 시도 횟수: ${maxLoginAttempts - loginAttemptCount}`);
            }
        }
    } catch (error) {
        console.error('Error:', error);
        alert('비밀번호 찾기에 실패했습니다.');
    }
})

// 비밀번호 변경 폼 제출
document.getElementById('changePasswordForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    var newPassword = document.getElementById('newPassword').value;
    var confirmPassword = document.getElementById('confirmPassword').value;

    if (!isValidPassword(newPassword)) {
        alert('비밀번호는 숫자 4자리이여야 합니다.');
        return;
    }

    if (newPassword !== confirmPassword) {
        alert('새 비밀번호와 비밀번호 확인이 일치하지 않습니다.');
        return;
    }

    const token = localStorage.getItem('jwt');

    try {
        const response = await fetch('https://port-0-server-57lz2alpj8pw34.sel5.cloudtype.app/auth/changePW', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({ newPassword })
        });

        const data = await response.json()

        if (response.status === 200) {
            alert('비밀번호가 성공적으로 변경되었습니다.');
            window.location.href = '../index.html';
        } else {
            alert(data.message || '비밀번호 변경에 실패했습니다.');
        }
    } catch (error) {
        console.error(error);
        alert('비밀번호 변경에 실패했습니다.');
    }
});
