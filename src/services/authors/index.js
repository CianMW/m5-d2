import express from "express"
import uniqid from "uniqid"
import fs from "fs" 
import { fileURLToPath } from "url" 
import { dirname, join } from "path" 
import { getAuthors, writeAuthorsToFile, authorsReadStream  } from "../../lib/functions.js"
import json2csv from "json2csv"
import { pipeline } from "stream"
import createHttpError from "http-errors"


const authorsRouter = express.Router()


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

authorsRouter.get("/", async (req, res) => {
    console.log(req.body)

    const arrayOfAuthors = await getAuthors()

    console.log(arrayOfAuthors)

    res.send(arrayOfAuthors)
})

//POST /authors => create a new author
authorsRouter.post("/",  async (req, res, next) => {
  try{
    console.log(req.body)
    const avatar = `https://ui-avatars.com/api/?name=${req.body.name}+${req.body.surname}`
  
    const newAuthor = { ...req.body, id: uniqid() , avatar: avatar}
    console.log(newAuthor)
    const authorsRewrite = await getAuthors()

    authorsRewrite.push(newAuthor)
    await writeAuthorsToFile(authorsRewrite)
    res.status(201).send({ id: newAuthor.id }) 
  } 
  catch(error) {
    next(error)
  }

  })


  //Downloads all the authors and their info as a csv file
  authorsRouter.get("/csv", async (req, res, next) => {
    try{  
      res.setHeader("Content-Disposition", "attachment; filename=authors.csv")
      console.log(req.body)

    const arrayOfAuthors = await getAuthors()
    console.log(arrayOfAuthors)

    const source = authorsReadStream()
    const transform = new json2csv.Transform({ fields: ["name", "surname", "email", "id", "date of birth"] })
    const destination = res

    pipeline(source, transform, destination, err => {
      if (err) next(err)
    })

  }
  catch(error) {
      next(error)
    }

})
  
  //GET /authors/123 => returns a single author
  authorsRouter.get("/:id", async (req, res, next) =>{
    try{
    const arrayOfAuthors = await getAuthors()

    const queriedAuthor = arrayOfAuthors.find(author => author.id === req.params.id)
    if (queriedAuthor) {
      res.status(200).send(queriedAuthor)
    } else {
      next(createHttpError(404, "User not found"))
    }
    } catch(error) {
      next(error)
    }
  })

  //PUT /authors/123 => edit the author with the given id
  authorsRouter.put("/:id", async (req, res, next) =>{
    try{

      const authors = await getAuthors()
  
      const index = authors.findIndex(author => author.id === req.params.id) 
      if(index !== -1){
        const editedAuthor = {...authors[index], ...req.body}
    
        authors[index] = editedAuthor
        await writeAuthorsToFile(authors)
    
        res.status(200).send(editedAuthor)
      } else {
        next(createHttpError(404, "could not find user"))
      }
    } catch(error) {
      next(error)
    }

  })
// DELETE /authors/123 => delete the author with the given id
authorsRouter.delete("/:id", async (req, res, next) =>{
  try{
    const authors = await getAuthors()
    const authorsAfterDeletion = authors.filter(author => author.id !== req.params.id) 
    if (authorsAfterDeletion.length < authors) {
    console.log("THESE ARE THE AUTHORS AFTER DELETION", authorsAfterDeletion)
    await writeAuthorsToFile(authorsAfterDeletion)
    res.status(200).send({response: "deletion complete!"})

    } else {
      next(404)
    }
  } catch(error) {
    next(error)
  }
})


export default authorsRouter