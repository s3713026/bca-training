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

function getIFollower() {
  var request = require('request');
  var options = {
    'method': 'GET',
    'url': 'https://bca-training.herokuapp.com/getIdFollower',
    'headers': {
    },
    formData: {

    }
  };
  request(options, function (error, response) {
    if (error) throw new Error(error);
    console.log(response.body);
  });
}

function getUInfor() {
      var request = require('request');
      var options = {
        'method': 'GET',
        'url': 'https://bca-training.herokuapp.com/getUserInfor',
        'headers': {
        }
      };
      request(options, function (error, response) {
        if (error) throw new Error(error);
        console.log(response.body);
      });
}

const myPromise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('foo');
  }, 10000);
});

exports.sendPersonMess= async (req, res, next)=>{
  if(req.body.name == null)
  {
      res.redirect('/');
  }
  console.log("THONG TIN O DAY")
  console.log(req.body.dropdownOptionsMessSend.value)
  console.log(req.body.dropdownOptionsClient.value)
  console.log(req.body.text)
  var options = {
    'method': 'POST',
    'url': req.body.dropdownOptionsMessSend.value,
    'headers': {
        'access_token': acToken.token,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        "recipient": {
            "user_id": req.body.dropdownOptionsClient.value
        },
        "message": {
            "text": req.body.text
        }
    })
};
request(options, function (error, response) {
    if (error) throw new Error(error);
    console.log(response.body);
});
}


/**
 * Render UI
 * @param req
 * @param res
 */
exports.ui = async (req, res) => {
  var dropdownOptionClients = [];

      myPromise
      .then(getIFollower())
      .then(getUInfor())
      .then(
        fs.readFile("userinf.json", 'utf8', (err, data) => {
          if (err) {
            console.error(err)
            return
          }
          // console.log("Đã lấy được thông tin người dùng")
          // console.log("[" + data + "]")
          for (i in JSON.parse("[" + data + "]")) {
            // console.log("NOTE");
            // console.log(JSON.stringify(JSON.parse("[" + data + "]")[i]));
            dropdownOptionClients.push(JSON.parse("[" + data + "]")[i])
            
          }
          res.render('index', {
            title: 'Zalo Custom Activity',
            dropdownOptionsMessSend: [
              {
                name: 'Gửi Tin Nhắn Text Phản Hồi Người Dùng',
                value: 'replyClient',
              },
              {
                name: 'Gửi Tin Nhắn Text',
                value: 'https://openapi.zalo.me/v2.0/oa/message',
              },
              {
                name: 'Gửi Tin Nhắn Text kèm Hình Ảnh',
                value: 'sendImg'
              }
            ],
            dropdownOptionsClient: dropdownOptionClients
          })
        })
      )
};
