import fs from "fs-extra";
import multer from "multer";
import { fileURLToPath } from "url"
import { dirname, join } from "path"
import { createReadStream } from "fs";
import sgMail from '@sendgrid/mail'


const { readJSON, writeJSON, writeFile } = fs

const dataFolderPath = join(dirname(fileURLToPath(import.meta.url)), "../data") // gets the current url, then the directory (folder) address, then goes out a level and adds the folder address "data"
console.log(dataFolderPath)
const postsJSONPath = join(dataFolderPath, "/posts.json")
const authorsJSONPath = join(dataFolderPath, "/authors.json")
const commentsJSONPath = join(dataFolderPath, "/comments.json")
const publicFolderPath = join(process.cwd(), "./public/covers") // process.cwd() gets the address for the root
const publicFolderPathAuthors = join(process.cwd(), "./public/authors") // process.cwd() gets the address for the root

//Writing to file 
export const writePostsToFile = (input) => {fs.writeJSON(postsJSONPath, input)} 
export const writeAuthorsToFile = (input) => {fs.writeJSON(authorsJSONPath, input)} 
export const writeCommentsToFile = (input) => {fs.writeJSON(commentsJSONPath, input)} 

//Reading file
export const getPosts = () => fs.readJSON(postsJSONPath)
export const getComments = () => fs.readJSON(commentsJSONPath)
export const getAuthors = () => fs.readJSON(authorsJSONPath)


//saving images
export const saveCoverImages = (fileName, contentAsBuffer) => writeFile(join(publicFolderPath, fileName), contentAsBuffer) // writes the picture to the destination
export const saveAuthorImages = (fileName, contentAsBuffer) => writeFile(join(publicFolderPathAuthors, fileName), contentAsBuffer) // writes the picture to the destination

export const authorsReadStream = () => createReadStream(authorsJSONPath)



//Sends verification to the author

export const sendEmailVerification = async (author) =>{

sgMail.setApiKey(process.env.SENDGRID_API_KEY)
console.log("this is the author", author)


const msg = {
  to: `${process.env.SENDER_EMAIL}`,
  from: `${process.env.SENDER_EMAIL}`, // Use the email address or domain you verified above
  subject: 'New blog post',
  text: 'and easy to do anywhere, even with Node.js',
  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
};
  try {
    await sgMail.send(msg);
  } catch (error) {
    console.log(error);
  }
;

}

