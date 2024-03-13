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

let intervalId = null;

function fetchSystemInfo() {
    const token = localStorage.getItem('jwtad');

    fetch('http://localhost:8080/auth/administrator/systeminfo', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        const systemDataDiv = document.getElementById('systemData');
        systemDataDiv.innerHTML = `
            <div class="system-info">
                <h2>시스템 정보</h2>
                <div class="info-block">
                    <h3>기본정보</h3>
                    <p><strong>Hostname :</strong> ${data.hostname}</p>
                    <p><strong>OS 타입 :</strong> ${data.osType}</p>
                    <p><strong>OS 버전 :</strong> ${data.osRelease}</p>
                </div>
                <div class="info-block">
                    <h3>CPU</h3>
                    <p><strong>CPU 사용량 :</strong> ${data.cpuLoad}%</p>
                </div>
                <div class="info-block">
                    <h3>메모리</h3>
                    <p><strong>전체 메모리 :</strong> ${data.memory.totalPercentage}GB</p>
                    <p><strong>메모리 사용량 :</strong> ${data.memory.usedPercentage}%</p>
                </div>
                <div class="info-block">
                    <h3>디스크 사용량</h3>
                    <pre>${data.diskUsage}</pre>
                </div>
                <div class="info-block">
                    <h3>부팅시간</h3>
                    <p><strong>부팅시간 : </strong>${data.uptime.hours}시 ${data.uptime.minutes}분 ${data.uptime.seconds}초</p>
                </div>
            </div>`;
    })
    .catch(error => {
        console.error('Error fetching system information:', error);
        clearInterval(intervalId);
        intervalId = null;
    });

    if (intervalId === null) {
        intervalId = setInterval(fetchSystemInfo, 3000);
    }
}

document.addEventListener('DOMContentLoaded', fetchSystemInfo);