// import { appConfig } from "../config/app.config";
// import axios from "axios";


// export const sendMessage = async ({msg,to}:{msg:string,to:string}) => {
//   try {
//     const response = await axios.post(
//       "https://api.wittyflow.com/v1/messages/send",
//       {
//         app_id: appConfig.SMS_API_KEY,
//         app_secret: appConfig.SMS_SECRET,
//         // from: "233545892554",
//         to: to,
//         type: 1,
//         message: msg
        
//       },
//       {
//         headers: { 'Content-Type': 'application/json' },
//       }
//     );
//     console.log(response.data)

//     return response.data;
//   } catch (err:any) {
//       console.log(err)

//     return {
//       error: err?.response?.data || err?.message,
//     };
//   }
// };


import followRedirects from "follow-redirects";
const { https } = followRedirects;

interface MessageOptions {
  to: string;
  text: string;
}

export const sendMessage = ({ to, text }: MessageOptions): Promise<void> => {
  const options = {
    method: 'POST',
    hostname: 'api.infobip.com',
    path: '/sms/2/text/advanced',
    headers: {
      'Authorization': `App 5d1294e69971ec5fd1e5ecbc87688353-e29ff0e0-cfa7-4392-a7ee-ef3d027f8a2f`, // Use environment variable
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    maxRedirects: 20
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      const chunks: Buffer[] = [];

      res.on("data", (chunk: Buffer) => {
        chunks.push(chunk);
      });

      res.on("end", () => {
        const body = Buffer.concat(chunks);
        console.log(body.toString());
        resolve();
      });

      res.on("error", (error) => {
        reject(error);
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    const postData = JSON.stringify({
      messages: [
        {
          destinations: [{"to":"233545892554"}],
          from:"447491163443",
          text
        }
      ]
    });

    req.write(postData);
    req.end();
  });
};

// Example usage:
// sendMessage({
//   to: "233545892554",
//   from: "447491163443",
//   text: "Congratulations on sending your first message..."
// }).catch(console.error);
