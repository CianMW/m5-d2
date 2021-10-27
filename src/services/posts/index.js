import express from "express"
import uniqid from "uniqid"
import { validationResult } from "express-validator"
import  {postValidationMiddlewares}  from "./validation.js"
import createHttpError from "http-errors"
import { writePostsToFile, getPosts, getComments, writeCommentsToFile } from "../../lib/functions.js"


const postsRouter = express.Router()


postsRouter.get("/", async (req, res, next) => {
    try{
      const errorList = validationResult(req)

      if(!errorList.isEmpty()){
          next(createHttpError(400, { errorsList })) //fires the error response
      } else {

          console.log(req.body)

  
  const arrayOfPosts = await getPosts()

  res.send(arrayOfPosts)
  }
  }catch(error){next(error)}
})

//POST /authors => create a new author
postsRouter.post("/", postValidationMiddlewares , async (req, res, next) => {
    try{
        const errorList = validationResult(req)
        console.log(errorList)

        if(!errorList.isEmpty()){
            next(createHttpError(400, { errorList })) //fires the error response
        } else {

            console.log(req.body)

    const name = req.body.author.name
    req.body.author.avatar = `https://ui-avatars.com/api/?name=${name}`
  
    const newPost = { ...req.body, id: uniqid(), createdAt: new Date}
    newPost.comments = []
    const postLibrary = await getPosts()
    postLibrary.push(newPost)
    await writePostsToFile(postLibrary)
 
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
  postsRouter.get("/:id", async (req, res, next) =>{
    try{
      console.log(req)
      const posts  = await getPosts()
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
  postsRouter.put("/:id", async (req, res, next) =>{
    try{
      const posts  = await getPosts()
      const index = posts.findIndex(post => post.id === req.params.id)
      
      if(index !== -1){
        const editedPost = {...posts[index], ...req.body }

      posts[index] = editedPost

      await writePostsToFile(posts)
      res.send(editedPost)
    }else{
      next(createHttpError(404, `post with the id ${req.params.id} doesn't exist` ))
    }
      
    }catch(error){
      next(error)
    }

  })
// DELETE /authors/123 => delete the author with the given id
postsRouter.delete("/:id", async (req, res, next) =>{
  try{
    const posts  = await getPosts()
    const foundPost = posts.find(post => post.id === req.params.id)
    
    if(foundPost){
      const afterDeletion = posts.filter(post => post.id !== req.params.id)
      await writePostsToFile(afterDeletion)

      res.status(200).send({response: "deletion complete!"})


  }else{
    next(createHttpError(404, `post with the id ${req.params.id} doesn't exist` ))
  }
    
  }catch(error){
    next(error)
  }

})

// GET /blogPosts/:id/comments, get all the comments for a specific post
// postsRouter.get("/:id/comments", async (req, res, next) =>{
//   try{
//     console.log(req)
//     const posts  = await getPosts()
//     const findPost = posts.find(post => post.id === req.params.id)
//     if(findPost){
//       res.send({findPost})
//     } else {
//       next(createHttpError(404, `post with the id ${req.params.id} doesn't exist` ))
//     }
//   }catch(error){
//     next(error)
//   }

// })

postsRouter.get("/:id/comments", async (req, res, next) =>{
  try{
    console.log(req)
    const comments  = await getComments()
    const findComments = comments.filter(comment => comment.article_id === req.params.id)
    if(findComments){
      res.send(findComments)
    } else {
      next(createHttpError(404, `Reviews with the id ${req.params.id} don't exist` ))
    }
  }catch(error){
    next(error)
  }

})

// POST /blogPosts/:id/comments, add a new comment to the specific post

postsRouter.post("/:id/comments", async (req, res, next) =>{
  try{
    console.log(req)
    const newComment = {...req.body, _id : uniqid() , createdAt : new Date}
    const allComments = getComments()
    allComments.push(newComment)
   await writeCommentsToFile(allComments)
    if(req){
      res.send(newComment)
    } else {
      next(createHttpError(404, `comment could not be created ` ))
    }
  }catch(error){
    next(error)
  }

})

// deletes comments 

postsRouter.delete("/:id/comments", async (req, res, next) =>{
  try{
    const allComments  = await getComments()
    const foundComment = allComments.find(comment => comment._id === req.params.id)
    
    if(foundComment){
      const afterDeletion = allComments.filter(comment => comment._id !== req.params.id)
      await writeCommentsToFile(afterDeletion)

      res.status(200).send({response: "deletion complete!"})


  }else{
    next(createHttpError(404, `Comment with id ${req.params.id} doesn't exist` ))
  }
    
  }catch(error){
    next(error)
  }
})



export default postsRouter