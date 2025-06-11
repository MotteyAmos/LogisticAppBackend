import { mergeTypeDefs } from "@graphql-tools/merge"
import { generalTypeDefs } from "./general.ts";
import { typeDefs as scalarTypeDefs } from 'graphql-scalars';
import { staffTypeDefs } from "./staff.ts";





export const mergedTypeDefs = mergeTypeDefs([scalarTypeDefs,generalTypeDefs, staffTypeDefs ]);