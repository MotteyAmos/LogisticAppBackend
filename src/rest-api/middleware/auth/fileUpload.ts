import multer from "multer";
import { Request, Response } from "express";
import { BadRequestException } from "../../utils/catch-error";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import sharp from "sharp";
import { appConfig } from "../../config/app.config";

const S3 = new S3Client({
  credentials: {
    secretAccessKey: appConfig.AWS_SECRET_ACCESS_KEY,
    accessKeyId: appConfig.AWS_ACCESS_KEY,
  },
  region: appConfig.S3_REGION,
});

const storage = multer.memoryStorage();

export const uploadFile = multer({
  storage,
  fileFilter: function (req, file, cb) {
    if ( file.mimetype.startsWith("image") || file.mimetype.startsWith("application/pdf")) {
      cb(null, true);
    } else {
      !req.invalidFiles
        ? (req.invalidFiles = [file.fieldname])
        : req.invalidFiles.push(file.fieldname);
      cb(
        new BadRequestException(
          `Unsupported file format under the field ${file.fieldname}`
        )
      );
    }
  },
  limits:{
     fileSize: 1 * 1024 * 1024
  }
});

export const riderFilefields = [
  { name: "driverLicense", maxCount: 1 },
  { name: "nationalIdentification", maxCount: 1 },
];

export const storeRiderFileToS3 = async (
  riderId: String,
  req: Request
): Promise<{ driverLicense: String; nationalIdentification: String }> => {
  const filesUrl = {
    driverLicense: "",
    nationalIdentification: "",
  };

  if (req.invalidFiles) {
    const moreT2 = req.invalidFiles.length > 1;
    if (!moreT2) {
      throw new BadRequestException(
        `File you uploaded under the field ${req.invalidFiles[0]} is not supported. Please provide an image or pdf`
      );
    } else {
      throw new BadRequestException(
        `Files you uploaded under the fields ${req.invalidFiles.join(", ")} are not supported. Please provide an image or pdf `
      );
    }
  }

  const files = req.files as {
    [fieldname: string]: Express.Multer.File[];
  };

  if (files.driverLicense && files.driverLicense[0]) {
    const dlFile = files.driverLicense[0];

    const fileKey = `ridersDocs/${riderId}-${dlFile.originalname}`;

    const params = {
      Bucket: appConfig.S3_NAME,
      Key: fileKey,
      Body: dlFile.buffer,
      ContentType: dlFile.mimetype,
    };
    filesUrl.driverLicense = `https://${appConfig.S3_NAME}.s3.${appConfig.S3_REGION}.amazonaws.com/${fileKey}`;

    const command = new PutObjectCommand(params);

    S3.send(command);
  }

  if (files.nationalIdentification && files.nationalIdentification[0]) {
    const nidFile = files.nationalIdentification[0];

    const fileKey = `ridersDocs/${riderId}-${nidFile.originalname}`;

    const params = {
      Bucket: appConfig.S3_NAME,
      Key: fileKey,
      Body: nidFile.buffer,
      ContentType: nidFile.mimetype,
    };

    filesUrl.nationalIdentification = `https://${appConfig.S3_NAME}.s3.${appConfig.S3_REGION}.amazonaws.com/${fileKey}`;

    const command = new PutObjectCommand(params);

    S3.send(command);
  }

  return filesUrl;
};

export const VendorUploadFile = multer({
  storage,
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      req.invalidFiles = [file.fieldname];
      cb(
        new BadRequestException(
          `Unsupported file format under the field ${file.fieldname}`
        )
      );
    }
  },
   limits:{
    fileSize: 1 * 1024 * 1024
  }
});

export const storeVendorFileToS3 = async (
  vendorId: String,
  req: Request
): Promise<String> => {
  if (req.invalidFiles) {
    throw new BadRequestException(
      `File you uploaded under the field ${req.invalidFiles[0]} is not supported. Please provide an image or pdf`
    );
  }

  const file = req.file;

  const fileKey = `vendorDoc/${vendorId}-${file?.originalname}`;

  const params = {
    Bucket: appConfig.S3_NAME,
    Key: fileKey,
    Body: file?.buffer,
    ContentType: file?.mimetype,
  };

  const command = new PutObjectCommand(params);

  S3.send(command);

  return `https://${appConfig.S3_NAME}.s3.${appConfig.S3_REGION}.amazonaws.com/${fileKey}`;
};
