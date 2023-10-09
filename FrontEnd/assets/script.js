// login
const loginLink = document.getElementById('login-link');
loginLink.addEventListener('click', ()=>{
    location.href = './login.html';
})

// Get login status
const email = localStorage.getItem('email');

// logout
if(email) {
    loginLink.textContent = 'logout';
    loginLink.addEventListener('click', function(){
    localStorage.removeItem('email');
    localStorage.removeItem('password');
    location.href = './index.html';
    });
} else{
}
