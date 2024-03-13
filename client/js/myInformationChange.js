var urlParams = new URLSearchParams(window.location.search);
var category = urlParams.get('data');
var token = localStorage.getItem('jwt')

fetchUserData();

async function fetchUserData() {
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
        const data = await response.json()
        infoData(data[1])
    } catch (error) {
        console.error('Error:', error);
    }
}

function infoData(data) {
    if ( data.height === undefined) {
        content1 = `<label for="inputName">키</label><input type="text" id="height" maxlength=3 placeholder="미저장" required>`
    }else{
        content1 = `<label for="inputName">키</label><input type="text" id="height" maxlength=3 placeholder="${data.height}">`
    }
    if ( data.weight === undefined) {
        content2 = `<label for="inputName">몸무게</label><input type="text" id="weight" maxlength=3 placeholder="미저장">`
    }else{
        content2 = `<label for="inputName">몸무게</label><input type="text" id="weight" maxlength=3 placeholder="${data.weight}">`
    }
    if ( data.allergy === undefined) {
        content3 = '미저장'
    }else{
        content3 = data.allergy
    }if(data.energy === undefined){
        content4 = 1
    }else {
        content4 = data.energy
    }
    document.getElementById('heightbox').innerHTML = content1
    document.getElementById('weightbox').innerHTML = content2
    document.getElementById('energybox').innerHTML = `<label for="inputName">운동량</label><input type="range" id="energy" min=1 max=5 value="${content4}">`
    document.getElementById('allergy').innerHTML = content3


    document.getElementById('height').addEventListener("input", (e) => { 
        const input = e.target.value
        if (notNum(input)) {
            e.target.value = ''; 
            alert("숫자만 입력하세요.")
          }
    })
    document.getElementById('weight').addEventListener("input", (e) => { 
        const input = e.target.value
        if (notNum(input)) {
            e.target.value = ''; 
            alert("숫자만 입력하세요.")
          }
    })
    document.getElementById('allergy13').addEventListener("input", (e) => { 
        const input = e.target.value
        if (notHan(input)) {
            e.target.value = ''; 
            alert("한글만 입력하세요.")
          }
    })

    function notNum(text) {
        const hangulRegex = /[ㄱ-ㅎㅏ-ㅣ가-힣]/;
        const engRegex = /[a-zA-Z]/;
        const sepRegex = /[~!@#$%^&*()_+=-`\\/]/
        const spaRegex = /[ ]/

        return hangulRegex.test(text) || engRegex.test(text) || sepRegex.test(text) || spaRegex.test(text);
      }
      
    function notHan(text){
        const numRegex = /[0-9]/
        const engRegex = /[a-zA-Z]/;
        const sepRegex = /[~!@#$%^&*()_+=-`\\/]/
        const spaRegex = /[ ]/

        return numRegex.test(text) || engRegex.test(text) || sepRegex.test(text) || spaRegex.test(text);
    }
    
}


// 새로 작성된 데이터 업데이트

const Allergy =[] // 선택한 알러지 값 입력받기 위한 리스트
// 데이터를 링크에서 받아와서 fetch하는 함수
var token = localStorage.getItem('jwt')


function newUserdata() {
    const energy = document.getElementById('energy').value
    const allergies = document.getElementsByName('allergy');
    const height = document.getElementById('height').value
    const weight = document.getElementById('weight').value
    const allergy13 = document.getElementById('allergy13').value
    let flag = true

    allergies.forEach((allergy) => {
        console.log(allergy.value);
        if( allergy.checked ){
            Allergy.push(allergy.value)
        }
    })
    Allergy.push(allergy13)
    if(Allergy[0] === ""){
        Allergy[0] = "없음"
    }
    dic = {
        weight: Number(weight),
        height: Number(height),
        allergy: Allergy,
        energy: Number(energy)
    }

    if ( height === '') {
        alert('키는 반드시 입력해주어야 합니다')
        flag = false
    }
    else if (height > 250 || height < 80 ) {
        alert('키를 올바르게 입력해주세요')
        flag = false
    } 
    else if (weight === '' ) {
        alert('몸무게는 반드시 입력해주어야 합니다')
        flag = false
    }
    else if (weight > 220 || weight < 20) {
        alert('몸무게를 올바르게 입력해주세요')
        flag = false
    }
    if(flag){
        fetchUserData(dic)
        return true
    }
    else{
        return false
    }

    async function fetchUserData(data) {
        try {
            const response = await fetch('http://localhost:8080/meal/newuser', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const result = await response.json();
        } catch (error) {
            console.error('Error:', error);
        }
    }
}


const pageMove = document.getElementById('infochange')
    pageMove.addEventListener('click' , function (event) {
        const sta = newUserdata()
        if(sta){
            alert('수정하신 정보는 내일 부터 반영되며, 높은 품질의 식단을 만나보실 수 있습니다!')
            var meallist = './myInformationCheck.html'
            window.location.href = meallist
        }
        else{
            event.preventDefault();
            alert('입력이 유효하지 않습니다. 데이터를 올바르게 입력해주세요.');
        }
    })


