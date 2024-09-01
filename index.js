import express from 'express'
import appRoutes from './src/Router/index.router.js'
import 'dotenv/config'

const PORT = process.env.PORT
const app=express()

app.use(express.json())
//app.use(express.urlencoded())

app.use(appRoutes)

app.listen(PORT,()=>console.log(`Server is up and running on Port: ${PORT}`))