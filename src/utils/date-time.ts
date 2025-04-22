// import {add} from "date-fns";

import { add } from "date-fns";

export const sevenDaysFromNow = ():Date => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

export const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;

export const calculateExpirationDate = (expiresIn: string = "15m"): Date=>{
    const match = expiresIn.match(/^(\d+)([mhd])$/);
    if (!match) throw new Error("Invalid format. Use 15m, 1h oe 2d");
    const [,value,unit] = match;
    const expireDate = new Date();

    switch(unit){
        case "m":
            return add(expireDate, {minutes: parseInt(value)});
        case "h":
            return add(expireDate, {hours:parseInt(value)})
        case "d":
            return add(expireDate, {days: parseInt(value)});
        default: 
            throw new Error("Invalid unit. use 'm', 'h' or 'd'");
    }
}