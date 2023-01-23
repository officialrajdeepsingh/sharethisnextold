import { schedule } from "@netlify/functions";
import axios from "axios";

// To learn about scheduled functions and supported cron extensions,
// see: https://ntl.fyi/sched-func

const handler = schedule('@hourly', async () => {

        try {
          
            await axios.get("https://linkedin-share.netlify.app/api/linkedin").then(
              value => {
                return {
                  statusCode: 200,
                  show: value
                }
              }
            );

        } catch (error) {
          console.log(error);
        }
  }
)

export { handler }