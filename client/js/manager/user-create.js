document.addEventListener('DOMContentLoaded', (event) => {
    document.body.style.display = 'none';
  
    const token = localStorage.getItem('jwtad');
  
    if (!token) {
      alert('로그인 후 사용 가능합니다.');
      window.location.href = 'managerLogin.html';
    } else {
      document.body.style.display = 'block';
    }
});

function validateUserData(userData) {
    if (!userData.userid || !userData.userpassword || !userData.username) {
        alert('필수 정보를 모두 입력해주세요.');
        return false;
    }

    const passwordRegex = /^\d{4}$/;
    if (!passwordRegex.test(userData.userpassword)) {
        alert('비밀번호는 숫자 4자리여야 합니다.');
        return false;
    }

    if (!userData.gender) {
        alert('성별을 선택해주세요.');
        return false;
    }

    const formattedPhoneNumber = formatPhoneNumber(userData.phnumber);
    if (!formattedPhoneNumber) {
        return false;
    }
    userData.phnumber = formattedPhoneNumber;

    // 생년월일 검사
    const currentYear = new Date().getFullYear();
    if (userData.birthday.year < 1900 || userData.birthday.year > currentYear) {
        alert('생년월일이 올바르지 않습니다.');
        return false;
    }

    return true;
}

function formatPhoneNumber(phnumber) {
    phnumber = phnumber.replace(/-/g, '');
    const phoneRegex = /^01([0|1|6|7|8|9])([0-9]{3,4})([0-9]{4})$/;
    if (!phoneRegex.test(phnumber)) {
        alert('올바른 전화번호 형식이 아닙니다.');
        return null;
    }
    return phnumber;
}

document.getElementById('createUserForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // 사용자가 입력한 값을 가져옴
    const userid = document.getElementById('userid').value;
    const userpassword = document.getElementById('userpassword').value;
    const username = document.getElementById('username').value;
    const gender = document.querySelector('input[name="gender"]:checked').value; 
    const birthdayType = document.querySelector('input[name="birthdayType"]:checked').value;
    const birthdayYear = document.getElementById('birthdayYear').value;
    const phnumber = formatPhoneNumber(document.getElementById('phonenumber').value);
    
    if (!phnumber) {
        return;
    }

    const token = localStorage.getItem('jwtad');

    // 필요한 데이터를 객체로 만듦
    const userData = {
        userid,
        userpassword,
        username,
        gender,
        birthday: {
            type: birthdayType,
            year: birthdayYear,
        },
        phnumber,
    };

    // 제약조건에 따른 검증 로직.
    if (!validateUserData(userData)) {
        return;
    }

    fetch('http://localhost:8080/auth/administrator/userinformation/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(userData)
    })
    .then(response => response.json())
    .then(data => {
        alert('사용자가 생성되었습니다.');
        window.location.href = 'user.html';
    })
    .catch(error => {
        console.error('Error:', error);
        alert('사용자 생성 중 오류가 발생했습니다.');
    });
});

document.getElementById('backButton').addEventListener('click', function() {
    window.history.back();
});
