import express from "express"
import uniqid from "uniqid"
import { validationResult } from "express-validator"
import createHttpError from "http-errors"
import { writePostsToFile, getPosts, getComments, writeCommentsToFile } from "../../lib/functions.js"
import pdfMake from "pdfmake/build/pdfmake.js";
// import pdfFonts from "pdfmake/build/vfs_fonts.js";
 import PdfPrinter from "pdfmake"
 import { pipeline } from "stream"


//FUNCTION TO DOWNLOAD THE PDF
const getPDFStream = content => {

  //pdfMake.vfs = pdfFonts.pdfMake.vfs
    //SETS THE FONT
const fonts = {
  'Helvetica': {
    normal: 'Helvetica',
    bold: 'Helvetica-bold',
    // italics: 'Roboto-Italic.ttf',
    // bolditalics: 'Roboto-Italic.ttf'
  }
};
const printer = new PdfPrinter(fonts)

const docDefinition = {
    content: [content, "END OF THE PDF"],
    defaultStyle: {
      font: "Helvetica",
    },
    // ...
  }

  const options = {
    // ...
  }

  const pdfReadableStream = printer.createPdfKitDocument(docDefinition, options)
  // pdfReadableStream.pipe(fs.createWriteStream('document.pdf')); // old syntax for piping
  // pipeline(pdfReadableStream, fs.createWriteStream('document.pdf')) // new syntax for piping (we don't want to pipe pdf into file on disk right now)
  pdfReadableStream.end()
  return pdfReadableStream


} // END OF PDF STREAM FUNCTION




const pdfRouter = express.Router()

pdfRouter.get("/:id", async (req, res, next) =>{
    try{
        const posts = await getPosts()
        const findPost = posts.find(post => post.id === req.params.id)
        if(findPost) {

        res.setHeader("Content-Disposition", `attachment: filename = ${findPost.title}.pdf`) 
        const source = getPDFStream(findPost.text) // PDF READABLE STREAM
        const destination = res

        pipeline(source, destination, err => {
            if (err) next(err)
          })
        

        }else {
        next(createHttpError(404, `post with the id ${req.params.id} doesn't exist and cannot be downloaded` ))
      }

       
    }catch(error){
        next(error)
    }
    // try{
    //   console.log(req)
    //   const posts  = await getPosts()
    //   const findPost = posts.find(post => post.id === req.params.id)
    //   if(findPost){
    //     res.send({findPost})
    //   } else {
    //     next(createHttpError(404, `post with the id ${req.params.id} doesn't exist` ))
    //   }
    // }catch(error){
    //   next(error)
    // }

  })
export default pdfRouter