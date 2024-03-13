let controller;

document.addEventListener('DOMContentLoaded', function () {
    document.body.style.display = 'none';
    const token = localStorage.getItem('jwtad');
    if (!token) {
        alert('로그인 후 사용 가능합니다.');
        window.location.href = 'managerLogin.html';
    } else {
        document.body.style.display = 'block';
    }
    const params = new URLSearchParams(window.location.search);
    const userId = params.get('userid');

    if (userId) {
        fetchUserData(userId, token);
    } else {
        alert('사용자 ID가 제공되지 않았습니다.');
    }
});

function fetchUserData(userId, token) {
    if (controller) {
        controller.abort();
    }

    controller = new AbortController();
    const signal = controller.signal;

    fetch(`https://port-0-server-57lz2alpj8pw34.sel5.cloudtype.app/auth/administrator/userinformation/users/${userId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        signal: signal
    })
    .then(response => response.json())
    .then(data => {
        if (data) {
            document.getElementById('userId').value = userId;
            fillFormData(data);
        } else {
            console.error('Error: Invalid user data received', data);
            alert('사용자 정보를 가져오는 중에 오류가 발생했습니다.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('사용자 정보를 가져오는 중에 오류가 발생했습니다.');
    });
}

function fillFormData(userData) {
    document.getElementById('username').value = userData.username;
    document.querySelector(`input[name="gender"][value="${userData.gender}"]`).checked = true;
    document.querySelector(`input[name="birthdayType"][value="${userData.birthday.type}"]`).checked = true;
    document.getElementById('birthdayYear').value = userData.birthday.year;
    document.getElementById('phonenumber').value = userData.phnumber;
    document.getElementById('weight').value = userData.weight || '';
    document.getElementById('height').value = userData.height || '';
    document.getElementById('allergy').value = userData.allergy || '';
    document.getElementById('energy').value = userData.energy || '';
}

function updateUser() {
    if (controller) {
        controller.abort();
    }

    controller = new AbortController();
    const signal = controller.signal;

    const token = localStorage.getItem('jwtad');
    const userId = document.getElementById('userId').value;
    const username = document.getElementById('username').value;
    const userpassword = document.getElementById('userpassword').value;
    const gender = document.querySelector('input[name="gender"]:checked').value;
    const birthdayType = document.querySelector('input[name="birthdayType"]:checked').value;
    const birthdayYear = document.getElementById('birthdayYear').value;
    const phonenumber = formatPhoneNumber(document.getElementById('phonenumber').value);
    const weight = document.getElementById('weight').value;
    const height = document.getElementById('height').value;
    const allergy = document.getElementById('allergy').value;
    const energy = document.getElementById('energy').value;

    if (!userId) {
        alert('사용자 ID가 제공되지 않았습니다.');
        return;
    }

    if (username.length > 20) {
        alert('사용자 이름은 20자를 초과할 수 없습니다.');
        return;
    }

    if (!phonenumber) {
        return;
    }

    const updatedUserData = {
        username, 
        userpassword, 
        gender, 
        birthday: { 
            type: birthdayType, 
            year: birthdayYear 
        }, 
        phnumber: phonenumber,
        weight, 
        height,
        allergy,
        energy
    };

    fetch(`https://port-0-server-57lz2alpj8pw34.sel5.cloudtype.app/auth/administrator/userinformation/users/${userId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedUserData),
        signal: signal
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === '사용자 정보가 업데이트 되었습니다.') {
            alert('사용자 정보가 업데이트되었습니다.');
            window.location.href = 'user.html';
        } else {
            alert('사용자 정보 업데이트에 실패했습니다.');
        }
    })
    .catch(error => {
        if (error.name === 'AbortError') {
            console.log('Fetch request aborted');
        } else {
            console.error('Error:', error);
            alert('사용자 정보 업데이트 중에 오류가 발생했습니다.');
        }
    });
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

function goBack() {
    if (controller) {
        controller.abort();
    }
    window.location.href = 'user.html';
}