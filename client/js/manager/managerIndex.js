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

window.onload = function() {
  var logoutButton = document.querySelector('.point-btn');
  if (logoutButton) {
    logoutButton.addEventListener('click', function() {
      alert('로그아웃을 진행합니다.');
      localStorage.removeItem('jwtad');
      window.location.href = 'managerLogin.html';
    });
  } else {
    console.log('로그아웃 버튼을 찾을 수 없습니다.');
  }
};

function updateIframe(url) {
  document.getElementById('contentFrame').src = url;
}