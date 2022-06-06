import express from "express";
import apiController from "../controller/apiController";

let router = express.Router();

const initAPIRoute = (app)=>{

    router.get('/users', apiController.getAllUsers); //method GET --> read data
    router.post('/create-user', apiController.createNewUser); //method POST --> create data
    router.put('/update-user', apiController.updateUser); //method PUT --> update data
    router.delete('/delete-user/:id', apiController.deleteUser); //method DELETE --> delete data

    return app.use('/api/v1', router)
}

export default initAPIRoute;