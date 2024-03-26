const express = require("express");
const mysql = require('mysql');
const router = express.Router();
const bodyParser = require('body-parser');
const { nanoid } = require('nanoid');


// 处理POST请求的中间件
router.use(bodyParser.json());


// 数据库连接函数
function dbConnection() {
  // 连接上数据库
  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'zhang3025',
    database: 'matchmdb'
  });
  connection.connect((err) => {
    if (err) {
      console.log('error', err);
      return;
    }
    console.log("数据库连接sussess")
  });
  return connection;
}

function dbClosed(connection) {
  // 关闭连接
  connection.end((error) => {
    if (error) {
      console.error('数据库关闭连接时出错：', error);
      return;
    }
    console.log('数据库连接已关闭。');
  });
}
// 去除null值
function removeNullValues(obj) {
  const data = {};
  var i = 0;

  for (const key in obj) {
    if (obj.hasOwnProperty(key) && obj[key] !== null) {
      data[key] = obj[key];
      i++;
    }
  }

  return {
    data, i
  };
}
// 获取当前操作时间戳
function getCurrentTimestamp() {
  var now = new Date();
  var timestamp = now.getTime();
  return timestamp;
}

// 登录接口
router.post("/login", (req, res) => {
  console.log(req.body);

  // 用于判断是否是管理者
  var isRoot;
  var exist;
  var userID;
  var timestamp;
  const options = {
    raw: true
  };
  // 连接上数据库
  const connection = dbConnection();

  // 查询数据
  var query = 'SELECT Username,PasswordHash,UserID,CreatedAt FROM users';
  connection.query(query, options, (err, results, fields) => {
    console.log(results);
    // if (err) throw err;
    if (err) {
      console.error('执行查询时出错：', err);
      return;
    }
    for (var i = 0; i < results.length; i++) {
      const username = req.body.username;
      const password = req.body.password;
      if (username == results[i].Username && password == results[i].PasswordHash) {
        console.log("存在");
        exist = true;
        userID = results[i].UserID;
        timestamp = results[i].CreatedAt;
        if (username == "root" && password == "888888") {
          isRoot = true;
          break;
        } else {
          isRoot = false;
          break;
        }
      } else {
        exist = false;
        isRoot = false;
        userID = null;
      }
    }
    console.log(results.UserID, userID);

    // 返回数据
    res.send({
      status: 0,
      msg: "POST请求成功",
      data: { exist, isRoot, userID, timestamp }
    })
  });
  // 关闭数据库
  dbClosed(connection);
})

// 注册接口
router.post("/register", (req, res) => {
  // 使用 nanoid 生成唯一的 ID
  const uniqueId = nanoid();
  const timestamp = getCurrentTimestamp();
  var done;
  const connect = dbConnection();
  const data = req.body
  // const birthday = toString(data.birthday);
  console.log(data);
  const query = 'INSERT INTO users (UserID,Username, PasswordHash,Email,gender,DateOfBirth,CreatedAt) VALUES (?,?,?,?,?,?,?)';
  connect.query(query, [uniqueId, data.name, data.password, data.email, data.gender, data.birthday, timestamp], (err, result) => {
    if (err) {
      console.error('执行插入操作时出错：', err);
      done = false;
      res.send({
        status: 0,
        msg: "POST请求成功",
        done: done,
        id: uniqueId
      })
      return;
    }
    console.log('数据插入成功。');
    done = true;
    console.log(data);
    res.send({
      status: 0,
      msg: "POST请求成功",
      done: done,
      id: uniqueId
    })
  });
  dbClosed(connect);
})
// 创建队伍
router.post("/createTeam", (req, res) => {
  console.log("createTeam接口被调用");
  const connect = dbConnection();
  const TeamID = nanoid();
  const timestamp = getCurrentTimestamp();
  const data = req.body;
  console.log(data);
  const query = 'INSERT INTO teams (TeamID,LeaderID,CompetitionName,Description,TeamName,Status,CreatedAt) values (?,?,?,?,?,?,?)';
  connect.query(query, [TeamID, data.id, data.category, data.desc, data.teamName, 1, timestamp], (err, result) => {
    if (err) {
      console.error('执行插入操作时出错：', err);
      return;
    }
    console.log('数据插入成功。');
    res.send({
      status: 0,
      msg: "POST请求成功",
    })
  });
  dbClosed(connect);
})

// 加入队伍
router.post("/joinTeam", (req, res) => {
  console.log("joinTeam接口被调用");
  const connect = dbConnection();
  const data = req.body;
  console.log(data);
  const query = 'INSERT INTO matchinfo (id,leader,matchName,des,teamName,state,phone,school) VALUES (?,?,?,?,?,?,?,?)';
  connect.query(query, [data.id, data.name, data.category, data.desc, data.gender, 1, data.contact, data.region], (err, result) => {

  })
})


// 获取组队大厅信息
router.get("/getTeamList", (req, res) => {
  const options = {
    row: true,
  }
  console.log("getTeamList接口被调用");
  const connect = dbConnection();
  const query = 'SELECT teams.*, users.UserName AS UserName , users.Email AS Email FROM teams INNER JOIN users ON teams.LeaderID = users.UserID WHERE teams.Status = 1; '
  connect.query(query, options, (error, results,) => {
    if (error) {
      console.error('执行查询时出错：', error);
      return;
    }
    console.log(results);
    res.send({
      status: 0,
      msg: "GET请求成功",
      data: results
    })
  })
  dbClosed(connect);
})

