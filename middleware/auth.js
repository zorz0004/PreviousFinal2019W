const jwt = require('jsonwebtoken')
const jwtPrivateKey = 'superSecureSecret'

module.exports = (req,res,next) => {
    //Get the JWT from the request header
    const token = req.header('bearer')
    
    if(!token){
        return res.status(401).send({
            errors: [
                {
                    status: 'Unauthorized',
                    code: '401',
                    title: 'Authentication failed',
                    description: 'Missing bearer token'
                }
            ]
        })
    }
    
    try{
        //Validate the JWT
        const payload = jwt.verify(token, jwtPrivateKey)
        req.user = payload
        next()
    }catch(err){
        res.status(400).send({
        errors: [
            {
                status: 'Unauthorized',
                code: '401',
                title: 'Authentication failed',
                description: 'Missing bearer token'
            }
        ]
    })
    }
    
}