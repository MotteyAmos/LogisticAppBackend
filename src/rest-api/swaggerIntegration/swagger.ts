import { Express, Request, Response } from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
const { version } = await import('../../../package.json');

const options: swaggerJsdoc.Operation = {
    definition:{
        openapi:"3.0.0",
        info: {
            title: "Throttle",
            version
        },
        components:{
            securitySchemas:{
                bearerAuth:{
                    type:"http",
                    schema:"bearer",
                    bearerFormat:"JWT"
                }
            }
        },
        security:[
            {
                bearerAuth:[]
            }
        ]
    },
    apis:["./src/swaggerIntegration/*.yaml"]
}

const swaggerSpec = swaggerJsdoc(options)

function swaggerDocs(app:Express, port:number){
 
    // Swagger page
    app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    //Docs in JSON format
    app.get("docs.json",(req:Request,res:Response)=>{
        res.setHeader("Content-Type","application/json")
        res.send(swaggerSpec)

    })

}


export default swaggerDocs;


