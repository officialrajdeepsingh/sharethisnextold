const { schedule } = require('@netlify/functions')
const axios = require('axios');

// To learn about scheduled functions and supported cron extensions,
// see: https://ntl.fyi/sched-func

module.exports.handler = schedule('* * * * *', async () => {

  (async () => {

    try {

      await axios.get("https://linkedin-share.netlify.app/api/linkedin").then(
        () => {
          return {
            statusCode: 200,
          }
        }
      )

    } catch (error) {
      console.log(error);
    }

  })();
})
