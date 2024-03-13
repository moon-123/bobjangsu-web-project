let time_wrap;
const storedToken = localStorage.getItem('jwt');

document.addEventListener('DOMContentLoaded', () => {

    const weightDataInput = document.getElementById('weightData');
    weightDataInput.addEventListener('input', validateWeightData);

    const saveButton = document.getElementById('savebtn')

    const currentUrl = new URL(window.location.href);
    let dataParam = currentUrl.searchParams.get('dataId');
    let categorys = currentUrl.searchParams.get('category');
    let decodedData = decodeURIComponent(dataParam);
    let category = decodeURIComponent(categorys);

    if(decodedData === 'null'){
        getNowTime()
        getNowDate()
    }else{
        updateDate(decodedData, category)
    }
    saveButton.addEventListener('click', () => saveData(decodedData, category));
    getDare()

    const hhmm = document.getElementById('timeClick');
    const timeTable = document.getElementById('timeTable');
    time_wrap = document.getElementById('time-wrap')
    time_wrap.addEventListener('click', () => {
        createDropdowns(timeTable);
        const time = time_wrap.lastElementChild
        if(time.classList.contains('on')){
            time.classList.remove('on')            
        }else{
            time.classList.add('on')
        }
    });

    document.getElementById('hours').addEventListener('click', handleOptionClick);
    document.getElementById('mins').addEventListener('click', handleOptionClick);
})

function validateWeightData(event) {
    const input = event.target;
    const maxLength = 3; 
    let sanitizedValue = input.value.replace(/[^0-9]/g, '');

    sanitizedValue = sanitizedValue.slice(0, maxLength);

    input.value = sanitizedValue;
}


async function updateDate(decodedData, category) {
    try {
        const response = await fetch(`http://localhost:8080/health/serchDataByID?dataId=${decodedData}&category=${category}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${storedToken}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        // 년도
        const dateParts = data.date.split('-');
        const year = parseInt(dateParts[0]);
        const month = parseInt(dateParts[1]) - 1; 
        const day = parseInt(dateParts[2]);
        const dayOfWeek = new Date(year, month, day).toLocaleDateString('ko-KR', { weekday: 'long' });

        document.getElementById('check_in_day').textContent = data.date.split('T')[0] + '(' + dayOfWeek.split('요')[0] + ')'

        // 시간 
        document.getElementById('hh').textContent = data.date.split('T')[1].split(':')[0];
        document.getElementById('mm').textContent = data.date.split('T')[1].split(':')[1];

        // 혈압
        document.getElementById('weightData').value = data.weightData

        // 메모
        document.getElementById('content').textContent = data.notepad
    } catch (error) {
        console.error('Error:', error);
    }
}

async function saveData(decodedData, category){
    // 여기서 다자인 에 따라 dateYMD 랑 dateDMS 고쳐야 합니다
    // 결로쪽으로 'yyyy-mm-dd hh:mm:ss' 이런 씩으로 완성 한다 
    // 시간 선택 
    const dateYMD = document.getElementById('check_in_day').textContent.split('(')[0]
    const dateH = await document.getElementById('hh').textContent
    const dateM = await document.getElementById('mm').textContent
    let dateTime;
    if(dateYMD.length === 10){
        dateTime = dateYMD + ' ' + dateH + ':' + dateM + ':00'
    }else{
        dateTime = dateYMD + '' + dateH + ':' + dateM + ':00'
    }

    const weightData =await document.getElementById('weightData').value
    const notepad = await document.getElementById('content').value
    const storedToken = await localStorage.getItem('jwt');

    if(weightData <= 20){
        alert('몸무게 수치는 20보다 커야 합니다!')
        return
    }

    if(weightData > 400){
        alert('몸무게 수치 400보다 큽니다!')
        return
    }

    try {
        var result = window.confirm(
            '시간: ' + dateTime +
            '\n몸무게: ' + weightData +
            '\n메모내용: ' + notepad +
            '\n저장하겠습니까?'
        );

        if (result) {
            const apiUrl = decodedData === 'null' ?
                'http://localhost:8080/health/createWeight' :
                `http://localhost:8080/health/updateData?category=${category}&dataId=${decodedData}`;

            console.log(apiUrl)
            
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${storedToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "date": dateTime,
                    "weightData": weightData,
                    "notepad": notepad
                }),
            });

            if (response.status === 200 || response.status === 301) {
                alert(decodedData === 'null' ? '저장 성공!' : '수정 성공!');
                window.location.href = 'dataChart.html?data=' + encodeURIComponent('몸무게');
            } else {
                alert(decodedData === 'null' ? '저장 실패!' : '수정 실패!');
            }
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again later.');
    }
}


