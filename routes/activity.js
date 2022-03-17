const { v1: Uuidv1 } = require('uuid');
const JWT = require('../utils/jwtDecoder');
const SFClient = require('../utils/sfmc-client');
const logger = require('../utils/logger');
const acToken = require('../routes/config-token.json');






/**
 * The Journey Builder calls this method for each contact processed by the journey.
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
// Thực thi được gọi khi 1 người vào Customer Activity
exports.execute = async (req, res) => {
  // decode data
  const data = JWT(req.body);

  logger.info(data);

  try {
    const id = Uuidv1();

    await SFClient.saveData(process.env.DATA_EXTENSION_EXTERNAL_KEY, [
      {
        keys: {
          Id: id,
          SubscriberKey: data.inArguments[0].contactKey,
        },
        values: {
          Event: data.inArguments[0].DropdownOptions,
          Text: data.inArguments[0].Text,
        },
      },
    ]);
  } catch (error) {
    logger.error(error);
  }

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


/**
 * Endpoint that get long token.
 * @param req
 * @param res
 * @returns {Promise<void>}
 */


 /**
 * Lấy Id người quan tâm.
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
  exports.getIdFollower = async (req,res) =>{
    var request = require('request');
    var fs = require('fs');
    // fs.readFile(acToken, 'utf8', (err, data) => {
    //     if (err) {
    //         console.error(err)
    //         return
    //     }
    //     console.log("read file success")
    //     console.log(data)
        var options2 = {
          'method': 'GET',
          'url': 'https://openapi.zalo.me/v2.0/oa/getfollowers?data=%7B%22offset%22%3A0%2C%22count%22%3A5%7D',
          'headers': {
            'access_token': acToken.token,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            "offset": 0,
            "count": 5
          })
        
        };
        request(options2, function (error, response) {
            if (error) throw new Error(error);
            console.log(response.body)
            var uid = JSON.parse(response.body).data.followers
            res.send(JSON.stringify(uid))
            fs.writeFile("userid.json", JSON.stringify(uid), function (err) {
                if (err) {
                    return console.log(err);
                }
                console.log("The file was saved!");
            });
        });
    // });
   }


  