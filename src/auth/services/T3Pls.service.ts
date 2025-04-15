import { ErrorCode } from "../../enum/errorCode";
import { BadRequestException } from "../../utils/catch-error";
import T3PLModel from "../database/models/3PLModel";
import { T3PLRegistrationDTO } from "../types/3pl";


export class T3PLAuthService{


    public async register(registerDto:T3PLRegistrationDTO){

        // check if the user already exit

        const userExit =await  T3PLModel.findOne({
            "userProfile.contactDetails.email":registerDto.userProfile.contactDetails.email
        })
       

        // if user exit throw error
        if (userExit){
            throw new BadRequestException("User already exits", ErrorCode.AUTH_EMAIL_ALREADY_EXISTS)
        }

        // save the profile picture on s3 bucket

        // create admin or dispatcher
        const user = await T3PLModel.create(registerDto);


        return {
            user
        }

    }
}