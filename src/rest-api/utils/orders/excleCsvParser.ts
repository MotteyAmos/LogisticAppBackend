import fs,{ PathLike } from "fs";
import { IAddOrder } from "../../types/orders/general";
import {parse} from "csv-parse";
import xlsx from "xlsx";
import { BadRequestException, HttpException } from "../catch-error";
import { OrderSource, orderStatus } from "../../enum/orders";
import { AppError } from "../AppError";
import { Request } from "express";
import { getPayloadFromAccessToken } from "../auth/cookies";
interface ICSVError {
  row: number;
  message: string;
  raw?: string;
}


export async function parseCSV(filePath: PathLike, req:Request): Promise<{ orders: IAddOrder[]; errors: ICSVError[] }> {
  const orders: IAddOrder[] = [];
  const errors: ICSVError[] = [];
  let rowCount = 0;


  return new Promise((resolve, reject) => {
    const stream = fs.createReadStream(filePath)
      .pipe(parse({
        columns: true,
        skip_empty_lines: true,
        relax_column_count: true,
        trim: true,
        onRecord: (record, {lines}) => {
          // This callback lets us handle each record with context
          rowCount = lines; // Track current line number
          return record;
        }
      }));


    stream
      .on('data', (row: IAddOrder) => {
        try {
        let errorRowCount =0;
          // Validate required fields
          if (!row.destination) {
            throw new BadRequestException(`Order destination is required `)
          }
          if (!row.recipientName) {
            throw new BadRequestException(`Recipient name is required `)

          }
          if (!row.recipientNumber) {
              throw new BadRequestException(`Recipient phone number is required  `);
          }
          
          if (!row.paymentAmount) {
              throw new BadRequestException(`Payment amount is required `);
          }

          if(!row.productDescription){
              throw new BadRequestException(`order description is required `);

          }

         
          row["source"]= { type: OrderSource.SELF}
          row["status"] = orderStatus.ORDER_PLACED

          // // Transform/validate data types
          // if (row.lat && row.lng) {
          //   row.location = {
          //     lat: Number(row.lat),
          //     lng: Number(row.lng)
          //   };
          //   if (isNaN(row.location.lat) || isNaN(row.location.lng)) {
          //     throw new Error('Invalid location coordinates');
          //   }
          // }
            errorRowCount +=1;
          orders.push({...row,  recipientNumber: `0${row.recipientNumber}`,});
        } catch (error) {
          errors.push({
            row: rowCount,
            message: error instanceof Error ? error.message : String(error),
            raw: JSON.stringify(row)
          });
        }
      })
      .on('error', (error) => {
        // Handle stream errors (file reading, parsing errors)
        errors.push({
          row: rowCount,
          message: error.message
        });
        reject({ orders, errors });
      })
      .on('end', () => {
        fs.unlinkSync(filePath);
        resolve({ orders, errors });
      });
  });
}

interface IParseResult {
  orders: IAddOrder[];
  errors: {
    row: number;
    message: string;
    rawData?: any;
  }[];
}



export function parseExcel(filePath: string): IParseResult {
  const result: IParseResult = {
    orders: [],
    errors: [],
  };

  try {
    // 1. Read Excel file
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // 2. Convert to JSON with row numbers
    const rawData: any[][] = xlsx.utils.sheet_to_json(sheet, {
      header: 1,
      defval: null,
    });

    if (!rawData.length) {
      throw new BadRequestException('Excel file is empty');
    }

    // 3. Get headers and trim whitespace
    const headers = rawData[0].map((header: any) =>
      typeof header === 'string' ? header.trim() : header
    );

    // 4. Process each row
    for (let i = 1; i < rawData.length; i++) {
      const row = rawData[i];

      // Skip empty rows
      if (row.every((cell) => cell === null || cell === undefined)) {
        continue;
      }

      const rowData: any = {};
      const rowErrors: string[] = [];
      let isValid = true;

      // Map headers to row values
      headers.forEach((header, index) => {
        if (typeof header === 'string') {
          rowData[header] = row[index];
        }
      });

      // Validate required fields
      if (!rowData.destination) {
        isValid = false;
        rowErrors.push('Destination is required');
      }

      if (!rowData.recipientName) {
        isValid = false;
        rowErrors.push('Recipient name is required');
      }

      if (!rowData.recipientNumber) {
        isValid = false;
        rowErrors.push('Recipient phone number is required');
      }

      if (!rowData.paymentAmount) {
        isValid = false;
        rowErrors.push('Payment amount is required');
      }

      // Validate location (optional)
      if ((rowData.lat || rowData.lng) &&
        (isNaN(Number(rowData.lat)) || isNaN(Number(rowData.lng)))
      ) {
        isValid = false;
        rowErrors.push('Invalid latitude or longitude');
      }

      // Validate source_type (optional)
      if (rowData.source_type && !['SELF', 'VENDOR'].includes(rowData.source_type)) {
        isValid = false;
        rowErrors.push('Invalid source type (must be SELF or VENDOR)');
      }

      // Add valid orders or record errors
      if (isValid) {
        const order: IAddOrder = {
          destination: rowData.destination,
          recipientName: rowData.recipientName,
          recipientNumber: `0${rowData.recipientNumber}`,
          paymentAmount: rowData.paymentAmount,
          source: {
            type: rowData.source_type || 'SELF',
          },
          status: orderStatus.ORDER_PLACED
        };

        if (rowData.productDescription) order.productDescription = rowData.productDescription;
        if (rowData.deliveryFee) order.deliveryFee = rowData.deliveryFee;
        if (rowData.productImage) order.productImage = rowData.productImage;
        if (rowData.lat && rowData.lng) {
          order.location = {
            lat: Number(rowData.lat),
            lng: Number(rowData.lng),
          };
        }

        result.orders.push(order);
      } else {
        result.errors.push({
          row: i + 1,
          message: rowErrors.join('; '),
          rawData: rowData,
        });
      }
    }

    return result;
  } catch (error) {
    result.errors.push({
      row: 0,
      message: error instanceof Error ? error.message : 'Unknown error occurred',
      rawData: null,
    });
    return result;
  } finally {
    // Cleanup file
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (cleanupError) {
      console.error('File cleanup error:', cleanupError);
      // Do not throw here to avoid overriding parsing errors
    }
  }
}



