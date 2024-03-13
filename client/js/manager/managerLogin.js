document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch('https://port-0-server-57lz2alpj8pw34.sel5.cloudtype.app/auth/administrator/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ adminId: username, adminPassword: password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.token) {
            localStorage.setItem('jwtad', data.token);
            // 로그인 성공 후 리디렉션
            window.location.href = 'managerIndex.html';
        } else {
            // 오류 처리
            alert('로그인 실패');
        }
    })
    .catch(error => console.error('Error:', error));
});
