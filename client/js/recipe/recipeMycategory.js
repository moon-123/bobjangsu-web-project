// 데이터를 링크에서 받아와서 fetch하는 함수
// const token = localStorage.getItem('jwt')

async function fetchDataBasedOnCategory() {
    var urlParams = new URLSearchParams(window.location.search);
    var category = urlParams.get('data');
    var token = localStorage.getItem('jwt')
    if (category) {
        try {
            // 로그인된 채로 내 아이디로 저장된 레시피만 받아오는 링크
            const encodedCategory = encodeURIComponent(category);
            const response = await fetch(`http://localhost:8080/recipe/my/category/?id=${encodedCategory}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                  }
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();

            // console.log(data);
            // 링크로 받은 리스트들을 나열
            if(data.length !== 0){
                data.forEach(recipe => {
                    const recipeList = document.querySelector('.list');
                    const listItem = document.createElement('li');
                    listItem.innerHTML = `${recipe.RCP_NM}`;
                    recipeList.appendChild(listItem);
                })
            }else{
                const recipeList = document.querySelector('.list');
                const PItem = document.createElement('div');
                PItem.style.textAlign = 'center';
                PItem.innerHTML = `저장된 레시피가 없습니다.`;
                recipeList.appendChild(PItem);
            }

            // Now you can work with the fetched data
        } catch (error) {
            console.error('Error fetching data:', error.message);
        }
    }
}
document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const input = document.querySelector('#searchInput');
    const ingredientsList = document.querySelector('.list');

    // 페이지 로딩 시 기본 데이터 출력
    fetchDataBasedOnCategory();

    form.addEventListener('submit', async function (event) {
        event.preventDefault();
        await handleFormSubmission();
    });

    ingredientsList.addEventListener('click', async function (event) {
        // Check if the clicked element is an li element
        if (event.target.tagName.toLowerCase() === 'li') {
            const ingredientName = event.target.textContent;
            clickname(ingredientName);
        }
    });

    async function handleFormSubmission() {
        // 검색어를 가져와서 URL에 추가
        const searchTerm = input.value;
        const token = localStorage.getItem('jwt');

        // Get category from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const category = urlParams.get('data');

        if (!category) {
            console.error('Category is not defined.');
            return;
        }

        // 내 레시피에서 검색
        let url;
        if (searchTerm) {
            url = `http://localhost:8080/recipe/my/category/?id=${encodeURIComponent(category)}&search=${encodeURIComponent(searchTerm)}`;
        } else {
            url = `http://localhost:8080/recipe/my/category/?id=${encodeURIComponent(category)}`;
        }

        try {
            // fetch 요청
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            // console.log(data);

            // 리스트 초기화
            ingredientsList.innerHTML = '';

            if (Array.isArray(data)) {
                let resultsFound = false;
                data.forEach(ingredient => {
                    // 검색어가 비어있거나, 검색어와 일치하는 경우에만 출력
                    if (!searchTerm || ingredient.RCP_NM.replace(/\s/g, '').toLowerCase().includes(searchTerm.replace(/\s/g, '').toLowerCase())) {
                        const listItem = document.createElement('li');
                        listItem.innerHTML = `${ingredient.RCP_NM}`;
                    
                        ingredientsList.appendChild(listItem);
                        resultsFound = true;
                    }
                });
                if (!resultsFound) {
                    const noResultsMessage = document.createElement('li');

                    noResultsMessage.style.pointerEvents = 'none'
                    noResultsMessage.innerHTML = '검색 결과가 없습니다.';
                    ingredientsList.appendChild(noResultsMessage);
                }
            } else {
                console.error('Data row is not an array.');
            }
        } catch (error) {
            console.error('Error fetching data:', error.message);
        }
    }

    function clickname(name) {
        var urlParams = new URLSearchParams(window.location.search);
        var category = urlParams.get('data');
        window.location.href = 'recipeOneMy.html?data=' + encodeURIComponent(name) + '&cat=' + encodeURIComponent(category);
    }
}); 