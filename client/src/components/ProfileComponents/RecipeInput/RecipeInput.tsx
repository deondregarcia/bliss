import React, { useState } from "react";
import { RecipeContentType } from "../../../types/content";
import "./RecipeInput.css";
import Axios from "axios";

const RecipeInput = ({
  setRecipeArray,
}: {
  setRecipeArray: React.Dispatch<React.SetStateAction<RecipeContentType[]>>;
}) => {
  const [recipeIngredients, setRecipeIngredients] = useState<string>("");

  // request recipes with spoonacular api
  const getRecipes = () => {
    const recipeOptions = {
      params: {
        ingredients: recipeIngredients,
        number: 2,
        ignorePantry: true,
        ranking: 1,
      },
      headers: {
        "X-RapidAPI-Key": "7b783e3ddfmsh0489e8cc42e6687p135823jsn125c1ac6400e",
        "X-RapidAPI-Host":
          "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
      },
    };
    Axios.get(
      "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/findByIngredients",
      recipeOptions
    )
      .then((res) => {
        console.log(res);
        setRecipeArray(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="recipe-api-input-wrapper">
      <label htmlFor="recipe-input">Enter Ingredients:</label>
      <div className="recipe-api-input-interactables">
        <input
          type="text"
          id="recipe-input"
          value={recipeIngredients}
          onChange={(e) => setRecipeIngredients(e.target.value)}
        />
        <button onClick={getRecipes}>Get Recipes</button>
      </div>
    </div>
  );
};

export default RecipeInput;
