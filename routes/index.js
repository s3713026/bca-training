const path = require('path');
const fs = require('fs');
const acToken = require('../routes/config-token.json');

/**
 * Render Config
 * @param req
 * @param res
 */
// domain link lấy từ Zalo
exports.config = (req, res) => {
  const domain = req.headers.host || req.headers.origin;
  // tạo , nối các đường dẫn 
  const file = path.join(__dirname, '..', 'public', 'config-template.json');

  // đọc file từ config-template.json với mã hóa
  const configTemplate = fs.readFileSync(file, 'utf-8');
  const config = JSON.parse(configTemplate.replace(/\$DOMAIN/g, domain));
  res.json(config);
};


/**
 * Render UI
 * @param req
 * @param res
 */
exports.ui = (req, res) => {
  var request = require('request');
  request('https://bca-training.herokuapp.com/getUserInfor', function (error, response, body) {
    if (!error && response.statusCode === 200) {
      console.log(body) // Print the google web page.
    }
    var fs = require('fs');
    fs.readFile("userinf.json", 'utf8', (err, data) => {
      if (err) {
        console.error(err)
        return
      }
      console.log("Đã lấy được thông tin người dùng")
      console.log(data)
      var user_infor = JSON.parse("[" + data + "]")
      for (var i = 0; i <= user_infor.length; i++) {

      }
    })
  })
  res.render('index', {
    title: 'Zalo Custom Activity',
    dropdownOptionsMessSend: [
      {
        name: 'Gửi Tin Nhắn Text Phản Hồi Người Dùng',
        value: 'replyClient',
      },
      {
        name: 'Gửi Tin Nhắn Text',
        value: 'sendMess',
      },
      {
        name: 'Gửi Tin Nhắn Text kèm Hình Ảnh',
        value: 'sendImg'
      }
    ],
    dropdownOptionsClient: [
      {
        name: 'C1',
        value: 'C1',
      },
      {
        name: 'C2',
        value: 'C2',
      },
      {
        name: 'C3',
        value: 'C3'
      }
    ],
  });
};
