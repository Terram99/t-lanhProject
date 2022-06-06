import pool from "../configs/connectDB";
import multer from "multer";
import { send } from "express/lib/response";

let getHomePage = async (req, res)=>{

    const [rows, fields] = await pool.execute('SELECT * FROM users');
    return res.render('index.ejs', {dataUser: rows})

};

let getDetailPage = async (req, res)=> {

    let userId = req.params.id;
    console.log(`>>>check params ${userId}`)
    let [user] = await pool.execute(`select *from users where id = ?`, [userId])

    return res.send(JSON.stringify(user))

};

let createNewUser =  async(req,res)=>{

    console.log(req.body);
    let{firstName, lastName, email, address} = req.body;
    await pool.execute('insert into users(firstName, lastName, email, adress) value( ?, ?, ?, ?)',
            [firstName, lastName, email, address])

    return res.redirect('/')
};

let deleteUser = async(req, res)=>{
    let userId = req.body.userId
    await pool.execute('delete from users where id = ?', [userId])
    return res.redirect('/');
}

let getEditPage = async(req, res)=>{
    let id = req.params.id;
    let [user] =  await pool.execute('Select * from users where id = ? ', [id]);

    return res.render('updateUser.ejs', {dataUser: user[0]});
}

let postUpdateUser = async(req, res)=>{

    let {firstName, lastName, email, address, id} = req.body;
    console.log(req.body)
    await pool.execute('Update users set firstName = ?, lastName = ?, email = ?, adress = ? where id = ?',
    [firstName, lastName, email, address, id]);
     
    return res.redirect('/')
}

let getUploadFilePage = async(req,res)=>{
    return res.render('uploadFile.ejs')
}


// upload single file

let handleUploadFile = async(req,res)=>{

        if (req.fileValidationError) {
            return res.send(req.fileValidationError);
        }
        else if (!req.file) {
            return res.send('Please select an image to upload');
        }
 
        // Display uploaded image for user validation
        res.send(`You have uploaded this image: <hr/><img src="/img/${req.file.filename}" width="500"><hr /><a href="./">Upload another image</a>`);
}

// upload multiple files
const uploadMultip = multer().array('multiple_images');

let handleUploadMultipleFiles = async(req,res) =>{

        if(req.fileValidationError){
            return res.send(req.fileValidationError)
        }else if(!req.files){
            return res.send('Plesase select an image to upload!')
        }

        
        let result = "You have uploaded these images: <hr />";
        const files = req.files;
        let index, len;

        // Loop through all the uploaded images and display them on frontend
        for (index = 0, len = files.length; index < len; ++index) {
            result += `<img src="/img/${files[index].filename}" width="300" style="margin-right: 20px;">`;
        }
        result += '<hr/><a href="./">Upload more images</a>';
        res.send(result);
}
module.exports = {
   getHomePage, getDetailPage, createNewUser, deleteUser, getEditPage, postUpdateUser, getUploadFilePage, handleUploadFile, handleUploadMultipleFiles

}