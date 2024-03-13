async function fetchDataBasedOnCategory() {
    document.addEventListener('DOMContentLoaded', async function () {
        var urlParams = new URLSearchParams(window.location.search);
        var category = urlParams.get('data');
        if (category) {
            try {
                const response = await fetch(`http://localhost:8080/ingredient/detail?ingredientName=${category}`, {
                    method: 'GET'
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();

                const imgplace = document.getElementById('img');

                const loadingGifPath = '../../images/Spinner-3.gif';

                // 이미지 로딩을 위한 프로미스를 저장하는 배열
                const imageLoadPromises = [];

                data.forEach(ingredient => {
                    const imgElement = document.createElement('img');
                    imgElement.alt = ingredient.PRDLST_NM;
                    imgElement.width = 200;

                    // GIF 이미지 표시
                    const loadingGif = document.createElement('img');
                    loadingGif.src = loadingGifPath;
                    loadingGif.alt = '로딩 중';
                    loadingGif.width = 100;
                    imgplace.appendChild(loadingGif);

                    // 각 이미지 로드에 대한 프로미스 생성
                    const imageLoadPromise = new Promise((resolve) => {
                        imgElement.onload = () =>{
                            imgplace.removeChild(loadingGif);
                            imgplace.appendChild(imgElement);
                            resolve(); 
                        } 
                    });

                    imageLoadPromises.push(imageLoadPromise);

                    imgElement.src = ingredient.IMG_URL;

                    // 이름, 생산시기, 효능, 구입요령, 손질법, 조리법 추가
                    const name = document.getElementById('name');
                    const date = document.getElementById('date');
                    const effect = document.getElementById('effect');
                    const buying = document.getElementById('buy');
                    const handle = document.getElementById('handle');
                    const cook = document.getElementById('cook');

                    const name_content = document.createElement('li');
                    name_content.innerHTML = `<${ingredient.PRDLST_NM}>`;
                    name.appendChild(name_content);

                    const date_content = document.createElement('li');
                    const date_title = document.createElement('p');
                    date_title.innerHTML = '[생산시기]';
                    date_content.innerHTML = `${ingredient.PRDCTN__ERA}`;
                    date.appendChild(date_title);
                    date.appendChild(date_content);

                    const effect_title = document.createElement('p');
                    effect_title.innerHTML = '[효능]<br>';
                    const effect_content = document.createElement('li');
                    effect_content.innerHTML = `${ingredient.EFFECT.replace(/^-+|-+$/g, '').replace(/[-]/g, '<br>').replace(/\？/g, '')}`;
                    effect.appendChild(effect_title);
                    effect.appendChild(effect_content);

                    const buying_title = document.createElement('p');
                    buying_title.innerHTML = '[구입요령]<br>';
                    const buying_content = document.createElement('li');
                    buying_content.innerHTML = `${ingredient.PURCHASE_MTH.replace(/^-+|-+$/g, '').replace(/-/g, '<br>').replace(/\？/g, '')}`;
                    buying.appendChild(buying_title);
                    buying.appendChild(buying_content);

                    const handle_title = document.createElement('p');
                    handle_title.innerHTML = '[손질법]<br>';
                    const handle_content = document.createElement('li');
                    handle_content.innerHTML = `${ingredient.TRT_MTH.replace(/^-+|-+$/g, '').replace(/-/g, '<br>').replace(/\？/g, '')}`;
                    handle.appendChild(handle_title);
                    handle.appendChild(handle_content);

                    const cook_title = document.createElement('p');
                    cook_title.innerHTML = '[조리법]<br>';
                    const cook_content = document.createElement('li');
                    cook_content.innerHTML = `${ingredient.COOK_MTH.replace(/^-+|-+$/g, '').replace(/-/g, '<br>').replace(/\？/g, '')}`;
                    cook.appendChild(cook_title);
                    cook.appendChild(cook_content);

                });

                // 모든 이미지가 로드될 때까지 기다린 후에만 내용을 표시합니다.
                await Promise.all(imageLoadPromises);

            } catch (error) {
                console.error('데이터를 가져오는 중 오류 발생:', error.message);
            }
        }
    });
}

fetchDataBasedOnCategory();
