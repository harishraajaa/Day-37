import bcrypt from 'bcryptjs'
import Config from './Config.js'
import jwt from 'jsonwebtoken'

const hashData = async(str)=>{
    let salt = await bcrypt.genSalt(Config.SALT)
    let hash = await bcrypt.hash(str,salt)
    return hash
}

const compareHash=async (text,hash)=>{
    return await bcrypt.compare(text,hash)
}

const createToken = (payload)=>{
    let token = jwt.sign(payload,Config.jwt_secret,{
        expiresIn:Config.jwt_expiry
    })
    return token
}

const decodeToken = (token)=>{
    return jwt.decode(token)
}


export default{hashData, compareHash, createToken, decodeToken}