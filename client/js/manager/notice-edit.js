document.addEventListener('DOMContentLoaded', (event) => {
    document.body.style.display = 'none';
  
    const token = localStorage.getItem('jwtad');
  
    if (!token) {
      alert('로그인 후 사용 가능합니다.');
      window.location.href = 'managerLogin.html';
    } else {
      document.body.style.display = 'block';
    }
});

async function initializeEditor() {
    const editor = new toastui.Editor({
        el: document.querySelector('#editor'),
        height: '400px',
        initialEditType: 'markdown',
        previewStyle: 'vertical',
        hooks: {
            addImageBlobHook: function(blob, callback) {
                const formData = new FormData();
                formData.append('image', blob);
                const token = localStorage.getItem('jwtad');

                fetch('http://localhost:8080/auth/administrator/noticesboard/notices/images', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: formData
                })
                .then(response => response.json())
                .then(data => {
                    const imageUrl = data.url; // 서버로부터 받은 이미지 URL
                    callback(imageUrl, '이미지 설명'); // 이미지 URL을 에디터에 삽입
                })
                .catch(error => {
                    console.error('이미지 업로드 실패:', error);
                });
                return false; // 기본 이미지 업로드 처리 방지
            }
        }
    });
    return editor;
}

document.addEventListener('DOMContentLoaded', async function() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    const token = localStorage.getItem('jwtad');

    try {
        const editor = await initializeEditor();
        const url = `http://localhost:8080/auth/administrator/noticesboard/notices/${id}`;

        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        editor.setMarkdown(data.content);

        document.getElementById('title').value = data.title;

        document.getElementById('submitButton').addEventListener('click', async function() {
            const updatedTitle = document.getElementById('title').value;
            const updatedContent = editor.getMarkdown();

            if (!updatedTitle.trim()) {
                alert('제목을 입력하세요.');
                return;
            }
            if (updatedTitle.length > 100) {
                alert('제목은 100자 이내로 입력하세요.');
                return;
            }
            if (!updatedContent.trim()) {
                alert('내용을 입력하세요.');
                return;
            }

            const putResponse = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ title: updatedTitle, content: updatedContent }),
            });

            if (putResponse.ok) {
                alert("수정 되었습니다.");
                window.location.href = 'notice.html';
            } else {
                console.error('Error:', putResponse.statusText);
            }
        });
    } catch (error) {
        console.error('Error:', error);
    }

    const goBackButton = document.getElementById('goBackButton');
    if (goBackButton) {
        goBackButton.addEventListener('click', function() {
            window.history.back(); 
        });
    }
});