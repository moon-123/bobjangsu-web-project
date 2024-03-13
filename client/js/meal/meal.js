import * as func from '../meal/mealdetail.js'
import * as calc from '../meal/mealcalc.js'
var token = localStorage.getItem('jwt')
// 로딩
const mainplace = document.getElementById('menulist');
mainplace.style.display = 'none'
const loading = document.getElementById('loading')
const loadingGifPath = '../../images/Spinner-3.gif';
const loadingGif = document.createElement('img');
loadingGif.src = loadingGifPath;
loadingGif.alt = '로딩 중';
loadingGif.width = 100;
loading.appendChild(loadingGif)


const morning = func.morningStore();
const lunch = func.lunchStore()
const dinner = func.dinnerStore();

if (morning === null) {
    console.log("localstorage에 값 없음, fetch 실행");
    fetchMealData()
}
else {
    console.log("localstorage에 값 존재, 출력 실행", morning);
    test()
}

async function test() {     
    document.addEventListener('DOMContentLoaded', function () {
        const morningButton = document.getElementById('morning');
        func.morningdinnerview(morning)
        morningButton.classList.add('on')
        morningButton.addEventListener('click', async function () {
            lunchButton.classList.remove('on')
            morningButton.classList.add('on')
            dinnerButton.classList.remove('on')
            func.morningdinnerview(morning)
        })

        const lunchButton = document.getElementById('lunch');
        lunchButton.addEventListener('click', async function () {
            lunchButton.classList.add('on')
            morningButton.classList.remove('on')
            dinnerButton.classList.remove('on')
            func.lunchview(lunch)
        })

        const dinnerButton = document.getElementById('dinner');
        dinnerButton.addEventListener('click', async function () {
            lunchButton.classList.remove('on')
            morningButton.classList.remove('on')
            dinnerButton.classList.add('on')
            func.morningdinnerview(dinner)
        })
    })

}

async function fetchMealData() {
    try {
        const response = await fetch('http://localhost:8080/meal/bmeal', {
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
        const gender = data[2].gender

        if ( gender == 'male') {        // 성별에 따른 결과값 차이로 인해 구별
            malemealCategory(data)
        }
        else {
            femalemealCategory(data)
        }        
        // 여기에서 데이터를 사용하거나 처리합니다.
    } catch (error) {
        console.error('Error:', error);
    }
}

// 2. 남자 데이터 출력 및 실행
function malemealCategory(maindata) {
    const weight = maindata[0].weight // 사용자 몸무게(number)
    const height = maindata[0].height // 사용자 신장(number)
    const allergy = maindata[0].allergy // 사용자 알레르기(string)
    const Energy = maindata[0].energy // 사용자 운동량(number)
    const time = parseFloat(maindata[2].createdAt)
    const nowtime = new Date()
    const nowyear = nowtime.getFullYear()
    const userAge = (time-nowyear)
    
    let category = maindata[1]
    let allergyfilter = []
    let mainmenu = []
    let babmenu = []        // 밥 타입
    let gugmenu = []        // 국 타입
    let banchanmenu = []    // 반찬 타입
    let gitamenu = []    // 기타 타입

    // 알러지 확인하는 과정
    for(let i=0; i< category.length; i++ ) {
        if (!category[i].RCP_PARTS_DTLS.includes(allergy)) {
            allergyfilter.push(category[i])
        }
    }

    // 알러지 거르고 분류하는 작업
    for(let i=0; i< allergyfilter.length; i++ )  {
        let dic = {
            'name': allergyfilter[i].RCP_NM, 
            'type': allergyfilter[i].RCP_PAT2,
            'kalory' : allergyfilter[i].INFO_ENG,      // 칼로리
            'danbek' : allergyfilter[i].INFO_PRO,      // 단백질
            'jibang' : allergyfilter[i].INFO_FAT,      // 지방
            'tansu' : allergyfilter[i].INFO_CAR       // 탄수화물
        }
        mainmenu.push(dic)

        if(dic.type == '밥') {
            babmenu.push(dic)
        }
        else if(dic.type == '국&찌개') {
            gugmenu.push(dic)
        }
        else if(dic.type == '반찬') {
            banchanmenu.push(dic)
        }
        else if(dic.type == '일품','기타','후식') {
            gitamenu.push(dic)
        }  
    }


// ------------------------------------------------------------------------------------------------------------------

    // 남성 수식 (60세 이상 남성 평균 신장 : 166, 평균 체중 : 66)
    let energy
    if(Energy === 1) {
        energy = 1.2
    }
    else if(Energy === 2) {
        energy = 1.375
    }
    else if(Energy === 3) {
        energy = 1.55
    }
    else if(Energy === 4) {
        energy = 1.725
    }
    else if(Energy === 5) {
        energy = 1.9
    }
    
    const malekalory = (66 + (13.7 * weight) + (5 * height ) - (6.8 * userAge)) * energy // 체중, 신장, 나이, 운동량 순
    const maledanbek = (parseFloat(weight) * 2.2) // 체중 * 2.2 = 단백질 정량(g)
    const malejibang = (malekalory * 0.35) / 9 // (기준열량 * 0.35  / 9) = 지방 정량(g)
    const maletansu = (malekalory - ((maledanbek * 4) + (malejibang * 9))) / 4 // (기준 열량 - (단백질 열량 + 지방 열량) / 4) = 탄수화물 정량(g)
    const calcbase = [malekalory, maledanbek, malejibang, maletansu]
    // ------------------------------------------------------------------------------------------------------------------

    // 아침
   
    startmenu()

async function startmenu() {
    const morningBox = document.getElementById('morning')
    morningBox.classList.add('on')
    const start = func.morningStore()
    if (start === null) {
        const morninglist = await calc.morningmenulist(babmenu, gugmenu, banchanmenu, calcbase)
        const lunchlist = await calc.lunchmenulist(babmenu, gugmenu, banchanmenu, calcbase)
        const dinnerlist = await calc.dinnermenulist(babmenu, gugmenu, banchanmenu, calcbase)
        func.morningStoreData(morninglist)
        func.lunchStoreData(lunchlist)
        func.dinnerStoreData(dinnerlist)

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
                func.morningdinnerview(data[0])
            } catch (error) {
                console.error('Error:', error);
            }
        }


    }
}

// 클릭 시 불러오기
const morningButton = document.getElementById('morning');

morningButton.addEventListener('click', async function () {
    lunchButton.classList.remove('on')
    morningButton.classList.add('on')
    dinnerButton.classList.remove('on')
    const morning = func.morningStore()
    if (morning === null) {
        console.log(morning,'null 들어옵니다');
        const morninglist = await calc.morningmenulist(babmenu, gugmenu, banchanmenu, calcbase)
        console.log('아침',morninglist);
        func.morningStoreData(morninglist)

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
                func.morningdinnerview(data[0])
            } catch (error) {
                console.error('Error:', error);
            }
        }


    }
    else if (morning !== null) {


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
                console.log(data);
                func.morningdinnerview(data[0])
            } catch (error) {
                console.error('Error:', error);
            }
        }


    }
});


    // ------------------------------------------------------------------------------------------------------------------

    // 점심
    

