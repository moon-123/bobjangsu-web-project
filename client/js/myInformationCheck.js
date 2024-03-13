var urlParams = new URLSearchParams(window.location.search);
var category = urlParams.get('data');
var token = localStorage.getItem('jwt')

fetchInfoData();

async function fetchInfoData() {
    try {
        const response = await fetch('http://localhost:8080/meal/meal', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        infoData(data)
    } catch (error) {
        console.error('Error:', error);
    }
}
// 가져온 데이터 html에 호출
function infoData(data) {
    const healthinfo = data[1];
    const userinfo = data[0]; 

    var content1;
    var content2;
    var content3;
    var content4

    if ( healthinfo.height === undefined) {
        content1 = '미저장'
    }else{
        content1 = `${healthinfo.height} cm`
    }
    
    if ( healthinfo.weight === undefined) {
        content2 = '미저장'
    }else{
        content2 = `${healthinfo.weight} kg`
    }

    if ( healthinfo.allergy === undefined) {
        content3 = '미저장'
    }else{
        content3 = healthinfo.allergy
    }

    if ( healthinfo.energy === undefined) {
        content4 = '<label for="inputName">운동량</label><span></span>'
    }else{
        content4 = `<label for="inputName">운동량</label><span>${healthinfo.energy}</span>`
    }

    // 각 필드에 대한 값을 설정합니다.

    document.getElementById('name').innerHTML = userinfo.username;
    document.getElementById('hp').innerHTML = userinfo.phnumber;
    document.getElementById('height').innerHTML = content1;
    document.getElementById('weight').innerHTML = content2
    document.getElementById('energy').innerHTML = content4
    document.getElementById('allergy').innerHTML = content3

    // const allergyList = healthinfo.allergy;
    // const allergyString = allergyList.join(', '); // 배열을 문자열로 변환
    // document.getElementById('allergy').value = allergyString;
}