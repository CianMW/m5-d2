import express from "express"
import listEndpoints from "express-list-endpoints"
import authorsRouter from "./services/authors/index.js"
import postsRouter from "./services/posts/index.js"
import createHttpError from "http-errors"
import cors from "cors"
import {badRequestHandler, unauthorizedHandler, notFoundHandler, genericErrorHandler} from "./errorHandlers.js"
import filesRouter from "./services/files/index.js"
import { join } from "path"
const server = express()

//-------------------MIDDLEWARES-----------------
server.use(cors("*"))
server.use(express.json())

const publicFolderPath = join(process.cwd(), "public")


server.use(express.static(publicFolderPath))
server.use("/authors", authorsRouter) 
server.use("/posts", postsRouter) 
server.use("/files", filesRouter) 



//------------------------------- Error Handlers ----------------------------

server.use(badRequestHandler)
server.use(unauthorizedHandler)
server.use(notFoundHandler)
server.use(genericErrorHandler)

const port = 3001

console.table(listEndpoints(server))

server.listen(port, () => {
  console.log("Server running on port:", port)
})