// 점심 메뉴 클릭 시 출력
const lunchButton = document.getElementById('lunch');
lunchButton.addEventListener('click', async function () {
    lunchButton.classList.add('on')
    morningButton.classList.remove('on')
    dinnerButton.classList.remove('on')
    const lunch = func.lunchStore()
    if (lunch === null) {
        const lunchlist = await calc.lunchmenulist(babmenu, gugmenu, banchanmenu, calcbase)
        
        
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
                func.lunchview(data[1])
            } catch (error) {
                console.error('Error:', error);
            }
        }



    }
    else if (lunch !== null) {

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
                func.lunchview(data[1])
            } catch (error) {
                console.error('Error:', error);
            }
        }




    }
});

    // ------------------------------------------------------------------------------------------------------------------

    // 저녁

const dinnerButton = document.getElementById('dinner');
dinnerButton.addEventListener('click', async function () {
    lunchButton.classList.remove('on')
    morningButton.classList.remove('on')
    dinnerButton.classList.add('on')
    const dinner = func.dinnerStore()
    if (dinner === null) {
        const dinnerlist = await calc.dinnermenulist(babmenu, gugmenu, banchanmenu, calcbase)


        
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
                func.morningdinnerview(data[2])
            } catch (error) {
                console.error('Error:', error);
            }
        }



    }
    else if (dinner !== null) {


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
                func.morningdinnerview(data[2])
            } catch (error) {
                console.error('Error:', error);
            }
        }



    }
});
}

