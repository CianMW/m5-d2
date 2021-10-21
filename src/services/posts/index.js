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
        console.log(errorList)

        if(!errorList.isEmpty()){
            next(createHttpError(400, { errorList })) //fires the error response
        } else {

            console.log(req.body)

    const name = req.body.author.name.split(" ")
    req.body.author.avatar = `https://ui-avatars.com/api/?name=${name[0]}+${name[1]}`
  
    const newPost = { ...req.body, id: uniqid(), createdAt: new Date }
    
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
  postsRouter.get("/:id", (req, res, next) =>{
    try{
      console.log(req)
      const posts  = getPosts()
      const findPost = posts.find(post => post.id === req.params.id)
      if(findPost){
        res.send({findPost})
      } else {
        next(createHttpError(404, `post with the id ${req.params.id} doesn't exist` ))
      }
    }catch(error){
      next(error)
    }

  })

  //PUT /authors/123 => edit the author with the given id
  postsRouter.put("/:id", (req, res, next) =>{
    try{
      const posts  = getPosts()
      const index = posts.findIndex(post => post.id === req.params.id)
      
      if(index !== -1){
        const editedPost = {...posts[index], ...req.body }

      posts[index] = editedPost

      writeToFile(posts)
      res.send(editedPost)
    }else{
      next(createHttpError(404, `post with the id ${req.params.id} doesn't exist` ))
    }
      
    }catch(error){
      next(error)
    }

  })
// DELETE /authors/123 => delete the author with the given id
postsRouter.delete("/:id", (req, res, next) =>{
  try{
    const posts  = getPosts()
    const foundPost = posts.find(post => post.id === req.params.id)
    
    if(foundPost){
      const afterDeletion = posts.filter(post => post.id !== req.params.id)
      writeToFile(afterDeletion)

      res.status(200).send({response: "deletion complete!"})


  }else{
    next(createHttpError(404, `post with the id ${req.params.id} doesn't exist` ))
  }
    
  }catch(error){
    next(error)
  }

})




export default postsRouter