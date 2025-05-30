const express = require('express');
const router = express.Router();
const User=require("../models/user")
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const nodemailer=require('nodemailer');
var transporter =nodemailer.createTransport({
    service:'gmail',
    auth:{
    user:'amenibenammar91@gmail.com',
    pass:'nivk umwk fduy crhc'
    },
    tls:{
    rejectUnauthorized:false
    }
})
router.post('/register', async (req, res) => {
    try {
    let { email, password, firstname, lastname ,avatar} = req.body
    const user = await User.findOne({ email })
    if (user) return res.status(404).send({ success: false, message: "User already exists" })
    const newUser = new User({ email, password, firstname, lastname,avatar })
    const createdUser = await newUser.save()
    var mailOption ={
        from: '"verify your email " <amenibenammar91@gmail.com>',
        to: newUser.email,
        subject: 'vérification your email ',
        html:`<h2>${newUser.firstname}! thank you for registreting on our website</h2>
        <h4>please verify your email to procced.. </h4>
        <a
        href="http://${req.headers.host}/api/users/status/edit?email=${newUser.email}">click
        here</a>`
        }
        transporter.sendMail(mailOption,function(error,info){
        if(error){
        console.log(error)
        }
        else{
        console.log('verification email sent to your gmail account ')
        }
        })
    return res.status(201).send({ success: true, message: "Account created successfully", user: createdUser })
    } catch (err) {
    console.log(err)
    res.status(404).send({ success: false, message: err })
    }
    });
    router.get('/', async (req, res, )=> {
        try {
        const users = await User.find().select("-password");
        res.status(200).json(users);
        } catch (error) {
        res.status(404).json({ message: error.message });
        }
        });
        router.get('/status/edit/', async (req, res) => {
            try {
            let email = req.query.email
            let user = await User.findOne({email})
            user.isActive = !user.isActive
            user.save()
            res.status(200).send({ success: true, user })
            } catch (err) {
            return res.status(404).send({ success: false, message: err })
            }
            })
        router.post('/login', async (req, res) => {
                try {
                let { email, password } = req.body
                if (!email || !password) {
                return res.status(404).send({ success: false, message: "Allfields are required" })
            }
            let user = await User.findOne({ email
            })
            if (!user) {
            return res.status(404).send({ 
                success: false, message: "Account doesn't exists" })
            } else {
            let isCorrectPassword = await bcrypt.compare(password, user.password)
            if (isCorrectPassword) {
            delete user._doc.password
            if (!user.isActive) return res.status(200).send({ success:
            false, message: 'Your account is inactive, Please contact your administrator' })
            const token = jwt.sign ({ iduser:
            user._id,name:user.firstname, role: user.role }, process.env.SECRET, {
            expiresIn: "1h", })
            return res.status(200).send({ success: true, user, token })
            } else {
            return res.status(404).send({ success: false, message:"Please verify your credentials" })
            }
        }
    } catch (err) {
    return res.status(404).send({ success: false, message: err.message
    })
    }
    });
module.exports = router;