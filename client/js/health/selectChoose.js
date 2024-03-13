function clickCategory(category) {
    if (category == '혈당') {
        window.location.href = 'selectSugar.html?data=' + encodeURIComponent(category);
    } else if (category == '혈압') {
        window.location.href = 'selectBlood.html?data=' + encodeURIComponent(category);
    } else {
        window.location.href = 'dataChart.html?data=' + encodeURIComponent(category);
    }
}
