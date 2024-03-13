function goback(){
    const currentUrl = new URL(window.location.href);
    let dataParam = currentUrl.searchParams.get('data');
    const decodedData = decodeURIComponent(dataParam);
    
    if(decodedData === '몸무게'){
        window.location.href = 'selectChoose.html'
    }else if (decodedData == '혈당') {
        window.location.href = 'selectSugar.html?data=' + encodeURIComponent(decodedData);
    } else if (decodedData == '혈압') {
        window.location.href = 'selectBlood.html?data=' + encodeURIComponent(decodedData);
    }
}