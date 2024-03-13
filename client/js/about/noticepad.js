document.addEventListener('DOMContentLoaded', () => {
    var currentPage = 1
    getNotice(currentPage)
});

async function getNotice(currentPage){
    try{
        console.log(currentPage)
        const response = await fetch(`http://localhost:8080/auth/noticesboard?page=${currentPage}`, {
            method: 'POST'
        })
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json()

        const ingredientsList = document.getElementById('list');
        ingredientsList.innerHTML = '';

        console.log(data.notices)
        data.notices.forEach(dataArr => {
            const noticePad = document.createElement('div')
            noticePad.classList.add('noticePad');

            const titleItem = document.createElement('li');
            titleItem.innerHTML = `${dataArr.title}`;
            noticePad.appendChild(titleItem)

            const contentItem = document.createElement('li');
            contentItem .innerHTML = `${dataArr.content}`
            noticePad.appendChild(contentItem)

            const dateItem = document.createElement('li');
            const dateTime = dataArr.createdAt.split('T')[0]
            dateItem.innerHTML = `${dateTime}`
            noticePad.appendChild(dateItem)

            ingredientsList.append(noticePad)
        });
        console.log(data.totalPages, currentPage)
        createPaginationButtons(data.totalPages, currentPage)
    }catch(error){
        console.error;
    }
}

function createPaginationButtons(totalPages, currentPage){
    console.log(totalPages, currentPage)
    const btnBox = document.getElementById('btnBox')
    btnBox.innerHTML = '';

    let startPage = 1;

    if (currentPage > 5) {
        startPage = Math.floor((currentPage - 1) / 5) * 5 + 1;
    }

    const backButton = document.createElement('button');
    backButton.textContent = '<';
    backButton.addEventListener('click', () => {
        getNotice(startPage - 5); // Go back to the first set of pages
    });
    btnBox.appendChild(backButton);

    if (startPage < 5) {
        backButton.style.display = 'none'
    }

    // Generate buttons based on totalPages
    for (let i = startPage; i <= totalPages && i < startPage + 5; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.addEventListener('click', () => {
            getNotice(i);
        });

        if (i === currentPage) {
            button.classList.add('current-page');
        }

        btnBox.appendChild(button);
    }

    // Add "Next" button if there are more pages
    if (startPage + 5 <= totalPages) {
        const nextButton = document.createElement('button');
        nextButton.textContent = '>';
        nextButton.addEventListener('click', () => {
            getNotice(startPage + 5);
        });
        btnBox.appendChild(nextButton);
    }
}