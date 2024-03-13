// test용
// localStorage.removeItem('Lunch');
// localStorage.removeItem('BREAKfast');
// localStorage.removeItem('Dinner');
// 문제
// 이름 떄문에 깔끔하게 검색 안됨 

var urlParams = new URLSearchParams(window.location.search);
var category = urlParams.get('data');
var token = localStorage.getItem('jwt')

fetchMealData();

async function fetchMealData() {
    try {
        const response = await fetch('http://localhost:8080/meal/ameal', {
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
        console.log("userdata: ", data);
        const gender = data[2]
        console.log("gender", gender);
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
    const allergyList = allergy.split(',')
    const energy = maindata[0].energy // 사용자 운동량(number)

    let category = maindata[1]
    let mainmenu = []
    let babmenu = []        // 밥 타입
    let gugmenu = []        // 국 타입
    let banchanmenu = []    // 반찬 타입
    let gitamenu = []       // 기타 타입

    // 메뉴의 타입을 나누는 과정
    for(let i=0; i< category.length; i++ ) {

        // 받아오는 메뉴에 알러지가 포함된 음식은 제외
        if ( sakong() === 0) {
            pass()
        }

        // 메뉴안에 알러지 있는건 제외
        function sakong() {
            const menu = []
            for (let j=0; j<= allergyList.length; j++) {
                if (category[i].RCP_PARTS_DTLS.includes(allergyList[j])) {
                    // console.log(`${category[i]}는 ${allergyList[j]}를 포함한다`);
                    menu.push(allergyList[j])
                }
            }
            // console.log(`68 ${category[i].RCP_PARTS_DTLS}에 포함된 알러지는 ${menu}`);
            return menu.length
        }

        function pass() {
            console.log("74 pass");
            let dic = {
                'name': category[i].RCP_NM, 
                'type': category[i].RCP_PAT2,
                'kalory' : category[i].INFO_ENG,      // 칼로리
                'danbek' : category[i].INFO_PRO,      // 단백질
                'jibang' : category[i].INFO_FAT,      // 지방
                'tansu' : category[i].INFO_CAR	    // 탄수화물
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

    }
    // console.log("100: main menu: ", mainmenu);
    // console.log("101: bab menu: ", babmenu);
    // console.log("102: gug menu: ", gugmenu);
    // console.log("103: banchan menu: ", banchanmenu);
    // console.log("104: gita menu: ", gitamenu);

    // 메뉴 랜덤으로 출력하기 위한 기반
    function getRandomElement(arr) {
        const randomIndex = Math.floor(Math.random() * arr.length);
        return arr[randomIndex]
    }


// ------------------------------------------------------------------------------------------------------------------

    // 남성 수식 (60세 이상 남성 평균 신장 : 166, 평균 체중 : 66)
    const malekalory = (66 + (13.7 * weight) + (5 * height ) - (6.8 * parseFloat('70'))) * energy // 체중, 신장, 나이, 운동량 순
    const maledanbek = (parseFloat(weight) * 2.2) // 체중 * 2.2 = 단백질 정량(g)
    const malejibang = (malekalory * 0.35) / 9 // (기준열량 * 0.35  / 9) = 지방 정량(g)
    const maletansu = (malekalory - ((maledanbek * 4) + (malejibang * 9))) / 4 // (기준 열량 - (단백질 열량 + 지방 열량) / 4) = 탄수화물 정량(g)
    const malebalence = (malekalory / 1589.04) // 남성 사용자별 신체조건에 따른 이용량 조절을 위한 조건식
    console.log("weight", weight);
    console.log("height", height);
    console.log(malekalory * 0.33);
    console.log(maledanbek * 0.33);
    console.log(malejibang * 0.33);
    console.log(maletansu * 0.33);

// ------------------------------------------------------------------------------------------------------------------


    // 아침
    async function morningmenulist() {
        console.log("123 morningmenelist 실행");
        let morningtansu = 0
        let morningjibang = 0
        let morningdanbek = 0
        let morningkalory = 0
        let Babrandom
        let Gugrandom
        let Banchanrandom
        let Banchanrandom1
        let exitLoop = false;

        // 식단 조건에 맞춰서 반복
        while ( morningkalory === 0 ) {

            // 밥 랜덤 출력
            let babtansu = 0
            let babjibang = 0
            let babdanbek = 0
            let babkalory = 0
            const babrandom = await getRandomElement(babmenu);
            // console.log("143 babrandom: ", babrandom);
            // console.log("144 babmenu: ", babmenu);
            if ( parseFloat(babrandom.tansu) * malebalence < (maletansu * (0.33)) * 0.75   
            && parseFloat(babrandom.jibang) * malebalence <= malejibang * (0.33)
            && parseFloat(babrandom.danbek) * malebalence <= maledanbek * (0.33)
            && parseFloat(babrandom.kalory) * malebalence <= malekalory * (0.33) ) {
                babtansu += parseFloat(babrandom.tansu) * malebalence
                babjibang += parseFloat(babrandom.jibang) * malebalence
                babdanbek += parseFloat(babrandom.danbek) * malebalence
                babkalory += parseFloat(babrandom.kalory) * malebalence 
                Babrandom = babrandom

                 // 국 랜덤 출력
                let gugtansu = 0
                let gugjibang = 0
                let gugdanbek = 0
                let gugkalory = 0
                const gugrandom = await getRandomElement(gugmenu)
                if ( parseFloat(gugrandom.tansu)* malebalence + babtansu <= maletansu * (0.33)
                && parseFloat(gugrandom.jibang) * malebalence + babjibang <= malejibang * (0.33)
                && parseFloat(gugrandom.danbek) * malebalence + babdanbek <= maledanbek * (0.33)
                && parseFloat(gugrandom.kalory) * malebalence + babkalory <= malekalory * (0.33) ) {
                    gugtansu = parseFloat(gugrandom.tansu) * malebalence + babtansu
                    gugjibang = parseFloat(gugrandom.jibang) * malebalence + babjibang
                    gugdanbek = parseFloat(gugrandom.danbek) * malebalence + babdanbek
                    gugkalory = parseFloat(gugrandom.kalory) * malebalence + babkalory
                    Gugrandom = gugrandom

                    // 반찬1 랜덤 출력
                    let banchantansu = 0
                    let banchanjibang = 0
                    let banchandanbek = 0
                    let banchankalory = 0
                    const banchanrandom = await getRandomElement(banchanmenu);
                    if ( parseFloat(banchanrandom.tansu)* malebalence + gugtansu <= maletansu * (0.33)
                    && parseFloat(banchanrandom.jibang) * malebalence + gugjibang <= malejibang * (0.33)
                    && parseFloat(banchanrandom.danbek) * malebalence + gugdanbek <= maledanbek * (0.33)
                    && parseFloat(banchanrandom.kalory) * malebalence + gugkalory <= malekalory * (0.33) ) {
                        banchantansu = parseFloat(banchanrandom.tansu) * malebalence + gugtansu
                        banchanjibang = parseFloat(banchanrandom.jibang) * malebalence + gugjibang
                        banchandanbek = parseFloat(banchanrandom.danbek) * malebalence + gugdanbek
                        banchankalory = parseFloat(banchanrandom.kalory) * malebalence + gugkalory
                        Banchanrandom = banchanrandom
                        
                        // 반찬2 랜덤 출력
                        const banchanrandom1 = await getRandomElement(banchanmenu);
                        if ( parseFloat(banchanrandom1.tansu)* malebalence + banchantansu <= maletansu * (0.33)
                        && parseFloat(banchanrandom1.jibang) * malebalence + banchanjibang <= malejibang * (0.33)
                        && parseFloat(banchanrandom1.danbek) * malebalence + banchandanbek <= maledanbek * (0.33)
                        && parseFloat(banchanrandom1.kalory) * malebalence + banchankalory <= malekalory * (0.33) ) {
                            morningtansu = parseFloat(banchanrandom1.tansu) * malebalence + banchantansu
                            morningjibang = parseFloat(banchanrandom1.jibang) * malebalence + banchanjibang
                            morningdanbek = parseFloat(banchanrandom1.danbek) * malebalence + banchandanbek
                            morningkalory = parseFloat(banchanrandom1.kalory) * malebalence + banchankalory   
                            Banchanrandom1 = banchanrandom1    
                        }
                        else {
                            console.log('반찬2 반복중 입니다');
                            exitLoop = true;
                        }         
                    }
                    else {
                        console.log('반찬1 반복중 입니다');
                        exitLoop = true;
                    }          
                }
                else {
                    console.log('국 반복중 입니다');
                    exitLoop = true;
                }
            }
            else {
                console.log('밥 반복중 입니다');
                exitLoop = true;
            }
        } // while 문
        
        // 선정된 메뉴 HTML에 출력하는 과정
        // const bab = Array.from(new Set(Babrandom.name)).join(',');
        const bab = Array.from(Babrandom.name).join(',');
        const realbab = bab.replace(/,/g, '');
        document.getElementById('rice').innerHTML = realbab;

        // const gug = Array.from(new Set(Gugrandom.name)).join(','); 
        const gug = Array.from(Gugrandom.name).join(','); 
        const realgug = gug.replace(/,/g, '');
        document.getElementById('soup').innerHTML = realgug;
            
        // const banchan = Array.from(new Set(Banchanrandom.name)).join(',');
        const banchan = Array.from(Banchanrandom.name).join(',');
        const realbanchan = banchan.replace(/,/g, '');
        document.getElementById('main1').innerHTML = realbanchan;

        // const banchan1 = Array.from(new Set(Banchanrandom1.name)).join(',');
        const banchan1 = Array.from(Banchanrandom1.name).join(',');
        const realbanchan1 = banchan1.replace(/,/g, '');
        document.getElementById('main2').innerHTML = realbanchan1;

        // 적정량 그래프 작성 과정
        const tansuper = (( morningtansu / (maletansu * (0.3))) * 100).toFixed(2);
        document.getElementById('catePer').innerText = `${tansuper}%`;
        const tansuBar = document.querySelector('#cateper span');
        tansuBar.style.width = `${tansuper*0.8}%`;

        const jibangper = (( morningjibang / (malejibang * (0.3)) ) * 100).toFixed(2);
        document.getElementById('catePer1').innerText = `${jibangper}%`;
        const jibangBar = document.querySelector('#cateper1 span');
        jibangBar.style.width = `${jibangper*0.8}%`;

        const danbekper = (( morningdanbek / (maledanbek * (0.3)) ) * 100).toFixed(2);
        document.getElementById('catePer2').innerText = `${danbekper}%`;
        const danbekBar = document.querySelector('#cateper2 span');
        danbekBar.style.width = `${danbekper*0.8}%`;

        const kaloryper = (( morningkalory / (malekalory * (0.3)) ) * 100).toFixed(2);
        document.getElementById('catePer3').innerText = `${kaloryper}%`;
        const kaloryBar = document.querySelector('#cateper3 span');
        kaloryBar.style.width = `${kaloryper*0.8}%`;

        // 기준치 그래프 작성 과정
        const base = 80
        const baseBar = document.querySelector('.base');
        // baseBar.stlye.width = '1%'
        baseBar.style.marginLeft = `${base}%`;
        const morning = [realbab,realgug,realbanchan,realbanchan1]
        console.log("262 morning: ", morning);
        const dic = {
            name:"morning",
            rice: morning[0],
            soup: morning[1],
            main1: morning[2],
            main2: morning[3]
        };
        try {
            const response = await fetch('http://localhost:8080/meal/savelist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(dic)
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const res = await response.json();
            console.log("282 res: ", res);
        } catch (error) {
            console.error('Error:', error);
        }
        return morning        
    } // morningmenulist 함수

    // 아침 메뉴 출력
    // basclist()
    function basclist() {
        const morning = morningStore()
        console.log("291 morning: ", morning.length);
        if (morning.length === undefined) {
            console.log("303: herer");
            const morninglist = morningmenulist()
            morningStoreData(morninglist)
            return morninglist;
        }
        else if (morning !== null) {
            morningview(morning)
        }
    }

    // 클릭 시 불러오기
    const morningButton = document.getElementById('morning');
    morningButton.addEventListener('click', async function () {
        const morning = morningStore()
        // console.log("309 morning", morning.length);
        console.log(morning)

        if (morning === null) {
            console.log("310 morning is null!!");

            const morninglist = await morningmenulist()
            morningStoreData(morninglist)
            return morninglist;
        }
        else if (morning !== null) {

            morningview(morning)
        }
    });

    function morningStore() {
        const morningData = localStorage.getItem('BREAKfast');
        // console.log('321 morningData: ', morningData);
        if (morningData !== null) {
            return JSON.parse(morningData);
        } else {
            return null;
        }
    }

    function morningStoreData(data) {
        console.log("348: ", data)

        console.log("348: ", JSON.stringify(data))

        localStorage.setItem('BREAKfast', JSON.stringify(data));
    }

    function morningview(data) {
        console.log("330: data: ", data);
        document.getElementById('rice').innerHTML = data[0];
        document.getElementById('soup').innerHTML = data[1];
        document.getElementById('main1').innerHTML = data[2];
        document.getElementById('main2').innerHTML = data[3];

        let rice
        let soup
        let main1
        let main2

        rice = babmenu.find(item => item.name === data[0]);
        soup = gugmenu.find(item => item.name === data[1]);
        main1 = banchanmenu.find(item => item.name === data[2]);
        main2 = banchanmenu.find(item => item.name === data[3]);

        console.log(rice)
        console.log(soup)
        console.log(main1)
        console.log(main2)

        // for (let i=0; i<category.length; i++){
        //     if (babmenu[i] === data[0]){
        //         rice = babmenu[i]
        //     }
        //     else if (gugmenu[i] === data[2]){
        //         soup = gugmenu[i]
        //     }
        //     else if (banchanmenu[i] === data[3]) {
        //         main1 = banchanmenu[i]
        //     }
        //     else if (banchanmenu[i] === data[3]) {
        //         main2 = banchanmenu[i]
        //     }
        // }

        // 저장된 아침메뉴의 성분 출력

        // const morningtansu = parseFloat(rice[0].tansu) + parseFloat(soup[1].tansu) + parseFloat(main1[2].tansu) + parseFloat(main2[3].tansu)
        // const morningdanbek = parseFloat(rice[0].danbek) + parseFloat(soup[1].danbek) + parseFloat(main1[2].danbek) + parseFloat(main2[3].danbek)
        // const morningjibang = parseFloat(rice[0].jibang) + parseFloat(soup[1].jibang) + parseFloat(main1[2].jibang) + parseFloat(main2[3].jibang)
        // const morningkalory = parseFloat(rice[0].kalory) + parseFloat(soup[1].kalory) + parseFloat(main1[2].kalory) + parseFloat(main2[3].kalory)

        const morningtansu = parseFloat(rice.tansu) + parseFloat(soup.tansu) + parseFloat(main1.tansu) + parseFloat(main2.tansu)
        const morningdanbek = parseFloat(rice.danbek) + parseFloat(soup.danbek) + parseFloat(main1.danbek) + parseFloat(main2.danbek)
        const morningjibang = parseFloat(rice.jibang) + parseFloat(soup.jibang) + parseFloat(main1.jibang) + parseFloat(main2.jibang)
        const morningkalory = parseFloat(rice.kalory) + parseFloat(soup.kalory) + parseFloat(main1.kalory) + parseFloat(main2.kalory)

        // 저장된 데이터 바 출력 코드 
        const tansuper = (( morningtansu / (maletansu * (0.3))) * 100).toFixed(2);
        document.getElementById('catePer').innerText = `${tansuper}%`;
        const tansuBar = document.querySelector('#cateper span');
        tansuBar.style.width = `${tansuper*0.8}%`;

        const jibangper = (( morningjibang / (malejibang * (0.3)) ) * 100).toFixed(2);
        document.getElementById('catePer1').innerText = `${jibangper}%`;
        const jibangBar = document.querySelector('#cateper1 span');
        jibangBar.style.width = `${jibangper*0.8}%`;

        const danbekper = (( morningdanbek / (maledanbek * (0.3)) ) * 100).toFixed(2);
        document.getElementById('catePer2').innerText = `${danbekper}%`;
        const danbekBar = document.querySelector('#cateper2 span');
        danbekBar.style.width = `${danbekper*0.8}%`;

        const kaloryper = (( morningkalory / (malekalory * (0.3)) ) * 100).toFixed(2);
        document.getElementById('catePer3').innerText = `${kaloryper}%`;
        const kaloryBar = document.querySelector('#cateper3 span');
        kaloryBar.style.width = `${kaloryper*0.8}%`;

        // 기준치 그래프 표시 코드
        const base = 80
        const baseBar = document.querySelector('.base');
        // baseBar.stlye.weight = '1%'
        baseBar.style.marginLeft = `${base}%`;
    }

// ------------------------------------------------------------------------------------------------------------------

    // 점심
    async function lunchmenulist() {

        let lunchtansu = 0
        let lunchjibang = 0
        let lunchdanbek = 0
        let lunchkalory = 0
        let Babrandom
        let Gugrandom
        let Banchanrandom
        let Banchanrandom1
        let exitLoop = false;

        // 식단 조건에 맞춰서 반복
        while ( lunchkalory === 0 ) {

            // 밥 랜덤 출력
            let babtansu = 0
            let babjibang = 0
            let babdanbek = 0
            let babkalory = 0
            const babrandom = await getRandomElement(babmenu);
            if ( parseFloat(babrandom.tansu) * malebalence < (maletansu * (0.44)) * 0.75   
            && parseFloat(babrandom.jibang) * malebalence <= malejibang * (0.44)
            && parseFloat(babrandom.danbek) * malebalence <= maledanbek * (0.44)
            && parseFloat(babrandom.kalory) * malebalence <= malekalory * (0.44) ) {
                babtansu += parseFloat(babrandom.tansu) * malebalence
                babjibang += parseFloat(babrandom.jibang) * malebalence
                babdanbek += parseFloat(babrandom.danbek) * malebalence
                babkalory += parseFloat(babrandom.kalory) * malebalence 
                Babrandom = babrandom

                 // 국 랜덤 출력
                let gugtansu = 0
                let gugjibang = 0
                let gugdanbek = 0
                let gugkalory = 0
                const gugrandom = await getRandomElement(gugmenu)
                if ( parseFloat(gugrandom.tansu)* malebalence + babtansu <= maletansu * (0.44)
                && parseFloat(gugrandom.jibang) * malebalence + babjibang <= malejibang * (0.44)
                && parseFloat(gugrandom.danbek) * malebalence + babdanbek <= maledanbek * (0.44)
                && parseFloat(gugrandom.kalory) * malebalence + babkalory <= malekalory * (0.44) ) {
                    gugtansu = parseFloat(gugrandom.tansu) * malebalence + babtansu
                    gugjibang = parseFloat(gugrandom.jibang) * malebalence + babjibang
                    gugdanbek = parseFloat(gugrandom.danbek) * malebalence + babdanbek
                    gugkalory = parseFloat(gugrandom.kalory) * malebalence + babkalory
                    Gugrandom = gugrandom

                    // 반찬1 랜덤 출력
                    let banchantansu = 0
                    let banchanjibang = 0
                    let banchandanbek = 0
                    let banchankalory = 0
                    const banchanrandom = await getRandomElement(banchanmenu);
                    if ( parseFloat(banchanrandom.tansu)* malebalence + gugtansu <= maletansu * (0.44)
                    && parseFloat(banchanrandom.jibang) * malebalence + gugjibang <= malejibang * (0.44)
                    && parseFloat(banchanrandom.danbek) * malebalence + gugdanbek <= maledanbek * (0.44)
                    && parseFloat(banchanrandom.kalory) * malebalence + gugkalory <= malekalory * (0.44) ) {
                        banchantansu = parseFloat(banchanrandom.tansu) * malebalence + gugtansu
                        banchanjibang = parseFloat(banchanrandom.jibang) * malebalence + gugjibang
                        banchandanbek = parseFloat(banchanrandom.danbek) * malebalence + gugdanbek
                        banchankalory = parseFloat(banchanrandom.kalory) * malebalence + gugkalory
                        Banchanrandom = banchanrandom
                        
                        // 반찬2 랜덤 출력
                        const banchanrandom1 = await getRandomElement(banchanmenu);
                        if ( parseFloat(banchanrandom1.tansu)* malebalence + banchantansu <= maletansu * (0.44)
                        && parseFloat(banchanrandom1.jibang) * malebalence + banchanjibang <= malejibang * (0.44)
                        && parseFloat(banchanrandom1.danbek) * malebalence + banchandanbek <= maledanbek * (0.44)
                        && parseFloat(banchanrandom1.kalory) * malebalence + banchankalory <= malekalory * (0.44) ) {
                            lunchtansu = parseFloat(banchanrandom1.tansu) * malebalence + banchantansu
                            lunchjibang = parseFloat(banchanrandom1.jibang) * malebalence + banchanjibang
                            lunchdanbek = parseFloat(banchanrandom1.danbek) * malebalence + banchandanbek
                            lunchkalory = parseFloat(banchanrandom1.kalory) * malebalence + banchankalory   
                            Banchanrandom1 = banchanrandom1    
                        }
                        else {
                            console.log('반찬2 반복중 입니다');
                            exitLoop = true;
                        }         
                    }
                    else {
                        console.log('반찬1 반복중 입니다');
                        exitLoop = true;
                    }          
                }
                else {
                    console.log('국 반복중 입니다');
                    exitLoop = true;
                }
            }
            else {
                console.log('밥 반복중 입니다');
                exitLoop = true;
            }
        } // while 문
        
        // 선정된 메뉴 HTML에 출력하는 과정
        const bab = Array.from(new Set(Babrandom.name)).join(',');
        // const bab = Babrandom.name.join('');
        const realbab = bab.replace(/,/g, '');
        document.getElementById('rice').innerHTML = realbab;

        // const gug = Array.from(new Set(Gugrandom.name)).join(','); 
        const gug = Array.from(Gugrandom.name).join(','); 
        console.log(gug)
        const realgug = gug.replace(/,/g, '');
        document.getElementById('soup').innerHTML = realgug;
            
        const banchan = Array.from(new Set(Banchanrandom.name)).join(',');
        // const banchan = Banchanrandom.name.join(',')
        const realbanchan = banchan.replace(/,/g, '');
        document.getElementById('main1').innerHTML = realbanchan;

        const banchan1 = Array.from(new Set(Banchanrandom1.name)).join(',');
        // const banchan1 = Banchanrandom1.name.join(',')
        const realbanchan1 = banchan1.replace(/,/g, '');
        document.getElementById('main2').innerHTML = realbanchan1;

        // 적정량 그래프 작성 과정
        const tansuper = (( lunchtansu / (maletansu * (0.4))) * 100).toFixed(2);
        document.getElementById('catePer').innerText = `${tansuper}%`;
        const tansuBar = document.querySelector('#cateper span');
        tansuBar.style.width = `${tansuper*0.8}%`;

        const jibangper = (( lunchjibang / (malejibang * (0.4)) ) * 100).toFixed(2);
        document.getElementById('catePer1').innerText = `${jibangper}%`;
        const jibangBar = document.querySelector('#cateper1 span');
        jibangBar.style.width = `${jibangper*0.8}%`;

        const danbekper = (( lunchdanbek / (maledanbek * (0.4)) ) * 100).toFixed(2);
        document.getElementById('catePer2').innerText = `${danbekper}%`;
        const danbekBar = document.querySelector('#cateper2 span');
        danbekBar.style.width = `${danbekper*0.8}%`;

        const kaloryper = (( lunchkalory / (malekalory * (0.4)) ) * 100).toFixed(2);
        document.getElementById('catePer3').innerText = `${kaloryper}%`;
        const kaloryBar = document.querySelector('#cateper3 span');
        kaloryBar.style.width = `${kaloryper*0.8}%`;

        // 기준치 그래프 작성 과정
        const base = 80
        const baseBar = document.querySelector('.base');
        // baseBar.stlye.weight = '1%'
        baseBar.style.marginLeft = `${base}%`;
        const lunch = [realbab,realgug,realbanchan,realbanchan1]
        const dic = {
            name:"lunch",
            rice: lunch[0],
            soup: lunch[1],
            main1: lunch[2],
            main2: lunch[3]
        };
        console.log("546 dic: ", dic);
        try {
            const response = await fetch('http://localhost:8080/meal/savelist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(dic)
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            await response.json();
        } catch (error) {
            console.error('Error:', error);
        }
        return lunch        
    } // lunchmenulist 함수

    // 점심 메뉴 클릭 시 출력
    const lunchButton = document.getElementById('lunch');
    lunchButton.addEventListener('click', async function () {
        const lunch = lunchStore()
        // if (lunch.length === undefined) {
        if (lunch === null) {
            console.log("310 lunch is null!!");

            const lunchlist = await lunchmenulist()
            lunchStoreData(lunchlist)
            return lunchlist;
        }
        else if (lunch !== null) {
            lunchview(lunch)
        }
    });

    function lunchStore() {
        const lunchData = localStorage.getItem('Lunch');
        console.log(lunchData)
        if (lunchData !== null) {
            return JSON.parse(lunchData);
        } else {
            return null;
        }
    }

    function lunchStoreData(data) {
        localStorage.setItem('Lunch', JSON.stringify(data));
    }

    function lunchview(data) {
        console.log("595: data: ", data);
        document.getElementById('rice').innerHTML = data[0];
        document.getElementById('soup').innerHTML = data[1];
        document.getElementById('main1').innerHTML = data[2];
        document.getElementById('main2').innerHTML = data[3];

        let rice
        let soup
        let main1
        let main2
        

        rice = babmenu.find(item => item.name === data[0]);
        soup = gugmenu.find(item => item.name === data[1]);
        // soup = gugmenu.find(item => item.name === '들깨된장육개장');
        main1 = banchanmenu.find(item => item.name === data[2]);
        main2 = banchanmenu.find(item => item.name === data[3]);

        console.log(rice)
        console.log(soup)
        console.log(main1)
        console.log(main2)
        // for (i=0; i<category.length; i++){
        //     if (babmenu[i] === data[0]){
        //         rice = babmenu[i]
        //     }
        //     else if (gugmenu[i] === data[2]){
        //         soup = gugmenu[i]
        //     }
        //     else if (banchanmenu[i] === data[3]) {
        //         main1 = banchanmenu[i]
        //     }
        //     else if (banchanmenu[i] === data[3]) {
        //         main2 = banchanmenu[i]
        //     }
        // }

        // 저장된 점심메뉴의 성분 출력
        // const lunchtansu = parseFloat(rice[0].tansu) + parseFloat(soup[1].tansu) + parseFloat(main1[2].tansu) + parseFloat(main2[3].tansu)
        // const lunchdanbek = parseFloat(rice[0].danbek) + parseFloat(soup[1].danbek) + parseFloat(main1[2].danbek) + parseFloat(main2[3].danbek)
        // const lunchjibang = parseFloat(rice[0].jibang) + parseFloat(soup[1].jibang) + parseFloat(main1[2].jibang) + parseFloat(main2[3].jibang)
        // const lunchkalory = parseFloat(rice[0].kalory) + parseFloat(soup[1].kalory) + parseFloat(main1[2].kalory) + parseFloat(main2[3].kalory)

        const lunchtansu  = parseFloat(rice.tansu) + parseFloat(soup.tansu) + parseFloat(main1.tansu) + parseFloat(main2.tansu)
        const lunchdanbek  = parseFloat(rice.danbek) + parseFloat(soup.danbek) + parseFloat(main1.danbek) + parseFloat(main2.danbek)
        const lunchjibang = parseFloat(rice.jibang) + parseFloat(soup.jibang) + parseFloat(main1.jibang) + parseFloat(main2.jibang)
        const lunchkalory = parseFloat(rice.kalory) + parseFloat(soup.kalory) + parseFloat(main1.kalory) + parseFloat(main2.kalory)

        // 저장된 데이터 바 출력 코드 
        const tansuper = (( lunchtansu / (maletansu * (0.4))) * 100).toFixed(2);
        document.getElementById('catePer').innerText = `${tansuper}%`;
        const tansuBar = document.querySelector('#cateper span');
        tansuBar.style.width = `${tansuper*0.8}%`;

        const jibangper = (( lunchdanbek / (malejibang * (0.4)) ) * 100).toFixed(2);
        document.getElementById('catePer1').innerText = `${jibangper}%`;
        const jibangBar = document.querySelector('#cateper1 span');
        jibangBar.style.width = `${jibangper*0.8}%`;

        const danbekper = (( lunchjibang / (maledanbek * (0.4)) ) * 100).toFixed(2);
        document.getElementById('catePer2').innerText = `${danbekper}%`;
        const danbekBar = document.querySelector('#cateper2 span');
        danbekBar.style.width = `${danbekper*0.8}%`;

        const kaloryper = (( lunchkalory / (malekalory * (0.4)) ) * 100).toFixed(2);
        document.getElementById('catePer3').innerText = `${kaloryper}%`;
        const kaloryBar = document.querySelector('#cateper3 span');
        kaloryBar.style.width = `${kaloryper*0.8}%`;

        // 기준치 그래프 표시 코드
        const base = 80
        const baseBar = document.querySelector('.base');
        // baseBar.stlye.weight = '1%'
        baseBar.style.marginLeft = `${base}%`;
    }

// ------------------------------------------------------------------------------------------------------------------

    // 저녁
    async function dinnermenulist() {
        
        let dinnertansu = 0
        let dinnerjibang = 0
        let dinnerdanbek = 0
        let dinnerkalory = 0
        let Babrandom
        let Gugrandom
        let Banchanrandom
        let Banchanrandom1
        let exitLoop = false;

        // 식단 조건에 맞춰서 반복
        while ( dinnerkalory === 0 ) {

            // 밥 랜덤 출력
            let babtansu = 0
            let babjibang = 0
            let babdanbek = 0
            let babkalory = 0
            const babrandom = await getRandomElement(babmenu);
            if ( parseFloat(babrandom.tansu) * malebalence < (maletansu * (0.44)) * 0.75   
            && parseFloat(babrandom.jibang) * malebalence <= malejibang * (0.44)
            && parseFloat(babrandom.danbek) * malebalence <= maledanbek * (0.44)
            && parseFloat(babrandom.kalory) * malebalence <= malekalory * (0.44) ) {
                babtansu += parseFloat(babrandom.tansu) * malebalence
                babjibang += parseFloat(babrandom.jibang) * malebalence
                babdanbek += parseFloat(babrandom.danbek) * malebalence
                babkalory += parseFloat(babrandom.kalory) * malebalence 
                Babrandom = babrandom

                 // 국 랜덤 출력
                let gugtansu = 0
                let gugjibang = 0
                let gugdanbek = 0
                let gugkalory = 0
                const gugrandom = await getRandomElement(gugmenu)
                if ( parseFloat(gugrandom.tansu)* malebalence + babtansu <= maletansu * (0.44)
                && parseFloat(gugrandom.jibang) * malebalence + babjibang <= malejibang * (0.44)
                && parseFloat(gugrandom.danbek) * malebalence + babdanbek <= maledanbek * (0.44)
                && parseFloat(gugrandom.kalory) * malebalence + babkalory <= malekalory * (0.44) ) {
                    gugtansu = parseFloat(gugrandom.tansu) * malebalence + babtansu
                    gugjibang = parseFloat(gugrandom.jibang) * malebalence + babjibang
                    gugdanbek = parseFloat(gugrandom.danbek) * malebalence + babdanbek
                    gugkalory = parseFloat(gugrandom.kalory) * malebalence + babkalory
                    Gugrandom = gugrandom

                    // 반찬1 랜덤 출력
                    let banchantansu = 0
                    let banchanjibang = 0
                    let banchandanbek = 0
                    let banchankalory = 0
                    const banchanrandom = await getRandomElement(banchanmenu);
                    if ( parseFloat(banchanrandom.tansu)* malebalence + gugtansu <= maletansu * (0.44)
                    && parseFloat(banchanrandom.jibang) * malebalence + gugjibang <= malejibang * (0.44)
                    && parseFloat(banchanrandom.danbek) * malebalence + gugdanbek <= maledanbek * (0.44)
                    && parseFloat(banchanrandom.kalory) * malebalence + gugkalory <= malekalory * (0.44) ) {
                        banchantansu = parseFloat(banchanrandom.tansu) * malebalence + gugtansu
                        banchanjibang = parseFloat(banchanrandom.jibang) * malebalence + gugjibang
                        banchandanbek = parseFloat(banchanrandom.danbek) * malebalence + gugdanbek
                        banchankalory = parseFloat(banchanrandom.kalory) * malebalence + gugkalory
                        Banchanrandom = banchanrandom
                        
                        // 반찬2 랜덤 출력
                        const banchanrandom1 = await getRandomElement(banchanmenu);
                        if ( parseFloat(banchanrandom1.tansu)* malebalence + banchantansu <= maletansu * (0.44)
                        && parseFloat(banchanrandom1.jibang) * malebalence + banchanjibang <= malejibang * (0.44)
                        && parseFloat(banchanrandom1.danbek) * malebalence + banchandanbek <= maledanbek * (0.44)
                        && parseFloat(banchanrandom1.kalory) * malebalence + banchankalory <= malekalory * (0.44) ) {
                            dinnertansu = parseFloat(banchanrandom1.tansu) * malebalence + banchantansu
                            dinnerjibang = parseFloat(banchanrandom1.jibang) * malebalence + banchanjibang
                            dinnerdanbek = parseFloat(banchanrandom1.danbek) * malebalence + banchandanbek
                            dinnerkalory = parseFloat(banchanrandom1.kalory) * malebalence + banchankalory   
                            Banchanrandom1 = banchanrandom1    
                        }
                        else {
                            console.log('반찬2 반복중 입니다');
                            exitLoop = true;
                        }         
                    }
                    else {
                        console.log('반찬1 반복중 입니다');
                        exitLoop = true;
                    }          
                }
                else {
                    console.log('국 반복중 입니다');
                    exitLoop = true;
                }
            }
            else {
                console.log('밥 반복중 입니다');
                exitLoop = true;
            }
        } // while 문
        
        // 선정된 메뉴 HTML에 출력하는 과정
        // const bab = Array.from(new Set(Babrandom.name)).join(',');
        const bab = Array.from(Babrandom.name).join(',');
        const realbab = bab.replace(/,/g, '');
        document.getElementById('rice').innerHTML = realbab;

        // const gug = Array.from(new Set(Gugrandom.name)).join(','); 
        const gug = Array.from(Gugrandom.name).join(','); 
        const realgug = gug.replace(/,/g, '');
        document.getElementById('soup').innerHTML = realgug;
            
        // const banchan = Array.from(new Set(Banchanrandom.name)).join(',');
        const banchan = Array.from(Banchanrandom.name).join(',');
        const realbanchan = banchan.replace(/,/g, '');
        document.getElementById('main1').innerHTML = realbanchan;

        // const banchan1 = Array.from(new Set(Banchanrandom1.name)).join(',');
        const banchan1 = Array.from(Banchanrandom1.name).join(',');
        const realbanchan1 = banchan1.replace(/,/g, '');
        document.getElementById('main2').innerHTML = realbanchan1;

        // 적정량 그래프 작성 과정
        const tansuper = (( dinnertansu / (maletansu * (0.3))) * 100).toFixed(2);
        document.getElementById('catePer').innerText = `${tansuper}%`;
        const tansuBar = document.querySelector('#cateper span');
        tansuBar.style.width = `${tansuper*0.8}%`;

        const jibangper = (( dinnerjibang / (malejibang * (0.3)) ) * 100).toFixed(2);
        document.getElementById('catePer1').innerText = `${jibangper}%`;
        const jibangBar = document.querySelector('#cateper1 span');
        jibangBar.style.width = `${jibangper*0.8}%`;

        const danbekper = (( dinnerdanbek / (maledanbek * (0.3)) ) * 100).toFixed(2);
        document.getElementById('catePer2').innerText = `${danbekper}%`;
        const danbekBar = document.querySelector('#cateper2 span');
        danbekBar.style.width = `${danbekper*0.8}%`;

        const kaloryper = (( dinnerkalory / (malekalory * (0.3)) ) * 100).toFixed(2);
        document.getElementById('catePer3').innerText = `${kaloryper}%`;
        const kaloryBar = document.querySelector('#cateper3 span');
        kaloryBar.style.width = `${kaloryper*0.8}%`;

        // 기준치 그래프 작성 과정
        const base = 80
        const baseBar = document.querySelector('.base');
        // baseBar.stlye.weight = '1%'
        baseBar.style.marginLeft = `${base}%`;
        const dinner = [realbab,realgug,realbanchan,realbanchan1]
        const dic = {
            name:"dinner",
            rice: dinner[0],
            soup: dinner[1],
            main1: dinner[2],
            main2: dinner[3]
        };
        try {
            const response = await fetch('http://localhost:8080/meal/savelist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(dic)
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            await response.json();
        } catch (error) {
            console.error('Error:', error);
        }
        return dinner        
    } // lunchmenulist 함수

    // 저녁 메뉴 클릭 시 출력
    const dinnerButton = document.getElementById('dinner');
    dinnerButton.addEventListener('click', async function () {
        const dinner = dinnerStore()
        if (dinner=== null) {
        // if (dinner.length === undefined) {
            const dinnerlist = await dinnermenulist()
            dinnerStoreData(dinnerlist)
            return dinnerlist;
        }
        else if (dinner !== null) {
            dinnerview(dinner)
        }
    });

    function dinnerStore() {
        const dinnerData = localStorage.getItem('Dinner');
        if (dinnerData !== null) {
            return JSON.parse(dinnerData);
        } else {
            return null;
        }
    }

    function dinnerStoreData(data) {
        localStorage.setItem('Dinner', JSON.stringify(data));
    }

    function dinnerview(data) {
        console.log("834: data: ", data);
        document.getElementById('rice').innerHTML = data[0];
        document.getElementById('soup').innerHTML = data[1];
        document.getElementById('main1').innerHTML = data[2];
        document.getElementById('main2').innerHTML = data[3];
        
        let rice
        let soup
        let main1
        let main2

        
        rice = babmenu.find(item => item.name === data[0]);
        soup = gugmenu.find(item => item.name === data[1]);
        main1 = banchanmenu.find(item => item.name === data[2]);
        main2 = banchanmenu.find(item => item.name === data[3]);

        console.log(rice)
        console.log(soup)
        console.log(main1)
        console.log(main2)

        // for (i=0; i<category.length; i++){
        //     if (babmenu[i] === data[0]){
        //         rice = babmenu[i]
        //     }
        //     else if (gugmenu[i] === data[2]){
        //         soup = gugmenu[i]
        //     }
        //     else if (banchanmenu[i] === data[3]) {
        //         main1 = banchanmenu[i]
        //     }
        //     else if (banchanmenu[i] === data[3]) {
        //         main2 = banchanmenu[i]
        //     }
        // }

        
        // 저장된 저녁메뉴의 성분 출력
        // const dinnertansu = parseFloat(rice[0].tansu) + parseFloat(soup[1].tansu) + parseFloat(main1[2].tansu) + parseFloat(main2[3].tansu)
        // const dinnerdanbek = parseFloat(rice[0].danbek) + parseFloat(soup[1].danbek) + parseFloat(main1[2].danbek) + parseFloat(main2[3].danbek)
        // const dinnerjibang = parseFloat(rice[0].jibang) + parseFloat(soup[1].jibang) + parseFloat(main1[2].jibang) + parseFloat(main2[3].jibang)
        // const dinnerkalory = parseFloat(rice[0].kalory) + parseFloat(soup[1].kalory) + parseFloat(main1[2].kalory) + parseFloat(main2[3].kalory)
        const dinnertansu = parseFloat(rice.tansu) + parseFloat(soup.tansu) + parseFloat(main1.tansu) + parseFloat(main2.tansu)
        const dinnerdanbek = parseFloat(rice.danbek) + parseFloat(soup.danbek) + parseFloat(main1.danbek) + parseFloat(main2.danbek)
        const dinnerjibang = parseFloat(rice.jibang) + parseFloat(soup.jibang) + parseFloat(main1.jibang) + parseFloat(main2.jibang)
        const dinnerkalory = parseFloat(rice.kalory) + parseFloat(soup.kalory) + parseFloat(main1.kalory) + parseFloat(main2.kalory)
        // 저장된 데이터 바 출력 코드 
        const tansuper = (( dinnertansu / (maletansu * (0.3))) * 100).toFixed(2);
        document.getElementById('catePer').innerText = `${tansuper}%`;
        const tansuBar = document.querySelector('#cateper span');
        tansuBar.style.width = `${tansuper*0.8}%`;

        const jibangper = (( dinnerdanbek / (malejibang * (0.3)) ) * 100).toFixed(2);
        document.getElementById('catePer1').innerText = `${jibangper}%`;
        const jibangBar = document.querySelector('#cateper1 span');
        jibangBar.style.width = `${jibangper*0.8}%`;

        const danbekper = (( dinnerjibang / (maledanbek * (0.3)) ) * 100).toFixed(2);
        document.getElementById('catePer2').innerText = `${danbekper}%`;
        const danbekBar = document.querySelector('#cateper2 span');
        danbekBar.style.width = `${danbekper*0.8}%`;

        const kaloryper = (( dinnerkalory / (malekalory * (0.3)) ) * 100).toFixed(2);
        document.getElementById('catePer3').innerText = `${kaloryper}%`;
        const kaloryBar = document.querySelector('#cateper3 span');
        kaloryBar.style.width = `${kaloryper*0.8}%`;

        // 기준치 그래프 표시 코드
        const base = 80
        const baseBar = document.querySelector('.base');
        // baseBar.stlye.weight = '1%'
        baseBar.style.marginLeft = `${base}%`;
    }
} // Category 함수    


// 2.여자 데이터 출력 및 실행
function femalemealCategory(maindata) {

    const weight = maindata[0].weight // 사용자 몸무게(number)
    const height = maindata[0].height // 사용자 신장(number)
    const allergy = maindata[0].allergy // 사용자 알레르기(string)
    const allergyList = allergy.split(',')
    const energy = maindata[0].energy // 사용자 운동량(number)

    let category = maindata[1]
    let mainmenu = []
    let babmenu = []        // 밥 타입
    let gugmenu = []        // 국 타입
    let banchanmenu = []    // 반찬 타입
    let gitamenu = []       // 기타 타입

    // 메뉴의 타입을 나누는 과정
    for(let i=0; i< category.length; i++ ) {

        // 받아오는 메뉴에 알러지가 포함된 음식은 제외
        if ( sakong() === 0) {
            pass()
        }

        // 메뉴안에 알러지 있는건 제외
        function sakong() {
            const menu = []
            for (let j=0; j<= allergyList.length; j++) {
                if (category[i].RCP_PARTS_DTLS.includes(allergyList[j])) {
                    menu.push(allergyList[j])
                }
            }
            return menu.length
        }

        function pass() {
            let dic = {
                'name': category[i].RCP_NM, 
                'type': category[i].RCP_PAT2,
                'kalory' : category[i].INFO_ENG,      // 칼로리
                'danbek' : category[i].INFO_PRO,      // 단백질
                'jibang' : category[i].INFO_FAT,      // 지방
                'tansu' : category[i].INFO_CAR	    // 탄수화물
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
    }

    // 메뉴 랜덤으로 출력하기 위한 기반
    function getRandomElement(arr) {
        const randomIndex = Math.floor(Math.random() * arr.length);
        return arr[randomIndex]
    }


// ------------------------------------------------------------------------------------------------------------------

    // 여성 수식 (60세 이상 여성 평균 신장 : 152, 평균 체중 : 56)
    const femalekalory = (655 + (9.6 * weight) + (1.8 * height) - (4.7 * parseFloat('70'))) * energy // 체중, 신장, 나이, 운동량 순
    const femaledanbek = (parseFloat(weight) * 2.2) // 체중 * 2.2 = 단백질 정량(g)
    const femalejibang = (femalekalory * 0.35) / 9 // (기준열량 * 0.35  / 9) = 지방 정량(g)
    const femaletansu = (femalekalory - ((femaledanbek * 4) + (femalejibang * 9))) / 4 // (기준 열량 - (단백질 열량 + 지방 열량) / 4) = 탄수화물 정량(g)
    const femalebalence = (femalekalory / 1364.64) // 여성 사용자별 신체조건에 따른 이용량 조절을 위한 조건식


    console.log(femalekalory * 0.33);
    console.log(femaledanbek * 0.33);
    console.log(femalejibang * 0.33);
    console.log(femaletansu * 0.33);

// ------------------------------------------------------------------------------------------------------------------


    // 아침
    async function morningmenulist() {

        let morningtansu = 0
        let morningjibang = 0
        let morningdanbek = 0
        let morningkalory = 0
        let Babrandom
        let Gugrandom
        let Banchanrandom
        let Banchanrandom1
        let exitLoop = false;

        // 식단 조건에 맞춰서 반복
        while ( morningkalory === 0 ) {

            // 밥 랜덤 출력
            let babtansu = 0
            let babjibang = 0
            let babdanbek = 0
            let babkalory = 0
            const babrandom = await getRandomElement(babmenu);
            if ( parseFloat(babrandom.tansu) * femalebalence < (femaletansu * (0.33)) * 0.75   
            && parseFloat(babrandom.jibang) * femalebalence <= femalejibang * (0.33)
            && parseFloat(babrandom.danbek) * femalebalence <= femaledanbek * (0.33)
            && parseFloat(babrandom.kalory) * femalebalence <= femalekalory * (0.33) ) {
                babtansu += parseFloat(babrandom.tansu) * femalebalence
                babjibang += parseFloat(babrandom.jibang) * femalebalence
                babdanbek += parseFloat(babrandom.danbek) * femalebalence
                babkalory += parseFloat(babrandom.kalory) * femalebalence 
                Babrandom = babrandom

                 // 국 랜덤 출력
                let gugtansu = 0
                let gugjibang = 0
                let gugdanbek = 0
                let gugkalory = 0
                const gugrandom = await getRandomElement(gugmenu)
                if ( parseFloat(gugrandom.tansu)* femalebalence + babtansu <= femaletansu * (0.33)
                && parseFloat(gugrandom.jibang) * femalebalence + babjibang <= femalejibang * (0.33)
                && parseFloat(gugrandom.danbek) * femalebalence + babdanbek <= femaledanbek * (0.33)
                && parseFloat(gugrandom.kalory) * femalebalence + babkalory <= femalekalory * (0.33) ) {
                    gugtansu = parseFloat(gugrandom.tansu) * femalebalence + babtansu
                    gugjibang = parseFloat(gugrandom.jibang) * femalebalence + babjibang
                    gugdanbek = parseFloat(gugrandom.danbek) * femalebalence + babdanbek
                    gugkalory = parseFloat(gugrandom.kalory) * femalebalence + babkalory
                    Gugrandom = gugrandom

                    // 반찬1 랜덤 출력
                    let banchantansu = 0
                    let banchanjibang = 0
                    let banchandanbek = 0
                    let banchankalory = 0
                    const banchanrandom = await getRandomElement(banchanmenu);
                    if ( parseFloat(banchanrandom.tansu)* femalebalence + gugtansu <= femaletansu * (0.33)
                    && parseFloat(banchanrandom.jibang) * femalebalence + gugjibang <= femalejibang * (0.33)
                    && parseFloat(banchanrandom.danbek) * femalebalence + gugdanbek <= femaledanbek * (0.33)
                    && parseFloat(banchanrandom.kalory) * femalebalence + gugkalory <= femalekalory * (0.33) ) {
                        banchantansu = parseFloat(banchanrandom.tansu) * femalebalence + gugtansu
                        banchanjibang = parseFloat(banchanrandom.jibang) * femalebalence + gugjibang
                        banchandanbek = parseFloat(banchanrandom.danbek) * femalebalence + gugdanbek
                        banchankalory = parseFloat(banchanrandom.kalory) * femalebalence + gugkalory
                        Banchanrandom = banchanrandom
                        
                        // 반찬2 랜덤 출력
                        const banchanrandom1 = await getRandomElement(banchanmenu);
                        if ( parseFloat(banchanrandom1.tansu)* femalebalence + banchantansu <= femaletansu * (0.33)
                        && parseFloat(banchanrandom1.jibang) * femalebalence + banchanjibang <= femalejibang * (0.33)
                        && parseFloat(banchanrandom1.danbek) * femalebalence + banchandanbek <= femaledanbek * (0.33)
                        && parseFloat(banchanrandom1.kalory) * femalebalence + banchankalory <= femalekalory * (0.33) ) {
                            morningtansu = parseFloat(banchanrandom1.tansu) * femalebalence + banchantansu
                            morningjibang = parseFloat(banchanrandom1.jibang) * femalebalence + banchanjibang
                            morningdanbek = parseFloat(banchanrandom1.danbek) * femalebalence + banchandanbek
                            morningkalory = parseFloat(banchanrandom1.kalory) * femalebalence + banchankalory   
                            Banchanrandom1 = banchanrandom1    
                        }
                        else {
                            console.log('반찬2 반복중 입니다');
                            exitLoop = true;
                        }         
                    }
                    else {
                        console.log('반찬1 반복중 입니다');
                        exitLoop = true;
                    }          
                }
                else {
                    console.log('국 반복중 입니다');
                    exitLoop = true;
                }
            }
            else {
                console.log('밥 반복중 입니다');
                exitLoop = true;
            }
        } // while 문
        
        // 선정된 메뉴 HTML에 출력하는 과정
        const bab = Array.from(new Set(Babrandom.name)).join(',');
        const realbab = bab.replace(/,/g, '');
        document.getElementById('rice').innerHTML = realbab;

        const gug = Array.from(new Set(Gugrandom.name)).join(','); 
        const realgug = gug.replace(/,/g, '');
        document.getElementById('soup').innerHTML = realgug;
            
        const banchan = Array.from(new Set(Banchanrandom.name)).join(',');
        const realbanchan = banchan.replace(/,/g, '');
        document.getElementById('main1').innerHTML = realbanchan;

        const banchan1 = Array.from(new Set(Banchanrandom1.name)).join(',');
        const realbanchan1 = banchan1.replace(/,/g, '');
        document.getElementById('main2').innerHTML = realbanchan1;

        // 적정량 그래프 작성 과정
        const tansuper = (( morningtansu / (femaletansu * (0.3))) * 100).toFixed(2);
        document.getElementById('catePer').innerText = `${tansuper}%`;
        const tansuBar = document.querySelector('#cateper span');
        tansuBar.style.width = `${tansuper*0.8}%`;

        const jibangper = (( morningjibang / (femalejibang * (0.3)) ) * 100).toFixed(2);
        document.getElementById('catePer1').innerText = `${jibangper}%`;
        const jibangBar = document.querySelector('#cateper1 span');
        jibangBar.style.width = `${jibangper*0.8}%`;

        const danbekper = (( morningdanbek / (femaledanbek * (0.3)) ) * 100).toFixed(2);
        document.getElementById('catePer2').innerText = `${danbekper}%`;
        const danbekBar = document.querySelector('#cateper2 span');
        danbekBar.style.width = `${danbekper*0.8}%`;

        const kaloryper = (( morningkalory / (femalekalory * (0.3)) ) * 100).toFixed(2);
        document.getElementById('catePer3').innerText = `${kaloryper}%`;
        const kaloryBar = document.querySelector('#cateper3 span');
        kaloryBar.style.width = `${kaloryper*0.8}%`;

        // 기준치 그래프 작성 과정
        const base = 80
        const baseBar = document.querySelector('.base');
        // baseBar.stlye.weight = '1%'
        baseBar.style.marginLeft = `${base}%`;
        const morning = [realbab,realgug,realbanchan,realbanchan1]
        const dic = {
            name:"morning",
            rice: morning[0],
            soup: morning[1],
            main1: morning[2],
            main2: morning[3]
        };
        try {
            const response = await fetch('http://localhost:8080/meal/savelist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(dic)
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            await response.json();
        } catch (error) {
            console.error('Error:', error);
        }
        return morning        
    } // morningmenulist 함수

    // 아침 메뉴 출력
    // basclist()
    function basclist() {
        const morning = morningStore()
        if (morning.length === undefined) {
            const morninglist = morningmenulist()
            morningStoreData(morninglist)
            return morninglist;
        }
        else if (morning !== null) {
            morningview(morning)
        }
    }

    // 클릭 시 불러오기
    const morningButton = document.getElementById('morning');
    morningButton.addEventListener('click', async function () {
        const morning = morningStore()
        if (morning.length === undefined) {
            const morninglist = await morningmenulist()
            morningStoreData(morninglist)
            return morninglist;
        }
        else if (morning !== null) {
            morningview(morning)
        }
    });


    function morningStore() {
        const morningData = localStorage.getItem('BREAKfast');
        if (morningData !== null) {
            return JSON.parse(morningData);
        } else {
            return null;
        }
    }

    function morningStoreData(data) {
        localStorage.setItem('BREAKfast', JSON.stringify(data));
    }

    function morningview(data) {
        console.log("1173: data: ", data);
        document.getElementById('rice').innerHTML = data[0];
        document.getElementById('soup').innerHTML = data[1];
        document.getElementById('main1').innerHTML = data[2];
        document.getElementById('main2').innerHTML = data[3];

        // 저장된 아침메뉴의 성분 출력
        const morningtansu = parseFloat(data[0].tansu) + parseFloat(data[1].tansu) + parseFloat(data[2].tansu) + parseFloat(data[3].tansu)
        const morningdanbek = parseFloat(data[0].danbek) + parseFloat(data[1].danbek) + parseFloat(data[2].danbek) + parseFloat(data[3].danbek)
        const morningjibang = parseFloat(data[0].jibang) + parseFloat(data[1].jibang) + parseFloat(data[2].jibang) + parseFloat(data[3].jibang)
        const morningkalory = parseFloat(data[0].kalory) + parseFloat(data[1].kalory) + parseFloat(data[2].kalory) + parseFloat(data[3].kalory)

        // 저장된 데이터 바 출력 코드 
        const tansuper = (( morningtansu / (femaletansu * (0.3))) * 100).toFixed(2);
        document.getElementById('catePer').innerText = `${tansuper}%`;
        const tansuBar = document.querySelector('#cateper span');
        tansuBar.style.width = `${tansuper*0.8}%`;

        const jibangper = (( morningjibang / (femalejibang * (0.3)) ) * 100).toFixed(2);
        document.getElementById('catePer1').innerText = `${jibangper}%`;
        const jibangBar = document.querySelector('#cateper1 span');
        jibangBar.style.width = `${jibangper*0.8}%`;

        const danbekper = (( morningdanbek / (femaledanbek * (0.3)) ) * 100).toFixed(2);
        document.getElementById('catePer2').innerText = `${danbekper}%`;
        const danbekBar = document.querySelector('#cateper2 span');
        danbekBar.style.width = `${danbekper*0.8}%`;

        const kaloryper = (( morningkalory / (femalekalory * (0.3)) ) * 100).toFixed(2);
        document.getElementById('catePer3').innerText = `${kaloryper}%`;
        const kaloryBar = document.querySelector('#cateper3 span');
        kaloryBar.style.width = `${kaloryper*0.8}%`;

        // 기준치 그래프 표시 코드
        const base = 80
        const baseBar = document.querySelector('.base');
        // baseBar.stlye.weight = '1%'
        baseBar.style.marginLeft = `${base}%`;
    }

// ------------------------------------------------------------------------------------------------------------------

    // 점심
    async function lunchmenulist() {

        let lunchtansu = 0
        let lunchjibang = 0
        let lunchdanbek = 0
        let lunchkalory = 0
        let Babrandom
        let Gugrandom
        let Banchanrandom
        let Banchanrandom1
        let exitLoop = false;

        // 식단 조건에 맞춰서 반복
        while ( lunchkalory === 0 ) {

            // 밥 랜덤 출력
            let babtansu = 0
            let babjibang = 0
            let babdanbek = 0
            let babkalory = 0
            const babrandom = await getRandomElement(babmenu);
            if ( parseFloat(babrandom.tansu) * femalebalence < (femaletansu * (0.44)) * 0.75   
            && parseFloat(babrandom.jibang) * femalebalence <= femalejibang * (0.44)
            && parseFloat(babrandom.danbek) * femalebalence <= femaledanbek * (0.44)
            && parseFloat(babrandom.kalory) * femalebalence <= femalekalory * (0.44) ) {
                babtansu += parseFloat(babrandom.tansu) * femalebalence
                babjibang += parseFloat(babrandom.jibang) * femalebalence
                babdanbek += parseFloat(babrandom.danbek) * femalebalence
                babkalory += parseFloat(babrandom.kalory) * femalebalence 
                Babrandom = babrandom

                 // 국 랜덤 출력
                let gugtansu = 0
                let gugjibang = 0
                let gugdanbek = 0
                let gugkalory = 0
                const gugrandom = await getRandomElement(gugmenu)
                if ( parseFloat(gugrandom.tansu)* femalebalence + babtansu <= femaletansu * (0.44)
                && parseFloat(gugrandom.jibang) * femalebalence + babjibang <= femalejibang * (0.44)
                && parseFloat(gugrandom.danbek) * femalebalence + babdanbek <= femaledanbek * (0.44)
                && parseFloat(gugrandom.kalory) * femalebalence + babkalory <= femalekalory * (0.44) ) {
                    gugtansu = parseFloat(gugrandom.tansu) * femalebalence + babtansu
                    gugjibang = parseFloat(gugrandom.jibang) * femalebalence + babjibang
                    gugdanbek = parseFloat(gugrandom.danbek) * femalebalence + babdanbek
                    gugkalory = parseFloat(gugrandom.kalory) * femalebalence + babkalory
                    Gugrandom = gugrandom

                    // 반찬1 랜덤 출력
                    let banchantansu = 0
                    let banchanjibang = 0
                    let banchandanbek = 0
                    let banchankalory = 0
                    const banchanrandom = await getRandomElement(banchanmenu);
                    if ( parseFloat(banchanrandom.tansu)* femalebalence + gugtansu <= femaletansu * (0.44)
                    && parseFloat(banchanrandom.jibang) * femalebalence + gugjibang <= femalejibang * (0.44)
                    && parseFloat(banchanrandom.danbek) * femalebalence + gugdanbek <= femaledanbek * (0.44)
                    && parseFloat(banchanrandom.kalory) * femalebalence + gugkalory <= femalekalory * (0.44) ) {
                        banchantansu = parseFloat(banchanrandom.tansu) * femalebalence + gugtansu
                        banchanjibang = parseFloat(banchanrandom.jibang) * femalebalence + gugjibang
                        banchandanbek = parseFloat(banchanrandom.danbek) * femalebalence + gugdanbek
                        banchankalory = parseFloat(banchanrandom.kalory) * femalebalence + gugkalory
                        Banchanrandom = banchanrandom
                        
                        // 반찬2 랜덤 출력
                        const banchanrandom1 = await getRandomElement(banchanmenu);
                        if ( parseFloat(banchanrandom1.tansu)* femalebalence + banchantansu <= femaletansu * (0.44)
                        && parseFloat(banchanrandom1.jibang) * femalebalence + banchanjibang <= femalejibang * (0.44)
                        && parseFloat(banchanrandom1.danbek) * femalebalence + banchandanbek <= femaledanbek * (0.44)
                        && parseFloat(banchanrandom1.kalory) * femalebalence + banchankalory <= femalekalory * (0.44) ) {
                            lunchtansu = parseFloat(banchanrandom1.tansu) * femalebalence + banchantansu
                            lunchjibang = parseFloat(banchanrandom1.jibang) * femalebalence + banchanjibang
                            lunchdanbek = parseFloat(banchanrandom1.danbek) * femalebalence + banchandanbek
                            lunchkalory = parseFloat(banchanrandom1.kalory) * femalebalence + banchankalory   
                            Banchanrandom1 = banchanrandom1    
                        }
                        else {
                            console.log('반찬2 반복중 입니다');
                            exitLoop = true;
                        }         
                    }
                    else {
                        console.log('반찬1 반복중 입니다');
                        exitLoop = true;
                    }          
                }
                else {
                    console.log('국 반복중 입니다');
                    exitLoop = true;
                }
            }
            else {
                console.log('밥 반복중 입니다');
                exitLoop = true;
            }
        } // while 문
        
        // 선정된 메뉴 HTML에 출력하는 과정
        const bab = Array.from(new Set(Babrandom.name)).join(',');
        const realbab = bab.replace(/,/g, '');
        document.getElementById('rice').innerHTML = realbab;

        const gug = Array.from(new Set(Gugrandom.name)).join(','); 
        const realgug = gug.replace(/,/g, '');
        document.getElementById('soup').innerHTML = realgug;
            
        const banchan = Array.from(new Set(Banchanrandom.name)).join(',');
        const realbanchan = banchan.replace(/,/g, '');
        document.getElementById('main1').innerHTML = realbanchan;

        const banchan1 = Array.from(new Set(Banchanrandom1.name)).join(',');
        const realbanchan1 = banchan1.replace(/,/g, '');
        document.getElementById('main2').innerHTML = realbanchan1;

        // 적정량 그래프 작성 과정
        const tansuper = (( lunchtansu / (femaletansu * (0.4))) * 100).toFixed(2);
        document.getElementById('catePer').innerText = `${tansuper}%`;
        const tansuBar = document.querySelector('#cateper span');
        tansuBar.style.width = `${tansuper*0.8}%`;

        const jibangper = (( lunchjibang / (femalejibang * (0.4)) ) * 100).toFixed(2);
        document.getElementById('catePer1').innerText = `${jibangper}%`;
        const jibangBar = document.querySelector('#cateper1 span');
        jibangBar.style.width = `${jibangper*0.8}%`;

        const danbekper = (( lunchdanbek / (femaledanbek * (0.4)) ) * 100).toFixed(2);
        document.getElementById('catePer2').innerText = `${danbekper}%`;
        const danbekBar = document.querySelector('#cateper2 span');
        danbekBar.style.width = `${danbekper*0.8}%`;

        const kaloryper = (( lunchkalory / (femalekalory * (0.4)) ) * 100).toFixed(2);
        document.getElementById('catePer3').innerText = `${kaloryper}%`;
        const kaloryBar = document.querySelector('#cateper3 span');
        kaloryBar.style.width = `${kaloryper*0.8}%`;

        // 기준치 그래프 작성 과정
        const base = 80
        const baseBar = document.querySelector('.base');
        // baseBar.stlye.weight = '1%'
        baseBar.style.marginLeft = `${base}%`;
        const lunch = [realbab,realgug,realbanchan,realbanchan1]
        const dic = {
            name:"lunch",
            rice: lunch[0],
            soup: lunch[1],
            main1: lunch[2],
            main2: lunch[3]
        };
        try {
            const response = await fetch('http://localhost:8080/meal/savelist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(dic)
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            await response.json();
        } catch (error) {
            console.error('Error:', error);
        }
        return lunch        
    } // lunchmenulist 함수

    // 점심 메뉴 클릭 시 출력
    const lunchButton = document.getElementById('lunch');
    lunchButton.addEventListener('click', async function () {
        const lunch = lunchStore()
        if (lunch.undefined === undefined) {
            const lunchlist = await lunchmenulist()
            lunchStoreData(lunchlist)
            return lunchlist;
        }
        else if (lunch !== null) {
            lunchview(lunch)
        }
    });

    function lunchStore() {
        const lunchData = localStorage.getItem('Lunch');
        if (lunchData !== null) {
            return JSON.parse(lunchData);
        } else {
            return null;
        }
    }

    function lunchStoreData(data) {
        localStorage.setItem('Lunch', JSON.stringify(data));
    }

    function lunchview(data) {
        console.log("1410: data: ", data);
        document.getElementById('rice').innerHTML = data[0];
        document.getElementById('soup').innerHTML = data[1];
        document.getElementById('main1').innerHTML = data[2];
        document.getElementById('main2').innerHTML = data[3];

        // 저장된 점심메뉴의 성분 출력
        const lunchtansu = parseFloat(data[0].tansu) + parseFloat(data[1].tansu) + parseFloat(data[2].tansu) + parseFloat(data[3].tansu)
        const lunchdanbek = parseFloat(data[0].danbek) + parseFloat(data[1].danbek) + parseFloat(data[2].danbek) + parseFloat(data[3].danbek)
        const lunchjibang = parseFloat(data[0].jibang) + parseFloat(data[1].jibang) + parseFloat(data[2].jibang) + parseFloat(data[3].jibang)
        const lunchkalory = parseFloat(data[0].kalory) + parseFloat(data[1].kalory) + parseFloat(data[2].kalory) + parseFloat(data[3].kalory)

        // 저장된 데이터 바 출력 코드 
        const tansuper = (( lunchtansu / (femaletansu * (0.4))) * 100).toFixed(2);
        document.getElementById('catePer').innerText = `${tansuper}%`;
        const tansuBar = document.querySelector('#cateper span');
        tansuBar.style.width = `${tansuper*0.8}%`;

        const jibangper = (( lunchdanbek / (femalejibang * (0.4)) ) * 100).toFixed(2);
        document.getElementById('catePer1').innerText = `${jibangper}%`;
        const jibangBar = document.querySelector('#cateper1 span');
        jibangBar.style.width = `${jibangper*0.8}%`;

        const danbekper = (( lunchjibang / (femaledanbek * (0.4)) ) * 100).toFixed(2);
        document.getElementById('catePer2').innerText = `${danbekper}%`;
        const danbekBar = document.querySelector('#cateper2 span');
        danbekBar.style.width = `${danbekper*0.8}%`;

        const kaloryper = (( lunchkalory / (femalekalory * (0.4)) ) * 100).toFixed(2);
        document.getElementById('catePer3').innerText = `${kaloryper}%`;
        const kaloryBar = document.querySelector('#cateper3 span');
        kaloryBar.style.width = `${kaloryper*0.8}%`;

        // 기준치 그래프 표시 코드
        const base = 80
        const baseBar = document.querySelector('.base');
        // baseBar.stlye.weight = '1%'
        baseBar.style.marginLeft = `${base}%`;
    }

// ------------------------------------------------------------------------------------------------------------------

    // 저녁
    async function dinnermenulist() {
        
        let dinnertansu = 0
        let dinnerjibang = 0
        let dinnerdanbek = 0
        let dinnerkalory = 0
        let Babrandom
        let Gugrandom
        let Banchanrandom
        let Banchanrandom1
        let exitLoop = false;

        // 식단 조건에 맞춰서 반복
        while ( dinnerkalory === 0 ) {

            // 밥 랜덤 출력
            let babtansu = 0
            let babjibang = 0
            let babdanbek = 0
            let babkalory = 0
            const babrandom = await getRandomElement(babmenu);
            if ( parseFloat(babrandom.tansu) * femalebalence < (femaletansu * (0.44)) * 0.75   
            && parseFloat(babrandom.jibang) * femalebalence <= femalejibang * (0.44)
            && parseFloat(babrandom.danbek) * femalebalence <= femaledanbek * (0.44)
            && parseFloat(babrandom.kalory) * femalebalence <= femalekalory * (0.44) ) {
                babtansu += parseFloat(babrandom.tansu) * femalebalence
                babjibang += parseFloat(babrandom.jibang) * femalebalence
                babdanbek += parseFloat(babrandom.danbek) * femalebalence
                babkalory += parseFloat(babrandom.kalory) * femalebalence 
                Babrandom = babrandom

                 // 국 랜덤 출력
                let gugtansu = 0
                let gugjibang = 0
                let gugdanbek = 0
                let gugkalory = 0
                const gugrandom = await getRandomElement(gugmenu)
                if ( parseFloat(gugrandom.tansu)* femalebalence + babtansu <= femaletansu * (0.44)
                && parseFloat(gugrandom.jibang) * femalebalence + babjibang <= femalejibang * (0.44)
                && parseFloat(gugrandom.danbek) * femalebalence + babdanbek <= femaledanbek * (0.44)
                && parseFloat(gugrandom.kalory) * femalebalence + babkalory <= femalekalory * (0.44) ) {
                    gugtansu = parseFloat(gugrandom.tansu) * femalebalence + babtansu
                    gugjibang = parseFloat(gugrandom.jibang) * femalebalence + babjibang
                    gugdanbek = parseFloat(gugrandom.danbek) * femalebalence + babdanbek
                    gugkalory = parseFloat(gugrandom.kalory) * femalebalence + babkalory
                    Gugrandom = gugrandom

                    // 반찬1 랜덤 출력
                    let banchantansu = 0
                    let banchanjibang = 0
                    let banchandanbek = 0
                    let banchankalory = 0
                    const banchanrandom = await getRandomElement(banchanmenu);
                    if ( parseFloat(banchanrandom.tansu)* femalebalence + gugtansu <= femaletansu * (0.44)
                    && parseFloat(banchanrandom.jibang) * femalebalence + gugjibang <= femalejibang * (0.44)
                    && parseFloat(banchanrandom.danbek) * femalebalence + gugdanbek <= femaledanbek * (0.44)
                    && parseFloat(banchanrandom.kalory) * femalebalence + gugkalory <= femalekalory * (0.44) ) {
                        banchantansu = parseFloat(banchanrandom.tansu) * femalebalence + gugtansu
                        banchanjibang = parseFloat(banchanrandom.jibang) * femalebalence + gugjibang
                        banchandanbek = parseFloat(banchanrandom.danbek) * femalebalence + gugdanbek
                        banchankalory = parseFloat(banchanrandom.kalory) * femalebalence + gugkalory
                        Banchanrandom = banchanrandom
                        
                        // 반찬2 랜덤 출력
                        const banchanrandom1 = await getRandomElement(banchanmenu);
                        if ( parseFloat(banchanrandom1.tansu)* femalebalence + banchantansu <= femaletansu * (0.44)
                        && parseFloat(banchanrandom1.jibang) * femalebalence + banchanjibang <= femalejibang * (0.44)
                        && parseFloat(banchanrandom1.danbek) * femalebalence + banchandanbek <= femaledanbek * (0.44)
                        && parseFloat(banchanrandom1.kalory) * femalebalence + banchankalory <= femalekalory * (0.44) ) {
                            dinnertansu = parseFloat(banchanrandom1.tansu) * femalebalence + banchantansu
                            dinnerjibang = parseFloat(banchanrandom1.jibang) * femalebalence + banchanjibang
                            dinnerdanbek = parseFloat(banchanrandom1.danbek) * femalebalence + banchandanbek
                            dinnerkalory = parseFloat(banchanrandom1.kalory) * femalebalence + banchankalory   
                            Banchanrandom1 = banchanrandom1    
                        }
                        else {
                            console.log('반찬2 반복중 입니다');
                            exitLoop = true;
                        }         
                    }
                    else {
                        console.log('반찬1 반복중 입니다');
                        exitLoop = true;
                    }          
                }
                else {
                    console.log('국 반복중 입니다');
                    exitLoop = true;
                }
            }
            else {
                console.log('밥 반복중 입니다');
                exitLoop = true;
            }
        } // while 문
        
        // 선정된 메뉴 HTML에 출력하는 과정
        const bab = Array.from(new Set(Babrandom.name)).join(',');
        const realbab = bab.replace(/,/g, '');
        document.getElementById('rice').innerHTML = realbab;

        const gug = Array.from(new Set(Gugrandom.name)).join(','); 
        const realgug = gug.replace(/,/g, '');
        document.getElementById('soup').innerHTML = realgug;
            
        const banchan = Array.from(new Set(Banchanrandom.name)).join(',');
        const realbanchan = banchan.replace(/,/g, '');
        document.getElementById('main1').innerHTML = realbanchan;

        const banchan1 = Array.from(new Set(Banchanrandom1.name)).join(',');
        const realbanchan1 = banchan1.replace(/,/g, '');
        document.getElementById('main2').innerHTML = realbanchan1;

        // 적정량 그래프 작성 과정
        const tansuper = (( dinnertansu / (femaletansu * (0.3))) * 100).toFixed(2);
        document.getElementById('catePer').innerText = `${tansuper}%`;
        const tansuBar = document.querySelector('#cateper span');
        tansuBar.style.width = `${tansuper*0.8}%`;

        const jibangper = (( dinnerjibang / (femalejibang * (0.3)) ) * 100).toFixed(2);
        document.getElementById('catePer1').innerText = `${jibangper}%`;
        const jibangBar = document.querySelector('#cateper1 span');
        jibangBar.style.width = `${jibangper*0.8}%`;

        const danbekper = (( dinnerdanbek / (femaledanbek * (0.3)) ) * 100).toFixed(2);
        document.getElementById('catePer2').innerText = `${danbekper}%`;
        const danbekBar = document.querySelector('#cateper2 span');
        danbekBar.style.width = `${danbekper*0.8}%`;

        const kaloryper = (( dinnerkalory / (femalekalory * (0.3)) ) * 100).toFixed(2);
        document.getElementById('catePer3').innerText = `${kaloryper}%`;
        const kaloryBar = document.querySelector('#cateper3 span');
        kaloryBar.style.width = `${kaloryper*0.8}%`;

        // 기준치 그래프 작성 과정
        const base = 80
        const baseBar = document.querySelector('.base');
        // baseBar.stlye.weight = '1%'
        baseBar.style.marginLeft = `${base}%`;
        const dinner = [realbab,realgug,realbanchan,realbanchan1]
        const dic = {
            name:"dinner",
            rice: dinner[0],
            soup: dinner[1],
            main1: dinner[2],
            main2: dinner[3]
        };
        try {
            const response = await fetch('http://localhost:8080/meal/savelist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(dic)
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            await response.json();
        } catch (error) {
            console.error('Error:', error);
        }
        return dinner        
    } // lunchmenulist 함수

    // 저녁 메뉴 클릭 시 출력
    const dinnerButton = document.getElementById('dinner');
    dinnerButton.addEventListener('click', async function () {
        const dinner = dinnerStore()
        if (dinner.length === undefined) {
            const dinnerlist = await dinnermenulist()
            dinnerStoreData(dinnerlist)
            return dinnerlist;
        }
        else if (dinner !== null) {
            dinnerview(dinner)
        }
    });

    function dinnerStore() {
        const dinnerData = localStorage.getItem('Dinner');
        if (dinnerData !== null) {
            return JSON.parse(dinnerData);
        } else {
            return null;
        }
    }

    function dinnerStoreData(data) {
        localStorage.setItem('Dinner', JSON.stringify(data));
    }

    function dinnerview(data) {
        console.log("1646: data: ", data);
        document.getElementById('rice').innerHTML = data[0];
        document.getElementById('soup').innerHTML = data[1];
        document.getElementById('main1').innerHTML = data[2];
        document.getElementById('main2').innerHTML = data[3];

        // 저장된 저녁메뉴의 성분 출력
        const dinnertansu = parseFloat(data[0].tansu) + parseFloat(data[1].tansu) + parseFloat(data[2].tansu) + parseFloat(data[3].tansu)
        const dinnerdanbek = parseFloat(data[0].danbek) + parseFloat(data[1].danbek) + parseFloat(data[2].danbek) + parseFloat(data[3].danbek)
        const dinnerjibang = parseFloat(data[0].jibang) + parseFloat(data[1].jibang) + parseFloat(data[2].jibang) + parseFloat(data[3].jibang)
        const dinnerkalory = parseFloat(data[0].kalory) + parseFloat(data[1].kalory) + parseFloat(data[2].kalory) + parseFloat(data[3].kalory)

        // 저장된 데이터 바 출력 코드 
        const tansuper = (( dinnertansu / (femaletansu * (0.3))) * 100).toFixed(2);
        document.getElementById('catePer').innerText = `${tansuper}%`;
        const tansuBar = document.querySelector('#cateper span');
        tansuBar.style.width = `${tansuper*0.8}%`;

        const jibangper = (( dinnerdanbek / (femalejibang * (0.3)) ) * 100).toFixed(2);
        document.getElementById('catePer1').innerText = `${jibangper}%`;
        const jibangBar = document.querySelector('#cateper1 span');
        jibangBar.style.width = `${jibangper*0.8}%`;

        const danbekper = (( dinnerjibang / (femaledanbek * (0.3)) ) * 100).toFixed(2);
        document.getElementById('catePer2').innerText = `${danbekper}%`;
        const danbekBar = document.querySelector('#cateper2 span');
        danbekBar.style.width = `${danbekper*0.8}%`;

        const kaloryper = (( dinnerkalory / (femalekalory * (0.3)) ) * 100).toFixed(2);
        document.getElementById('catePer3').innerText = `${kaloryper}%`;
        const kaloryBar = document.querySelector('#cateper3 span');
        kaloryBar.style.width = `${kaloryper*0.8}%`;

        // 기준치 그래프 표시 코드
        const base = 80
        const baseBar = document.querySelector('.base');
        // baseBar.stlye.weight = '1%'
        baseBar.style.marginLeft = `${base}%`;
    }
} // Category 함수

document.addEventListener('DOMContentLoaded', function () {
    const pageMove = document.getElementById('pagemove')
    if (pageMove !== null){
        pageMove.addEventListener('click' ,async function () {
            var meallist = './meallist.html'
            window.location.href = meallist
        })
    }
})
