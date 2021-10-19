import express from "express"
import uniqid from "uniqid"
import fs from "fs" 
import { fileURLToPath } from "url" 
import { dirname, join } from "path" 

const authorsRouter = express.Router()

const currentFilePath = fileURLToPath(import.meta.url)
const parentFolder = dirname(currentFilePath)
const authorsJSONPath = join(parentFolder, "authors.json")


/*Authors should have the following information:

 

name
surname
ID (Unique and server-generated)
email
date of birth
avatar (e.g. https://ui-avatars.com/api/?name=John+Doe)
 

The backend should include the following routes:

 

GET /authors => returns the list of authors
GET /authors/123 => returns a single author
PUT /authors/123 => edit the author with the given id
DELETE /authors/123 => delete the author with the given id */



//GET /authors => returns the list of authors


authorsRouter.get("/",  (req, res) => {
    console.log(req.body)

    const arrayOfAuthors = JSON.parse(fs.readFileSync(authorsJSONPath))

    console.log(arrayOfAuthors)

    res.send(arrayOfAuthors)
})

//POST /authors => create a new author
authorsRouter.post("/", (req, res) => {
    console.log(req.body)
  
    const newAuthor = { ...req.body, createdAt: new Date(), id: uniqid() }
    console.log(newAuthor)
    const authorsRewrite = JSON.parse(fs.readFileSync(authorsJSONPath))
    authorsRewrite.push(newAuthor)
  

    fs.writeFileSync(authorsJSONPath, JSON.stringify(authorsRewrite))
    res.status(201).send({ id: newAuthor.id })
  })



export default authorsRouter