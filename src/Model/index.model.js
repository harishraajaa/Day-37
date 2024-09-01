import mongoose from "mongoose"
import config from './Config.js'

main().catch((error)=>console.error('MongoDB Connection Failed',error.message))

async function main(){
    await mongoose.connect(`${config.db_url}/${config.db_name}`)
    console.log('MongoDB Connected!')
}


export default mongoose