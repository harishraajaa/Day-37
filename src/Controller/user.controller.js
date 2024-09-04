import 'dotenv/config'
import userModel from '../Model/user.model.js'
import auth from '../Model/auth.js'
import nodemailer from 'nodemailer'
import Config from '../Model/Config.js'
 
// function generateRandomID(len){
//     const text='qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890'
//     let random=''
//     for(let i=0;i<len;i++)
//         random+=text[Math.floor(Math.random()*100)%62]
//     return random
// }


const sendEmail=async(user,link,hostname)=>{
    //mdwu zsql olgs rsiq
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465, //587,
      secure: true, // Use `true` for port 465, `false` for all other ports
      auth: {
        user: Config.smtpuser,
        pass: Config.smtppwd,
      }
    })

     await transporter.sendMail({
      from: '"Harish Foods" <Notifications@harishfoods.com>', // sender address
      to: `${user.email}`, // list of receivers
      subject: "Password Reset Link", // Subject line
      text: "Hello world?", // plain text body
      html: `<b>Hi ${user.name},</b><br><br><p><b>Link for Password reset: </b>${hostname}${link}</p>`, // html body
    });

    console.log("Email sent")
}

const getAllUser=async(request,response)=>{

    try {

        let users= await userModel.find({},{_id:0})

        response.status(200).send({
            message:"Get All Users",
            data:users
        })
        
    } catch (error) {
        console.log("Error in getAllUser Endpoint")
        response.status(500).send({
            message:"Internal Server Error",
            data:error.message
        })
    }
}

const getUserById=async(request,response)=>{

    try {
        let {id}=request.params
        //console.log(id)
        let user= await userModel.findOne({id:id},{_id:0})
        response.status(200).send({
            message:"Get User",
            data:user
        })
        
    } catch (error) {
        console.log("Error in getAllUser Endpoint")
        response.status(500).send({
            message:"Internal Server Error",
            data:error.message
        })
    }
}

const createUser=async(request,response)=>{

    try {

        let user=await userModel.findOne({email:request.body.email})

        if(!user){
            
            //hash the password
            request.body.password=await auth.hashData(request.body.password)
            await userModel.create(request.body)
            response.status(201).send({
                message:"User Created!!!"
            })
        }
        else{
            response.status(400).send({
                message:"User Already Exists!!!"
            })
        }

        
    } catch (error) {
        console.log("Error in createUser Endpoint")
        console.log(error.message)
        response.status(500).send({
            message:"Internal Server Error",
            data:error.message
        })
    }
}

const editUserById = async (request, response) => {
    
    try {
        let {id}= request.params
        let user = await userModel.findOne({id:id})
        if(user)
        {
            const {name,email,mobile,status,role,} = request.body
            user.name = name?name: user.name
            user.email = email?email: user.email
            user.mobile = mobile?mobile: user.mobile
            user.status = status?status: user.status
            user.role = role?role: user.role
            
            await user.save()

            response.status(200).send({message:"Data Saved Successfully"})
        }
        else
            response.status(400).send({message:"Invalid Id"})

        
    } catch (error) {
        console.log("Error in EditUserById Endpoint")
        response.status(500).send({
            message:"Internal Server Error",
            data:error.message
        })
    }
}

const deleteUserById = async (request, response) => {

    try {
 
        let {id} = request.params
        let data = await userModel.deleteOne({id:id})
        if(data.deletedCount)
            response.status(200).send({message:"User Deleted Successfully"})
        else
            response.status(400).send({message:"Invalid Id"})
        
    } catch (error) {
        console.log("Error in deleteUserById Endpoint")
        response.status(500).send({
            message:"Internal Server Error",
            data:error.message
        })
    }
}

const login = async(req,res)=>{
    try {
        let {email,password} = req.body
        let user = await userModel.findOne({email:email})
        if(user)
        {
            //compare password
            if(await auth.compareHash(password,user.password))
            {
                const token = auth.createToken({
                    email:user.email,
                    name:user.name,
                    role:user.role,
                    id:user.id
                })
                res.status(200).send({
                    message:"Login Successfull",
                    token:token,
                    role:user.role
                })
            }
            else
            {
                res.status(400).send({
                    message:"Incorrect Password"
                })
            }
        }
        else
        {
            res.status(400).send({
                message:`User with email ${req.body.email} does not exists`
            })
        }
        
    } catch (error) {
        console.log(`Error in ${req.originalUrl}`,error.message)
        res.status(500).send({ message: error.message || "Internal Server Error" })
    }
}

const changePassword= async (request,response)=>{
    try {

        let token = request.headers.authorization.split(' ')[1]
        let payload = auth.decodeToken(token)
        //console.log(payload)
        if (payload) {
            let user = await userModel.findOne({ id: payload.id })
            if (user) {
                let { oldpassword, newpassword } = request.body

                if (await auth.compareHash(oldpassword,user.password)) {
                    user.password = await auth.hashData(newpassword)

                    await user.save()
                    response.status(200).send({
                        message: "Password Updated Successfully"
                    })
                }
                else
                    response.status(400).send({ message: "Current Password did not match" })

            }

            else {
                response.status(400).send({ message: "User not exists" })
            }
        }
        else {
            response.status(400).send({ message: "Invalid Token" })
        }
        
        
        
    } catch (error) {
        console.log(`Error in ${request.originalUrl}`,error.message)
        response.status(500).send({ message: error.message || "Internal Server Error" })
    }
}

const forgetPassword=async(request,response)=>{
    
    try {
        let {email}=request.body
        let hostname=request.headers.origin
        let user=await userModel.findOne({email:email})
        if (user){

            let link = `/resetpassword/${user.id}`
            const token = auth.createToken({
                email:user.email,
                name:user.name,
                role:user.role,
                id:user.id
            })
            sendEmail(user,link,hostname)
            response.status(201).send({
                message:"Link Created!!!",
                link:link,
                token:token
            })
        }
        else{
            response.status(400).send({
                message:"User doesn't Exists!!!"
            })
        }
        
    } catch (error) {
        console.log("Error in forgetPassword Endpoint")
        response.status(500).send({
            message:"Internal Server Error",
            data:error.message
        })
    }
}

const resetPassword=async(request,response)=>{
    try {

        //let token = request.headers.authorization.split(' ')[1]
        //let payload = auth.decodeToken(token)
        //console.log(payload)
            let {id}=request.params
            let user = await userModel.findOne({ id:id })
            if (user) {
                let { newpassword } = request.body
                user.password = await auth.hashData(newpassword)
                await user.save()
                
                response.status(200).send({
                    message: "Password Updated Successfully"
                })
            }
            else {
                response.status(400).send({ message: "User not exists" })
            }
        
        
    } catch (error) {
        console.log(`Error in ${request.originalUrl}`,error.message)
        response.status(500).send({ message: error.message || "Internal Server Error" })
    }
}

export default {getAllUser,createUser,getUserById,editUserById,deleteUserById,login, changePassword,forgetPassword, resetPassword}