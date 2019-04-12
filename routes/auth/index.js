//const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const authorize = require('../../middleware/auth')
//const saltRounds = 14
const express = require('express')
const router = express.Router()
const User = require("../../models/User")
const sanitizeBody = require("../../middleware/sanitizeBody")



router.post('/users', sanitizeBody, async (req, res, next) => {
    newUser = new User(req.sanitizedBody)
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

  //update password
  router.patch('/users/:id', authorize, sanitizeBody,  async (req, res, next) =>{
      try{
        // const user = await User.findByIdAndUpdate(req.params.id)
        // user.password = req.sanitizedBody.password
        // await user.save()
        // res.send({data: user})
        
        //const password = req.sanitizedBody.password
        const user = await User.findById(req.params.id)
        user.password = req.sanitizedBody.password
            // { password: password },
            // {
            //     new: true,
            //     runValidators: true
            // })
        await user.save()
        res.send({data: user})
      }
      catch(err){
          next(err)
      }
  })

  


module.exports = router