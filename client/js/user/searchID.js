function formatPhoneNumber(phnumber) {
    // 전화번호에서 하이픈 제거
    phnumber = phnumber.trim();
    phnumber = phnumber.replace(/-/g, '');

    // 전화번호 형식 검증
    const phoneRegex = /^01([0|1|6|7|8|9])([0-9]{3,4})([0-9]{4})$/;
    if (!phoneRegex.test(phnumber)) {
        alert('올바른 전화번호 형식이 아닙니다.');
        return null;
    }

    return phnumber;
}

document.getElementById('searchID-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const phnumber = formatPhoneNumber(document.getElementById('phnumber').value);
        if (!phnumber) {
            return;
        }

    if (!username.trim()) {
        alert('이름을 입력하세요');
        return;
    }

    try {
        const response = await fetch('http://localhost:8080/auth/searchID', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, phnumber }),
        });

        if (response.status === 200) {
            const data = await response.json();
            alert(`아이디는 ${data.userId} 입니다.`);
            window.location.href = '../login.html';
        } else {
            alert('사용자를 찾을 수 없습니다.');
        }
    } catch (error) {
        console.error(error);
        alert('아이디 찾기에 실패했습니다.');
    }
});
