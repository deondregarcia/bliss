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

  // request recipes with spoonacular api from backend
  const getRecipes = () => {
    Axios.post("/get-recipes", {
      query: recipeSearch,
    })
      .then((res) => {
        console.log(res.data.data);
        setRecipeArray(res.data.data);
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
