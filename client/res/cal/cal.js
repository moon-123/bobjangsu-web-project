// 날짜 포맷 정규식 (yyyy-mm-dd)
const regexDate = RegExp(/^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/);
// date 객체 만들기
const thisDate = new Date();
// 오늘 날짜 (yyyy-mm-dd 00:00:00)
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
// 체크아웃 날짜
let checkOutDate = "";


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
        if (currentMonth === 11) {
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
                // 지난 날짜는 disable 처리
                if (i < today.getDate()-1) {
                    start_calendar += pervDisableDay(i)
                } else {
                    start_calendar += dailyDay(currentYear, currentMonth, i);
                }
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
    // function dailyDay(currentYear, currentMonth, day) {
    //     const date = currentYear + '' + zf((currentMonth + 1)) + '' + zf(day);

    //     if (checkInDate === date) {
    //         return '<div class="day current checkIn" data-day="' + date + '" onclick="selectDay(this)"><span>' + day + '</span><p class="check_in_out_p"></p><p>' + '</div>';
    //     } else {
    //         return '<div class="day current" data-day="' + date + '" onclick="selectDay(this)"><span>' + day + '</span><p class="check_in_out_p"></p><p>' + '</div>';
    //     }
    // }
    // 이번달
    function dailyDay(currentYear, currentMonth, day) {
        const date = currentYear + '' + zf((currentMonth + 1)) + '' + zf(day);
        const currentDate = new Date(currentYear, currentMonth, day);

        if (currentDate > today) {
            // Date is after today, so disable it
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

function selectDay(obj) {
    if (checkInDate === "") {
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

// 최대 개월수 체크
function getLimitMonthCheck(year, month) {
    let months = ((today.getFullYear() - year) * 12);
    months -= (today.getMonth() + 1);
    months += month;

    return months;
}

// 날짜형태 변환
function conversion_date(YYMMDD, choice) {
    const yyyy = YYMMDD.substring(0, 4);
    const mm = YYMMDD.substring(4, 6);
    const dd = YYMMDD.substring(6, 8);

    return (choice === 1)
        ? yyyy + "-" + zf(mm) + "-" + zf(dd)
        : yyyy + "." + zf(mm) + "." + zf(dd);
}

// 몇요일인지 알려주는 함수 (숫자 형태)
function weekday(YYYYMMDD) {
    const weekday_year = YYYYMMDD.substring(0, 4);
    const weekday_menth = YYYYMMDD.substring(4, 6);
    const weekday_day = YYYYMMDD.substring(6, 9);

    return new Date(weekday_year + "-" + weekday_menth + "-" + weekday_day).getDay();
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

// 숫자 두자리로 만들기
function zf(num) {
    num = Number(num).toString();

    if (Number(num) < 10 && num.length == 1) {
        num = "0" + num;
    }

    return num;
}

