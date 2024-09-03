import express from 'express'
import appRoutes from './src/Router/index.router.js'
import 'dotenv/config'
import cors from 'cors'

const PORT = process.env.PORT
const app=express()
app.use(cors())
app.use(express.json())
//app.use(express.urlencoded())

app.use(appRoutes)

app.listen(PORT,()=>console.log(`Server is up and running on Port: ${PORT}`))