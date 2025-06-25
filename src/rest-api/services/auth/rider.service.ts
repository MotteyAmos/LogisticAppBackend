import RiderModel from "../../../database/models/auth/RiderModel";
import { ErrorCode } from "../../enum/errorCode";
import { accountStatus, ApproveStatus, Gender } from "../../enum/general";
import { storeRiderFileToS3 } from "../../middleware/auth/fileUpload";
import { ApprovalStatusDTO } from "../../types/auth/generalTypes";
import { RiderRegistrationDTO } from "../../types/auth/rider";
import { BadRequestException } from "../../utils/catch-error";
import { Request } from "express";


export class RiderService {
  public async registration(riderDTO:{riderInfo:RiderRegistrationDTO, req:Request} ) {
    const riderExist = await RiderModel.findOne({
      "contactDetails.email": riderDTO.riderInfo.contactDetails.email,
    });

    if (riderExist) {
      throw new BadRequestException(
        "User Already exist",
        ErrorCode.AUTH_EMAIL_ALREADY_EXISTS
      );
    }

    const rider = await RiderModel.create(riderDTO.riderInfo);

    const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${riderDTO.riderInfo.userProfile.fullName.split(" ")[0]}`;
    const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${riderDTO.riderInfo.userProfile.fullName.split(" ")[0]}`;
  

    if (riderDTO.riderInfo.userProfile.gender == Gender.MALE){
        rider.userProfile.picture = boyProfilePic
    }
    else if (riderDTO.riderInfo.userProfile.gender == Gender.FEMALE){
        rider.userProfile.picture = girlProfilePic
    }

    const {driverLicense, nationalIdentification} = await storeRiderFileToS3(rider._id as String, riderDTO.req)

    if (driverLicense){
        rider.professionalDetails.drivingLicenseImg = driverLicense
    }
    if (nationalIdentification){
        rider.userProfile.nationalIdentification.image = nationalIdentification
    }

    await rider.save();


    return "rider account created successful"
    
}

  public async registrationApprovement(dto: ApprovalStatusDTO){

    const rider = await RiderModel.findById(dto.id);

     if (!rider) {
      throw new BadRequestException(
        "Rider does not exist",
        ErrorCode.AUTH_USER_NOT_FOUND
      );
    }

    if (dto.status == ApproveStatus.APPROVE){
      rider.status = accountStatus.ACTIVE

      await rider.save();
      return "Rider's account approved successfully"
    }
    else if(dto.status == ApproveStatus.DENIED){
      await RiderModel.findByIdAndDelete(dto.id)
      return "Rider's account deleted successful"
    }


  }


}
