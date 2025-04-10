import bcrypt from "bcrypt";

export  const hashValue = async (value:String, saltRounds: Number = 10):Promise<String>=>{
    return await bcrypt.hash(value as string, saltRounds as number);
}


export const compareValue = async (value:String, hashedValue:String):Promise<Boolean>=>{
    return await bcrypt.compare(value as string,hashedValue as string);
}