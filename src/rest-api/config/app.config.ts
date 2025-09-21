
import env from "dotenv";
env.config();


const getEnv = (key:string, defaultValue?:string): string=>{
    const envValue = process.env[key] || defaultValue;
    // console.log(process.env)
    if (envValue == undefined){
        throw new Error(`Environment variable key: ${key} is not set`);
    }
    return  envValue;
   
}


const config = ()=>({
    PORT: getEnv("PORT"),
    DATABASE_URL: getEnv("DATABASE_URL"),
    APP_URI: getEnv("APP_ORIGIN"),
    EMAIL: getEnv("EMAIL"),
    EMAIL_PASSWORD: getEnv("EMAIL_PASSWORD"),
    JWT_REFRESH_SECRET:getEnv("JWT_REFRESH_SECRET"),
    JWT_ACCESS_SECRET: getEnv("JWT_ACCESS_SECRET"),
    JWT_ACCESS_EXPIRES_IN: getEnv("JWT_ACCESS_EXPIRES_IN"),
    JWT_REFRESH_EXPIRES_IN: getEnv("JWT_REFRESH_EXPIRES_IN"),
    RESEND_API_KEY: getEnv("RESEND_API_KEY"),
    APP_ORIGIN: getEnv("APP_ORIGIN"),
    S3_NAME: getEnv("S3_NAME"),
    S3_REGION: getEnv("S3_REGION"),
    AWS_ACCESS_KEY: getEnv("S3_ACCESS_KEY"),
    AWS_SECRET_ACCESS_KEY: getEnv("S3_SECRET_ACCESS_KEY"),
    SMS_API_KEY: getEnv("SMS_API_KEY"),
    SMS_SECRET:getEnv("SMS_SECRET")
})


export const appConfig = config();





