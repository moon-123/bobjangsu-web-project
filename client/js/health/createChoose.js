function clickCategory(category) {
    if (category == '혈당') {
        window.location.href = 'createSugar.html?data=' + encodeURIComponent(category);
    } else if (category == '혈압') {
        window.location.href = 'createBlood.html?data=' + encodeURIComponent(category);
    } else {
        window.location.href = 'createWeight.html?data=' + encodeURIComponent(category);
    }
}
