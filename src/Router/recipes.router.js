import express from "express"
import recipeController from '../Controller/recipe.controller.js'

const recipesrouter=express.Router()

recipesrouter.get('/',(request,response)=>response.send({message:"Recipes Data Fetched"}))


recipesrouter.get('/getAllRecipes',recipeController.getAllRecipes)
recipesrouter.get('/getAllRecipesByUserId/:id',recipeController.getAllRecipesByUserId)
recipesrouter.post('/createRecipe',recipeController.createRecipe)

export default recipesrouter
