import express from "express";
import homeController from "../controller/homeController"
import multer from "multer";
import path from "path";


const appRoot = require('app-root-path');
let router = express.Router();

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        console.log("check appRoot", appRoot)
        cb(null, appRoot + "/src/public/img/");
    },

    //by defaul, multer removes file extension so let`s add them back
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const imageFilter = function(req, file, cb) {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        req.fileValidationError = 'Only image files are allowed!';
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

let upload = multer({ storage: storage, fileFilter: imageFilter});
let uploadMultiple = multer({ storage: storage, fileFilter: imageFilter}).array('multiple_images',3);
const initWebRoute = (app)=>{

    router.get('/', homeController.getHomePage)
    router.get('/detail/user/:id', homeController.getDetailPage)
    router.post('/create-new-user', homeController.createNewUser)
    router.post('/detele-user', homeController.deleteUser)
    router.get('/edit-user/:id', homeController.getEditPage)
    router.post('/update-user', homeController.postUpdateUser)

    // upload file 
    router.post('/upload-profile-pic', upload.single('profile_pic') ,homeController.handleUploadFile)
    router.get('/upload', homeController.getUploadFilePage)
    router.post('/upload-multiple-images', (req, res, next)=>{
        uploadMultiple(req, res, (err)=>{
            if (err instanceof multer.MulterError && err.code === "LIMIT_UNEXPECTED_FILE"){
                res.send('LIMIT_UNEXPECTED_FILE')
            }else if (err){
                res.send(err)
            }else{
                next()
            }
        })
    }, homeController.handleUploadMultipleFiles)

    return app.use('/', router)
}

export default initWebRoute;