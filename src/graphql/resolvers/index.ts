import { mergeResolvers } from "@graphql-tools/merge";
import { IResolvers } from "@graphql-tools/utils";
import { generalResolves } from "./general.ts";
import { resolvers as scalarResolvers } from "graphql-scalars";
import { staffResolves } from "./staff.ts";
import { vendorResolves } from "./vendor.ts";


export const mergedResolvers: IResolvers = mergeResolvers([
  scalarResolvers,
  generalResolves,
  staffResolves,
  vendorResolves
]);
