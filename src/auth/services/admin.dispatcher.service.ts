import { ErrorCode } from "../../enum/errorCode";
import { BadRequestException } from "../../utils/catch-error";
import AdminDispatcherModel from "../database/models/admin.Dispatcher.Model";
import { adminRegisterDto } from "../types/admin";





export class AuthService{


    public async register(registerDto:adminRegisterDto){

        // check if the user already exit
        const userExit =await  AdminDispatcherModel.exists({
            "userProfile.contactDetils.email":registerDto.userPrfile.contactDetails.email
        })
       

        // if user exit throw error
        if (userExit){
            throw new BadRequestException("User already exits", ErrorCode.AUTH_EMAIL_ALREADY_EXISTS)
        }

        // save the profile picture on s3 bucket


    }
}