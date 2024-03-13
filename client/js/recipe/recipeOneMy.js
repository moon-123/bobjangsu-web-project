// var category;
var tokenn = localStorage.getItem('jwt')

function convertToHttps(url) {
    return url.replace(/^http:/, 'https:');
}

async function fetchDataBasedOnCategory() {
    var urlParams = new URLSearchParams(window.location.search);
    var category = urlParams.get('data');
    if (category) {
        try {
            const response = await fetch(`https://port-0-server-57lz2alpj8pw34.sel5.cloudtype.app/recipe/detail?foodName=${category}`, {
                method: 'GET'
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            const data = await response.json();
            const recipeData = data[0];

            const imgplace = document.getElementById('img');
            const imgElement = document.createElement('img');
            imgElement.src = convertToHttps(recipeData.ATT_FILE_NO_MK);
            imgElement.alt = recipeData.ATT_FILE_NO_MAIN; 
            imgElement.width = 100;
            imgplace.appendChild(imgElement)

            const titleElement = document.getElementById('title');
            titleElement.textContent = recipeData.RCP_NM;
    
            const ingredientsList = document.getElementById('ingre');
            const listItem = document.createElement('li');
            const date_title = document.createElement('p');
            date_title.innerHTML = '[재료]';
            ingredientsList.appendChild(date_title);

            listItem.innerHTML = `<li>${recipeData.RCP_PARTS_DTLS}`;
            ingredientsList.appendChild(listItem); 

            const howList = document.getElementById('how');
            const howitem = document.createElement('li');
            
            const manuals = [];
            
            for (let i = 1; i <= 20; i++) {
                const manualNumber = i < 10 ? `0${i}` : `${i}`;
                const manualKey = `MANUAL${manualNumber}`;
                const manualValue = recipeData[manualKey];
            
                if (manualValue && manualValue.trim() !== "") {
                    manuals.push(`<li>${manualValue}`);
                }
            }
            
            const howContent = manuals.join('');

            const re_title = document.createElement('p');
            re_title.innerHTML = '[레시피]';
            howList.appendChild(re_title);
            
            if (howContent.trim() !== "") {
                howitem.innerHTML = `${howContent}`;
                howList.appendChild(howitem);
            }


            const btnSaveWrap = document.getElementById('savedd');
            const dataButton = document.getElementById('savebtn');
            const storedToken = localStorage.getItem('jwt');
            if (!category) {
                return;
            }
            try {
                const response = await fetch(`https://port-0-server-57lz2alpj8pw34.sel5.cloudtype.app/recipe/my/detail/?id=${encodeURIComponent(category)}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${storedToken}`
                    }
                });
            
                const dataExists = await response.json();
            
                if (dataExists.length != 0) {
                    if (dataExists.message != undefined) {
                        dataButton.innerText = '로그인 후 저장 가능';
                        dataButton.classList = 'main-text'
                        btnSaveWrap.addEventListener('click', function() {
                            // 클릭 시 login.html로 이동
                            window.location.href = '../../html/login.html';
                        });
                    } else {
                        dataButton.innerText = '삭제';
                        dataButton.classList = 'main-text'
                        btnSaveWrap.addEventListener('click', deleteData);
                    }
                } else {
                    dataButton.innerText = '저장';
                    dataButton.classList = 'main-text'
                    btnSaveWrap.addEventListener('click', saveData);
                }
            } catch (error) {
                console.error('Error:', error);
            }

            async function saveData() {
                try {
                    const response = await fetch(`https://port-0-server-57lz2alpj8pw34.sel5.cloudtype.app/recipe/detail?foodName=${category}`);
                    const dataExists = await response.json();
                    var howToCook = dataExists[0];
                    const storedToken = localStorage.getItem('jwt');
                    // console.log(howToCook)
            
                    if (!howToCook) {
                        return;
                    }
            
                    try {
                        await fetch('https://port-0-server-57lz2alpj8pw34.sel5.cloudtype.app/recipe/saveData', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${storedToken}`
                            },
                            body: JSON.stringify(howToCook),
                        });
            
                        alert('해당 요리책이 저장되었습니다.');
                        window.location.reload();
                    } catch (error) {
                        console.error('Error saving data:', error.message);
                    }
                } catch (error) {
                    console.error('Error fetching data before saving:', error.message);
                }
            }
            
            // Function to delete data
            async function deleteData() {
                const storedToken = localStorage.getItem('jwt');
                try {
                    await fetch(`https://port-0-server-57lz2alpj8pw34.sel5.cloudtype.app/recipe/deleteData/?id=${encodeURIComponent(category)}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${storedToken}`
                        },
                    });
            
                    alert('요리책이 삭제되었습니다.');
                    window.location.reload();
                } catch (error) {
                    console.error('Error deleting data:', error.message);
                }
            }
    
        } catch (error) {
            console.error('Error fetching data:', error.message);
        }
    }
}

// Call fetchDataBasedOnCategory when the page is loaded
document.addEventListener('DOMContentLoaded', async () => {
    await fetchDataBasedOnCategory();
});


function reload() {
    var urlParams = new URLSearchParams(window.location.search)
    var category = urlParams.get('cat');
    window.location.href = 'recipeMycategory.html?data=' + encodeURIComponent(category)
}