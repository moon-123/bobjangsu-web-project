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

document.addEventListener('DOMContentLoaded', function() {
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
                    const imageUrl = data.url;
                    callback(imageUrl, '이미지 설명');
                })
                .catch(error => {
                    console.error('이미지 업로드 실패:', error);
                });
    
                return false;
            }
        }
    });

    const backButton = document.getElementById('backButton');
    backButton.addEventListener('click', function() {
        window.history.back();
    });


    const form = document.getElementById('noticeForm');
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const token = localStorage.getItem('jwtad');

        const title = document.getElementById('title').value;
        const content = editor.getMarkdown();

        if (!title.trim()) {
            alert('제목을 입력하세요.');
            return;
        }
        if (title.length > 100) {
            alert('제목은 100자 이내로 입력하세요.');
            return;
        }

        if (!content.trim()) {
            alert('내용을 입력하세요.');
            return;
        }

        fetch('http://localhost:8080/auth/administrator/noticesboard/notices', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ title, content })
        })
        .then(response => {
            if(response.ok) {
                return response.json();
            }
            throw new Error('등록에 실패했습니다.');
        })
        .then(() => {
            alert('등록되었습니다.')
            window.location.href = 'notice.html';
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('등록에 실패했습니다.');
        });
    });
});

