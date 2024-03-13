// 식단 출력할때 건강정보 기입했을 시 자동으로 페이지 이동하게 하는 코드
var urlParams = new URLSearchParams(window.location.search);
var category = urlParams.get('data');

fetchMealData();

async function fetchMealData() {

    const token = localStorage.getItem('jwt')
    
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
        chcekData(data)
        // 여기에서 데이터를 사용하거나 처리합니다.
    } catch (error) {
        console.error('Error:', error);
    }

    function chcekData(data) {
        const check = data[0]
        if(check !== null) {
            var meal = './meal.html'
            window.location.href = meal
        }
        document.getElementById("additional").style.display = "block"

    }
}