function getDare(){
    const today = new Date();
    // 달력이도 최대 개월 수
    const limitMonth = 4;
    // 달력에서 표기하는 날짜 객체
    let thisMonth = today;
    // 달력에서 표기하는 년
    let currentYear = thisMonth.getFullYear();
    // 달력에서 표기하는 월
    let currentMonth = thisMonth.getMonth();
    // 체크인 날짜
    let checkInDate = "";

    const nowYear = today.getFullYear()
    const nowMonth = today.getMonth();


    $(document).ready(function () {
        // 달력 만들기
        calendarInit(thisMonth);


        // 이전달로 이동
        $('.go-prev').on('click', function () {
            thisMonth = new Date(currentYear, currentMonth - 1, 1);

            calendarInit(thisMonth);
        });

        // 다음달로 이동
        $('.go-next').on('click', function () {

            if (currentYear > nowYear || (currentYear === nowYear && currentMonth >= nowMonth)) {
                alert('이미 12월이므로 더 이상 이동할 수 없습니다.');
                return;
            }

            let limitYear = today.getFullYear();

            if (currentMonth + limitMonth >= 12) {
                limitYear = limitYear + 1
            }

            thisMonth = new Date(currentYear, currentMonth + 1, 1);
            calendarInit(thisMonth);
        });
    });

    function calendarInit(thisMonth) {

        // 렌더링을 위한 데이터 정리
        currentYear = thisMonth.getFullYear();
        currentMonth = thisMonth.getMonth();

        // 렌더링 html 요소 생성
        let start_calendar = '';
        // let last_calendar = '';

        makeStartCalendar();
        // makeLastCalendar();

        // start_calendar
        function makeStartCalendar() {
            // 이전 달의 마지막 날 날짜와 요일 구하기
            const startDay = new Date(currentYear, currentMonth, 0);
            const prevDate = startDay.getDate();
            const prevDay = startDay.getDay();

            // 이번 달의 마지막날 날짜와 요일 구하기
            const endDay = new Date(currentYear, currentMonth + 1, 0);
            const nextDate = endDay.getDate();
            const nextDay = endDay.getDay();

            // 지난달
            for (let i = prevDate - prevDay; i <= prevDate; i++) {
                start_calendar += pervDisableDay(i);
            }

            // 이번달
            for (let i = 1; i <= nextDate; i++) {
                // 이번달이 현재 년도와 월이 같을경우
                if (currentYear === today.getFullYear() && currentMonth === today.getMonth()) {
                    start_calendar += dailyDay(currentYear, currentMonth, i);
                } else {
                    start_calendar += dailyDay(currentYear, currentMonth, i);
                }
            }

            // 다음달 7 일 표시
            for (let i = 1; i <= (6 - nextDay); i++) {
                start_calendar += nextDisableDay(i);
            }

            $('.start-calendar').html(start_calendar);
            // 월 표기
            $('.start-year-month').text(currentYear + '.' + zf((currentMonth + 1)));
        }
        function pervDisableDay(day) {
            return '<div class="day prev disable">' + day + '</div>';
        }

        // 이번달
        function dailyDay(currentYear, currentMonth, day) {
            const date = currentYear + '' + zf((currentMonth + 1)) + '' + zf(day);
            const currentDate = new Date(currentYear, currentMonth, day);
        
            if (currentDate > today) {
                return '<div class="day current disable">' + day + '</div>';
            } else if (checkInDate === date) {
                return '<div class="day current checkIn" data-day="' + date + '" onclick="selectDay(this)"><span>' + day + '</span><p class="check_in_out_p"></p><p>' + '</div>';
            } else {
                return '<div class="day current" data-day="' + date + '" onclick="selectDay(this)"><span>' + day + '</span><p class="check_in_out_p"></p><p>' + '</div>';
            }
        }
    
        // 다음달 미리 보기
        function nextDisableDay(day) {
            return '<div class="day next disable">' + day + '</div>';
        }

    }

    // 숫자 두자리로 만들기
    function zf(num) {
        num = Number(num).toString();

        if (Number(num) < 10 && num.length == 1) {
            num = "0" + num;
        }

        return num;
    }
}


