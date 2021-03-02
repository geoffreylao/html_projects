// handles upload and store images with middleware function

// create controller for uploading images

const fs = require("fs");

const db = require("../models");
const Image = db.images;

const uploadFiles = async(req,res) => {
  try {
    console.log(req.file);

    // get and check file upload from req.file    
    if(req.file == undefined){
      return res.send(`You must select a file.`);
    }

    // use sequlieze model create method to save an image object to MySQL
    Image.create({
      type: req.file.mimetype,
      name: req.file.originalname,
      data: fs.readFileSync( // data recieved from middleware function
        __basedir + "/resources/static/assets/uploads/" + req.file.filename
      ),   
    }).then((image) => { //write image data to tmp if successful
      fs.writeFileSync( // fs used to read and write data
        __basedir + "/resources/static/assets/tmp/" + image.name,
        image.data
      );

      return res.send(`File has been uploaded`);
    });
  } catch (error){
    console.log(error);
    return res.send(`Error when trying upload images: ${error}`);
  }
};

module.exports = {
  uploadFiles,
};