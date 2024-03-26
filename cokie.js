const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());

app.get('/set-cookie', (req, res) => {
  // 设置一个cookie，有效期为1小时
  res.cookie('sample', 'value', {
    // maxAge: 3600000, // 1小时的毫秒数
    maxAge: 60000, // 1分钟的毫秒数
    httpOnly: true, // 保护cookie不被客户端JavaScript访问
    sameSite: 'lax', // 设置sameSite策略，防止CSRF攻击
  });

  // 发送响应到前端，告知cookie已设置
  res.send('Cookie has been set!');
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});