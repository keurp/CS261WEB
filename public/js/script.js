document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.querySelector('form');
    const errorMessage = document.getElementById('error-message');
    const loadingMessage = document.getElementById('loading-message'); // เพิ่มข้อความกำลังโหลด (ต้องเพิ่มใน HTML ด้วย)

    loginForm.addEventListener('submit', async function (event) {
        event.preventDefault(); 

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        errorMessage.style.display = 'none';
        loadingMessage.style.display = 'block'; 

        if (!username || !password) {
            errorMessage.textContent = "กรอกชื่อและรหัสผ่านให้ครบ";
            errorMessage.style.display = 'block';
            loadingMessage.style.display = 'none'; 
            return;
        }

        const usernamePattern = /^[0-9]{10}$/;
        if (!usernamePattern.test(username)) {
            errorMessage.textContent = "Username ต้องเป็นตัวเลข 10 หลัก";
            errorMessage.style.display = 'block';
            loadingMessage.style.display = 'none';
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: {
                    'Application-Key': 'TU95bd6299e8284b5a343f13f5c22716389cac9bed383ceccce14bef13942533269da23d53820e3fc250e4cdf9bac71961',
                    'Content-Type' : 'application/json' 
                },
                body: JSON.stringify({ username, password }) 
            });

            const result = await response.json(); 
            loadingMessage.style.display = 'none';

            if (response.ok && result.success) {
                errorMessage.style.color = 'green';
                errorMessage.textContent = 'Login successful!';
                errorMessage.style.display = 'block'; 
            } else {
                errorMessage.textContent = result.message || 'Invalid username or password';
                errorMessage.style.display = 'block';
            }
        } catch (error) {
            console.error('Error during login:', error);
            errorMessage.textContent = 'Something went wrong. Please try again.';
            errorMessage.style.display = 'block'; 
            loadingMessage.style.display = 'none';
        }
    });
});