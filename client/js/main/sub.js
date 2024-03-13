// 식단 출력할때 건강정보 기입했을 시 자동으로 페이지 이동하게 하는 코드
var urlParams = new URLSearchParams(window.location.search);
var category = urlParams.get('data');
var token = localStorage.getItem('jwt')

async function fetchMealData() {
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
        checkData(data)
        // 여기에서 데이터를 사용하거나 처리합니다.
    } catch (error) {
        console.error('Error:', error);
    }
}

async function checkMeallist() {
    try {
        const response = await fetch('http://localhost:8080/meal/mealcheck', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        console.log(response);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        ML(data)
        // 여기에서 데이터를 사용하거나 처리합니다.
    } catch (error) {
        console.error('Error:', error);
    }
}

function ML(data){
    if (data[0] === null){
        data[0] = []
    }
    if (data[0].length === 0) {

        localStorage.removeItem('morning');
        localStorage.removeItem('lunch');
        localStorage.removeItem('dinner');
        window.location.href = '../meal/meal.html'
    }
    else {
        localStorage.setItem('morning', JSON.stringify(data[0]));
        localStorage.setItem('lunch', JSON.stringify(data[1]));
        localStorage.setItem('dinner', JSON.stringify(data[2]));
        window.location.href = '../meal/meal.html'
    }
}

function checkData(data) {
    let check
    if(Object.keys(data[1]).length === 0){
        check = null
    }
    else{
        check = data[1]
    }
    // console.log(check);
    if(check) {
        checkMeallist()
    }else{
        window.location.href = '../meal/cal.html'
    }
}