// 获取历史组队信息
router.get("/getHistory", (req, res) => {
  console.log("getHistory接口被调用");
  const options = {
    row: true,
  }
  const connect = dbConnection();
  const query = 'select * from history where state = 1';
  connect.query(query, options, (error, results) => {
    if (error) {
      console.error('执行查询时出错：', error);
      return;
    };
    console.log(results);
    res.send({
      status: 0,
      msg: "GET请求成功",
      data: results
    })
  })
  dbClosed(connect);
})

// 个人中心接口
router.get("/getUser", (req, res) => {
  console.log("getUser接口被调用");
  const connect = dbConnection();
  var options = { row: true };
  var query = 'SELECT username,phone,school,province FROM user where username = "user"';
  connect.query(query, options, (error, results) => {
    if (error) {
      console.error('执行查询时出错：', error);
      return;
    };
    console.log(results);
    res.send({
      status: 0,
      msg: "GET请求成功",
      data: results
    })
  });
  dbClosed(connect);
})

// 获取已读消息
router.get("/getRead", (req, res) => {
  console.log("getRead接口被调用");
  const connect = dbConnection();
  const options = {
    raw: true
  };
  var query = 'SELECT date,name,address FROM message where status = 1';
  connect.query(query, options, (err, results) => {
    if (err) {
      console.error('执行查询时出错：', err);
      return;
    }
    console.log(results);
    res.send({
      status: 0,
      msg: "GET请求成功",
      data: results
    })
  })
  dbClosed(connect);
})

// 获取未读消息
router.get("/getUnRead", (req, res) => {
  console.log("getUnRead接口被调用");
  const connect = dbConnection();
  const options = {
    raw: true
  };
  var query = 'SELECT date,name,des FROM message where status = 0';
  connect.query(query, options, (err, results) => {
    if (err) {
      console.error('执行查询时出错：', err);
      return;
    }
    console.log(results);
    res.send({
      status: 0,
      msg: "GET请求成功",
      data: results
    })
  })
  dbClosed(connect);
  /* const tableData = [{
    date: '12987122',
    name: '好滋好味鸡蛋仔',
    desc: '荷兰优质淡奶，奶香浓而不腻',
    detail: 'xiaoqingjianjijisgkghasdjk'
  }, {
    date: '12987123',
    name: '好滋好味鸡蛋仔',
    desc: '荷兰优质淡奶，奶香浓而不腻',
    detail: 'xiaoqingjianjijisgkghasdjk'
  }, {
    date: '12987123',
    name: '好滋好味鸡蛋仔',
    desc: '荷兰优质淡奶，奶香浓而不腻',
    detail: 'xiaoqingjianjijisgkghasdjk'
  }, {
    date: '12987123',
    name: '好滋好味鸡蛋仔',
    desc: '荷兰优质淡奶，奶香浓而不腻',
    detail: 'xiaoqingjianjijisgkghasdjk'
  }];
  res.send({
    status: 0,
    msg: "GET请求成功",
    data: tableData
  }) */
})

// 获取比赛资讯
router.get("/getMatch", (req, res) => {
  console.log("getMatch接口被调用");
  const connect = dbConnection();
  const options = {
    raw: true
  };
  var query = 'SELECT date,name,des,detail FROM matchnews ';
  connect.query(query, options, (err, results) => {
    if (err) {
      console.error('执行查询时出错：', err);
      return;
    }
    console.log(results);
    res.send({
      status: 0,
      msg: "GET请求成功",
      data: results
    })
  })
  dbClosed(connect);
  /* const tableData = [{
    date: '2016-05-02',
    name: '王小虎',
    desc: '这是一条概要1'
  }, {
    date: '2016-05-04',
    name: '王小虎',
    desc: '这是一条概要2'
  }, {
    date: '2016-05-01',
    name: '王小虎',
    desc: '这是一条概要3'
  }, {
    date: '2016-05-03',
    name: '王小虎',
    desc: '这是一条概要4'
  }, {
    date: '2016-05-01',
    name: '王小虎',
    desc: '这是一条概要5'
  }, {
    date: '2016-05-01',
    name: '王小虎',
    desc: '这是一条概要6'
  }, {
    date: '2016-05-01',
    name: '王小虎',
    desc: '这是一条概要7'
  },
  {
    date: '2016-05-01',
    name: '王小虎',
    desc: '这是一条概要7'
  },
  {
    date: '2016-05-01',
    name: '王小虎',
    desc: '这是一条概要7'
  },
  {
    date: '2016-05-01',
    name: '王小虎',
    desc: '这是一条概要7'
  },
  ];
  res.send({
    status: 0,
    msg: "GET请求成功",
    data: tableData
  }) */
})

// 删除信息
router.post("/delete", (req, res) => {
  console.log("delete接口被调用");
  const id = req.body.id;
  const connect = dbConnection();
  console.log(id);
  var query = `update history set state = 0 where id = ?;`
  connect.query(query, [id], function (err, results) {
    if (err) throw err;
    console.log(results);
    res.send({
      status: 0,
      msg: "删除成功",
    })
  })
  dbClosed(connect);
})



module.exports = router;