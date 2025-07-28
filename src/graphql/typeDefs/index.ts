import { mergeTypeDefs } from "@graphql-tools/merge";
import { generalTypeDefs } from "./auth/general.ts";
import { typeDefs as scalarTypeDefs } from "graphql-scalars";
import { staffTypeDefs } from "./auth/staff.ts";
import { vendorTypeDefs } from "./auth/vendor.ts";
import { generalOrderTypeDef } from "./order/general.ts";
import { riderTypeDefs } from "./auth/rider.ts";

export const mergedTypeDefs = mergeTypeDefs([
  scalarTypeDefs,
  generalTypeDefs,
  staffTypeDefs,
 vendorTypeDefs,
 riderTypeDefs,
 generalOrderTypeDef
]);
