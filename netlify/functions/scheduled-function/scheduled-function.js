const axios = require('axios');

// To learn about scheduled functions and supported cron extensions,
// see: https://ntl.fyi/sched-func



module.exports.handler = async () => {


    try {

      await axios.get("https://linkedin-share.netlify.app/api/linkedin").then(
        () => {
          console.log('Successful publish new article.');
          return {
            statusCode: 200,
            body: JSON.stringify( { message : "Successful" } ),
          }
        }
      )

    } catch (error) {
      console.log('error is here');
    }

  };
