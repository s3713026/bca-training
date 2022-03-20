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