// 2.여자 데이터 출력 및 실행
function femalemealCategory(maindata) {
    
    const weight = maindata[0].weight // 사용자 몸무게(number)
    const height = maindata[0].height // 사용자 신장(number)
    const allergy = maindata[0].allergy // 사용자 알레르기(string)
    const Energy = maindata[0].energy // 사용자 운동량(number)
    const time = maindata[2].birthday.year
    const year = parseFloat(time.substring(0,4))
    const nowtime = new Date()
    const nowyear = nowtime.getFullYear()
    const userAge = (year-nowyear)

    let category = maindata[1]
    let allergyfilter = []
    let mainmenu = []
    let babmenu = []        // 밥 타입
    let gugmenu = []        // 국 타입
    let banchanmenu = []    // 반찬 타입
    let gitamenu = []    // 기타 타입

    // 알러지 확인하는 과정
    for(let i=0; i< category.length; i++ ) {
        if (!category[i].RCP_PARTS_DTLS.includes(allergy)) {
            allergyfilter.push(category[i])
        }
    }

    // 알러지 거르고 분류하는 작업
    for(let i=0; i< allergyfilter.length; i++ )  {
        let dic = {
            'name': allergyfilter[i].RCP_NM, 
            'type': allergyfilter[i].RCP_PAT2,
            'kalory' : allergyfilter[i].INFO_ENG,      // 칼로리
            'danbek' : allergyfilter[i].INFO_PRO,      // 단백질
            'jibang' : allergyfilter[i].INFO_FAT,      // 지방
            'tansu' : allergyfilter[i].INFO_CAR       // 탄수화물
        }
        mainmenu.push(dic)

        if(dic.type == '밥') {
            babmenu.push(dic)
        }
        else if(dic.type == '국&찌개') {
            gugmenu.push(dic)
        }
        else if(dic.type == '반찬') {
            banchanmenu.push(dic)
        }
        else if(dic.type == '일품','기타','후식') {
            gitamenu.push(dic)
        }  
    }


// ------------------------------------------------------------------------------------------------------------------

    // 여성 수식 (60세 이상 여성 평균 신장 : 152, 평균 체중 : 56)
    let energy
    if(Energy === 1) {
        energy = 1.2
    }
    else if(Energy === 2) {
        energy = 1.375
    }
    else if(Energy === 3) {
        energy = 1.55
    }
    else if(Energy === 4) {
        energy = 1.725
    }
    else if(Energy === 5) {
        energy = 1.9
    }

    const femalekalory = (655 + (9.6 * weight) + (1.8 * height) - (4.7 * userAge)) * energy // 체중, 신장, 나이, 운동량 순
    const femaledanbek = (parseFloat(weight) * 2.2) // 체중 * 2.2 = 단백질 정량(g)
    const femalejibang = (femalekalory * 0.35) / 9 // (기준열량 * 0.35  / 9) = 지방 정량(g)
    const femaletansu = (femalekalory - ((femaledanbek * 4) + (femalejibang * 9))) / 4 // (기준 열량 - (단백질 열량 + 지방 열량) / 4) = 탄수화물 정량(g)
    const calcbase = [femalekalory, femaledanbek, femalejibang, femaletansu]


// ------------------------------------------------------------------------------------------------------------------

    // 아침
startmenu()

async function startmenu() {
    const morningBox = document.getElementById('morning')
    morningBox.classList.add('on')
    const start = func.morningStore()
    if (start === null) {
        const morninglist = await calc.morningmenulist(babmenu, gugmenu, banchanmenu, calcbase)
        const lunchlist = await calc.lunchmenulist(babmenu, gugmenu, banchanmenu, calcbase)
        const dinnerlist = await calc.dinnermenulist(babmenu, gugmenu, banchanmenu, calcbase)
        func.morningStoreData(morninglist)
        func.lunchStoreData(lunchlist)
        func.dinnerStoreData(dinnerlist)


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
                func.morningdinnerview(data[0])
            } catch (error) {
                console.error('Error:', error);
            }
        }



    }
}


const morningButton = document.getElementById('morning');
morningButton.addEventListener('click', async function () {
    lunchButton.classList.remove('on')
    morningButton.classList.add('on')
    dinnerButton.classList.remove('on')
    const morning = func.morningStore()
    if (morning === null) {
        const morninglist = await calc.morningmenulist(babmenu, gugmenu, banchanmenu, calcbase)
        func.morningStoreData(morninglist)


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
                func.morningdinnerview(data[0])
            } catch (error) {
                console.error('Error:', error);
            }
        }


    }
    else if (morning !== null) {


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
                func.morningdinnerview(data[0])
            } catch (error) {
                console.error('Error:', error);
            }
        }


    }
});

    // ------------------------------------------------------------------------------------------------------------------

    // 점심
const lunchButton = document.getElementById('lunch');
lunchButton.addEventListener('click', async function () {
    lunchButton.classList.add('on')
    morningButton.classList.remove('on')
    dinnerButton.classList.remove('on')
    const lunch = func.lunchStore()
    if (lunch === null) {
        const lunchlist = await calc.lunchmenulist(babmenu, gugmenu, banchanmenu, calcbase)
        func.lunchStoreData(lunchlist)


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
                func.lunchview(data[1])
            } catch (error) {
                console.error('Error:', error);
            }
        }


    }
    else if (lunch !== null) {


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
                func.lunchview(data[1])
            } catch (error) {
                console.error('Error:', error);
            }
        }


    }
});

    // ------------------------------------------------------------------------------------------------------------------


// 저녁 메뉴 클릭 시 출력
const dinnerButton = document.getElementById('dinner');
dinnerButton.addEventListener('click', async function () {
    lunchButton.classList.remove('on')
    morningButton.classList.remove('on')
    dinnerButton.classList.add('on')
    const dinner = func.dinnerStore()
    if (dinner === null) {
        const dinnerlist = await calc.dinnermenulist(babmenu, gugmenu, banchanmenu, calcbase)
        func.dinnerStoreData(dinnerlist)


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
                func.morningdinnerview(data[2])
            } catch (error) {
                console.error('Error:', error);
            }
        }


    }
    else if (dinner !== null) {


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
                func.morningdinnerview(data[2])
            } catch (error) {
                console.error('Error:', error);
            }
        }



    }
});

}

document.addEventListener('DOMContentLoaded', function () {
    const pageMove = document.getElementById('pagemove')
    if (pageMove !== null){
        pageMove.addEventListener('click' ,async function () {
            var meallist = './meallist.html'
            window.location.href = meallist
        })
    }
})
