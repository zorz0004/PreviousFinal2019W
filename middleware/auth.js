const jwt = require('jsonwebtoken')
const jwtPrivateKey = 'superSecureSecret'


function parseToken(header){
    if(header){
        const [type, token] = header.split(" ")
        if(type == 'Bearer' && typeof token !== 'undefined'){
            return token
        } else{
            return undefined
        }
    }
}

module.exports = (req,res,next) => {
    //Get the JWT from the request header
    const token = parseToken(req.header('Authorization'))
    
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