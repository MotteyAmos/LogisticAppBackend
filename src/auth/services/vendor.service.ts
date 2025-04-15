import { ErrorCode } from "../../enum/errorCode";
import { BadRequestException } from "../../utils/catch-error";
import VendorModel from "../database/models/vendorModel";
import { vendorRegisterDto } from "../types/vendor";






export class VendorAuthService{

    public async register(registerDto:vendorRegisterDto){

        // check if the user already exit
        const userExit =await  VendorModel.findOne({
            "userProfile.contactDetails.email":registerDto.userProfile.contactDetails.email
        })
       

        // if user exit throw error
        if (userExit){
            throw new BadRequestException("Vendor already exits", ErrorCode.AUTH_EMAIL_ALREADY_EXISTS)
        }

        // save the profile picture on s3 bucket

        // create admin or dispatcher
        const user = await VendorModel.create(registerDto);


        return {
            user
        }

    }
}