import mongoose, { Number } from "mongoose";

import { ErrorCode } from "../../enum/errorCode.ts";
import {
  BadRequestException,
  UnauthorizedException,
} from "../../utils/catch-error.ts";
// import T3PLModel from "../database/models/3PLModel";

import StaffModel from "../../../database/models/auth/staffs.Model.ts";

import {
  forgotPasswordDTO,
  loginDTO,
  PermsissionType,
  RoleDTO,
  RoleType,
  SessionType,
  UpdatePermsissionDTO,
  UpdateRoleDto,
  verifyOtpDTO,
} from "../../types/auth/generalTypes.ts";

import { vendorType } from "../../types/auth/vendor.ts";
import {
  calculateExpirationDate,
  fiveMinutesAgo,
  fiveMinutesFromNow,
  ONE_DAY_IN_MS,
  sevenDaysFromNow,
} from "../../utils/date-time.ts";

import {
  AccessTokenPayloadType,
  RefreshTokenPayloadType,
  refreshTokenSignOptions,
  signToken,
  verifyJwtToken,
} from "../../utils/auth/jwt.ts";

import SessionModel from "../../../database/models/auth/SessionModel.ts";
import { appConfig } from "../../config/app.config.ts";
import { JwtPayload } from "jsonwebtoken";
import { config } from "dotenv";
import RoleModel from "../../../database/models/auth/RoleModel.ts";
import { escapeRegex } from "../../utils/general.ts";
import { roleSchema } from "../../validators/auth/general.ts";

import PermsissionModel from "../../../database/models/auth/PermissionModel.ts";
import { IStaff } from "../../types/auth/staffs.ts";
import { Request } from "express";

import { getAuthCookies } from "../../utils/auth/cookies.ts";
import VerificationCodeType from "../../enum/verificationCode.ts";
import VerificationCodeModel from "../../../database/models/auth/verificationCodeModel.ts";
import { generateRandomNumber } from "../../utils/generateRandomNumber.ts";
import { sendForgotPasswordEmail } from "../../utils/auth/emailTemplate.ts";
import { RiderType } from "../../types/auth/rider.ts";
import VendorModel from "../../../database/models/auth/vendorModel.ts";
import { accountStatus } from "../../enum/general.ts";
import { T3PLType } from "../../types/auth/3pl.ts";
import T3PLModel from "../../../database/models/auth/3PLModel.ts";
import RiderModel from "../../../database/models/auth/RiderModel.ts";

export class GeneralAuthService {
  public async createPermssion(permission: PermsissionType) {
    const permissionExist = await PermsissionModel.findOne({
      name: {
        $regex: new RegExp(`^${escapeRegex(permission.name.trim())}$`, "i"),
      },
    });

    if (permissionExist) {
      throw new BadRequestException(
        "Permission name already exits",
        ErrorCode.PERMISSION_ALREADY_EXIST
      );
    }

    const newPermision = await PermsissionModel.create(permission);

    return {
      newPermision,
    };
  }

  public async updatePermission(permission: UpdatePermsissionDTO) {
    const permissionExist = await PermsissionModel.findById({
      _id: permission.id,
    });

    if (!permissionExist) {
      throw new BadRequestException(
        "Permission does not exits",
        ErrorCode.PERMISSION_ALREADY_EXIST
      );
    }

    if (permissionExist && permission.name) {
      permissionExist.name = permission.name;
    }

    if (permissionExist && permission.description) {
      permissionExist.description = permission.description;
    }

    permissionExist && (await permissionExist.save());

    return {
      message: "permission updated successful",
    };
  }

