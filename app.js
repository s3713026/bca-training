require('dotenv').config();
const cookieParser = require('cookie-parser');
const express = require('express');
const helmet = require('helmet');
const httpErrors = require('http-errors');
const logger = require('morgan');
const path = require('path');
const bodyParser = require('body-parser');
const routes = require('./routes/index');
const activityRouter = require('./routes/activity');

const app = express();
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        'default-src': ["'self'"],
        'frame-ancestors': ["'self'", `https://mc.${process.env.STACK}.exacttarget.com`, `https://jbinteractions.${process.env.STACK}.marketingcloudapps.com`],
      },
    },
  }),
);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.raw({
  type: 'application/jwt',
}));

app.use(express.static(path.join(__dirname, 'public')));

// serve config
app.use('/config.json', routes.config);

// custom activity routes
app.use('/gettoken',activityRouter.getToken);
app.use('/getIdFollower',activityRouter.getIdFollower);
app.use('/journey/execute/', activityRouter.execute);
app.use('/journey/save/', activityRouter.save);
app.use('/journey/publish/', activityRouter.publish);
app.use('/journey/validate/', activityRouter.validate);

// serve UI
app.use('/', routes.ui);
app.get('/', (res,req)=>{
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
})

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(httpErrors(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});




module.exports = app;
