import React from "react";
import { RecipeContentType } from "../../../types/content";
import "./RecipeDisplay.css";

const RecipeDisplay = ({ recipe }: { recipe: RecipeContentType }) => {
  return (
    <div className="recipe-display-container">
      <img
        src={recipe.image}
        alt="recipe image"
        className="recipe-display-image"
      />
      <div className="recipe-display-info">
        <p className="recipe-display-info-title">{recipe.title}</p>
      </div>
    </div>
  );
};

export default RecipeDisplay;
