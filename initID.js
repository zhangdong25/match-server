/* const mysql = require('mysql');
const { nanoid } = require('nanoid');

// 创建数据库连接
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'zhang3025',
  database: 'matchdb'
});

// 连接到数据库
connection.connect((error) => {
  if (error) {
    console.error('无法连接到数据库:', error);
    return;
  }

  // 查询需要更新 ID 的表
  const query = 'SELECT * FROM user';

  connection.query(query, (error, results, fields) => {
    if (error) {
      console.error('查询数据时出错:', error);
      connection.end(); // 关闭数据库连接
      return;
    }

    // 对查询结果进行迭代
    results.forEach(row => {
      const newId = nanoid(); // 生成新的唯一 ID

      // 更新记录
      connection.query(
        'INSERT INTO user (id) VALUES (?)',
        [newId],
        (error, results, fields) => {
          if (error) {
            console.error(`更新记录时出错，ID: ${row.id} => ${newId}`, error);
            return;
          }
          console.log(`记录已更新，ID: ${row.id} => ${newId}`);
        }
      );
    });

    // 所有操作完成后关闭数据库连接
    connection.end();
  });
});
 */
var now = new Date();
var timestamp = now.getTime();

console.log(typeof (toString(timestamp)));