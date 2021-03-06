const path = require('path');
const fs = require('fs');
const acToken = require('../routes/config-token.json');

/**
 * Render Config
 * @param req
 * @param res
 */
// domain link lấy từ Custom Activity for Zalo
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
  res.render('index', {
    title: 'Custom Activity for Zalo',
    dropdownOptions: [
      {
        name: 'Gửi Tin Nhắn Text Phản Hồi Người Dùng',
        value: 'https://openapi.zalo.me/v2.0/oa/message',
      },
      {
        name: 'Gửi Tin Nhắn Text',
        value: 'https://openapi.zalo.me/v2.0/oa/message',
      },
      {
        name: 'Gửi Tin Nhắn Text kèm Hình Ảnh',
        value: 'https://openapi.zalo.me/v2.0/oa/message'
      }
    ],
  });
};






// /**
//  * Render UI
//  * @param req
//  * @param res
//  */
// exports.ui = async (req, res) => {
//   var dropdownOptionClients = [];

//   myPromise
//     .then(getIFollower())
//     .then(getUInfor())
//     .then(
//       fs.readFile("userinf.json", 'utf8', (err, data) => {
//         if (err) {
//           console.error(err)
//           return
//         }
//         // console.log("Đã lấy được thông tin người dùng")
//         // console.log("[" + data + "]")
//         for (i in JSON.parse("[" + data + "]")) {
//           // console.log("NOTE");
//           // console.log(JSON.stringify(JSON.parse("[" + data + "]")[i]));
//           dropdownOptionClients.push(JSON.parse("[" + data + "]")[i])

//         }
//         res.render('index', {
//           title: 'Zalo Custom Activity',
//           dropdownOptionsMessSend: [
//             {
//               name: 'Gửi Tin Nhắn Text Phản Hồi Người Dùng',
//               value: 'replyClient',
//             },
//             {
//               name: 'Gửi Tin Nhắn Text',
//               value: 'https://openapi.zalo.me/v2.0/oa/message',
//             },
//             {
//               name: 'Gửi Tin Nhắn Text kèm Hình Ảnh',
//               value: 'sendImg'
//             }
//           ],
//           dropdownOptionsClient: dropdownOptionClients
//         })
//       })

//     )


// };

