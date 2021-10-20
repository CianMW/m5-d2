import express from "express"
import listEndpoints from "express-list-endpoints"
import authorsRouter from "./services/authors/index.js"
import postsRouter from "./services/posts/index.js"
import createHttpError from "http-errors"
import cors from "cors"
const server = express()


server.use(cors("*"))
server.use(express.json())




server.use("/authors", authorsRouter) 
server.use("/posts", postsRouter) 

const port = 3001

console.table(listEndpoints(server))

server.listen(port, () => {
  console.log("Server running on port:", port)
})