  public async deletePermission(id: String): Promise<String> {
    const isPermissionUsed = await RoleModel.find()
      .populate({
        path: "permissions",
        match: { _id: { $eq: id } },
      })
      .exec();

    if (isPermissionUsed) {
      const permissionUsedBy = isPermissionUsed.map((p) => p.name);

      throw new BadRequestException(
        `Permission is attached to the following role(s): ${permissionUsedBy.join(
          ", "
        )}. Please detach the permission from these role(s) and try again.`,
        ErrorCode.PERMISSION_IN_USE
      );
    }
    const deletedPermission = await PermsissionModel.findByIdAndDelete({
      _id: id,
    });

    if (!deletedPermission) {
      throw new BadRequestException(
        "Permission does not exist",
        ErrorCode.PERMISSION_NOT_FOUND
      );
    }

    return "Permission deleted successful";
  }

  public async createRole(role: RoleDTO) {
    const roleExit = await RoleModel.findOne({
      name: { $regex: new RegExp(`^${escapeRegex(role.name.trim())}$`, "i") },
    });

    if (roleExit) {
      throw new BadRequestException(
        "Role name already exits",
        ErrorCode.ROLE_ALREADY_EXIST
      );
    }

    const newRole = await RoleModel.create(role);

    return {
      newRole,
    };
  }

  public async updateRole(role: UpdateRoleDto) {
    const roleExist = await RoleModel.findById({ _id: role.id });

    if (!roleExist) {
      throw new BadRequestException(
        "Role does not exits",
        ErrorCode.ROLE_NOT_FOUND
      );
    }

    if (roleExist && role?.name) {
      roleExist.name = role.name;
    }

    if (roleExist && role?.description) {
      roleExist.description = role.description;
    }

    if (roleExist && role?.permissions) {
      roleExist.permissions =
        role.permissions as unknown as mongoose.Types.ObjectId[];
    }

    roleExist && (await roleExist.save());

    return {
      message: "role updated successful",
    };
  }

  public async deleteRole(id: String): Promise<String> {
    const isRoleUsed = await RoleModel.findById(id)
      .populate({ path: "assignTo", select: "userProfile.fullName" })
      .lean()
      .exec();

    if (isRoleUsed?.assignTo && isRoleUsed?.assignTo?.length !== 0) {
      throw new BadRequestException(
        `Role is in use`,
        ErrorCode.PERMISSION_IN_USE
      );
    }
    const deletedRole = await RoleModel.findByIdAndDelete({ _id: id });

    if (!deletedRole) {
      throw new BadRequestException(
        "Role does not exist",
        ErrorCode.ROLE_NOT_FOUND
      );
    }
    return "Role deleted successful";
  }

