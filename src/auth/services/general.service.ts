import mongoose from "mongoose";
import { ErrorCode } from "../../enum/errorCode";
import { BadRequestException } from "../../utils/catch-error";
import T3PLModel from "../database/models/3PLModel";
import AdminDispatcherModel from "../database/models/admin.Dispatcher.Model";
import VendorModel from "../database/models/vendorModel";
import { Role } from "../enum/general";
import { T3PLRegistrationDTO, T3PLTypes } from "../types/3pl";
import { adminTypes } from "../types/admin";
import { loginDTO } from "../types/generalTypes";
import { vendorType } from "../types/vendor";
import { sevenDaysFromNow } from "../../utils/date-time";
import { AccessTokenPayloadType, RefreshTokenPayloadType, refreshTokenSignOptions, signToken } from "../utils/jwt";
import SessionModel from "../database/models/SessionModel";


export class GeneralAuthService{

    public async login(loginDTo: loginDTO){
        const {email, password, userAgent, role} = loginDTo;

        let user: T3PLTypes | adminTypes | vendorType 
       
        if ([Role.ADMIN ,Role.DISPATCHER, Role.SUPER_ADMIN].includes(role)){

          
            user = await AdminDispatcherModel.findOne({
                "userProfile.contactDetails.email":email
            }) as  adminTypes
        }else if (role == Role.VENDOR){
           
            user = await VendorModel.findOne({
                "userProfile.contactDetails.email":email
            }) as vendorType
           
        }else{
            user = await T3PLModel.findOne({
                "userProfile.contactDetails.email":email
            }) as T3PLTypes
        }
       

        if (!user){
            console.log('its the email')
            throw new BadRequestException("Invalid email or password", ErrorCode.AUTH_USER_NOT_FOUND);
        }

        const isPassword = await user.comparePassword(password);

        if (!isPassword){
            console.log("is thee password")
            throw new BadRequestException("Invalid email or password", ErrorCode.AUTH_USER_NOT_FOUND);
        }

        // check whether account has been verified

        // if (user.preference.enable2FA == true){
        //     // send a verification code to user
        // }


        const session = await SessionModel.create({
            userId: user._id,
            userAgent: userAgent
        })
        


        const accessToken = signToken({userId:user._id , sessionId:session._id} as AccessTokenPayloadType)
        const refreshToken = signToken({sessionId:session._id} as RefreshTokenPayloadType, refreshTokenSignOptions)


        return {
            user:user,
            accessToken,
            refreshToken
        }

    }

    

}