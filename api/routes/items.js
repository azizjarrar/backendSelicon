const express = require('express')
const crypto = require('crypto')
const multer = require('multer')
const path = require('path')
var fs = require('fs')
var mkdirp = require('mkdirp');

const router = express.Router()
const item_controler = require('../controllers/itemS')
const storageMulter = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'./uploads/Medias')
    },
    filename:(req,file,cb)=>{
        crypto.randomBytes(16, (err, buf) => {
            if (err) {
                return reject(err);
            }
             file_name = buf.toString('hex') + path.extname(file.originalname)
             cb(null,file_name)
        })
    }
})
const uploadMulter = multer({storage:storageMulter})
/***check if file exsist**/
function checkUploadPath(req, res, next) {
    fs.exists('./uploads/Medias', function(exists) {
       if(exists) {
         next();
       }
       else {
        mkdirp('./uploads/Medias').then(data=>{
           
            next();
        }).catch(error=>{
            console.log('Error in folder creation='+error.message);
            next();
        })
       }
    })
}
router.post('/Itemadd',checkUploadPath,uploadMulter.single('file'),item_controler.Itemadd)
router.post('/Itemdelete',item_controler.Itemdelete)
router.post('/getItemsSelection',item_controler.getItemsSelection)
router.post('/searchByword',item_controler.searchByword)
module.exports = router
