import express from "express"
import uniqid from "uniqid"
import fs from "fs" 
import { fileURLToPath } from "url" 
import { dirname, join } from "path" 

const authorsRouter = express.Router()

const currentFilePath = fileURLToPath(import.meta.url)
const parentFolder = dirname(currentFilePath)
const authorJSONPath = join(parentFolder, "authors.json")




export default authorsRouter