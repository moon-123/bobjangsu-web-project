import * as func from './mealdetail.js'

export async function morningmenulist(babmenu, gugmenu, banchanmenu, calcbase) {
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
        const babrandom = await func.getRandomElement(babmenu);
        // console.log("143 babrandom: ", babrandom);
        // console.log("144 babmenu: ", babmenu);
        if ( parseFloat(babrandom.tansu) < (calcbase[3] * (0.33)) * 0.75   
        && parseFloat(babrandom.jibang) <= calcbase[2] * (0.33)
        && parseFloat(babrandom.danbek) <= calcbase[1] * (0.33)
        && parseFloat(babrandom.kalory) <= calcbase[0] * (0.33) ) {
            babtansu += parseFloat(babrandom.tansu)
            babjibang += parseFloat(babrandom.jibang)
            babdanbek += parseFloat(babrandom.danbek)
            babkalory += parseFloat(babrandom.kalory) 
            Babrandom = babrandom

             // 국 랜덤 출력
            let gugtansu = 0
            let gugjibang = 0
            let gugdanbek = 0
            let gugkalory = 0
            const gugrandom = await func.getRandomElement(gugmenu)
            if ( parseFloat(gugrandom.tansu) + babtansu <= calcbase[3] * (0.33)
            && parseFloat(gugrandom.jibang) + babjibang <= calcbase[2] * (0.33)
            && parseFloat(gugrandom.danbek) + babdanbek <= calcbase[1] * (0.33)
            && parseFloat(gugrandom.kalory) + babkalory <= calcbase[0] * (0.33) ) {
                gugtansu = parseFloat(gugrandom.tansu) + babtansu
                gugjibang = parseFloat(gugrandom.jibang) + babjibang
                gugdanbek = parseFloat(gugrandom.danbek) + babdanbek
                gugkalory = parseFloat(gugrandom.kalory) + babkalory
                Gugrandom = gugrandom

                // 반찬1 랜덤 출력
                let banchantansu = 0
                let banchanjibang = 0
                let banchandanbek = 0
                let banchankalory = 0
                const banchanrandom = await func.getRandomElement(banchanmenu);
                if ( parseFloat(banchanrandom.tansu) + gugtansu <= calcbase[3] * (0.33)
                && parseFloat(banchanrandom.jibang) + gugjibang <= calcbase[2] * (0.33)
                && parseFloat(banchanrandom.danbek) + gugdanbek <= calcbase[1] * (0.33)
                && parseFloat(banchanrandom.kalory) + gugkalory <= calcbase[0] * (0.33) ) {
                    banchantansu = parseFloat(banchanrandom.tansu) + gugtansu
                    banchanjibang = parseFloat(banchanrandom.jibang) + gugjibang
                    banchandanbek = parseFloat(banchanrandom.danbek) + gugdanbek
                    banchankalory = parseFloat(banchanrandom.kalory) + gugkalory
                    Banchanrandom = banchanrandom
                    
                    // 반찬2 랜덤 출력
                    const banchanrandom1 = await func.getRandomElement(banchanmenu);
                    if ( parseFloat(banchanrandom1.tansu) + banchantansu <= calcbase[3] * (0.33)
                    && parseFloat(banchanrandom1.jibang) + banchanjibang <= calcbase[2] * (0.33)
                    && parseFloat(banchanrandom1.danbek) + banchandanbek <= calcbase[1] * (0.33)
                    && parseFloat(banchanrandom1.kalory) + banchankalory <= calcbase[0] * (0.33) ) {
                        morningkalory = parseFloat(banchanrandom1.kalory) + banchankalory   
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

    const Morningtansu = parseFloat(Babrandom.tansu) + parseFloat(Gugrandom.tansu) + parseFloat(Banchanrandom.tansu) + parseFloat(Banchanrandom1.tansu)
    const Morningdanbek = parseFloat(Babrandom.danbek) + parseFloat(Gugrandom.danbek) + parseFloat(Banchanrandom.danbek) + parseFloat(Banchanrandom1.danbek)
    const Morningjibang = parseFloat(Babrandom.jibang) + parseFloat(Gugrandom.jibang) + parseFloat(Banchanrandom.jibang) + parseFloat(Banchanrandom1.jibang)
    const Morningkalory = parseFloat(Babrandom.kalory) + parseFloat(Gugrandom.kalory) + parseFloat(Banchanrandom.kalory) + parseFloat(Banchanrandom1.kalory)

    // 선정된 메뉴 HTML에 출력하는 과정
    const realbab = Babrandom.name
    const realgug = Gugrandom.name;
    const realbanchan = Banchanrandom.name
    const realbanchan1 = Banchanrandom1.name

    // 적정량 그래프 작성 과정
    const tansuper = (( Morningtansu / (calcbase[3] * (0.3))) * 100).toFixed(2);
    const jibangper = (( Morningjibang / (calcbase[2] * (0.3)) ) * 100).toFixed(2);
    const danbekper = (( Morningdanbek / (calcbase[1] * (0.3)) ) * 100).toFixed(2);
    const kaloryper = (( Morningkalory / (calcbase[0] * (0.3)) ) * 100).toFixed(2);

    const morning = [realbab,realgug,realbanchan,realbanchan1]
    const per = [tansuper, jibangper, danbekper,kaloryper ]
    const dic = {
        name:"morning",
        user : {rice: morning[0],soup: morning[1],main1: morning[2],main2: morning[3]},
        per : {tan: per[0],ji:per[1],dan:per[2],kal:per[3], total:Morningkalory}
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
        return res
    } catch (error) {
        console.error('Error:', error);
    }
} // morningmenulist 함수

export async function lunchmenulist(babmenu, gugmenu, banchanmenu, calcbase) {

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
        const babrandom = await func.getRandomElement(babmenu);
        if ( parseFloat(babrandom.tansu) < (calcbase[3] * (0.44)) * 0.75   
        && parseFloat(babrandom.jibang) <= calcbase[2] * (0.44)
        && parseFloat(babrandom.danbek) <= calcbase[1] * (0.44)
        && parseFloat(babrandom.kalory) <= calcbase[0] * (0.44) ) {
            babtansu += parseFloat(babrandom.tansu)
            babjibang += parseFloat(babrandom.jibang)
            babdanbek += parseFloat(babrandom.danbek)
            babkalory += parseFloat(babrandom.kalory) 
            Babrandom = babrandom

             // 국 랜덤 출력
            let gugtansu = 0
            let gugjibang = 0
            let gugdanbek = 0
            let gugkalory = 0
            const gugrandom = await func.getRandomElement(gugmenu)
            if ( parseFloat(gugrandom.tansu) + babtansu <= calcbase[3] * (0.44)
            && parseFloat(gugrandom.jibang) + babjibang <= calcbase[2] * (0.44)
            && parseFloat(gugrandom.danbek) + babdanbek <= calcbase[1] * (0.44)
            && parseFloat(gugrandom.kalory) + babkalory <= calcbase[0] * (0.44) ) {
                gugtansu = parseFloat(gugrandom.tansu) + babtansu
                gugjibang = parseFloat(gugrandom.jibang) + babjibang
                gugdanbek = parseFloat(gugrandom.danbek) + babdanbek
                gugkalory = parseFloat(gugrandom.kalory) + babkalory
                Gugrandom = gugrandom

                // 반찬1 랜덤 출력
                let banchantansu = 0
                let banchanjibang = 0
                let banchandanbek = 0
                let banchankalory = 0
                const banchanrandom = await func.getRandomElement(banchanmenu);
                if ( parseFloat(banchanrandom.tansu) + gugtansu <= calcbase[3] * (0.44)
                && parseFloat(banchanrandom.jibang) + gugjibang <= calcbase[2] * (0.44)
                && parseFloat(banchanrandom.danbek) + gugdanbek <= calcbase[1] * (0.44)
                && parseFloat(banchanrandom.kalory) + gugkalory <= calcbase[0] * (0.44) ) {
                    banchantansu = parseFloat(banchanrandom.tansu) + gugtansu
                    banchanjibang = parseFloat(banchanrandom.jibang) + gugjibang
                    banchandanbek = parseFloat(banchanrandom.danbek) + gugdanbek
                    banchankalory = parseFloat(banchanrandom.kalory) + gugkalory
                    Banchanrandom = banchanrandom
                    
                    // 반찬2 랜덤 출력
                    const banchanrandom1 = await func.getRandomElement(banchanmenu);
                    if ( parseFloat(banchanrandom1.tansu) + banchantansu <= calcbase[3] * (0.44)
                    && parseFloat(banchanrandom1.jibang) + banchanjibang <= calcbase[2] * (0.44)
                    && parseFloat(banchanrandom1.danbek) + banchandanbek <= calcbase[1] * (0.44)
                    && parseFloat(banchanrandom1.kalory) + banchankalory <= calcbase[0] * (0.44) ) {
                        lunchkalory = parseFloat(banchanrandom1.kalory) + banchankalory   
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
  
    const Lunchtansu = parseFloat(Babrandom.tansu) + parseFloat(Gugrandom.tansu) + parseFloat(Banchanrandom.tansu) + parseFloat(Banchanrandom1.tansu)
    const Lunchdanbek = parseFloat(Babrandom.danbek) + parseFloat(Gugrandom.danbek) + parseFloat(Banchanrandom.danbek) + parseFloat(Banchanrandom1.danbek)
    const Lunchjibang = parseFloat(Babrandom.jibang) + parseFloat(Gugrandom.jibang) + parseFloat(Banchanrandom.jibang) + parseFloat(Banchanrandom1.jibang)
    const Lunchkalory = parseFloat(Babrandom.kalory) + parseFloat(Gugrandom.kalory) + parseFloat(Banchanrandom.kalory) + parseFloat(Banchanrandom1.kalory)
    
    // 선정된 메뉴 HTML에 출력하는 과정
    const realbab = Babrandom.name
    const realgug = Gugrandom.name     
    const realbanchan = Banchanrandom.name
    const realbanchan1 = Banchanrandom1.name

    // 적정량 그래프 작성 과정
    const tansuper = (( Lunchtansu / (calcbase[3] * (0.4))) * 100).toFixed(2);
    document.getElementById('catePer').innerText = `${tansuper}%`;
    const tansuBar = document.querySelector('#cateper span');
    tansuBar.style.width = `${tansuper}%`;

    const jibangper = (( Lunchjibang / (calcbase[2] * (0.4)) ) * 100).toFixed(2);
    document.getElementById('catePer1').innerText = `${jibangper}%`;
    const jibangBar = document.querySelector('#cateper1 span');
    jibangBar.style.width = `${jibangper}%`;

    const danbekper = (( Lunchdanbek / (calcbase[1] * (0.4)) ) * 100).toFixed(2);
    document.getElementById('catePer2').innerText = `${danbekper}%`;
    const danbekBar = document.querySelector('#cateper2 span');
    danbekBar.style.width = `${danbekper}%`;

    const kaloryper = (( Lunchkalory / (calcbase[0] * (0.4)) ) * 100).toFixed(2);
    document.getElementById('catePer3').innerText = `${kaloryper}% // ${Lunchkalory.toFixed(2)}kcal`;
    const kaloryBar = document.querySelector('#cateper3 span');
    kaloryBar.style.width = `${kaloryper}%`;

    const lunch = [realbab,realgug,realbanchan,realbanchan1]
    const per = [tansuper, jibangper, danbekper,kaloryper ]
    const dic = {
        name:"lunch",
        user : {rice: lunch[0],soup: lunch[1],main1: lunch[2],main2: lunch[3]},
        per : {tan: per[0],ji:per[1],dan:per[2],kal:per[3], total:Lunchkalory}
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
        return res
    } catch (error) {
        console.error('Error:', error);
    }      
} // lunchmenulist 함수


export async function dinnermenulist(babmenu, gugmenu, banchanmenu, calcbase) {
    console.log('저녁 함수 들어왓다');        
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
        const babrandom = await func.getRandomElement(babmenu);
        if ( parseFloat(babrandom.tansu) < (calcbase[3] * (0.33)) * 0.75   
        && parseFloat(babrandom.jibang) <= calcbase[2] * (0.33)
        && parseFloat(babrandom.danbek) <= calcbase[1] * (0.33)
        && parseFloat(babrandom.kalory) <= calcbase[0] * (0.33) ) {
            babtansu += parseFloat(babrandom.tansu)
            babjibang += parseFloat(babrandom.jibang)
            babdanbek += parseFloat(babrandom.danbek)
            babkalory += parseFloat(babrandom.kalory) 
            Babrandom = babrandom

             // 국 랜덤 출력
            let gugtansu = 0
            let gugjibang = 0
            let gugdanbek = 0
            let gugkalory = 0
            const gugrandom = await func.getRandomElement(gugmenu)
            if ( parseFloat(gugrandom.tansu) + babtansu <= calcbase[3] * (0.33)
            && parseFloat(gugrandom.jibang) + babjibang <= calcbase[2] * (0.33)
            && parseFloat(gugrandom.danbek) + babdanbek <= calcbase[1] * (0.33)
            && parseFloat(gugrandom.kalory) + babkalory <= calcbase[0] * (0.33) ) {
                gugtansu = parseFloat(gugrandom.tansu) + babtansu
                gugjibang = parseFloat(gugrandom.jibang) + babjibang
                gugdanbek = parseFloat(gugrandom.danbek) + babdanbek
                gugkalory = parseFloat(gugrandom.kalory) + babkalory
                Gugrandom = gugrandom

                // 반찬1 랜덤 출력
                let banchantansu = 0
                let banchanjibang = 0
                let banchandanbek = 0
                let banchankalory = 0
                const banchanrandom = await func.getRandomElement(banchanmenu);
                if ( parseFloat(banchanrandom.tansu) + gugtansu <= calcbase[3] * (0.33)
                && parseFloat(banchanrandom.jibang) + gugjibang <= calcbase[2] * (0.33)
                && parseFloat(banchanrandom.danbek) + gugdanbek <= calcbase[1] * (0.33)
                && parseFloat(banchanrandom.kalory) + gugkalory <= calcbase[0] * (0.33) ) {
                    banchantansu = parseFloat(banchanrandom.tansu) + gugtansu
                    banchanjibang = parseFloat(banchanrandom.jibang) + gugjibang
                    banchandanbek = parseFloat(banchanrandom.danbek) + gugdanbek
                    banchankalory = parseFloat(banchanrandom.kalory) + gugkalory
                    Banchanrandom = banchanrandom
                    
                    // 반찬2 랜덤 출력
                    const banchanrandom1 = await func.getRandomElement(banchanmenu);
                    if ( parseFloat(banchanrandom1.tansu) + banchantansu <= calcbase[3] * (0.33)
                    && parseFloat(banchanrandom1.jibang) + banchanjibang <= calcbase[2] * (0.33)
                    && parseFloat(banchanrandom1.danbek) + banchandanbek <= calcbase[1] * (0.33)
                    && parseFloat(banchanrandom1.kalory) + banchankalory <= calcbase[0] * (0.33) ) {
                        dinnerkalory = parseFloat(banchanrandom1.kalory) + banchankalory   
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

    const Dinnertansu = parseFloat(Babrandom.tansu) + parseFloat(Gugrandom.tansu) + parseFloat(Banchanrandom.tansu) + parseFloat(Banchanrandom1.tansu)
    const Dinnerdanbek = parseFloat(Babrandom.danbek) + parseFloat(Gugrandom.danbek) + parseFloat(Banchanrandom.danbek) + parseFloat(Banchanrandom1.danbek)
    const Dinnerjibang = parseFloat(Babrandom.jibang) + parseFloat(Gugrandom.jibang) + parseFloat(Banchanrandom.jibang) + parseFloat(Banchanrandom1.jibang)
    const Dinnerkalory = parseFloat(Babrandom.kalory) + parseFloat(Gugrandom.kalory) + parseFloat(Banchanrandom.kalory) + parseFloat(Banchanrandom1.kalory)
    // 선정된 메뉴 HTML에 출력하는 과정
    const realbab = Babrandom.name
    const realgug = Gugrandom.name
    const realbanchan = Banchanrandom.name
    const realbanchan1 = Banchanrandom1.name

    // 적정량 그래프 작성 과정
    const tansuper = (( Dinnertansu / (calcbase[3] * (0.3))) * 100).toFixed(2);
    document.getElementById('catePer').innerText = `${tansuper}%`;
    const tansuBar = document.querySelector('#cateper span');
    tansuBar.style.width = `${tansuper}%`;

    const jibangper = (( Dinnerjibang / (calcbase[2] * (0.3)) ) * 100).toFixed(2);
    document.getElementById('catePer1').innerText = `${jibangper}%`;
    const jibangBar = document.querySelector('#cateper1 span');
    jibangBar.style.width = `${jibangper}%`;

    const danbekper = (( Dinnerdanbek / (calcbase[1] * (0.3)) ) * 100).toFixed(2);
    document.getElementById('catePer2').innerText = `${danbekper}%`;
    const danbekBar = document.querySelector('#cateper2 span');
    danbekBar.style.width = `${danbekper}%`;

    const kaloryper = (( Dinnerkalory / (calcbase[0] * (0.3)) ) * 100).toFixed(2);
    document.getElementById('catePer3').innerText = `${kaloryper}% // ${Dinnerkalory.toFixed(2)}kcal`;
    const kaloryBar = document.querySelector('#cateper3 span');
    kaloryBar.style.width = `${kaloryper}%`;

    const dinner = [realbab,realgug,realbanchan,realbanchan1]
    const per = [tansuper, jibangper, danbekper,kaloryper ]
    const dic = {
        name:"dinner",
        user : {rice: dinner[0],soup: dinner[1],main1: dinner[2],main2: dinner[3]},
        per : {tan: per[0],ji:per[1],dan:per[2],kal:per[3],total:Dinnerkalory}
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
        return res
    } catch (error) {
        console.error('Error:', error);
    }     
} // lunchmenulist 함수