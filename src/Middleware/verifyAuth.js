import auth from "../Model/auth.js"

const verifyAuth = async(req,res,next)=>{
    let token = req.headers?.authorization?.split(" ")[1]
    if(token)
    {
        let payload = auth.decodeToken(token)
        if(payload.exp > Math.floor(+new Date()/1000))
        {
            
            req.headers.userId = payload.id
            //console.log(payload.id)
            next()
        }
        else
            res.status(401).send({message:"Session Expired"})
    }
    else
        res.status(401).send({
    message:"No Token Found"})
}

export default verifyAuth