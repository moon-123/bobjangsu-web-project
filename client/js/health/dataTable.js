const storedToken = localStorage.getItem('jwt');

document.addEventListener('DOMContentLoaded', () => {
    const currentUrl = new URL(window.location.href);
    const dataParam = currentUrl.searchParams.get('data');
    const decodedData = decodeURIComponent(dataParam);
    getData(decodedData);
    getDare();
});

async function getData(decodedData) {
    try {
        const response = await fetch(`http://localhost:8080/health/countData/?category=${decodedData}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${storedToken}`,
            }
        });

        // 관련 테이블 만들기
        const data = await response.json();
        makeTable(decodedData, data)
    } catch (error) { 
        console.error('Error:', error);
        alert('An error occurred. Please try again later.');
    }
}

function makeTable(decodedData, data) {
    const table = document.getElementById('table');

    if (data.length === 0) {
        table.textContent = '등록된 데이터가 없습니다';
        table.classList.add('noData');
        table.style.padding = '10%'
    } else {
        // If there is data, remove the 'noData' class
        table.classList.remove('noData');

        data.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        if (table.firstChild) {
            while (table.firstChild) {
                table.removeChild(table.firstChild);
            }
        }
    
        const headers = ['날짜', '등록 횟수']
        const thead = document.createElement('thead')
        const tr = document.createElement('tr')
        headers.forEach((header) => {
            let th = document.createElement('th')
            th.textContent = header
            tr.appendChild(th)
        })
        thead.appendChild(tr)
        table.appendChild(thead)
        const tbody = document.createElement('tbody');
        for (let i = 0; i < data.length; i++) {
            let tr2 = document.createElement('tr');
    
            let td1 = document.createElement('td');
    
            let dateLink = document.createElement('a');
    
            let dateTableTime = data[i].date.split('T')[0];
    
            if (decodedData == '혈당') {
                dateLink.href = `dataChart.html?data=${decodedData}&date=${dateTableTime}`;
            } else {
                dateLink.href = `dataChart.html?data=${decodedData}&date=${dateTableTime}`;
            }
    
            dateLink.textContent = dateTableTime;
            td1.appendChild(dateLink);
            tr2.appendChild(td1);
    
            let td2 = document.createElement('td');
            let dateLink2 = document.createElement('a');
            if (decodedData == '혈당') {
                dateLink2.href = `dataChart.html?data=${decodedData}&date=${dateTableTime}`;
            } else {
                dateLink2.href = `dataChart.html?data=${decodedData}&date=${dateTableTime}`;
            }

            dateLink2.textContent = data[i].count;
            td2.appendChild(dateLink2);
            tr2.appendChild(td2);
            tbody.appendChild(tr2);
        }
        table.appendChild(tbody);
    }
}

document.getElementById('searchBtn').addEventListener('click', () => {
    // Retrieve the entered date
    const dateTime = document.getElementById('check_in_day').textContent.split('(')[0]
    console.log(dateTime)
            // Decode the data parameter from the URL
    const currentUrl = new URL(window.location.href);
    const dataParam = currentUrl.searchParams.get('data');
    const decodedData = decodeURIComponent(dataParam);

        // Perform the search with the retrieved date
    searchData(decodedData, dateTime);
});

document.getElementById('selectAll').addEventListener('click', () => {
    const currentUrl = new URL(window.location.href);
    const dataParam = currentUrl.searchParams.get('data');
    const decodedData = decodeURIComponent(dataParam);
    getData(decodedData);
})

async function searchData(decodedData, dateTime) {
    try {
        const response = await fetch(`http://localhost:8080/health/serachData/?category=${decodedData}&date=${dateTime}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${storedToken}`,
            }
        });
        // 관련 테이블 만들기
        const data = await response.json();
        makeTable(decodedData, data);
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
    const dateData = document.getElementById('dateData')
    dateData.style.display = 'none';
}

function hideIt(){
    const calendar = document.getElementById('calendar');
    calendar.style.display = 'none';
    const dateData = document.getElementById('dateData')
    dateData.style.display = 'block';
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

// 버튼 엘리먼트 가져오기
var legBtn = document.getElementById('legBtn');

// 버튼 클릭 이벤트에 대한 리스너 추가
legBtn.addEventListener('click', function() {

    const currentUrl = new URL(window.location.href);
    const dataParam = currentUrl.searchParams.get('data');
    const decodedData = decodeURIComponent(dataParam);
    var targetPageUrl = ''
    if(decodedData === '혈당'){
        targetPageUrl = 'createSugar.html';
    }else if(decodedData === '혈압'){
        targetPageUrl = 'createBlood.html';
    }else if(decodedData === '몸무게'){
        targetPageUrl = 'createWeight.html';
    }
    
    // 페이지 이동
    window.location.href = targetPageUrl;
});

