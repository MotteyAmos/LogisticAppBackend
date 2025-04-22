import { HTTPSTATUS } from "../../config/http.config";
import { ErrorCode } from "../../enum/errorCode";
import { BadRequestException } from "../../utils/catch-error";
import AdminDispatcherModel from "../database/models/admin.Dispatcher.Model";
import VendorModel from "../database/models/vendorModel";
import { accountStatus } from "../enum/general";
import { accountVerifyDTO, adminRegisterDto } from "../types/admin";



export class AuthService{


    public async register(registerDto:adminRegisterDto){

        // check if the user already exit

        const userExit =await  VendorModel.findOne({
            "userProfile.contactDetails.email":registerDto.userProfile.contactDetails.email
        })
       

        // if user exit throw error
        if (userExit){
            throw new BadRequestException("User already exits", ErrorCode.AUTH_EMAIL_ALREADY_EXISTS)
        }

        // save the profile picture on s3 bucket

        // create admin or dispatcher
        const user = await AdminDispatcherModel.create(registerDto);


        return {
            user
        }
    }

    public async verifyVendorAccount(verifyDto:accountVerifyDTO){

        const vendor = await VendorModel.findOne({id:verifyDto.userId})

        if (!vendor){
            throw new BadRequestException("Vendor does not exit")
        }

        vendor.status = accountStatus.ACTIVE

        vendor.save();

        // send an email to the vendor
    }
}