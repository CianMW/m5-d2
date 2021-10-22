import express from "express"
import createHttpError from "http-errors"
import multer from "multer"
import { writePostsToFile, getPosts, saveCoverImages } from "../../lib/functions.js"
const filesRouter = express.Router()

// FOR ADDING COVER PHOTO
filesRouter.post("/:id/cover", multer().single("cover"), async (req, res, next) => {
  try {
      if(req.file){
        console.log(req.file)
        console.log("This is the id: ",req.params.id)
        const identity = JSON.stringify(req.params.id)
        const newFileName = req.params.id + req.file.originalname
        await saveCoverImages(newFileName, req.file.buffer)
        const posts  = await getPosts()
        const index = await posts.findIndex(post => post.id === req.params.id)
        let fileLinkDeclaration = ""
        if(index!==-1){
          const postPreEdit = posts[index]
        const editedPost = {...posts[index], cover : `http://localhost:3001/covers/${newFileName}` }
    
         posts[index] = editedPost
    
         await writePostsToFile(posts)
         console.log("this is the post pre edit", postPreEdit)
         console.log("this is the post post-edit",editedPost)
         console.log("These are the posts", posts)
         console.log("Here is the index", index)

    
        fileLinkDeclaration = "file uploaded and connection made to article"
        res.status(200).send(fileLinkDeclaration)
      } else {
        res.status(404).send("not found")
      }
    
    } else {
      next(createHttpError(400))
    }
      
  } catch(error) {
    next(error)
  }
})


// FOR ADDING AUTHOR AVATAR
filesRouter.post("/:id/avatar", multer().single("cover"), async (req, res, next) => {
  try {
      if(req.file){
        console.log(req.file)
        console.log("This is the id: ",req.params.id)
        const identity = JSON.stringify(req.params.id)
        const newFileName = req.params.id + req.file.originalname
        await saveCoverImages(newFileName, req.file.buffer)
        const posts  = await getPosts()
        const index = await posts.findIndex(post => post.id === req.params.id)
        let fileLinkDeclaration = ""
        if(index!==-1){
          const postPreEdit = posts[index]
        const editedPost = {...posts[index], cover : `http://localhost:3001/authors/${newFileName}` }
    
         posts[index] = editedPost
    
         await writePostsToFile(posts)
         console.log("this is the post pre edit", postPreEdit)
         console.log("this is the post post-edit",editedPost)
         console.log("These are the posts", posts)
         console.log("Here is the index", index)

    
        fileLinkDeclaration = "file uploaded and connection made to article"
        res.status(200).send(fileLinkDeclaration)
      } else {
        res.status(404).send("not found")
      }
    
    } else {
      next(createHttpError(400))
    }
      
  } catch(error) {
    next(error)
  }
})


export default filesRouter