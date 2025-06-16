import { ErrorCode } from "../../enum/errorCode";
import { BadRequestException } from "../../utils/catch-error";
import VendorModel from "../../../database/models/auth/vendorModel";
import { vendorRegisterDto } from "../types/vendor";
import { generateApiKey } from 'generate-api-key';
import { hashValue } from "../utils/bcryptEn";





export class VendorAuthService{

    public async register(registerDto:vendorRegisterDto){

        const vendorExist =await  VendorModel.findOne({
            "contactDetails.email":registerDto.contactDetails.email
        })
       
        if (vendorExist){
            throw new BadRequestException("Vendor already exits", ErrorCode.AUTH_EMAIL_ALREADY_EXISTS)
        }

        // save the profile picture on s3 bucket

        const vendor = await VendorModel.create(registerDto);

        // const apiKey =  generateApiKey({
          
        //     name: `${user.businessInfo?.companyName.replace(/\s+/g, "")}${user.businessInfo?.businessType.replace(/\s+/g, "")}`
         
        // });
 

        // user.apiKey = await hashValue(apiKey as String);



        return {
            vendor
        }

    }
}