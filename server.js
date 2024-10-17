const express = require('express');
const path = require('path');
const axios = require('axios'); 
const bodyParser = require('body-parser'); 

const app = express();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "public", 'index.html'));
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // ตรวจสอบว่า username และ password ถูกส่งมาหรือไม่
    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'กรุณากรอกชื่อผู้ใช้และรหัสผ่านให้ครบถ้วน' });
    }

    // ตรวจสอบว่า username เป็นตัวเลขและมีความยาว 10 หลัก
    const usernamePattern = /^[0-9]{10}$/;
    if (!usernamePattern.test(username)) {
        return res.status(400).json({ success: false, message: 'Username ต้องเป็นตัวเลข 10 หลัก' });
    }

    try {
        const apiResponse = await axios.post('https://restapi.tu.ac.th/api/v1/auth/Ad/verify2', {
            UserName: username,
            PassWord: password
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Application-Key': 'TU95bd6299e8284b5a343f13f5c22716389cac9bed383ceccce14bef13942533269da23d53820e3fc250e4cdf9bac71961'         // ระบุว่าเนื้อหาเป็น JSON
            }
        });

        console.log('API Response:', apiResponse.data);

        
        if (apiResponse.data.success) {
            res.json({ success: true, message: 'Login successful' });
        } else if (apiResponse.data.error === 'INVALID_PASSWORD') {
            res.status(401).json({ success: false, message: 'รหัสผ่านไม่ถูกต้อง' });
        } else {
            res.status(401).json({ success: false, message: 'Invalid username or password' });
        }
    } catch (error) {
        if (error.response) {
            console.error('Error response from API:', error.response.data);
            res.status(500).json({ success: false, message: error.response.data.message || 'Server error. Please try again later.' });
        } else {
            console.error('Error during API call:', error);
            res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
        }
    }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
