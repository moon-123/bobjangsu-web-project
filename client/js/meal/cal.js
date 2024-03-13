const Allergy =[]
const NoAllergy =[]
let trueAllergy// 선택한 알러지 값 입력받기 위한 리스트
// 데이터를 링크에서 받아와서 fetch하는 함수
var token = localStorage.getItem('jwt')

var test = document.getElementsByName('allergy')
test.forEach((el)=>{
    el.addEventListener('change',()=>{
        if (el.checked === true) {
            if (el.defaultValue !== "없음") {
                Allergy.push(el.defaultValue)
            }
            else {
                NoAllergy.push(el.defaultValue) 
            }
        }
    })
})

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



function myFunction() {
    const allergy13 = document.getElementById('allergy13').value
    if (allergy13 === '') {
        delete allergy13
    }
    else {
        Allergy.push(allergy13)
    }
    const height = document.getElementById('height').value
    const weight = document.getElementById('weight').value
    const energy = document.getElementById('energy').value

    if ( height === '') {
        alert('키는 반드시 입력해주어야 합니다')
        location.reload()
    }
    else if (height > 250 && height < 80 ) {
        alert('키를 올바르게 입력해주세요')
        location.reload()
    } 
    else if (weight === '') {
        alert('몸무게는 반드시 입력해주어야 합니다')
        location.reload()
    }
    else if (weight > 220 && weight < 20 ) {
        alert('몸무게를 올바르게 입력해주세요')
        location.reload()
    }
    if (Allergy.length && NoAllergy.length) {
        alert('알레르기를 올바르게 입력해주세요')
        location.reload()
    }
    else {
        if(Allergy.length) {
            trueAllergy = Allergy
        }
        else {
            trueAllergy = NoAllergy
        }
    }
    dic = {
        weight: Number(weight),
        height: Number(height),
        allergy: trueAllergy,
        energy: Number(energy)
    }
      
    async function fetchUserData(data) {
        try {
            const response = await fetch('http://localhost:8080/meal/user', {
                method: 'POST',
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
            alert('입력한 정보는 오늘 종일 반영되며, 높은 품질의 식단을 만나보실 수 있습니다!')
            var meal = './meal.html';
            window.location.href = meal;
        } catch (error) {
            console.error('Error:', error);
        }
    }
    fetchUserData(dic)
}

document.addEventListener('DOMContentLoaded', function () {
    const pageMove = document.getElementById('pagemove')
    pageMove.addEventListener('click' ,async function () {
        myFunction()
    })
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