

import twilio from "twilio";import { appConfig } from "../config/app.config";
;

const client = twilio(appConfig.TWILIO_SNS_SID, appConfig.TWILIO_AUTH_TOKEN)


export async function sendMessage({msg,to}:{msg:string,to:string}) {
  const message = await client.messages.create({
    body: msg,
    from: "+16625032834",
    to: appConfig.TWILIO_SNS_SENDTO,
  });

  console.log(message.body);
}

