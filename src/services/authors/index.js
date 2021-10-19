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
    const avatar = `https://ui-avatars.com/api/?name=${req.body.name}+${req.body.surname}`
  
    const newAuthor = { ...req.body, id: uniqid() , avatar: avatar}
    console.log(newAuthor)
    const authorsRewrite = JSON.parse(fs.readFileSync(authorsJSONPath))
    const emailCheck =  authorsRewrite.find(author => author.email === req.body.email)

   if (emailCheck === "undefined"){ authorsRewrite.push(newAuthor)
    fs.writeFileSync(authorsJSONPath, JSON.stringify(authorsRewrite))
    res.status(201).send({ id: newAuthor.id }) 
    } else { (res.status(406).send({response :"invalid : email already exists"}))}

  })

  //GET /authors/123 => returns a single author
  authorsRouter.get("/:id", (req, res) =>{

    const arrayOfAuthors = JSON.parse(fs.readFileSync(authorsJSONPath))
    const queriedAuthor = arrayOfAuthors.find(author => author.id === req.params.id)

    res.send(queriedAuthor)

  })

  //PUT /authors/123 => edit the author with the given id
  authorsRouter.put("/:id", (req, res) =>{
    const authors = JSON.parse(fs.readFileSync(authorsJSONPath))

    const index = authors.findIndex(author => author.id === req.params.id) 

    const editedAuthor = {...authors[index], ...req.body}

    authors[index] = editedAuthor

    fs.writeFileSync(authorsJSONPath, JSON.stringify(authors))

    res.send(editedAuthor)

  })
// DELETE /authors/123 => delete the author with the given id
authorsRouter.delete("/:id", (req, res) =>{
    const authors = JSON.parse(fs.readFileSync(authorsJSONPath))
    const authorsAfterDeletion = authors.filter(author => author.id !== req.params.id) 
    console.log("THESE ARE THE AUTHORS AFTER DELETION", authorsAfterDeletion)
    
    fs.writeFileSync(authorsJSONPath, JSON.stringify(authorsAfterDeletion))
    res.status(200).send({response: "deletion complete!"})
})


export default authorsRouter