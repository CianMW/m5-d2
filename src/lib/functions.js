import fs from "fs-extra";
import multer from "multer";
import { fileURLToPath } from "url"
import { dirname, join } from "path"

const { readJSON, writeJSON, writeFile } = fs

const dataFolderPath = join(dirname(fileURLToPath(import.meta.url)), "../data") // gets the current url, then the directory (folder) address, then goes out a level and adds the folder address "data"
console.log(dataFolderPath)
const postsJSONPath = join(dataFolderPath, "/posts.json")
const commentsJSONPath = join(dataFolderPath, "/comments.json")
const publicFolderPath = join(process.cwd(), "./public/covers") // process.cwd() gets the address for the root
const publicFolderPathAuthors = join(process.cwd(), "./public/authors") // process.cwd() gets the address for the root


export const writePostsToFile = (input) => {fs.writeJSON(postsJSONPath, input)} 
export const getPosts = () => fs.readJSON(postsJSONPath)
export const getComments = () => fs.readJSON(commentsJSONPath)
export const saveCoverImages = (fileName, contentAsBuffer) => writeFile(join(publicFolderPath, fileName), contentAsBuffer) // writes the picture to the destination
export const saveAuthorImages = (fileName, contentAsBuffer) => writeFile(join(publicFolderPathAuthors, fileName), contentAsBuffer) // writes the picture to the destination



