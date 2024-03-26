const express = require("express");
const app = express();
const cors = require('cors');


// 配置解析表单数据的中间件
app.use(express.urlencoded({ extended: false }));

// 必须在配置cors中间件之前，配置JSONP的接口
app.get("/api/jsonp", (req, res) => {
  // 1.得到回调函数的名称
  const funName = req.query.callback;
  // 2.定义要发送到客户端的数据对象
  const data = { name: "zs", age: 22 };
  // 3.拼接出一个函数的调用
  const scriptStr = `${funName}(${JSON.stringify(data)})`;
  // 4.把拼接的字符串，响应给客户端
  res.send(scriptStr);
});

// 一定要在路由之前配置cors，从而解决接口跨域问题
// const cors = require("cors");
app.use(cors());

const router = require("./apiRouter");
app.use("/api", router);

app.listen(80, function () {
  console.log("Express server running at http://127.0.0.1");
});
