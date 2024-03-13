// 메인 버튼 눌렀을 때, 카테고리명 붙여서 다음 페이지로 넘어감
function clickCategory(category) {
    window.location.href = 'ingredients.html?data=' + encodeURIComponent(category);
}