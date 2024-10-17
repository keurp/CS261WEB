import express from 'express';
import path from 'path';
import fetch from 'node-fetch'; // ต้องติดตั้งไลบรารี node-fetch
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ใช้ body-parser เพื่อแปลง request body เป็น JSON
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'กรุณากรอกชื่อผู้ใช้และรหัสผ่านให้ครบถ้วน' });
    }

    try {
        // ส่งคำขอไปยัง API ภายนอก
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

        const apiResult = await response.json(); // แปลง response เป็น JSON

        // ตรวจสอบผลลัพธ์จาก API
        if (response.ok && apiResult.status) {
            res.json({ success: true, message: 'Login successful', data: apiResult });
        } else {
            res.status(401).json({ success: false, message: apiResult.message || 'Invalid username or password' });
        }
    } catch (error) {
        console.error('Error during API call:', error);
        res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));