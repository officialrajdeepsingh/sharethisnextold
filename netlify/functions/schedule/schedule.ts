import { Handler, HandlerEvent, HandlerContext, schedule } from "@netlify/functions";
import axios from "axios";

// To learn about scheduled functions and supported cron extensions,
// see: https://ntl.fyi/sched-func

const handler:Handler = schedule('@daily', async (_event: HandlerEvent, _context: HandlerContext) => {

  console.log("Received event:", _event);
  console.log("Received context:", _context);
  
  try {
    await axios.get("https://linkedin-share.netlify.app/api/linkedin").then(
      value => {
        return {
          statusCode: 200,
          show:value
        }
      }
    )
  } catch (error) {
    console.log(error);
  }
})

export { handler }