  public async login(loginDTo: loginDTO) {
    const { email, password, userAgent, role } = loginDTo;

    let user: IStaff | vendorType | T3PLType| RiderType |null = null;

    let viewAbleTabs: String[] = [];
    
    if (role == "STAFF") {
      user = (await StaffModel.findOne({
        "userProfile.email": email,
      })
        .populate({ path: "role", populate: { path: "permissions" } })
        .exec()) as IStaff;

      const roles = user?.role as RoleType;
      const permissions = roles?.permissions as unknown as PermsissionType[];
      viewAbleTabs = permissions?.map((perm) => {
        return perm?.name;
      });
    } else if (role == "VENDOR") {
      user = (await VendorModel.findOne({
        "contactDetails.email": email,
      })) as vendorType;
    }else if (role === "T3PL"){
      user = (await T3PLModel.findOne({
         "contactDetails.email": email,
      })) as T3PLType;
    }else if (role === "RIDER"){
      user = ( await RiderModel.findOne({
        "contactDetails.email": email
      }) 
      )as RiderType
    }
    // else{
    //     user = await T3PLModel.findOne({
    //         "userProfile.contactDetails.email":email
    //     }) as T3PLTypes
    // }

    if (!user) {
      throw new BadRequestException(
        "Invalid email or password",
        ErrorCode.AUTH_USER_NOT_FOUND
      );
    }

    // if (user instanceof T3PLModel || user instanceof VendorModel) {
    //   if (user.status == accountStatus.INACTIVE) {
    //     throw new UnauthorizedException(
    //       "Sorry your account is not actived, contact the adminstrator for help"
    //     );
    //   }
    // }

    const isPassword = await user.comparePassword(password);

    if (!isPassword) {
      throw new BadRequestException(
        "Invalid email or password",
        ErrorCode.AUTH_USER_NOT_FOUND
      );
    }

    // check whether account has been verified

    // if (user.preference.enable2FA == true){
    //     // send a verification code to user
    // }

    if (role == "VENDOR") {
      const _user = user as vendorType;

      if (_user.status !== accountStatus.APPROVED) {
        throw new BadRequestException(
          "Wait for throttle to approve your registration"
        );
      }

      viewAbleTabs = ["Vendor","View Orders", "Add Order", "Cash on Delivery"];
    }
     if (role == "T3PL") {
      const _user = user as T3PLType;

      if (_user.status !== accountStatus.APPROVED) {
        throw new BadRequestException(
          "Wait for throttle to approve your registration"
        );
      }

      viewAbleTabs = ["T3PL","View Orders",  "Cash on Delivery"];
    }
    if (role == "RIDER") {
      const _user = user as RiderType;

      if (_user.status !== accountStatus.APPROVED) {
        throw new BadRequestException(
          "Wait for throttle to approve your registration"
        );
      }

      viewAbleTabs = ["RIDER","View Orders",  "Cash on Delivery"];
    }

    let session
    if (role == "STAFF") {
       session = await SessionModel.create({
        userId: user._id,
        userAgent: userAgent,
        roleId: user.role,
        UserType: role,
      });
    } else {
      session = await SessionModel.create({
        userId: user._id,
        userAgent: userAgent,
        UserType: role,
      });
    }


    const accessToken = signToken({
      userId: user._id,
      sessionId: session._id,
      roleId: role == "STAFF" ? user.role : "",
      UserType: role,
    } as AccessTokenPayloadType);

    const refreshToken = signToken(
      { sessionId: session._id } as RefreshTokenPayloadType,
      refreshTokenSignOptions
    );

    return {
      viewAbleTabs,
      user: user,
      accessToken,
      refreshToken,
    };
  }

  public async refreshToken(refreshToken: string) {
    const { payload } = verifyJwtToken<RefreshTokenPayloadType>(refreshToken, {
      secret: appConfig.JWT_REFRESH_SECRET,
    }) as JwtPayload;

    if (!payload) {
      throw new UnauthorizedException(
        "Token expired, Please relogin!!!",
        ErrorCode.EXPIRED_REFRESH_TOKEN
      );
      // "Invalid refresh token"
    }

    const session = await SessionModel.findById(payload?.sessionId);

    if (!session) {
      throw new UnauthorizedException(
        "Token expired, Please relogin!!!",
        ErrorCode.EXPIRED_REFRESH_TOKEN
      );
      // "Session does not exist"
    }

    const now = Date.now();

    if (session.expiredAt.getTime() < now) {
      throw new UnauthorizedException(
        "Token expired, Please relogin!!!",
        ErrorCode.EXPIRED_REFRESH_TOKEN
      );
      // "Session expired"
    }

    const sessionRequiredRefresh =
      session.expiredAt.getTime() - now <= ONE_DAY_IN_MS;

    if (sessionRequiredRefresh) {
      session.expiredAt = sevenDaysFromNow();
      await session.save();
    }

    const newRefreshToken = sessionRequiredRefresh
      ? signToken(
          { sessionId: session._id } as RefreshTokenPayloadType,
          refreshTokenSignOptions
        )
      : refreshToken;

    const accessToken = signToken({
      userId: session.userId,
      roleId: session?.roleId,
      sessionId: session._id,
      UserType: session.UserType,
    } as AccessTokenPayloadType);

    return {
      accessToken,
      newRefreshToken,
    };
  }

