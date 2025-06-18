
import express, {Request, Response, urlencoded} from "express";

import { appConfig } from "./rest-api/config/app.config.ts";
import { authRoute } from "./rest-api/routes/authRoutes.ts";
import { orderRoute } from "./rest-api/routes/orderRoutes.ts";
import { errorHandler } from "./rest-api/middleware/errorHandler.ts";
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import cors from 'cors';
import http from 'http';
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import swaggerDocs from "./rest-api/swaggerIntegration/swagger.ts";
import { mergedTypeDefs } from "./graphql/typeDefs/index.ts";
import { mergedResolvers } from "./graphql/resolvers/index.ts";
import connectDatabase from "./database/dbConnect.ts";
import cookieParser from "cookie-parser"
import env from "dotenv";
env.config();


const app = express();

// app.use(cors({
//   origin: appConfig.APP_URI,
//   optionsSuccessStatus: 200,
//   credentials:true 
// }))
app.use(express.json())
app.use(urlencoded({extended:true}));
app.use(cookieParser())



const httpServer = http.createServer(app);


app.get("/", (req:Request, res: Response)=>{
    res.send("Hello");
})

interface MyContext {
  token?: String;
}


const server = new ApolloServer<MyContext>({
  typeDefs:mergedTypeDefs,
  resolvers:mergedResolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
});

await server.start();

app.use(
  '/graphql',
  cors<cors.CorsRequest>(),
  express.json(),
  expressMiddleware(server),
);

app.use("/api/v1/auth", authRoute)

app.use("/api/v1/order", orderRoute)



app.use(errorHandler)



await new Promise<void>((resolve, reject) => {
  httpServer.listen(appConfig.PORT, () => {
    console.log(`App is running on port: ${appConfig.PORT}`);
    resolve();
  });

 httpServer.on("error", (err) => {
    console.error("Server failed to start:", err);
    reject(err);
  });
})

await connectDatabase()
  .then(() => console.log("Database is up"))
  .catch((err) => {
    console.error("Database connection failed:", err);
  });



swaggerDocs(app,Number.parseInt(appConfig.PORT))

// app.listen(appConfig.PORT,async ()=>{
//     console.log(`listening on port `)
//     await connectDatabase();
//     swaggerDocs(app,Number.parseInt(appConfig.PORT))
// })









    // "dev": "ts-node-dev --poll --respawn --transpile-only --prefer-ts-exts src/index.ts",
