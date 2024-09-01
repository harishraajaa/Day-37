import mongoose from './index.model.js'
import { v4 as genuuid } from 'uuid';

const recipesSchema = new mongoose.Schema({
    id:{
        type:String,
        default:function (){
            return genuuid()
        }
    },
    name:{
        type:String,
        required:[true,"Name is required"]
    },
  
    description:{
        type:String,
        required:[true,"Description is required"]
    },
    ingredients:{
        type:Array,
        default:[]
    },
    procedure:{
        type:String,
        required:[true,"Procedure is required"]
    },
    userId:{
        type:String,
        required:[true,"userId is required"]
    },
    status:{
        type:Boolean,
        default:true
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }

},{
    collection:'recipes',
    versionKey:false
})

export default mongoose.model('recipes',recipesSchema)