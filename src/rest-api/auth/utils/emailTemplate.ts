import { sendMail } from "./sendMail"
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

interface Params {
    sender:string,
    recipientName:string,
    recipientEmail:string,
    recipientPassword:string,
    loginLink:string
}


const __filename = fileURLToPath(import.meta.url);


const __dirname = path.dirname(__filename);
const rest_api_rootDir = path.resolve(__dirname, '../');

const company_logo = path.join(rest_api_rootDir, 'static', 'company_logo.jpg');
const attachment = fs.readFileSync(company_logo).toString('base64');



export const sendAccountCreatedEmail = async({sender,recipientName, recipientEmail,recipientPassword,loginLink}:Params)=>{
// <!-- Logo -->
                // <div style="text-align: center; margin-bottom: 30px;">
                // <img src="https://yourdomain.com/assets/throttle-logo.png" alt="Throttle Logo" style="width: 150px;" />
                // </div>

    const html =` 
        <!DOCTYPE html>
        <html lang="en">
            <head>
            <meta charset="UTF-8">
            <title>Throttle</title>
            </head>
            <body style="font-family: Arial, sans-serif; background-color: #121212; color: #ffffff; padding: 20px;">
            <div style="max-width: 600px; margin: auto; background-color: #1e1e1e; padding: 30px; border-radius: 8px;">
                

                <h2 style="color: #00d084;">Welcome to Throttle</h2>
                <p>Hello, ${recipientName}</p>
                <p>An account has been created for you on the Throttle platform.</p>
                <p>Here are your login credentials</p>

                <div style="background-color: #2c2c2c; padding: 20px; border-radius: 6px; margin: 20px 0;">
                <p><strong>Login Email:</strong> <span style="color: #00d084;">${recipientEmail}</span></p>
                <p><strong>Temporary Password:</strong> <span style="color: #00d084;">${recipientPassword}</span></p>
                </div>

              
                <p>You can log in using the button below:</p>
                <div style="text-align: center; margin: 20px 0;">
                <a href="${loginLink}" style="background-color: #00d084; color: white; text-decoration: none; padding: 12px 25px; border-radius: 5px;">Go to Application</a>
                </div>

                <!-- Footer -->
                <p>If you did not expect this email, please ignore it.</p>
                <p style="font-size: 12px; color: #888;">© 2025 Throttle. All rights reserved.</p>

            </div>
            </body>
        </html>
     
     `

      const {error} = await sendMail({
        sender,
        to: recipientEmail,
        subject:"Your Throttle Account Has Been Created",
        html
    })

    return {error}
}

interface ForgotPaswordParams {
    sender:String,
    recipientName:String,
    recipientEmail:String,
    code: String
}

export const sendForgotPasswordEmail = async({sender,recipientName, recipientEmail,code}:ForgotPaswordParams)=>{

    const html =` 
       <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>Throttle</title>
            <style>
                body {
                margin: 0;
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                color: #333;
                }
                .email-container {
                max-width: 600px;
                margin: 30px auto;
                background-color: #000000;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                color:#f0f0f0
                }
                .header {
                background-color: #17654F;
                color: white;
                padding: 20px;
                text-align: center;
                }
                .logo {
                max-height: 50px;
                }
                .content {
                padding: 30px;
                }
                .content h1 {
                font-size: 22px;
                margin-bottom: 10px;
                }
                .content p {
                font-size: 16px;
                line-height: 1.5;
                }
                .button {
                display: inline-block;
                margin-top: 20px;
                background-color: #4a90e2;
                color: white;
                padding: 12px 24px;
                text-decoration: none;
                border-radius: 4px;
                font-weight: bold;
                }
                .footer {
                background-color: #f0f0f0;
                padding: 15px;
                font-size: 12px;
                text-align: center;
                color: #777;
                }
                .centerText{
                    text-align: center;
                    max-width: 500;
                    background-color: #333;
                    padding: 10px 5px;
                    font-weight:bold
                }
            </style>
        </head>
        <body>

        <div class="email-container">
            <div class="header">
            <h2>Throttle</h2>
            </div>
            <div class="content">
            <h1>Hello, ${recipientName}</h1>
            <p>
                You recently requested to reset your password. Here is your OTP code:
            </p>
            <p class="centerText">
                ${code}
            </p>
           
            <p style="margin-top: 20px;">
               This code expires in 5 minutes.
            </p>
            </div>
            <div class="footer">
            &copy; 2025 YourApp Inc. All rights reserved.
            </div>
        </div>

        </body>
        </html>

     
     `

      const {error} = await sendMail({
        sender,
        to: recipientEmail,
        subject:"Password reset OTP code",
        html
    })

    return {error}
}


   
     

