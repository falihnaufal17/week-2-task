const express = require('express')
const Route = express.Router()
const multer = require('multer')
const path = require('path')

const userController = require('../controllers/user')
const Auth = require('../helpers/auth')

let storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './uploads/images/')
    },

    filename: function (req, file, callback) {
        callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

let upload = multer({ storage: storage, limits: { fileSize: 100000000 } })

Route
    .all('/*', Auth.authInfo)
    .get('/', Auth.accessToken, userController.getUsers)
    .get('/:iduser', Auth.accessToken, userController.userDetail)
    .post('/register', upload.single('image'), userController.register)
    .post('/login', userController.login)
    .patch('/logout/:iduser', userController.logout)
    .patch('/verify/:iduser', Auth.accessToken, userController.verifyUser)
    .patch('/update/:iduser', upload.single('image'), Auth.accessToken, userController.updateUser)
module.exports = Route