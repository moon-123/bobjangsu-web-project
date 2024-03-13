var dataContainer = $("#data-container");

async function fetchDataAndInitializePagination() {
    var urlParams = new URLSearchParams(window.location.search);
    var category = urlParams.get('data');
    if (category) {
        try {
            const encodedCategory = encodeURIComponent(category);
            const response = await fetch(`http://localhost:8080/recipe/?categoryName=${encodedCategory}`, {
                method: 'GET',
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            var recipeList = await response.json();

            // Specify the number of items per page
            var pageSize = 8;

            // Calculate the total number of pages based on the pageSize
            var totalNumberOfPages = Math.ceil(recipeList.length / pageSize);

            // Use fetched data as the dataSource for pagination
            initializePagination(recipeList, pageSize, totalNumberOfPages);
        } catch (error) {
            console.error('Error fetching data:', error.message);
        }
    }
}

function initializePagination(data, pageSize, totalNumberOfPages) {
    $('#demo').pagination({
        dataSource: data,
        locator: 'items',
        pageSize: pageSize,
        totalNumber: totalNumberOfPages, // Set the total number of pages
        showPageNumbers: true, // Show page numbers in pagination
        // showNavigator: true, // Show previous and next buttons
        showGoInput: false, // Hide input for entering page number
        showGoButton: false, // Hide the "Go" button for navigating to the entered page
        pageNumber: 1, // Start with the first page
        ajax: {
            beforeSend: function () {
                dataContainer.html('Loading data...');
            }
        },
        callback: function (data, pagination) {
            var html = template(data);
            dataContainer.html(html);
        }
    });
}

function template(data) {
    return data.map(item => `<li>${item["RCP_NM"]}`).join('');

}

// Call the combined function to fetch data and initialize pagination
fetchDataAndInitializePagination();


// 검색 기능
document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const input = document.querySelector('#searchInput');
    const ingredientsList = document.querySelector('#data-container');

    const loadingGifPath = '../../images/Spinner-3.gif';

    // GIF 이미지 표시
    const frame = document.createElement('div');
    const loadingGif = document.createElement('img');
    loadingGif.src = loadingGifPath;
    loadingGif.alt = '로딩 중';
    loadingGif.width = 100;
    
    ingredientsList.appendChild(frame);
    frame.appendChild(loadingGif);

    // 페이지 로딩 시 기본 데이터 출력
    fetchDataAndInitializePagination();


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
            url = `http://localhost:8080/recipe/?categoryName=${encodeURIComponent(category)}&search=${encodeURIComponent(searchTerm)}`;
        } else {
            url = `http://localhost:8080/recipe/?categoryName=${encodeURIComponent(category)}`;
        }
    
        try {
            // fetch 요청
            const response = await fetch(url);
    
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            const data = await response.json();
    
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
    
                // Toggle visibility of pagination based on search results
                const pagination = $('#demo');
                if (data.length > 0) {
                    pagination.hide(); // Show pagination if there are search results
                } else {
                    pagination.hide(); // Hide pagination if there are no search results
                }

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
        window.location.href = 'recipeOne.html?data=' + encodeURIComponent(name);
    }
    
});