import React, { useState } from "react";
import { RecipeContentType } from "../../../types/content";
import "./RecipeInput.css";
import Axios from "axios";
import { GetRecipesButton } from "../../Buttons/Buttons";

const RecipeInput = ({
  setRecipeArray,
}: {
  setRecipeArray: React.Dispatch<React.SetStateAction<RecipeContentType[]>>;
}) => {
  const [recipeSearch, setRecipeSearch] = useState<string>("tacos");

  // request recipes with spoonacular api
  const getRecipes = () => {
    const recipeOptions = {
      params: {
        query: recipeSearch,
        number: 4,
        sort: "popularity",
        ranking: 2,
      },
      headers: {
        "X-RapidAPI-Key": "7b783e3ddfmsh0489e8cc42e6687p135823jsn125c1ac6400e",
        "X-RapidAPI-Host":
          "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
      },
    };
    Axios.get(
      "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/complexSearch",
      recipeOptions
    )
      .then((res) => {
        console.log(res);
        setRecipeArray(res.data.results);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="recipe-api-input-wrapper">
      {/* <label htmlFor="recipe-input" className="recipe-api-text">
        Enter recipe:
      </label> */}
      <div className="recipe-api-input-interactables">
        <input
          type="text"
          id="recipe-input"
          value={recipeSearch}
          onChange={(e) => setRecipeSearch(e.target.value)}
          className="recipe-api-input-text"
        />
        {/* <button onClick={getRecipes}>Get Recipes</button> */}
        <GetRecipesButton getRecipes={getRecipes} />
      </div>
    </div>
  );
};

export default RecipeInput;
