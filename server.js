const express = require('express');
const path = require('path');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'กรุณากรอกชื่อผู้ใช้และรหัสผ่านให้ครบถ้วน' });
    }

    const usernamePattern = /^[0-9]{10}$/;
    if (!usernamePattern.test(username)) {
        return res.status(400).json({ success: false, message: 'Username ต้องเป็นตัวเลข 10 หลัก' });
    }

    try {
        // ส่งคำขอไปยัง API
        const response = await fetch('https://restapi.tu.ac.th/api/v1/auth/Ad/verify', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Application-Key": 'TU5c3a63b70fcc202184bde6030c73793c71d2000e3ab4c6f2fff9d00146f0792f4ecc5be4ac9e33ad4d38e022e0ac02fe'
            },
            body: JSON.stringify({
                "UserName": username,
                "PassWord": password
            })
        });

        // ตรวจสอบผลลัพธ์จาก API
        if (response.ok) {
            res.json({ success: true, message: 'Login successful'});
        } else {
            res.status(401).json({ success: false, message: 'Invalid username or password' });
        }
    } catch (error) {
        res.status(500).json({message:'test'});
    }
})