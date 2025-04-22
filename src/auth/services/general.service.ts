import mongoose from "mongoose";
import { ErrorCode } from "../../enum/errorCode";
import { BadRequestException, UnauthorizedException } from "../../utils/catch-error";
import T3PLModel from "../database/models/3PLModel";
import AdminDispatcherModel from "../database/models/admin.Dispatcher.Model";
import VendorModel from "../database/models/vendorModel";
import { accountStatus, Role } from "../enum/general";
import { T3PLRegistrationDTO, T3PLTypes } from "../types/3pl";
import { adminTypes } from "../types/admin";
import { loginDTO } from "../types/generalTypes";
import { vendorType } from "../types/vendor";
import { calculateExpirationDate, ONE_DAY_IN_MS, sevenDaysFromNow } from "../../utils/date-time";
import { AccessTokenPayloadType, RefreshTokenPayloadType, refreshTokenSignOptions, signToken, verifyJwtToken } from "../utils/jwt";
import SessionModel from "../database/models/SessionModel";
import { appConfig } from "../../config/app.config";
import { JwtPayload } from "jsonwebtoken";
import { config } from "dotenv";


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
           
            throw new BadRequestException("Invalid email or password", ErrorCode.AUTH_USER_NOT_FOUND);
        }

        if (user.status == accountStatus.INACTIVE ){
            throw new UnauthorizedException("Sorry your account is not actived, contact the adminstrator for help")
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
            userAgent: userAgent,
            userRole: user.role
        })
        


        const accessToken = signToken({userId:user._id , sessionId:session._id, role:user.role} as AccessTokenPayloadType)
        const refreshToken = signToken({sessionId:session._id} as RefreshTokenPayloadType, refreshTokenSignOptions)


        return {
            user:user,
            accessToken,
            refreshToken
        }

    }

    public async refreshToken(refreshToken:string){
        const {payload} = verifyJwtToken<RefreshTokenPayloadType>(refreshToken,{
            secret:appConfig.JWT_REFRESH_SECRET
        }) as JwtPayload

        if (!payload){
            throw new UnauthorizedException("Invalid refresh token");
        }

        const session = await SessionModel.findById(payload?.sessionId); 

        if (!session){
            throw new UnauthorizedException("Session does not exist");
        }

        const now = Date.now();

        if (session.expiredAt.getTime() <= now){
            throw new UnauthorizedException("Session expired")
        }

        const sessionRequiredRefresh = session.expiredAt.getTime() - now <= ONE_DAY_IN_MS;

        if (sessionRequiredRefresh){
            session.expiredAt = calculateExpirationDate(appConfig.JWT_REFRESH_EXPIRES_IN);
            await session.save();
        }

        const newRefreshToken = sessionRequiredRefresh ? signToken({sessionId:session._id} as RefreshTokenPayloadType,refreshTokenSignOptions):undefined;

        const accessToken = signToken({sessionId:session._id , userId:session.userId, role:session.userRole} as AccessTokenPayloadType)

        return {
            accessToken,
            newRefreshToken
        }

    }

    

}