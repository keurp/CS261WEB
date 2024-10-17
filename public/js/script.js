document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.querySelector('form');
    const errorMessage = document.getElementById('error-message');
    const displayData = document.getElementById('display-data'); // Div สำหรับแสดงผลข้อมูล

    loginForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        errorMessage.style.display = 'none';
        displayData.style.display = 'none';
        displayData.innerHTML = ''; 

        if (!username || !password) {
            errorMessage.textContent = "กรอกชื่อและรหัสผ่านให้ครบ";
            errorMessage.style.display = 'block';
            return;
        }
        console.log('Sending Username:', username);
        console.log('Sending Password:', password);

        try {
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password })
            });

            const result = await response.json();

            // พิมพ์ผลลัพธ์เพื่อดูโครงสร้างการตอบกลับจาก API
            console.log('API Response:', result);

            if (response.ok && result.success) {
                // แสดงข้อมูลที่ได้รับจากเซิร์ฟเวอร์
                displayData.style.display = 'block';
                displayData.innerHTML = `
                    <p>ชื่อภาษาไทย: ${result.data.displayname_th || 'N/A'}</p>
                    <p>ชื่อภาษาอังกฤษ: ${result.data.displayname_en || 'N/A'}</p>
                    <p>อีเมล: ${result.data.email || 'N/A'}</p>
                    <p>คณะ: ${result.data.faculty || 'N/A'}</p>
                    <p>สาขาวิชา: ${result.data.department || 'N/A'}</p>
                `;
            } else {
                errorMessage.textContent = result.message || 'Invalid username or password';
                errorMessage.style.display = 'block';
            }
        } catch (error) {
            console.error('Error during login:', error);
            errorMessage.textContent = 'Something went wrong. Please try again.';
            errorMessage.style.display = 'block';
        }
    });
});
