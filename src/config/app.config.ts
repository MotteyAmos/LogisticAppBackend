
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
    EMAIL_PASSWORD: getEnv("EMAIL_PASSWORD")
})


export const appConfig = config();





