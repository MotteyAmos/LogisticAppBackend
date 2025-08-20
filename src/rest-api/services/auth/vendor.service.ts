import { ErrorCode } from "../../enum/errorCode";
import { BadRequestException } from "../../utils/catch-error";
import VendorModel from "../../../database/models/auth/vendorModel";
import { vendorRegisterDto } from "../../types/auth/vendor";
import { generateApiKey } from "generate-api-key";
import { hashValue } from "../../utils/auth/bcryptEn";
import { storeVendorFileToS3 } from "../../middleware/fileUpload";
import { Request } from "express";
import { accountStatus, ApproveStatus } from "../../enum/general";
import { ApprovalStatusDTO } from "../../types/auth/generalTypes";
import { sendAccountCreatedEmail } from "../../utils/auth/emailTemplate";
import { appConfig } from "../../config/app.config";
import { getVendorInitials } from "../../utils/orders/generateVendorInitials";
import OrderCounterModel from "../../../database/models/orders/OrderCounter";
export class VendorAuthService {
  public async register(registerDto: {
    req: Request;
    body: vendorRegisterDto;
  }) {
    const vendorExist = await VendorModel.findOne({
      "contactDetails.email": registerDto.body.contactDetails.email,
    });

    if (vendorExist) {
      throw new BadRequestException(
        "Vendor already exist",
        ErrorCode.AUTH_EMAIL_ALREADY_EXISTS
      );
    }

    const vendor = await VendorModel.create({...registerDto.body, tempPassword:registerDto.body.contactDetails.password});

    if (registerDto.req.file) {
      const bussinessLogoUri = await storeVendorFileToS3(
        vendor._id as String,
        registerDto.req
      );
      vendor.businessInfo.logo = bussinessLogoUri as String;
      await vendor.save();
    }

    // const apiKey =  generateApiKey({

    //     name: `${user.businessInfo?.companyName.replace(/\s+/g, "")}${user.businessInfo?.businessType.replace(/\s+/g, "")}`

    // });

    // user.apiKey = await hashValue(apiKey as String);

    return "Account created successfully";
  }

  public async registrationApprovement(dto: ApprovalStatusDTO) {
    const vendor = await VendorModel.findById(dto.id);

    if (!vendor) {
      throw new BadRequestException(
        "vendor does not exist",
        ErrorCode.AUTH_USER_NOT_FOUND
      );
    }

    if (dto.status == ApproveStatus.APPROVE) {
      vendor.status = accountStatus.APPROVED;

      // if admin is approving for the first time 
      if (vendor.tempPassword.trim().length >0){
        let vendorInitial = getVendorInitials(vendor.businessInfo.companyName);
        let lastValue ="";

        let vendorInitialExist =await OrderCounterModel.findOne({initials:vendorInitial})

        if(vendorInitialExist){
          const lastDigit = vendorInitialExist.initials?.split("")[vendorInitialExist.initials.length -1]

          if (/^\d+$/.test(lastDigit as string)){
            const count = Number(lastDigit) + 1;
            lastValue  = `${count}`;
          }else{
              lastValue =`${2}`
          }

        }

        const newOrderCounter = await OrderCounterModel.create({
          vendorId: dto.id,
          initials: (lastValue?.length >0) ? `${vendorInitial}${lastValue}` : vendorInitial,
          source:"VENDOR"
        })
      }

      const passwordInfo = vendor.tempPassword.trim().length >0 ? vendor.tempPassword:"Use your current password"
      const {error}= await sendAccountCreatedEmail({
            sender: appConfig.EMAIL,
            recipientEmail: `${vendor.contactDetails.email}`,
            recipientName: `${vendor.businessInfo.companyName}`,
            recipientPassword: `${passwordInfo}`,
            loginLink: `${appConfig.APP_ORIGIN}`,
            
          })

         vendor.tempPassword = ""


      await vendor.save();
      return "Vendor's account approved successfully";
    } else if (dto.status == ApproveStatus.DENIED) {
      vendor.status = accountStatus.DENIED;
      await vendor.save();
      return "Vendor's account denied successfully";
    }
  }

    public async deleteVendor(id: String): Promise<String> {
      const deletedVendor = await VendorModel.findByIdAndDelete({ _id: id });
  
      if (!deletedVendor) {
        throw new BadRequestException(
          "Vendor does not exist",
          ErrorCode.ROLE_NOT_FOUND
        );
      }
      return "Vendor deleted successful";
    }
}
