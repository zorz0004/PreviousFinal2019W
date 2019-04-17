//const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const authorize = require('../../middleware/auth')
//const saltRounds = 14
const express = require('express')
const router = express.Router()
const User = require("../../models/User")
const sanitizeBody = require("../../middleware/sanitizeBody")



router.post('/users', sanitizeBody, async (req, res, next) => {
    
    const tmpUser = req.sanitizedBody
    tmpUser.isStaff = false
    //newUser = new User(req.sanitizedBody)
    newUser = new User(tmpUser)
    .save()
    .then(newUser => res.status(201).send({data: newUser}))
    .catch(next)
})


router.post('/tokens', sanitizeBody, async (req, res) => {
    const {email, password} = req.sanitizedBody
    const user = await User.authenticate(email, password)

    if(!user){
        return res.status(401).send({
            errors: [
                {
                status: 'Unauthorized',
                code: '401',
                title: 'Incorrect username or password.'
            }
        ]
    })
    }

    res.status(201).send({data: {token: user.generateAuthToken()}})
  })


router.get('/users/me', authorize, async (req, res) => {
    const user = await User.findById(req.user._id).select('-password -__v')
    res.send({data: user})
  })


router.patch('/users/:id', authorize, sanitizeBody,  async (req, res, next) =>{
    //Update password
    if(req.sanitizedBody.password != undefined){
        try{
            const user = await User.findById(req.params.id)
            user.password = req.sanitizedBody.password
            await user.save()
            res.send({data: user})
          }
          catch(err){
              next(err)
          }
    }
    else{
        //Update isStaff
        let myUser = await User.findById(req.user._id).select('isStaff')
        if(myUser.isStaff === true && req.sanitizedBody.isStaff != null){
            try{
                const user = await User.findById(req.params.id)
                user.isStaff = req.sanitizedBody.isStaff
                await user.save()
                res.send({data: user})
              }
              catch(err){
                  next(err)
              }
        }
        else{
            return res.status(403).send({
                errors: [
                    {
                        status: 'Unauthorized',
                        code: '403',
                        title: 'Access denied',
                        description: 'Not allowed'
                    }
                ]
            })
        }
    }
  })


module.exports = router