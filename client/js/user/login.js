document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    var userid = document.getElementById('userid').value.trim();
    var password = document.getElementById('password').value;

    var data = {
        userid: userid,
        userpassword: password
    };

    fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`서버에 에러가 발생하였습니다. 에러코드 : ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        localStorage.setItem('jwt', data.token);
        var userid = data.userid;
        alert(userid + "님 로그인을 환영합니다!");
        window.location.href = './index.html';
    })
    .catch((error) => {
        console.error('Error:', error);
        alert("아이디 혹은 비밀번호가 틀렸습니다.");
    });
});