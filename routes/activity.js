const { v1: Uuidv1 } = require('uuid');
const JWT = require('../utils/jwtDecoder');
const SFClient = require('../utils/sfmc-client');
const logger = require('../utils/logger');
const fs = require('fs');

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
 * Endpoint that get long token.
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.getToken = async (req,res) =>{
 var url_page = req.query;
    var string = JSON.stringify(url_page);
    var objectValue = JSON.parse(string);
    var get_authorization_code = objectValue['code'];
    console.log("Authorization Code: " + get_authorization_code);
    res.send(get_authorization_code);

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
        console.log(response.body);
        var infor = JSON.parse(response.body);
        var ac_token = infor.access_token
        res.send(ac_token)
        fs.writeFile("config.json", JSON.stringify(ac_token), function (err) {
            if (err) {
                return console.log(err);
            }
            console.log("The file was saved!");
        });
    });

}



/**
 * Endpoint that receives a notification when a user saves the journey.
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.save = async (req, res) => {
  fs.readFile('config.json', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    } res.send(JSON.parse(data))});
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
