document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('login-form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('error-message');

    loginForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        const email = emailInput.value;
        const password = passwordInput.value;
        const requestBody = {
            email: emailInput.value,
            password: passwordInput.value,
        };
        // 构建请求体, 发送POST请求到后端API进行身份验证
        try {
            const response = await fetch('http://localhost:5678/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
            // 身份验证成功,保存用户ID和token，使用localStorage，跳转首页；验证失败，显示错误消息
            if (response.ok) {
                const userData = await response.json();
                localStorage.setItem('userId', userData.userId);
                localStorage.setItem('token', userData.token);
                location.href = './index.html';
            } else {
                errorMessage.classList.remove('hidden');
                errorMessage.textContent = '! Erreur dans l’identifiant ou le mot de passe';
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    });

});