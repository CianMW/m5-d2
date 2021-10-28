import express from "express"
import listEndpoints from "express-list-endpoints"
import authorsRouter from "./services/authors/index.js"
import postsRouter from "./services/posts/index.js"
import createHttpError from "http-errors"
import cors from "cors"
import {badRequestHandler, unauthorizedHandler, notFoundHandler, genericErrorHandler} from "./errorHandlers.js"
import filesRouter from "./services/files/index.js"
import pdfRouter from "./services/article_download/pdfDownload.js"
import { join } from "path"
const server = express()


//-------------------MIDDLEWARES-----------------

    const whitelist = [process.env.FE_LOCAL_URL, process.env.FE_PROD_URL, process.env.BE_CUR_URL]
    const corsOpts = {
      origin: function (origin, next) {
        // Since CORS is a global middleware, it is going to be executed for each and every request --> we are able to "detect" the origin of each and every req from this function
        console.log("CURRENT ORIGIN: ", origin)
        if (!origin || whitelist.indexOf(origin) !== -1) {
          // If origin is in the whitelist or if the origin is undefined () --> move ahead
          next(null, true)
        } else {
          // If origin is NOT in the whitelist --> trigger a CORS error
          next(new Error("CORS ERROR"))
        }
      },
    }

    server.use(cors(corsOpts)) // You need this if you want to make the FE communicate with BE


  
server.use(express.json())

const publicFolderPath = join(process.cwd(), "public")


server.use(express.static(publicFolderPath))
server.use("/authors", authorsRouter) 
server.use("/posts", postsRouter) 
server.use("/files", filesRouter) 
server.use("/pdf", pdfRouter) 



//------------------------------- Error Handlers ----------------------------

server.use(badRequestHandler)
server.use(unauthorizedHandler)
server.use(notFoundHandler)
server.use(genericErrorHandler)

const port = 3050 //process.env.PORT

console.table(listEndpoints(server))

server.listen(port, () => {
  console.log("Server running on port:", port)
})