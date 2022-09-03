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
        <h3 className="recipe-display-info-title">{recipe.title}</h3>
        <p className="recipe-display-info-text">Likes: {recipe.likes}</p>
      </div>
    </div>
  );
};

export default RecipeDisplay;
