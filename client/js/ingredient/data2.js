// 데이터를 불러오고 화면에 표시하는 함수
async function fetchDataBasedOnCategory() {
    var urlParams = new URLSearchParams(window.location.search);
    var category = urlParams.get('data');
    // 만약에 카테고리가 있다면
    if (category) {
        try {
            const response = await fetch(`http://localhost:8080/ingredient?categoryName=${category}`, {
                method: 'GET'
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            // 로고부분에 타이틀 띄우기
            const title = document.getElementById('title');
            const logo = document.createElement('p');
            logo.innerHTML = category;
            title.appendChild(logo);

            const data = await response.json();

            // 리스트 초기화
            const ingredientsList = document.getElementById('list');
            ingredientsList.innerHTML = '';

            // 기본 데이터 출력
            if (!data.searchTerm) {
                data.allData.forEach(ingredient => {
                    const listItem = document.createElement('li');
                    listItem.innerHTML = `${ingredient.PRDLST_NM}`;
                    listItem.addEventListener('click', () => {
                        clickname(ingredient.PRDLST_NM);
                    });
                    ingredientsList.appendChild(listItem);
                });
            } else {
                // 검색 결과 출력
                if (Array.isArray(data.allData)) {
                    data.allData.forEach(ingredient => {
                        // 검색어가 비어있거나, 검색어와 일치하는 경우에만 출력
                        if (ingredient.PRDLST_NM.toLowerCase().includes(data.searchTerm.toLowerCase())) {
                            const listItem = document.createElement('li');
                            listItem.innerHTML = `${ingredient.PRDLST_NM}`;
                            listItem.addEventListener('click', () => {
                                clickname(ingredient.PRDLST_NM);
                            });
                            ingredientsList.appendChild(listItem);
                        }
                    });
                } else {
                    console.error('Data row is not an array.');
                }
            }

            // 건강 정보 출력
            const Infomation = data.healthInfo;
            const randomIndex = Math.floor(Math.random() * Infomation.length);
            const info = document.getElementById('healthInfo');
            const p = document.createElement('p');
            p.innerHTML = `${Infomation[randomIndex].content}`;
            info.appendChild(p);

        } catch (error) {
            console.error('Error fetching data:', error.message);
        }
    }
}

// DOMContentLoaded 이벤트 리스너 등록
document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const input = document.querySelector('input');

    // 페이지 로딩 시 기본 데이터 출력
    fetchDataBasedOnCategory();

    form.addEventListener('submit', async function (event) {
        event.preventDefault();

        // 검색어를 가져와서 URL에 추가
        const searchTerm = input.value;

        // Get category from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const category = urlParams.get('data');

        if (!category) {
            console.error('Category is not defined.');
            return;
        }

        const url = `http://localhost:8080/ingredient?categoryName=${category}`;

        try {
            // fetch 요청
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();

            // 리스트 초기화
            const ingredientsList = document.getElementById('list');
            ingredientsList.innerHTML = '';

            // 검색 결과 출력
            if (Array.isArray(data.allData)) {
                // 검색 결과 있는지 확인
                let resultsFound = false;
            
                data.allData.forEach(ingredient => {
                    // 검색어가 비어있거나, 검색어와 일치하는 경우에만 출력
                    if (ingredient.PRDLST_NM.toLowerCase().includes(searchTerm.toLowerCase())) {
                        const listItem = document.createElement('li');
                        listItem.innerHTML = `${ingredient.PRDLST_NM}`;
                        listItem.addEventListener('click', () => {
                            clickname(ingredient.PRDLST_NM);
                        });
                        ingredientsList.appendChild(listItem);
            
                        resultsFound = true;
                    }
                });
            
                // 검색 결과 없을 경우
                if (!resultsFound) {
                    const noResultsMessage = document.createElement('li');
                    noResultsMessage.innerHTML = '검색 결과가 없습니다.';
                    ingredientsList.appendChild(noResultsMessage);
                }
            } else {
                console.error('Data row is not an array.');
            }
        } catch (error) {
            console.error('Error fetching data:', error.message);
        }
    });
});

// 리스트 아이템 클릭 시 이동 함수
function clickname(name) {
    window.location.href = 'ingredientsDetail.html?data=' + encodeURIComponent(name);
}
