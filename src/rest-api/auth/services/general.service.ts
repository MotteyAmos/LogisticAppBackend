import mongoose from "mongoose";

import { ErrorCode } from "../../enum/errorCode.ts";
import {
  BadRequestException,
  UnauthorizedException,
} from "../../utils/catch-error.ts";
// import T3PLModel from "../database/models/3PLModel";

import StaffModel from "../../../database/models/auth/staffs.Model.ts";
import { T3PLRegistrationDTO, T3PLTypes } from "../types/3pl.ts";
import {
  loginDTO,
  PermsissionType,
  RoleDTO,
  UpdatePermsissionDTO,
  UpdateRoleDto,
} from "../types/generalTypes.ts";
import { vendorType } from "../types/vendor.ts";
import {
  calculateExpirationDate,
  ONE_DAY_IN_MS,
  sevenDaysFromNow,
} from "../../utils/date-time.ts";
import {
  AccessTokenPayloadType,
  RefreshTokenPayloadType,
  refreshTokenSignOptions,
  signToken,
  verifyJwtToken,
} from "../utils/jwt.ts";
import SessionModel from "../../../database/models/auth/SessionModel.ts";
import { appConfig } from "../../config/app.config.ts";
import { JwtPayload } from "jsonwebtoken";
import { config } from "dotenv";
import RoleModel from "../../../database/models/auth/RoleModel.ts";
import { escapeRegex } from "../../utils/general.ts";
import { roleSchema } from "../validators/general.ts";
import PermsissionModel from "../../../database/models/auth/PermissionModel.ts";

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
      }).exec();

    if (isPermissionUsed) {
        const permissionUsedBy = isPermissionUsed.map((p)=> p.name)

      throw new BadRequestException(
        `Permission is attached to the following role(s): ${permissionUsedBy.join(", ")}. Please detach the permission from these role(s) and try again.`,
        ErrorCode.PERMISSION_IN_USE
      );
    }
    const deletedPermission = await PermsissionModel.findByIdAndDelete({
      _id: id,
    });

     
      if (!deletedPermission){
        throw new BadRequestException("Permission does not exist",ErrorCode.PERMISSION_NOT_FOUND);
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

    if (roleExist && role.name) {
      roleExist.name = role.name;
    }

    if (roleExist && role.permissions) {
      roleExist.permissions =
        role.permissions as unknown as mongoose.Types.ObjectId[];
    }

    roleExist && (await roleExist.save());

    return {
      message: "role updated successful",
    };
  }

  public async deleteRole(id: String): Promise<String> {
    const isRoleUsed = await StaffModel.find()
      .populate({
        path: "role",
        match: { _id: { $eq: id } },
      }).exec();

       if (isRoleUsed) {
        const roleUsedBy = isRoleUsed.map((p)=> p.userProfile.fullName.surname)

      throw new BadRequestException(
        `Role is attached to the following staff(s): ${roleUsedBy.join(", ")}. Please detach the role from these staff(s) and try again.`,
        ErrorCode.PERMISSION_IN_USE
      );
    }
    const deletedRole = await RoleModel.findByIdAndDelete({ _id: id });

    if (!deletedRole){
        throw new BadRequestException("Role does not exist",ErrorCode.ROLE_NOT_FOUND);
      }
    return "Role deleted successful";
  }

  // public async login(loginDTo: loginDTO){
  //     const {email, password, userAgent, role} = loginDTo;

  //     let user: T3PLTypes | adminTypes | vendorType

  //     if ([Role.ADMIN ,Role.DISPATCHER,].includes(role)){

  //         user = await AdminDispatcherModel.findOne({
  //             "userProfile.contactDetails.email":email
  //         }) as  adminTypes
  //     }else if (role == Role.VENDOR){

  //         user = await VendorModel.findOne({
  //             "userProfile.contactDetails.email":email
  //         }) as vendorType

  //     }else{
  //         user = await T3PLModel.findOne({
  //             "userProfile.contactDetails.email":email
  //         }) as T3PLTypes
  //     }

  //     if (!user){

  //         throw new BadRequestException("Invalid email or password", ErrorCode.AUTH_USER_NOT_FOUND);
  //     }

  //     if (user instanceof T3PLModel || user instanceof VendorModel){
  //         if (user.status == accountStatus.INACTIVE ){
  //         throw new UnauthorizedException("Sorry your account is not actived, contact the adminstrator for help")
  //         }
  //     }

  //     const isPassword = await user.comparePassword(password);

  //     if (!isPassword){

  //         throw new BadRequestException("Invalid email or password", ErrorCode.AUTH_USER_NOT_FOUND);
  //     }

  //     // check whether account has been verified

  //     // if (user.preference.enable2FA == true){
  //     //     // send a verification code to user
  //     // }

  //     const session = await SessionModel.create({
  //         userId: user._id,
  //         userAgent: userAgent,
  //         userRole: user.role
  //     })

  //     const accessToken = signToken({userId:user._id , sessionId:session._id, role:user.role} as AccessTokenPayloadType)
  //     const refreshToken = signToken({sessionId:session._id} as RefreshTokenPayloadType, refreshTokenSignOptions)

  //     return {
  //         user:user,
  //         accessToken,
  //         refreshToken
  //     }

  // }

  // public async refreshToken(refreshToken:string){
  //     const {payload} = verifyJwtToken<RefreshTokenPayloadType>(refreshToken,{
  //         secret:appConfig.JWT_REFRESH_SECRET
  //     }) as JwtPayload

  //     if (!payload){
  //         throw new UnauthorizedException("Invalid refresh token");
  //     }

  //     const session = await SessionModel.findById(payload?.sessionId);

  //     if (!session){
  //         throw new UnauthorizedException("Session does not exist");
  //     }

  //     const now = Date.now();

  //     if (session.expiredAt.getTime() <= now){
  //         throw new UnauthorizedException("Session expired")
  //     }

  //     const sessionRequiredRefresh = session.expiredAt.getTime() - now <= ONE_DAY_IN_MS;

  //     if (sessionRequiredRefresh){
  //         session.expiredAt = calculateExpirationDate(appConfig.JWT_REFRESH_EXPIRES_IN);
  //         await session.save();
  //     }

  //     const newRefreshToken = sessionRequiredRefresh ? signToken({sessionId:session._id} as RefreshTokenPayloadType,refreshTokenSignOptions):undefined;

  //     const accessToken = signToken({sessionId:session._id , userId:session.userId, role:session.userRole} as AccessTokenPayloadType)

  //     return {
  //         accessToken,
  //         newRefreshToken
  //     }

  // }
}
