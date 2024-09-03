import express from "express"
import recipeController from '../Controller/recipe.controller.js'
import VerifyAuth from '../Middleware/verifyAuth.js'

const recipesrouter=express.Router()

recipesrouter.get('/',(request,response)=>response.send({message:"Recipes Data Fetched"}))


recipesrouter.get('/getAllRecipes',VerifyAuth,recipeController.getAllRecipes)
recipesrouter.get('/getAllRecipesByUserId/:id',VerifyAuth,recipeController.getAllRecipesByUserId)
recipesrouter.post('/createRecipe',VerifyAuth,recipeController.createRecipe)

export default recipesrouter
