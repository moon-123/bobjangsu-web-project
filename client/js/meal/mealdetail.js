// 아침 저녁 출력 함수
export function morningdinnerview(data) {

    const morningdinnermenu = data.user[0]
    const morningdinnerper = data.per[0]
    let totalkal = data.per[0].total
    if (totalkal.includes('.')){
        totalkal = totalkal.split('.')[0] + '.' + totalkal.split('.')[1].slice(0, 2);
    }


    const loading = document.getElementById('loading')
    loading.style.display = 'none';
    const mainplace = document.getElementById('menulist');
    mainplace.style.display = 'block'
    document.getElementById('rice').innerHTML = morningdinnermenu.rice
    document.getElementById('soup').innerHTML = morningdinnermenu.soup
    document.getElementById('main1').innerHTML = morningdinnermenu.main1
    document.getElementById('main2').innerHTML = morningdinnermenu.main2

    // 저장된 데이터 바 출력 코드 
    document.getElementById('catePer').innerText = `${morningdinnerper.tan}%`;
    const tansuBar = document.querySelector('#cateper span');
    tansuBar.style.width = `${morningdinnerper.tan}%`;

    document.getElementById('catePer1').innerText = `${morningdinnerper.ji}%`;
    const jibangBar = document.querySelector('#cateper1 span');
    jibangBar.style.width = `${morningdinnerper.ji}%`;

    document.getElementById('catePer2').innerText = `${morningdinnerper.dan}%`;
    const danbekBar = document.querySelector('#cateper2 span');
    danbekBar.style.width = `${morningdinnerper.dan}%`;

    document.getElementById('catePer3').innerText = `${morningdinnerper.kal}% (${totalkal}kcal)`;
    const kaloryBar = document.querySelector('#cateper3 span');
    kaloryBar.style.width = `${morningdinnerper.kal}%`;
}

//점심 출력 함수
export function lunchview(data) {

    const lunchmenu = data.user[0]
    const lunchper = data.per[0]
    let totalkal = data.per[0].total
    if (totalkal.includes('.')){
        totalkal = totalkal.split('.')[0] + '.' + totalkal.split('.')[1].slice(0, 2);
    }
    document.getElementById('rice').innerHTML = lunchmenu.rice
    document.getElementById('soup').innerHTML = lunchmenu.soup
    document.getElementById('main1').innerHTML = lunchmenu.main1
    document.getElementById('main2').innerHTML = lunchmenu.main2

    // 저장된 데이터 바 출력 코드 
    document.getElementById('catePer').innerText = `${lunchper.tan}%`;
    const tansuBar = document.querySelector('#cateper span');
    tansuBar.style.width = `${lunchper.tan}%`;

    document.getElementById('catePer1').innerText = `${lunchper.ji}%`;
    const jibangBar = document.querySelector('#cateper1 span');
    jibangBar.style.width = `${lunchper.ji}%`;

    document.getElementById('catePer2').innerText = `${lunchper.dan}%`;
    const danbekBar = document.querySelector('#cateper2 span');
    danbekBar.style.width = `${lunchper.dan}%`;

    document.getElementById('catePer3').innerText = `${lunchper.kal}% (${totalkal}kcal)`;
    const kaloryBar = document.querySelector('#cateper3 span');
    kaloryBar.style.width = `${lunchper.kal}%`;   
}

// 로컬 데이터 저장 함수
export async function morningStoreData(data) {
    localStorage.setItem('morning', JSON.stringify(data));
}

export async function lunchStoreData(data) {
    localStorage.setItem('lunch', JSON.stringify(data));
}

export async function dinnerStoreData(data) {
    localStorage.setItem('dinner', JSON.stringify(data));
}

// 로컬 데이터 출력 함수
export function morningStore() {
    const morningData = localStorage.getItem('morning');
    if (morningData !== null) {
        return JSON.parse(morningData);
    } else {
        return null;
    }
}

export function lunchStore() {
    const lunchData = localStorage.getItem('lunch');
    if (lunchData !== null) {
        return JSON.parse(lunchData);
    } else {
        return null;
    }
}

export function dinnerStore() {
    const dinnerData = localStorage.getItem('dinner');
    if (dinnerData !== null) {
        return JSON.parse(dinnerData);
    } else {
        return null;
    }
}

// 메뉴 랜덤으로 출력하기 위한 기반
export function getRandomElement(arr) {
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex]
}

