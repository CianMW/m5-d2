import express from "express"
import uniqid from "uniqid"
import fs from "fs" 
import { fileURLToPath } from "url" 
import { dirname, join } from "path" 
import { validationResult } from "express-validator"
import  {postValidationMiddlewares}  from "./validation.js"
import createHttpError from "http-errors"


const postsRouter = express.Router()

const currentFilePath = fileURLToPath(import.meta.url) //imports the current file path
const parentFolder = dirname(currentFilePath)
const postsJSONPath = join(parentFolder, "posts.json")

const writeToFile = (input) => {fs.writeFileSync(postsJSONPath, JSON.stringify(input))} 
const getPosts = () => JSON.parse(fs.readFileSync(postsJSONPath))



postsRouter.get("/", (req, res, next) => {
    try{
      const errorList = validationResult(req)

      if(!errorList.isEmpty()){
          next(createHttpError(400, { errorsList })) //fires the error response
      } else {

          console.log(req.body)

  
  const arrayOfPosts = getPosts()

  res.send(arrayOfPosts)
  }
  }catch(error){next(error)}
})

//POST /authors => create a new author
postsRouter.post("/", postValidationMiddlewares , (req, res, next) => {
    try{
        const errorList = validationResult(req)

        if(!errorList.isEmpty()){
            next(createHttpError(400, { errorList })) //fires the error response
        } else {

            console.log(req.body)
  
    const newPost = { ...req.body, id: uniqid() }
    
    writeToFile(newPost)
 
    res.send({id: newPost.id})
    }
    }catch(error){next(error)}

  })

  /* try {
    const errorsList = validationResult(req)

    if (!errorsList.isEmpty()) {
      // If we had validation errors --> we need to trigger Bad Request Error Handler
      next(createHttpError(400, { errorsList }))
    } else {
      const newBook = { ...req.body, createdAt: new Date(), id: uniqid() }
      const books = getBooks()

      books.push(newBook)

      writeBooks(books)

      res.status(201).send({ id: newBook.id })
    }
  } catch (error) {
    next(error)
  }
}) */

  //GET /authors/123 => returns a single author
  postsRouter.get("/:id", (req, res) =>{


    const arrayOfAuthors = JSON.parse(fs.readFileSync(authorsJSONPath))
    const queriedAuthor = arrayOfAuthors.find(author => author.id === req.params.id)

    res.send(queriedAuthor)
    try{
      const errorList = validationResult(req)

      if(!errorList.isEmpty()){
          next(createHttpError(400, { errorsList })) //fires the error response
      } else {

          console.log(req.body)
          const posts = getPosts

  const newPost = { ...req.body, id: uniqid() }
  
  writeToFile(newPost)

  res.send({id: newPost.id})
  }
  }catch(error){next(error)}

  })

  //PUT /authors/123 => edit the author with the given id
  postsRouter.put("/:id", (req, res) =>{
    const authors = JSON.parse(fs.readFileSync(authorsJSONPath))

    const index = authors.findIndex(author => author.id === req.params.id) 

    const editedAuthor = {...authors[index], ...req.body}

    authors[index] = editedAuthor

    fs.writeFileSync(authorsJSONPath, JSON.stringify(authors))

    res.send(editedAuthor)

  })
// DELETE /authors/123 => delete the author with the given id
postsRouter.delete("/:id", (req, res) =>{
    const authors = JSON.parse(fs.readFileSync(authorsJSONPath))
    const authorsAfterDeletion = authors.filter(author => author.id !== req.params.id) 
    console.log("THESE ARE THE AUTHORS AFTER DELETION", authorsAfterDeletion)
    
    fs.writeFileSync(authorsJSONPath, JSON.stringify(authorsAfterDeletion))
    res.status(200).send({response: "deletion complete!"})
})




export default postsRouter