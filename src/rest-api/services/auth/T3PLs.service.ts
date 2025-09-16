import { ErrorCode } from "../../enum/errorCode";
import { BadRequestException } from "../../utils/catch-error";
import VendorModel from "../../../database/models/auth/vendorModel";
import { vendorRegisterDto } from "../../types/auth/vendor";
import { generateApiKey } from "generate-api-key";
import { hashValue } from "../../utils/auth/bcryptEn";
import { storeRiderFileToS3, storeT3PLFileToS3, storeVendorFileToS3 } from "../../middleware/fileUpload";
import { Request } from "express";
import { accountStatus, ApproveStatus } from "../../enum/general";
import { ApprovalStatusDTO } from "../../types/auth/generalTypes";
import { T3PLRegisterDto } from "../../types/auth/3pl";
import RiderModel from "../../../database/models/auth/RiderModel";
import T3PLModel from "../../../database/models/auth/3PLModel";

export class T3PLAuthService {
  public async register(registerDto: {
    req: Request;
    body: T3PLRegisterDto;
  }) {
    const T3plExist = await T3PLModel.findOne({
      "contactDetails.email": registerDto.body.contactDetails.email,
    });

    if (T3plExist) {
      throw new BadRequestException(
        "3pl already exist",
        ErrorCode.AUTH_EMAIL_ALREADY_EXISTS
      );
    }

    const T3pl = await T3PLModel.create(registerDto.body);

    if (registerDto.req.file) {
      
      const bussinessLogoUri = await storeT3PLFileToS3(
        T3pl._id as String,
        registerDto.req
      );

      T3pl.businessInfo.logo = bussinessLogoUri as String;
      await T3pl.save();
    }

    // const apiKey =  generateApiKey({

    //     name: `${user.businessInfo?.companyName.replace(/\s+/g, "")}${user.businessInfo?.businessType.replace(/\s+/g, "")}`

    // });

    // user.apiKey = await hashValue(apiKey as String);

    return "Account created successfully";
  }

  public async registrationApprovement(dto: ApprovalStatusDTO) {
    const T3pl = await T3PLModel.findById(dto.id);

    if (!T3pl) {
      throw new BadRequestException(
        "3pl does not exist",
        ErrorCode.AUTH_USER_NOT_FOUND
      );
    }

    if (dto.status == ApproveStatus.APPROVE) {
      T3pl.status = accountStatus.APPROVED;

      await T3pl.save();
      return "3pl's account approved successfully";
    } else if (dto.status == ApproveStatus.DENIED) {
      T3pl.status = accountStatus.DENIED;
      await T3pl.save();
      return "3pl's account denied successfully";
    }
  }

    public async delete3PL(id: String): Promise<String> {
      const deleted3pl = await T3PLModel.findByIdAndDelete({ _id: id });
  
      if (!deleted3pl) {
        throw new BadRequestException(
          "3pl does not exist",
          ErrorCode.ROLE_NOT_FOUND
        );
      }
      return "3Pl deleted successful";
    }
}
