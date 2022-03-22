const { v1: Uuidv1 } = require('uuid');
const JWT = require('../utils/jwtDecoder');
const SFClient = require('../utils/sfmc-client');
const logger = require('../utils/logger');
const acToken = require('../routes/config-token.json');
const { request } = require('express');






/**
 * The Journey Builder calls this method for each contact processed by the journey.
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
// Thực thi được gọi khi 1 người vào Customer Activity
exports.execute = async (req, res) => {
  console.log("Đã gọi");  
  console.log(res.body); 
  // decode data
  const data = JWT(req.body);
  console.log("SEND HERE XXX:", data)
  logger.info(data);

  // try { 
  //   // const id = Uuidv1();

  //   await SFClient.saveData(process.env.DATA_EXTENSION_EXTERNAL_KEY, [
  //     {
  //       keys: {
  //         UserId: data.inArguments[0],
  //         SubscriberKey: data.inArguments[0].contactKey,
  //       },
  //       values: {
  //         Event: data.inArguments[0].DropdownOptions.value,
  //         Text: data.inArguments[0].Text,
  //       },
  //     },
  //   ]);
  // } catch (error) {
  //   logger.error(error);
  // }
  // request.get(`/hub/v1/dataevents/key:${process.env.DATA_EXTENSION_EXTERNAL_KEY}/rowset`,function(err, response, body){
  //   if (!err && response.statusCode == 200) {
  //     var locals = JSON.parse(body);
      var options = {
        'method': 'POST',
        'url': data.inArguments.DropdownOptions,
        'headers': {
          'access_token': acToken.token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "recipient": {
            "user_id": data.inArguments.contactKey
          },
          "message": {
            "text": data.inArguments.Text
          }
        })
      }
      request(options, function (error, response) {
        if (error) throw new Error(error);
        console.log("OKOKOKOKOKOK")
        console.log(response.body);
      });
    // }
  // })
  res.status(200).send({
    status: 'ok',
  });
};


/**
 * Endpoint that receives a notification when a user saves the journey.
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.save = async (req, res) => {
  res.status(200).send({
    status: 'ok',
  });
};

/**
 *  Endpoint that receives a notification when a user publishes the journey.
 * @param req
 * @param res
 */
exports.publish = (req, res) => {
  res.status(200).send({
    status: 'ok',
  });
};

/**
 * Endpoint that receives a notification when a user performs
 * some validation as part of the publishing process.
 * @param req
 * @param res
 */
exports.validate = (req, res) => {
  res.status(200).send({
    status: 'ok',
  });
};




// /**
//  * Endpoint that get long token.
//  * @param req
//  * @param res
//  * @returns {Promise<void>}
//  */
// exports.getUserInfor = async (res, req) => {
//   var request = require('request');
//   var fs = require('fs');
//   fs.readFile("userid.json", 'utf8', (err, data) => {
//     if (err) {
//       console.error(err)
//       return
//     }
//     // console.log("read file get user id success")
//     // console.log(data)
//     JSON.parse(data).forEach(element => {
//       var options = {
//         'method': 'GET',
//         'url': 'https://openapi.zalo.me/v2.0/oa/getprofile?data=%7B%22user_id%22%3A%22116216443722543962%22%7D',
//         'headers': {
//           'access_token': acToken.token,
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//           "user_id": element.user_id
//         })
//       };
//       request(options, function (error, response) {
//         if (error) throw new Error(error);
//         // console.log(response.body);
//         var infor = JSON.parse(response.body);
//         var user_avatar = infor.data.avatar
//         var username = infor.data.display_name
//         var userInfor = {
//           'u_id': element.user_id,
//           'username': username,
//           'user_ava': user_avatar
//         }
//         // console.log(userInfor);
//         if (fs.existsSync("userinf.json")) {
//           fs.readFile("userinf.json", 'utf8', (err, dataInf) => {
//             if (err) {
//               console.error(err)
//               return
//             }
//             console.log("read file success")
//             if (dataInf.includes(JSON.stringify(userInfor))) {
//               // console.log("Có Rồi");
//             } else {
//               fs.appendFile('userinf.json', "," + JSON.stringify(userInfor), function (err) {
//                 if (err) throw err;
//                 console.log('Saved!');
//               });
//             }
//           });
//         } else {
//           fs.writeFile("userinf.json", JSON.stringify(userInfor), function (err) {
//             if (err) {
//               return console.log(err);
//             }
//             // console.log("The file was saved!");
//           });
//         }
//       });
//     });
//   });
// }

// /**
// * Lấy Id người quan tâm.
// * @param req
// * @param res
// * @returns {Promise<void>}
// */
// exports.getIdFollower = async (req, res) => {
//   var request = require('request');
//   var fs = require('fs');
//   var options2 = {
//     'method': 'GET',
//     'url': 'https://openapi.zalo.me/v2.0/oa/getfollowers?data=%7B%22offset%22%3A0%2C%22count%22%3A5%7D',
//     'headers': {
//       'access_token': acToken.token,
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({
//       "offset": 0,
//       "count": 5
//     })

//   };
//   request(options2, function (error, response) {
//     if (error) throw new Error(error);
//     console.log(response.body)
//     var uid = JSON.parse(response.body).data.followers
//     res.send(JSON.stringify(uid))
//     fs.writeFile("userid.json", JSON.stringify(uid), function (err) {
//       if (err) {
//         return console.log(err);
//       }
//       // console.log("The file was saved!");
//     });
//   });

// }

// /**
// * Lấy infor người quan tâm.
// * @param req
// * @param res
// * @returns {Promise<void>}
// */
// exports.sendMess = function (req, res) {
//   console.log("CHECK CHAY KO")
//   console.log(req.query.dropdownOptionsClient.value)
//   // var options = {
//   //   'method': 'POST',
//   //   'url': req.query.dropdownOptionsMessSend.value,
//   //   'headers': {
//   //     'access_token': acToken.token,
//   //     'Content-Type': 'application/json'
//   //   },
//   //   body: JSON.stringify({
//   //     "recipient": {
//   //       "user_id": req.query.dropdownOptionsClient.value
//   //     },
//   //     "message": {
//   //       "text": req.query.textarea - id - 01
//   //     }
//   //   })
//   // }
//   // request(options, function (error, response) {
//   //   if (error) throw new Error(error);
//   //   console.log("OKOKOKOKOKOK")
//   //   console.log(response.body);
//   // });
// }



// /**
// * Lấy infor người quan tâm.
// * @param req
// * @param res
// * @returns {Promise<void>}
// */
// exports.getTestRead = async (req, res) => {
//   var fs = require('fs');
//   fs.readFile("userinf.json", 'utf8', (err, data) => {
//     if (err) {
//       console.error(err)
//       return
//     }
//     // console.log("read file success");
//     res.send(data)
//   });
// }


