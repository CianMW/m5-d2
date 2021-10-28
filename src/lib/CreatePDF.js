import pdfMake from "pdfmake/build/pdfmake.js";
// import pdfFonts from "pdfmake/build/vfs_fonts.js";
 import PdfPrinter from "pdfmake"
 import { pipeline } from "stream"
 import striptags from "striptags";



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

//FUNCTION TO DOWNLOAD THE PDF
export const getPDFStream = async (blog) => {
    let imagePart = {};
    if (blog.cover) {
    const response = await fetch(blog.cover, {
      responseType: "arraybuffer",
    });
    const blogCoverURLParts = blog.cover.split("/");
    const fileName = blogCoverURLParts[blogCoverURLParts.length - 1];
    const [id, extension] = fileName.split(".");
    const base64 = response.data.toString("base64");
    const base64Image = `data:image/${extension};base64,${base64}`;
    imagePart = { image: base64Image, width: 500, margin: [0, 0, 0, 40] };
  }

  const printer = new PdfPrinter(fonts)
  
  const docDefinition = {
      content: [
          imagePart, 
      { text: striptags(blog.content), lineHeight: 2 },],
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
  