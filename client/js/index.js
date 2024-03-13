window.onload = function () {
    let sidebar = document.querySelector(".side-bar");
    let plusButton = document.querySelector(".plus");
    let closeButton = document.querySelector(".close");
    let main = document.querySelector(".main");
  
    plusButton.addEventListener("click", (e) => {
      openSidebar();
    });
  
    closeButton.addEventListener("click", (e) => {
      closeSidebar();
    });
  
    document.addEventListener("click", (e) => {
      // Check if the clicked element is outside the sidebar
      if (!sidebar.contains(e.target) && e.target !== plusButton) {
        closeSidebar();
      }
    });
  };
  
  var token = localStorage.getItem("jwt");
  
  document.addEventListener("DOMContentLoaded", async () => {
    await attachEventListener();
    const token = localStorage.getItem("jwt");

    if(!token) {
      const button = document.getElementById('plus');
      button.innerText = '로그인';
      button.removeAttribute('class')

      const newAttr = document.createAttribute('style')
      newAttr.value = 'width: 15rem; flex-shrink: 0; border-radius: 15px; border: 0px; background: var(--point-color); color: #FFF; font-size: 3rem; padding: 1rem 0;'
      button.setAttributeNode(newAttr)
      button.addEventListener("click", (e) => {
        window.location.href = 'login.html';
      })
    }

  });
  

  async function attachEventListener() {
    const name = document.getElementById("myname");
    const URLlist = {'mealButton': 'meal', 'recipeButton': 'recipe', 'ingredientBt':'ingredient', 'healthButton': 'health'}
    const currentURL = window.location.href;
    for (let key in URLlist) {
      if (currentURL.includes(URLlist[key])){
        const button = document.getElementById(key);
        const Attr = document.createAttribute('style') // style 속성생성
        Attr.value = 'text-decoration: underline; text-decoration-color: red; text-decoration-thickness: 3px;';
        button.setAttributeNode(Attr)
      }
    }

    const token = localStorage.getItem("jwt");
    if (token) {
       try {
          const response = await fetch(`http://localhost:8080/auth/me`, {
             method: "GET",
             headers: {
                Authorization: `Bearer ${token}`,
             },
          });
 
          const mydata = await response.json();
 
          if (mydata.message != undefined) {
             // 토큰이 있지만 서버에서 사용자 정보를 가져오지 못한 경우
             name.innerText = `로그인이 필요합니다.`;
             logoutButton.style.display = "none";
             mypageButton.style.display = "none";
             mealButton.style.display = "none";
             healthButton.style.display = "none";
          } else {
             // 토큰이 있고 서버에서 사용자 정보를 가져온 경우
             name.innerHTML = `<span id="nickname">${mydata.username}</span>님, 반갑습니다.`;
             loginButton.style.display = "none";
             logoutButton.style.display = "block";
             mypageButton.style.display = "block";
             mealButton.style.display = "block";
             healthButton.style.display = "block";
            }
        } catch (error) {
            console.error("Error checking data:", error.message);
        }
      } else {
        // 토큰이 없는 경우
        name.innerText = `로그인이 필요합니다.`;
        logoutButton.style.display = "none";
        mypageButton.style.display = "none";
        mealButton.style.display = "none";
        healthButton.style.display = "none";
        const beBlock = document.querySelectorAll(".be-block")
        beBlock.forEach((be) => {
          var link = be.onclick;
          be.onclick = function(e) {
            e.preventDefault();
            alert("로그인 후에 이용하실 수 있습니다.")
          }
        })
        
      }
  }
 
  function openSidebar() {
    let sidebar = document.querySelector(".side-bar");
    let main = document.querySelector(".main");
    sidebar.classList.add("fadeIn");
    sidebar.classList.remove("fadeOut");
    main.style.visibility = "hidden";
  }
  
  function closeSidebar() {
    let sidebar = document.querySelector(".side-bar");
    let main = document.querySelector(".main");
    sidebar.classList.add("fadeOut");
    sidebar.classList.remove("fadeIn");
    main.style.visibility = "visible";
  }

  document.getElementById('logoutButton').addEventListener('click', function() {
    alert('로그아웃을 진행합니다.')
    localStorage.removeItem('jwt');
    localStorage.removeItem('morning');
    localStorage.removeItem('lunch');
    localStorage.removeItem('dinner');

    const loc = window.location.pathname
    if(loc === "/html/index.html"){
        window.location.href = './index.html';
    }
    else{
        window.location.href = '../index.html';
    }
  });
