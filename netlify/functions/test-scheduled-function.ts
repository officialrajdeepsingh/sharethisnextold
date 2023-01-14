import { Handler, HandlerEvent, HandlerContext, schedule } from "@netlify/functions";
import axios from "axios";

const myHandler: Handler = async (event: HandlerEvent, context: HandlerContext) => {

  console.log("Received event:", event);

 await axios.get("https://linkedin-share.netlify.app/api/linkedin")

    return {
        statusCode: 200,
    };
};

const handler = schedule("@hourly", myHandler)

export { handler };