import { Resend } from "resend";
import { appConfig } from "../../config/app.config";
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const resend = new Resend(appConfig.RESEND_API_KEY);

interface Params{
    sender: String,
    to:String,
    subject: String,
    // text: String,
    html:String
}




const __filename = fileURLToPath(import.meta.url);


const __dirname = path.dirname(__filename);
const rest_api_rootDir = path.resolve(__dirname, '../');

const company_logo = path.join(rest_api_rootDir, 'static', 'company_logo.jpg');
const attachment = fs.readFileSync(company_logo).toString('base64');


export const sendMail = async (
    {
        sender, to, subject,
        //  text,
         html
    }:Params
) =>  await resend.emails.send({
    from: process.env.NODE_ENV === "development"? "Acme <onboarding@resend.dev>": sender as string,
    to: process.env.NODE_ENV === "development"? "kojoababio06@gmail.com": to as string,
    subject:subject as string,
    html: html as string,
  //    attachments: [
  //   {
  //     content: attachment,
  //     filename: 'company_logo.jpg',
  //   },
  // ],
  });


