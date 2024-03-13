document.addEventListener('DOMContentLoaded', function () {
    document.body.style.display = 'none';

    const token = localStorage.getItem('jwtad');

    if (!token) {
        alert('로그인 후 사용 가능합니다.');
        window.location.href = 'managerLogin.html';
    } else {
        document.body.style.display = 'block';
    }
    fetchUsers();
});

// 기존 검색 값을 저장하는 변수
let currentSearchValue = '';

// 검색 함수
function searchUsers(event) {
    currentSearchValue = document.getElementById('searchField').value;
    fetchUsers(currentSearchValue);
}

// 페이지네이션을 위한 사용자 데이터 가져오기
function fetchUsers(searchValue = '', page = 1) {
    const token = localStorage.getItem('jwtad');
    const encodedSearchValue = encodeURIComponent(searchValue);
    const url = `https://port-0-server-57lz2alpj8pw34.sel5.cloudtype.app/auth/administrator/userinformation/users?search=${encodedSearchValue}&page=${page}&limit=10`;

    fetch(url, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        displayUsers(data.users, page);
        updatePagination(data.totalPages, page);
    })
    .catch(error => console.error('Error:', error));
}

// 페이지네이션 업데이트
function updatePagination(totalPages, currentPage) {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.innerText = i;
        if (i === currentPage) {
            pageButton.classList.add('active');
        }
        pageButton.addEventListener('click', () => fetchUsers(currentSearchValue, i));
        pagination.appendChild(pageButton);
    }
}

// 사용자 목록 표시
function displayUsers(users, currentPage) {
    const userList = document.getElementById('userList');
    userList.innerHTML = `
        <table class="user-list">
            <colgroup>
                <col style="width:7%">
                <col style="width:10%">
                <col style="width:30%">
                <col style="width:30%">
                <col style="width:15%">
                <col style="width:15%">
            </colgroup>
            <tr>
                <th>번호</th>
                <th>선택</th>
                <th>아이디</th>
                <th>이름</th>
                <th>성별</th>
                <th>상세보기</th>
            </tr>
            ${users.map((user, idx) => {
                const postNumber = (currentPage - 1) * 10 + idx + 1;
                return `
                    <tr id="user_${user._id}">
                        <td>${postNumber}</td>
                        <td><input type="checkbox" class="user-checkbox" value="${user._id}"></td>
                        <td>${user.userid}</td>
                        <td>${user.username}</td>
                        <td>${user.gender}</td>
                        <td><button class="gray-btn" onclick="toggleUserDetails('${user._id}')">상세보기</button></td>
                    </tr>
                    <tr id="details_${user._id}" class="user-details" style="display: none;">   
                        <td colspan="6">
                            <div class="user-details-card">
                            </div>
                        </td>
                    </tr>
                `;
            }).join('')}
        </table>
    `;
}

// 사용자 상세 정보를 가져오는 함수
function fetchUserDetails(userId) {
    const token = localStorage.getItem('jwtad');
    const url = `https://port-0-server-57lz2alpj8pw34.sel5.cloudtype.app/auth/administrator/userinformation/users/${userId}`;

    fetch(url, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(userDetails => {
        displayUserDetails(userId, userDetails);
    })
    .catch(error => console.error('Error:', error));
}

// 사용자 상세 정보를 화면에 표시하는 함수
function displayUserDetails(userId, userDetails) {
    const detailsRow = document.getElementById(`details_${userId}`);
    const detailsCard = detailsRow.querySelector('.user-details-card');

    const detailsHTML = `
        <p><strong>생년월일:</strong> ${formatBirthday(userDetails.birthday)}</p>
        <p><strong>핸드폰번호:</strong> ${userDetails.phnumber || '정보 없음'}</p>
        <p><strong>키:</strong> ${userDetails.height ? userDetails.height + 'cm' : '정보 없음'}</p>
        <p><strong>몸무게:</strong> ${userDetails.weight ? userDetails.weight + 'kg' : '정보 없음'}</p>
        <p><strong>알러지 정보:</strong> ${userDetails.allergy || '정보 없음'}</p>
        <p><strong>활동량 정보:</strong> ${userDetails.energy || '정보 없음'}</p>
    `;

    detailsCard.innerHTML = detailsHTML;
}

// 상세보기 토글 함수
function toggleUserDetails(userId) {
    const detailsRow = document.getElementById(`details_${userId}`);
    if (detailsRow.style.display === 'none') {
        fetchUserDetails(userId); // 상세 정보를 불러오는 함수 호출
        detailsRow.style.display = 'table-row';
    } else {
        detailsRow.style.display = 'none';
    }
}

function formatBirthday(birthday) {
    if (!birthday || !birthday.year || !birthday.type) {
        return '정보 없음';
    }
    return `${birthday.year} (${birthday.type === 'solar' ? '양력' : '음력'})`;
}

function getSelectedUser() {
    const checkboxes = document.querySelectorAll('.user-checkbox:checked');
    if (checkboxes.length === 0) {
        return null;
    }
    return checkboxes[0].value; 
}

function getSelectedUsers() {
    const checkboxes = document.querySelectorAll('.user-checkbox:checked');
    return Array.from(checkboxes).map(checkbox => checkbox.value);
}

// 사용자 생성
function createUser() {
    window.location.href = 'user-create.html';
}

// 사용자 수정
let isUpdateButtonDisabled = false;
function updateUser() {
    if (isUpdateButtonDisabled) {
        return;
    }

    const selectedUsers = getSelectedUsers();
    if (selectedUsers.length === 0) {
        alert('수정할 사용자를 선택해주세요.');
        return;
    } else if (selectedUsers.length > 1) {
        alert('한 번에 하나의 사용자만 수정할 수 있습니다.');
        return;
    }

    isUpdateButtonDisabled = true;
    const selectedUser = selectedUsers[0];
    window.location.href = `user-edit.html?userid=${selectedUser}`;
}

// 사용자 삭제
function deleteUser() {
    const selectedUsers = getSelectedUsers();
    if (selectedUsers.length === 0) {
        alert('삭제할 사용자를 선택해주세요.');
        return;
    }
    const token = localStorage.getItem('jwtad');

    Promise.all(selectedUsers.map(userId => {
        return fetch(`https://port-0-server-57lz2alpj8pw34.sel5.cloudtype.app/auth/administrator/userinformation/users/${userId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    }))
    .then(responses => Promise.all(responses.map(res => res.json())))
    .then(data => {
        alert('선택된 사용자가 삭제되었습니다.');
        fetchUsers();
    })
    .catch(error => {
        console.error('Error:', error);
        alert('사용자 삭제 중 오류가 발생했습니다.');
    });
}