document.addEventListener('DOMContentLoaded', () => {
    const currentUrl = new URL(window.location.href);
    let dataParam = currentUrl.searchParams.get('data');
    const decodedData = decodeURIComponent(dataParam);
    console.log(decodedData)
    getData(decodedData);
});

async function getData(decodedData) {
    const storedToken = await localStorage.getItem('jwt');
    console.log(storedToken)
    if(decodedData == '몸무게'){
        const response = await fetch(`http://localhost:8080/health//chartData/?category=${decodedData}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${storedToken}`,
            }
        });
        console.log(response)
        // 관련 테이블 만들기
        const data = await response.json();
        weightChart(data)

    }else if(decodedData == '혈당'){
        const currentUrl = new URL(window.location.href);
        let dateParam = currentUrl.searchParams.get('date');
        let dateTime = decodeURIComponent(dateParam);
        console.log(storedToken)

        const response = await fetch(`http://localhost:8080/health//chartData/?category=${decodedData}&date=${dateTime}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${storedToken}`,
            }
        });
        const data = await response.json();
        sugarChart(data)
    }else{
        const currentUrl = new URL(window.location.href);
        let dateParam = currentUrl.searchParams.get('date');
        let dateTime = decodeURIComponent(dateParam);

        const response = await fetch(`http://localhost:8080/health/chartData/?category=${decodedData}&date=${dateTime}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${storedToken}`,
            }
        });
        const data = await response.json();
        bloodChart(data)
    }
}

function weightChart(data){
    try{
        let weightDatas = [];
        let labelTimeDatas = [];

        for (let i = data.length-1; i >= 0; i--) {
            weightDatas.push(data[i].weightData);
            const newData = data[i].date.split('T')[0]
            labelTimeDatas.push(newData);
        }

        const data2 = {
            labels: labelTimeDatas,
            datasets: [{
                label: '몸무게',
                data: weightDatas,
                borderColor: '#eaca1b',
                borderWidth: 3,
                pointRadius: 8,
                fill: false,
                backgroundColor: '#eaca1b'
            }]
        };
        const options = {
            onClick: (event, elements) => getMemo(event, elements, data, labelTimeDatas)
        };
        
        const ctx = document.getElementById('myChart').getContext('2d');
        const myChart = new Chart(ctx, {
            type: 'line',
            data: data2,
            options: options
        });
    }catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again later.');
    }
}

function sugarChart(data){
    try{
        let sugarDatas = [];
        let labelTimeDatas = [];

        for (let i = 0; i < data.length; i++) {
            sugarDatas.push(data[i].sugarData);
            const newData = data[i].date.split('T')[1].slice(0, 5)
            labelTimeDatas.push(newData);
        }

        const data2 = {
            labels: labelTimeDatas,
            datasets: [{
                label: '혈당',
                data: sugarDatas,
                borderColor: 'red',
                borderWidth: 3,
                pointRadius: 8,
                fill: false,
                backgroundColor: 'red'
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
    }catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again later.');
    }
}

function bloodChart(data){
    try{
        let lowDatas = [];
        let highDatas = [];
        let labelTimeDatas = [];

        for (let i = 0; i < data.length; i++) {
            lowDatas.push(data[i].lowData);
            highDatas.push(data[i].highData)
            const newData = data[i].date.split('T')[1].slice(0, 5)
            labelTimeDatas.push(newData);
        }

        const data2 = {
            labels: labelTimeDatas,
            datasets: [
                {
                    label: '고 혈당',
                    data: highDatas,
                    borderColor: 'red',
                    borderWidth: 3,
                    pointRadius: 8,
                    fill: false,
                    backgroundColor: 'red'
                },
                {
                    label: '저 혈당',
                    data: lowDatas,
                    borderColor: 'blue',
                    borderWidth: 3,
                    pointRadius: 8,
                    fill: false,
                    backgroundColor: 'blue'
                }
            ]
        };

        const ctx = document.getElementById('myChart').getContext('2d');
        const myChart = new Chart(ctx, {
            type: 'line',
            data: data2,
            options: {
                onClick: (event, elements) => getMemo(event, elements, data, labelTimeDatas)
            }
        });
    }catch (error) {
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
    }
}

