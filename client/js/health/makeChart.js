const storedToken = localStorage.getItem('jwt');
let totalLength;
let data
let reversedIndex 
let clickedIndex 

document.addEventListener('DOMContentLoaded', () => {
    const currentUrl = new URL(window.location.href);
    let dataParam = currentUrl.searchParams.get('data');
    const decodedData = decodeURIComponent(dataParam);
    legBtnValue(dataParam)
    getData(decodedData);
});

async function getData(decodedData) {
    const storedToken = await localStorage.getItem('jwt');
    if(decodedData == '몸무게'){
        const response = await fetch(`http://localhost:8080/health//chartData/?category=${decodedData}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${storedToken}`,
            }
        });
        // 관련 테이블 만들기
        data = await response.json();
        totalLength = data.length
        weightChart(data)

    }else if(decodedData == '혈당'){
        const currentUrl = new URL(window.location.href);
        let dateParam = currentUrl.searchParams.get('date');
        let dateTime = decodeURIComponent(dateParam);

        const response = await fetch(`http://localhost:8080/health//chartData/?category=${decodedData}&date=${dateTime}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${storedToken}`,
            }
        });
        data = await response.json();
        totalLength = data.length
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
        data = await response.json();
        totalLength = data.length
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
                pointRadius: 10,
                fill: false,
                backgroundColor: '#eaca1b'
            }]
        };

        const options = {
            maintainAspectRatio: false,
            // responsive: false,
            // aspectRatio: 3,
            layout:{
                padding: {
                    right: 10
                }
            },
            scales: {
                yAxes: [{
                    ticks: {
                        min: Math.min(...weightDatas) - 10,
                        max: Math.max(...weightDatas) + 10
                    }
                }]
            },
            onClick: (event, elements) => getWeightMemo(event, elements, data, labelTimeDatas)
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


function getWeightMemo(event, array, data, labelTimeDatas) {
    if (array.length > 0) {
        clickedIndex = array[0]._index;
        reversedIndex = data.length - clickedIndex - 1;

        const memoText = data[reversedIndex].notepad;
        if (memoText) {
            document.getElementById('memoText').innerText = memoText;
        } else {
            document.getElementById('memoText').innerText = '메모내용이 없습니다.';
        }


        const legBtn = document.getElementById('legBtn');
        const delBtn = document.getElementById('delBtn');

        delBtn.value= data[reversedIndex]._id
        
        legBtn.style.pointerEvents = 'auto';
        delBtn.style.pointerEvents = 'auto';

        legBtn.style.backgroundColor = 'white'
        delBtn.style.backgroundColor = 'white'
        
        // delBtn.addEventListener('click', () => {onDeleteButtonClick(data, reversedIndex)});

        legBtn.addEventListener('click', () => {
            legBtn.style.backgroundColor = '#F27521';
            legBtn.style.color = 'white'

            const category = document.getElementById('legBtn').innerHTML.split(' ')[0];
            let targetPageUrl = 'createWeight.html?dataId=' + encodeURIComponent(data[reversedIndex]._id) + '&category=' + encodeURIComponent(category);
            window.location.href = targetPageUrl;
        });
    }
}

function onDeleteButtonClick(){
    const category = document.getElementById('legBtn').innerHTML.split(' ')[0];
    if(category === '몸무게'){
        if (totalLength === 1) {
            alert('삭제가 불 가능 합니다.');
        } else {
            const result = window.confirm(
                '시간: ' + data[reversedIndex].date.split('T')[0] + ' ' + data[reversedIndex].date.split('T')[1].split(':')[0] + ':' + data[reversedIndex].date.split('T')[1].split(':')[1] +
                '\n몸무게: ' + data[reversedIndex].weightData +
                '\n메모내용: ' + data[reversedIndex].notepad +
                '\n삭제하겠습니까?'
            );
    
            if (result) {
                fetch(`http://localhost:8080/health/delDataById?dataId=${data[reversedIndex]._id}&category=${category}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${storedToken}`,
                    },
                })
                    .then(() => {
                        const currentUrl = new URL(window.location.href);
                        let dataParam = currentUrl.searchParams.get('data');
                        const decodedData = decodeURIComponent(dataParam);
    
                        window.location.href = 'dataChart.html?data=' + encodeURIComponent(decodedData);
                    })
                    .catch((error) => {
                        console.error('Error deleting data:', error);
                    });
            }
        }
    }else {
        if(category === '혈당'){
            var result = window.confirm(
                '시간: ' + data[clickedIndex].date.split('T')[0] + ' ' + data[clickedIndex].date.split('T')[1].split(':')[0] + ':' + data[clickedIndex].date.split('T')[1].split(':')[1] +
                '\n혈당: ' + data[clickedIndex].sugarData +
                '\n메모내용: ' + data[clickedIndex].notepad +
                '\n삭제하겠습니까?'
            );
        }else if(category === '혈압'){
            var result = window.confirm(
                '시간: ' + data[clickedIndex].date.split('T')[0] + ' ' + data[clickedIndex].date.split('T')[1].split(':')[0] + ':' + data[clickedIndex].date.split('T')[1].split(':')[1] +
                '\n고혈압: ' + data[clickedIndex].highData +
                '\n저혈압: ' + data[clickedIndex].lowData +
                '\n메모내용: ' + data[clickedIndex].notepad +
                '\n저장하겠습니까?'
            );
        }
        if (result) {
            fetch(`http://localhost:8080/health/delDataById?dataId=${data[clickedIndex]._id}&category=${category}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${storedToken}`,
                },
            })
            .then(()=>{
                const currentUrl = new URL(window.location.href);
                let dateParam = currentUrl.searchParams.get('date');
                let dateTime = decodeURIComponent(dateParam);
                let dataParam = currentUrl.searchParams.get('data');
                const decodedData = decodeURIComponent(dataParam);
    
                window.location.href = 'dataChart.html?data=' + encodeURIComponent(decodedData) + '&date=' + encodeURIComponent(dateTime)
            })
        }        
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
                pointRadius: 10,
                fill: false,
                backgroundColor: 'red'
            }]
        };

        const options = {
            maintainAspectRatio: false,
            // responsive: false,
            // aspectRatio: 3,
            layout:{
                padding: {
                    right: 10
                }
            },
            scales: {
                yAxes: [{
                    ticks: {
                        min: Math.min(...sugarDatas) - 10,
                        max: Math.max(...sugarDatas) + 10
                    }
                }]
            },
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
                    pointRadius: 10,
                    fill: false,
                    backgroundColor: 'red'
                },
                {
                    label: '저 혈당',
                    data: lowDatas,
                    borderColor: 'blue',
                    borderWidth: 3,
                    pointRadius: 10,
                    fill: false,
                    backgroundColor: 'blue'
                }
            ]
        };

        const options = {
            maintainAspectRatio: false,
            // responsive: false,
            // aspectRatio: 3,
            layout:{
                padding: {
                    right: 10
                }
            },
            scales: {
                yAxes: [{
                    ticks: {
                        min: Math.min(...lowDatas) - 10,
                        max: Math.max(...highDatas) + 10
                    }
                }]
            },
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

function getMemo(event, array, data, labelTimeDatas) {
    if (array.length > 0) {
        clickedIndex = array[0]._index;
        const memoText = data[clickedIndex].notepad;
        if(memoText){
            document.getElementById('memoText').innerText = memoText;
        }else{
            document.getElementById('memoText').innerText ='메모내용이 없습니다.'
        }

        const legBtn = document.getElementById('legBtn');
        const delBtn = document.getElementById('delBtn')

        legBtn.style.pointerEvents = 'auto';
        delBtn.style.pointerEvents = 'auto';

        legBtn.style.backgroundColor = 'white'
        delBtn.style.backgroundColor = 'white'

        legBtn.style.color = 'var(--point-color)'
        delBtn.style.color = 'var(--point-color)'

        legBtn.addEventListener('click', ()=>{
            legBtn.style.backgroundColor = '#F27521'; 
            legBtn.style.color = '#FFF';

            const category = document.getElementById('legBtn').innerHTML.split(' ')[0]
            let targetPageUrl
            if(category === '혈당'){
                targetPageUrl = 'createSugar.html?dataId=' + encodeURIComponent(data[clickedIndex]._id) + '&category=' + encodeURIComponent(category)
            }else if(category === '혈압'){
                targetPageUrl = 'createBlood.html?dataId=' + encodeURIComponent(data[clickedIndex]._id) + '&category=' + encodeURIComponent(category)
            }
            window.location.href = targetPageUrl;
        })
    }
}

function legBtnValue(dataParam){
    // 获取button元素
    var buttonElement = document.getElementById('legBtn');
    var delElement = document.getElementById('delBtn')

    // 设置button元素的文本内容为dataParam的值
    buttonElement.innerHTML = dataParam + ' 수정';
    delElement.innerHTML =  dataParam + ' 삭제'
}