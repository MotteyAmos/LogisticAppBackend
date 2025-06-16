import { HTTPSTATUS } from "../../config/http.config";
import { ErrorCode } from "../../enum/errorCode";
import { BadRequestException } from "../../utils/catch-error";
import StaffModel from "../../../database/models/auth/staffs.Model";
import { accountStatus, Gender } from "../enum/general";
import { staffRegisterDto, updateStaffAccountDTO } from "../types/staffs";
import mongoose from "mongoose";
import { sendAccountCreatedEmail } from "../utils/emailTemplate";
import { appConfig } from "../../config/app.config";

export class AuthService {
  public async registerStaff(registerDto: staffRegisterDto) {
    // check if the user already exit

    const userExit = await StaffModel.findOne({
      "userProfile.email": registerDto.userProfile.email,
    });

    // if user exit throw error
    if (userExit) {
      throw new BadRequestException(
        "User already exist",
        ErrorCode.AUTH_EMAIL_ALREADY_EXISTS
      );
    }

   
    // create admin or dispatcher
    const user = await StaffModel.create(registerDto);

    user.role = registerDto.roleId as unknown as mongoose.Types.ObjectId

    
    const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${user.userProfile.fullName.surname}`;
    const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${user.userProfile.fullName.surname}`;

    if (user.userProfile.gender == Gender.MALE){
        user.userProfile.picture = boyProfilePic
    }
    if (user.userProfile.gender == Gender.FEMALE){
        user.userProfile.picture = girlProfilePic
    }

    // work on sending email to users concerning that login details

    await user.save();

    // work on the sender email
    // it has to be one creating the account, so let work on it again
    const {error} =await sendAccountCreatedEmail(
      {
        sender:"motteyamos770@gmail.com",
        recipientEmail:registerDto.userProfile.email,
        recipientName: `${registerDto.userProfile.fullName.surname} ${registerDto.userProfile.fullName.firstName}  ${registerDto.userProfile.fullName?.middleName}`,
        recipientPassword: `${registerDto.userProfile.password}`,
        loginLink:`${appConfig.APP_ORIGIN}`
      }
    )

    if (error){
      throw new BadRequestException(
        "The account was created, but we couldn't deliver the login credentials. Please check the email address and correct it if needed",
        ErrorCode.INCORRECT_EMAIL
      );
    }
    return {
      user,
    };
  }



  public async updateStaff(staffDTO: updateStaffAccountDTO){
      const staff = await StaffModel.findById(staffDTO.staffId);


       if(!staff){
          throw new BadRequestException("User does not exist",ErrorCode.AUTH_USER_NOT_FOUND);
      }

      const updatedStaff = await StaffModel.findByIdAndUpdate(staffDTO.staffId, {
        ...staffDTO,
        userProfile:{
          fullName:{
            surname: staffDTO?.userProfile?.fullName?.surname || staff.userProfile.fullName.surname,
            firstName: staffDTO?.userProfile?.fullName?.firstName || staff.userProfile.fullName.firstName,
            middleName: staffDTO?.userProfile?.fullName?.middleName || staff.userProfile.fullName.middleName
          },
          gender: staffDTO?.userProfile?.gender || staff.userProfile.gender,
          contact: staffDTO?.userProfile?.contact || staff.userProfile.contact,
          email: staffDTO?.userProfile?.email || staff.userProfile.email,
          password: staffDTO?.userProfile?.email || staff.userProfile.password,
          picture:  staff.userProfile.picture,

        }
      
      },{new:true});

      if(!updatedStaff){
          throw new BadRequestException("An Error occured while updating",ErrorCode.INTERNAL_SERVER_ERROR);
      }
      
      return {
        message: "User details updated successful"
      }

  }

    public async deleteStaff(id: String): Promise<String> {
      const deletedStaff = await StaffModel.findByIdAndDelete({ _id: id });
     
      if (!deletedStaff){
        throw new BadRequestException("User does not exist",ErrorCode.AUTH_USER_NOT_FOUND);
      }

      return `${deletedStaff.userProfile.fullName.surname} account deleted successful`;
    }

  // public async verifyVendorAccount(verifyDto:accountVerifyDTO){

  //     const vendor = await VendorModel.findOne({_id:verifyDto.userId})

  //     if (!vendor){
  //         throw new BadRequestException("Vendor does not exit")
  //     }

  //     vendor.status = accountStatus.ACTIVE

  //     vendor.save();

  //     // send an email to the vendor
  // }
  // public async verifyT3PlAccount(verifyDto:accountVerifyDTO){

  //     const vendor = await T3PLModel.findOne({_id:verifyDto.userId})

  //     if (!vendor){
  //         throw new BadRequestException("3PL does not exit")
  //     }

  //     vendor.status = accountStatus.ACTIVE

  //     vendor.save();

  //     // send an email to the vendor
  // }

  // public async verifyAdminDispatcherAccount(verifyDto:accountVerifyDTO){

  //     const vendor = await AdminDispatcherModel.findOne({_id:verifyDto.userId})

  //     if (!vendor){
  //         throw new BadRequestException("user does not exit")
  //     }

  //     vendor.status = accountStatus.ACTIVE

  //     vendor.save();

  //     // send an email to the vendor
  // }
}
