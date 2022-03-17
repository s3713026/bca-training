const path = require('path');
const fs = require('fs');

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

var getToken = (req,res)=>{
  
}



/**
 * Render UI
 * @param req
 * @param res
 */
exports.ui = (req, res) => {
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
  var url_page = req.query;
     var string = JSON.stringify(url_page);
     var objectValue = JSON.parse(string);
     var get_authorization_code = objectValue['code'];
     console.log("Authorization Code: " + get_authorization_code);
     var request = require('request');
     var options = {
         'method': 'POST',
         'url': 'https://oauth.zaloapp.com/v4/oa/access_token',
         'headers': {
             'secret_key': 'q52K4eXpUtLN353SVUcN',
             'Content-Type': 'application/x-www-form-urlencoded'
         },
         form: {
             'app_id': '3264157168871710467',
             'code_verifier': 'yWjvLbkuOMEZWUcMaPF43ChOldw8H87P_Zm813H5m1M',
             'code': get_authorization_code,
             'grant_type': 'authorization_code'
         }
     };
     request(options, function (error, response) {
         if (error) throw new Error(error);
        //  console.log(response.body);
         var infor = JSON.parse(response.body);
         var ac_token = infor.access_token
         console.log(ac_token);
        //  res.send(ac_token)
        if(ac_token!=undefined){
         fs.writeFile("config.json", JSON.stringify(ac_token), function (err) {
             if (err) {
                 return console.log(err);
             }
             console.log("The file was saved!");
         });
        } else {
          console.log("Have bọ here");
        }
     });
};
