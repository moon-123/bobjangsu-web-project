function clickCategory(category) {
    window.location.href = 'recipeDetail.html?data=' + encodeURIComponent(category);
}

async function clickMyrecipy() {
    const storedtoken = localStorage.getItem("jwt");
    try {
        const response = await fetch(`http://localhost:8080/auth/me`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${storedtoken}`,
          },
        });
        const mydata = await response.json();
        if (mydata.length !== 0) {
          if (mydata.message != undefined) {
            alert('로그인 후 해당 기능을 이용할 수 있습니다.')
            window.location.href = '../../html/login.html';
          } else {
            window.location.href = 'recipeMy.html';
          }
        }
      } catch (error) {
        console.error("Error checking data:", error.message);
      }
}