document.addEventListener('DOMContentLoaded', () => {
    const saveButton = document.getElementById('searchBtn');
    saveButton.addEventListener('click', searchData);
});

async function searchData() {
    const dateTime = await document.getElementById('yyymmdd').value;
    const storedToken = localStorage.getItem('userToken');

    try {
        const response = await fetch('http://localhost:8080/health/selectBlood/', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${storedToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({"date": dateTime})
        });

        // 관련 테이블 만들기
        const data = await response.json();
        document.getElementById('title').innerText = `<${dateTime}>`;

        const headers = ['date', 'lowData', 'highData']
        const table = document.getElementById('table');
        const thead = document.createElement('thead')
        const tr = document.createElement('tr')
        headers.forEach((header) => {
            let th = document.createElement('th')
            th.textContent = header
            tr.appendChild(th)
        })
        thead.appendChild(tr)
        table.appendChild(thead)

        const tbody = document.createElement('tbody');
        for (let i = 0; i < data.length; i++) {
            let tr2 = document.createElement('tr');

            let td1 = document.createElement('td');
            let dateTableTime = new Date(data[i].date).toLocaleTimeString('en-US', { hour12: false });
            td1.textContent = dateTableTime;
            tr2.appendChild(td1);

            let td2 = document.createElement('td');
            td2.textContent = data[i].lowData;
            tr2.appendChild(td2);

            let td3 = document.createElement('td');
            td3.textContent = data[i].highData;
            tr2.appendChild(td3);

            tbody.appendChild(tr2);
        }
        
        table.appendChild(tbody);
        
        // 차트 생성
        let lowDatas = [];
        let highDatas = [];
        let labelTimeDatas = [];

        for (let i = 0; i < data.length; i++) {
            lowDatas.push(data[i].lowData);
            highDatas.push(data[i].highData);
            const newData = new Date(data[i].date).toLocaleTimeString('en-US', { hour12: false });
            labelTimeDatas.push(newData);
        }

        const data2 = {
            labels: labelTimeDatas,
            datasets: [{
                label: '저혈당값',
                data: lowDatas,
                borderColor: 'blue',
                borderWidth: 1,
                fill: false
            },
            {
                label: '고혈당값',
                data: highDatas,
                borderColor: 'red',
                borderWidth: 1,
                fill: false
            }]
        };

        const ctx = document.getElementById('myChart').getContext('2d');
        const myChart = new Chart(ctx, {
            type: 'line',
            data: data2,
            options: {
                onClick: (event, elements) => getMemo(event, elements, data, labelTimeDatas)
            }
        });
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again later.');
    }
}

function getMemo(event, array, data, labelTimeDatas) {
    if (array.length > 0) {
        const clickedIndex = array[0]._index;
        const memoText = data[clickedIndex].notepad;
        if(memoText){
            document.getElementById('memoText').innerText = memoText;
        }else{
            document.getElementById('memoText').innerText ='메모내용이 없습니다.'
        }
        const timeTitle = labelTimeDatas[clickedIndex];
        document.getElementById('timeTitle').innerText = timeTitle + '시간대';
    }
}