document.addEventListener('DOMContentLoaded', function () {
// Get login status
// const email = localStorage.getItem('email');
const userId = localStorage.getItem('userId');
const loginLink = document.getElementById('login-link');

// Check if user is logged in

if (userId) {
    loginLink.textContent = 'logout'; //   login to logout
  }
  

loginLink.addEventListener('click', function () {
    if (userId) {
      // if click logout 
      localStorage.removeItem('userId');
      localStorage.removeItem('token');
      location.href = './index.html'; // redirection to homepage
    } else {
      
      location.href = './login.html';
    }
  });


});
