import { mergeResolvers } from "@graphql-tools/merge";
import { IResolvers } from "@graphql-tools/utils";
import { generalResolves } from "./auth/general.ts";
import { resolvers as scalarResolvers } from "graphql-scalars";
import { staffResolves } from "./auth/staff.ts";
import { vendorResolves } from "./auth/vendor.ts";
import { orderResolvers } from "./order/general.ts";
import { riderResolvers } from "./auth/rider.ts";

export const mergedResolvers: IResolvers = mergeResolvers([
  scalarResolvers,
  generalResolves,
  staffResolves,
  vendorResolves,
  riderResolvers,
  orderResolvers
]);
