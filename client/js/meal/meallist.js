var urlParams = new URLSearchParams(window.location.search);
var token = localStorage.getItem('jwt')

fetchMealData()

async function fetchMealData() {
    try {
        const response = await fetch('http://localhost:8080/meal/meallist', {
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
        mealList(data)
    } catch (error) {
        console.error('Error:', error);
    }
}

function mealList(data) {
    console.log(data);
    const morning = data[0]
    const lunch = data[1]
    const dinner = data[2]
    const morningmenu = morning.user[0]
    const lunchmenu = lunch.user[0]
    const dinnermenu = dinner.user[0]

    
    const morningButton = document.getElementById('morning')
    morningButton.classList.add('on')
    document.getElementById('rice').innerHTML = morningmenu.rice
    document.getElementById('soup').innerHTML = morningmenu.soup
    document.getElementById('main1').innerHTML = morningmenu.main1
    document.getElementById('main2').innerHTML = morningmenu.main2
    morningButton.addEventListener('click',async function () {
        lunchButton.classList.remove('on')
        morningButton.classList.add('on')
        dinnerButton.classList.remove('on')
        document.getElementById('rice').innerHTML = morningmenu.rice
        document.getElementById('soup').innerHTML = morningmenu.soup
        document.getElementById('main1').innerHTML = morningmenu.main1
        document.getElementById('main2').innerHTML = morningmenu.main2
    })
    const lunchButton = document.getElementById('lunch')
    lunchButton.addEventListener('click', async function () {
        lunchButton.classList.add('on')
        morningButton.classList.remove('on')
        dinnerButton.classList.remove('on')
        document.getElementById('rice').innerHTML = lunchmenu.rice
        document.getElementById('soup').innerHTML = lunchmenu.soup
        document.getElementById('main1').innerHTML = lunchmenu.main1
        document.getElementById('main2').innerHTML = lunchmenu.main2
    })
    const dinnerButton = document.getElementById('dinner')
    dinnerButton.addEventListener('click', async function () {
        lunchButton.classList.remove('on')
        morningButton.classList.remove('on')
        dinnerButton.classList.add('on')
        document.getElementById('rice').innerHTML = dinnermenu.rice
        document.getElementById('soup').innerHTML = dinnermenu.soup
        document.getElementById('main1').innerHTML = dinnermenu.main1
        document.getElementById('main2').innerHTML = dinnermenu.main2
    })
}

const ricebutton = document.getElementById('rice') 
const soupbutton = document.getElementById('soup')
const main1button = document.getElementById('main1')
const main2button = document.getElementById('main2')

mealRecipe()

function mealRecipe() {
    ricebutton.addEventListener('click', async function () {
        let riceText = ricebutton.innerText
        window.location.href = '../recipe/recipeOne.html?data=' + encodeURIComponent(riceText)
    })
    soupbutton.addEventListener('click',async function () {
        let soupText = soupbutton.innerText
        window.location.href = '../recipe/recipeOne.html?data=' + encodeURIComponent(soupText)
    })
    main1button.addEventListener('click',async function () {
        let main1Text = main1button.innerText
        window.location.href = '../recipe/recipeOne.html?data=' + encodeURIComponent(main1Text)
    })
    main2button.addEventListener('click',async function () {
        let main2Text = main2button.innerText
        window.location.href = '../recipe/recipeOne.html?data=' + encodeURIComponent(main2Text)
    })
}