// 창 뛰우기 이벤트 
function toggleCalendar() {
    const calendar = document.getElementById('calendar');
    calendar.style.display = 'block';
    const date_wrap = document.getElementById('date-wrap')
    date_wrap.style.display = 'none';
}

function hideIt(){
    const calendar = document.getElementById('calendar');
    calendar.style.display = 'none';
    const date_wrap = document.getElementById('date-wrap')
    date_wrap.style.display = 'block';
    date_wrap.style.display = 'flex';
}

// 클릭 이벤트
function selectDay(obj) {
    const checkInDateElement = document.getElementById('check_in_day');
    if (!checkInDateElement) {
        $(obj).addClass('checkIn');
        $('.checkIn').find('.check_in_out_p').html('');

        checkInDate = $(obj).data('day');
        $('#check_in_day').html(getCheckIndateHtml());
    } else {
        $('.checkIn').find('.check_in_out_p').html('');
        $('.day').removeClass('checkIn');

        $(obj).addClass('checkIn');
        $('.checkIn').find('.check_in_out_p').html('');

        checkInDate = $(obj).data('day')
        $('#check_in_day').html(getCheckIndateHtml())
    }
}

// 체크인 날짜 표기
function getCheckIndateHtml() {
    checkInDate = checkInDate.toString();
    let dateData = checkInDate.substring('0', '4') + "-" + checkInDate.substring('4', '6') + "-" + checkInDate.substring('6', '8') + " ( " + strWeekDay(weekday(checkInDate)) + " )"
    return dateData ;
}

// 요일 리턴
function strWeekDay(weekday) {
    switch (weekday) {
        case 0: return "일"
            break;
        case 1: return "월"
            break;
        case 2: return "화"
            break;
        case 3: return "수"
            break;
        case 4: return "목"
            break;
        case 5: return "금"
            break;
        case 6: return "토"
            break;
    }
}

// 몇요일인지 알려주는 함수 (숫자 형태)
function weekday(YYYYMMDD) {
    const weekday_year = YYYYMMDD.substring(0, 4);
    const weekday_menth = YYYYMMDD.substring(4, 6);
    const weekday_day = YYYYMMDD.substring(6, 9);

    return new Date(weekday_year + "-" + weekday_menth + "-" + weekday_day).getDay();
}

function getNowTime(){
    const now = new Date();
    const hours = padWithZero(now.getHours());
    const minutes = padWithZero(now.getMinutes());

    document.getElementById('hh').value = hours;
    document.getElementById('mm').value = minutes;
}

// 몇요일인지 알려주는 함수 (숫자 형태)
function weekday(YYYYMMDD) {
    const weekday_year = YYYYMMDD.substring(0, 4);
    const weekday_menth = YYYYMMDD.substring(4, 6);
    const weekday_day = YYYYMMDD.substring(6, 9);

    return new Date(weekday_year + "-" + weekday_menth + "-" + weekday_day).getDay();
}

