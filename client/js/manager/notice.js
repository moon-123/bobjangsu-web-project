document.addEventListener('DOMContentLoaded', function() {
    document.body.style.display = 'none';

    const token = localStorage.getItem('jwtad');

    if (!token) {
        alert('로그인 후 사용 가능합니다.');
    window.location.href = 'managerLogin.html';
    } else {
        document.body.style.display = 'block';
    }
    fetchNotices();
});

let currentPage = 1;
const limit = 10;

function fetchNotices(page = 1, searchValue = '') {
    const token = localStorage.getItem('jwtad');
    currentPage = page;
    const url = new URL('https://port-0-server-57lz2alpj8pw34.sel5.cloudtype.app/auth/administrator/noticesboard/notices');
    url.searchParams.append('page', page);
    url.searchParams.append('limit', limit);
    if (searchValue) {
        url.searchParams.append('title', searchValue);
    }

    fetch(url, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        displayNotices(data.notices, page);
        updatePagination(data.totalPages);
    })
    .catch(error => console.error('Error:', error));
}

function displayNotices(notices, currentPage) {
    const tableBody = document.querySelector('#board-list .board-table tbody');
    const rows = notices.map((notice, index) => {
        const postNumber = (currentPage - 1) * limit + index + 1;
        return `
            <tr>
            <td>${postNumber}</td>
                <td><input type="checkbox" class="notice-checkbox" value="${notice._id}"></td>
                <td><a href="#!" class="notice-title" data-id="${notice._id}">${notice.title}</a></td>
                <td>${new Date(notice.createdAt).toLocaleDateString()}</td>
            </tr>
            <tr id="content-${notice._id}" class="notice-content" style="display: none;">
                <td colspan="4">${notice.content}</td> <!-- 서버에서 변환된 HTML 내용을 그대로 표시 -->
            </tr>
        `;
    }).join('');

    tableBody.innerHTML = rows;

    document.querySelectorAll('.notice-title').forEach(titleElement => {
        titleElement.addEventListener('click', function() {
            const noticeId = this.getAttribute('data-id');
            const contentRow = document.getElementById(`content-${noticeId}`);
            contentRow.style.display = contentRow.style.display === 'none' ? 'table-row' : 'none';
        });
    });
}

function searchNotices(event) {
    event.preventDefault();
    const searchValue = document.getElementById('search').value;
    fetchNotices(1, searchValue);
}

function createSelectedNotices() {
    window.location.href = 'notice-create.html';
}

function updateSelectedNotices() {
    const selectedIds = getSelectedNoticeIds();
    
    if (selectedIds.length === 1) {
        // 정확히 하나의 공지사항만 선택된 경우, 수정 페이지로 이동
        window.location.href = `notice-edit.html?id=${selectedIds[0]}`;
    } else if (selectedIds.length > 1) {
        // 두 개 이상 선택된 경우, 경고 메시지 표시
        alert('한 번에 하나의 공지사항만 수정할 수 있습니다.');
    } else {
        // 아무것도 선택되지 않은 경우, 경고 메시지 표시
        alert('수정할 공지사항을 선택해주세요.');
    }
}

function deleteSelectedNotices() {
    const selectedIds = getSelectedNoticeIds();
    const token = localStorage.getItem('jwtad');
    selectedIds.forEach(id => {
        fetch(`https://port-0-server-57lz2alpj8pw34.sel5.cloudtype.app/auth/administrator/noticesboard/notices/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log(data.message);
            fetchNotices();
        })
        .catch(error => console.error('Error:', error));
    });
}

function getSelectedNoticeId() {
    const selectedCheckbox = document.querySelector('.notice-checkbox:checked');
    return selectedCheckbox ? selectedCheckbox.value : null;
}

function getSelectedNoticeIds() {
    const checkboxes = document.querySelectorAll('.notice-checkbox:checked');
    return Array.from(checkboxes).map(cb => cb.value);
}

function updatePagination(totalPages) {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';
    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.innerText = i;
        pageButton.addEventListener('click', () => fetchNotices(i));
        pagination.appendChild(pageButton);
    }
}

// 검색 폼 이벤트 핸들러
document.querySelector('#board-search form').addEventListener('submit', searchNotices);
