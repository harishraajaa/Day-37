import 'dotenv/config'
import recipeModel from '../Model/recipe.model.js'
import userModel from '../Model/user.model.js'

const recipeUserQuery = [
    {
        $lookup:{
            from:'users',
            localField:"userId",
            foreignField:"id",
            as:"recipeUser"
        }
    },
    {$unwind:"$recipeUser"},
    {$project:{name:1,description:1,ingedrients:1,procedure:1,userid:1,id:1,author:"$recipeUser.name",email:"$recipeUser.email"}}
]

const getAllRecipes = async(req,res)=>{
    try {

        let recipes = await recipeModel.aggregate(recipeUserQuery)        
        res.status(200).send({
            message:"Data Fetch Successfull",
            data:recipes
        })
        
    } catch (error) {
        console.log(`Error in ${req.originalUrl}`,error)
        res.status(500).send({ message: error.message || "Internal Server Error" })
    }
}

const getAllRecipesByUserId = async(req,res)=>{
    try {

        const {id} = req.params
        let recipes = await recipeModel.aggregate([...recipeUserQuery,{$match:{userid:id}}])
        res.status(200).send({
            message:"Data Fetch Successfull",
            data:recipes
        })
        
    } catch (error) {
        console.log(`Error in ${req.originalUrl}`,error)
        res.status(500).send({ message: error.message || "Internal Server Error" })
    }
}

const createRecipe = async(req,res)=>{
    try {
        let user = await userModel.findOne({id:req.body.userId})
        if(user)
        {
            await recipeModel.create(req.body)
            res.status(201).send({
                message: "Recipe Added Successfully"
            })
        }
        else
        {
            res.status(400).send({message:`Invalid userId`})
        }
    } catch (error) {
        console.log(`Error in ${req.originalUrl}`,error)
        res.status(500).send({ message: error.message || "Internal Server Error" })
    }
}
export default {
    createRecipe,
    getAllRecipes,
    getAllRecipesByUserId
}