function handleOptionClick(event) {
    const clickedOption = event.target;
    if (clickedOption.classList.contains('option')) {
        document.querySelectorAll('.option').forEach(option => {
            option.classList.remove('clicked');
        });
        clickedOption.classList.add('clicked');
    }
}

function generateOptions(start, end) {
    const options = [];
    for (let i = start; i <= end; i++) {
        options.push(padWithZero(i));
    }
    return options;
}

function createDropdowns(obj) {
    // obj.style.display = 'block';

    // Ensure that generateOptions is defined in your code
    const hoursOptions = generateOptions(0, 23);
    const minutesOptions = generateOptions(0, 60);

    const hours = document.getElementById('hours');
    hours.textContent = '';
    const mins = document.getElementById('mins');
    mins.textContent = '';
    const hh = document.getElementById('hh');
    const mm = document.getElementById('mm');

    hoursOptions.forEach(hour => {
        const option = document.createElement('div');
        option.textContent = hour.toString(); // Convert to string if needed
        option.classList.add('option');
        option.addEventListener('click', (event) => {
            event.stopPropagation();
            hh.textContent = hour.toString(); // Convert to string if needed
        });
        hours.appendChild(option);
    });

    minutesOptions.forEach(min => {
        const option = document.createElement('div');
        option.textContent = min.toString(); // Convert to string if needed
        option.classList.add('option');
        option.addEventListener('click', (event) => {
            event.stopPropagation();
            mm.textContent = min.toString(); // Convert to string if needed
        });
        mins.appendChild(option);
    });

    // 스크롤 시작 위치 지전 
    // 근데 왜 안되지????
    // const hourIndex = hoursOptions.indexOf(Number(hh.textContent));
    // const minuteIndex = minutesOptions.indexOf(Number(mm.textContent));

    // console.log(hourIndex, minuteIndex)
    // if (hourIndex !== -1) {
    //     setInitialScrollPosition(hours, hourIndex);
    // }

    // if (minuteIndex !== -1) {
    //     setInitialScrollPosition(mins, minuteIndex);
    // }
}

//스크롤 시작 위치 지전 
// function setInitialScrollPosition(element, index) {
//     const itemHeight = 22;
//     const scrollPosition = index * itemHeight;

//     console.log(scrollPosition)
//     console.log(element)

//     element.scrollTop = scrollPosition;
// }

function padWithZero(number) {
    return number < 10 ? '0' + number : number;
}

function getNowTime() {
    const now = new Date();
    const hours = padWithZero(now.getHours());
    const minutes = padWithZero(now.getMinutes());

    document.getElementById('hh').textContent = hours;
    document.getElementById('mm').textContent = minutes;
}


function checkIt() {
    const timeTable = document.getElementById('timeTable');
    timeTable.style.display = 'none';
}

document.addEventListener('click', (event) => {
    const time_wrap = document.getElementById('time-wrap');

    // Check if the clicked target is outside the time_wrap element
    if (!isDescendant(time_wrap, event.target)) {
        const time = time_wrap.lastElementChild;
        time.classList.remove('on');
    }
});

// Helper function to check if an element is a descendant of another element
function isDescendant(parent, child) {
    let node = child.parentNode;

    while (node != null) {
        if (node === parent) {
            return true;
        }
        node = node.parentNode;
    }

    return false;
}

function getNowDate(){
    const nowDate = new Date();
    const now_Year = nowDate.getFullYear();
    const now_Month = nowDate.getMonth() + 1;  // Months are zero-based, so add 1
    const now_Day = nowDate.getDate();
    const nowWeek_Index = nowDate.getDay()
    
    const weeks = ['일', '월', '화', '수', '목', '금', '토']

    const now_Date = now_Year + '-' + now_Month + '-' + now_Day + '(' + weeks[nowWeek_Index] + ')'
    
    const dateInput = document.getElementById('check_in_day')
    dateInput.innerHTML = now_Date
}