  public async logout(req: Request) {
    const { accessToken, refreshToken } = getAuthCookies(req);

    const { payload } = verifyJwtToken(accessToken || "");

    if (payload) {
      await SessionModel.findByIdAndDelete(payload.sessionId);
    }
  }

  public async forgotPassword(forgotPasswordDTO: forgotPasswordDTO) {
    const { email, role } = forgotPasswordDTO;

    let user: IStaff | vendorType | null = null;

    if (role == "STAFF") {
      user = (await StaffModel.findOne({
        "userProfile.email": email,
      })) as IStaff;
    }

    if (!user) {
      return "Check your email now—your OTP will expire soon!";
    }

    const fiveMinAgo = fiveMinutesAgo();

    const count = await VerificationCodeModel.countDocuments({
      userId: user._id,
      type: VerificationCodeType.PasswordReset,
      createdAt: { $gt: fiveMinAgo },
    });

    if (count >= 1) {
      throw new BadRequestException(
        "Too many requests, please try again later",
        ErrorCode.ABUSE
      );
    }

    const code = generateRandomNumber();
    const verificationCode = await VerificationCodeModel.create({
      userId: user._id,
      type: VerificationCodeType.PasswordReset,
      expiresAt: fiveMinutesFromNow(),
      verificationCodeNumber: code,
    });

    const { error } = await sendForgotPasswordEmail({
      sender: "motteyamos770@gmail.com",
      recipientEmail: user.userProfile.email,
      recipientName: `${user.userProfile.fullName.surname} `,
      code,
    });

    if (error) {
      throw new BadRequestException(
        "An error occurred while sending the email",
        ErrorCode.INTERNAL_SERVER_ERROR
      );
    }

    return "Check your email now—your OTP will expire soon!";
  }

  public async verifyOTP(verifyOtpDTO: verifyOtpDTO) {
    const { email, role, otpCode, password, userAgent } = verifyOtpDTO;

    let user: IStaff | null = null;

    if (role == "STAFF") {
      user = (await StaffModel.findOne({
        "userProfile.email": email,
      })) as IStaff;
    }

    if (!user) {
      throw new BadRequestException("Invalid OTP Code");
    }

    if (user.auditingAndConfirmation.numberOfOtpVerificationTry > 4) {
      if (role == "STAFF") {
        user.auditingAndConfirmation.numberOfOtpVerificationTry = 0;
        await user.save();
      }

      throw new BadRequestException(
        "Oops! That was too many tries. Click 'Resend' to get a new code"
      );
    }

    const validCode = await VerificationCodeModel.findOne({
      userId: user._id,
      type: VerificationCodeType.PasswordReset,
      expiresAt: { $gt: new Date() },
      verificationCodeNumber: otpCode,
    });

    if (!validCode) {
      if (role == "STAFF") {
        user.auditingAndConfirmation.numberOfOtpVerificationTry =
          user.auditingAndConfirmation.numberOfOtpVerificationTry + 1;
        await user.save();
      }
      throw new BadRequestException("Invalid OTP Code");
    }

    if (role == "STAFF") {
      user.userProfile.password = password;
    }

    await user.save();

    await VerificationCodeModel.deleteMany({
      userId: user._id,
      type: VerificationCodeType.PasswordReset,
    });

    await SessionModel.deleteMany({
      userId: user._id,
    });

    const session = await SessionModel.create({
      userId: user._id,
      userAgent: userAgent,
      roleId: user.role,
    });

    const accessToken = signToken({
      userId: user._id,
      sessionId: session._id,
      roleId: user.role,
    } as AccessTokenPayloadType);

    const refreshToken = signToken(
      { sessionId: session._id } as RefreshTokenPayloadType,
      refreshTokenSignOptions
    );

    return {
      message: "Password updated successful",
      user,
      accessToken,
      refreshToken,
    };
  }

  //   public async handleEmailEvent(result:any){
  //         //  handle email event for instance * recipient email not valid
  //         // when there is time do work on it

  //   }
}
