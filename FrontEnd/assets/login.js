const loginForm = document.getElementById('login-form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
loginForm.addEventListener('submit', function(e){
    e.preventDefault();
    const email = emailInput.value;
    const password = passwordInput.value;
    localStorage.setItem('email', email);
    localStorage.setItem('password', password);
    console.log(email, password);

    location.href = './index.html';
});

 //构建请求体
//  const requestBody = {
//     email: email,
//     password: password,
//  }
