import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft, Youtube } from "lucide-react"; // needs lucide-react installed

function RecipeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecipe() {
      try {
        const res = await fetch(
          `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
        );
        const data = await res.json();
        setRecipe(data.meals ? data.meals[0] : null);
      } catch (err) {
        console.error("Error fetching recipe details:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchRecipe();
  }, [id]);

  if (loading) return <p className="p-6 text-center text-lg">Loading recipe details...</p>;
  if (!recipe) return <p className="p-6 text-center text-red-500">Recipe not found!</p>;

  // Convert long instructions into steps
  const steps = recipe.strInstructions
    ? recipe.strInstructions.split(/\r?\n/).filter((line) => line.trim() !== "")
    : [];

  return (
    <div className="bg-gradient-to-r rounded-2xl from-pink-100 to-blue-100 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header Image */}
        <div className="relative">
          <img
            src={recipe.strMealThumb}
            alt={recipe.strMeal}
            className="w-full h-72 object-cover"
          />
          <button
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4 flex items-center gap-2 bg-white/80 hover:bg-white px-4 py-2 rounded-full shadow-lg text-gray-800 font-medium"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">{recipe.strMeal}</h1>

          {/* Grid layout */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Ingredients */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl shadow">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">🛒 Ingredients</h2>
              <ul className="space-y-2 text-gray-700">
                {Array.from({ length: 20 }).map((_, i) => {
                  const ingredient = recipe[`strIngredient${i + 1}`];
                  const measure = recipe[`strMeasure${i + 1}`];
                  return (
                    ingredient && (
                      <li
                        key={i}
                        className="flex items-center gap-2 text-base border-b border-gray-200 pb-1"
                      >
                        <span className="font-medium">{ingredient}</span>
                        <span className="text-gray-500">- {measure}</span>
                      </li>
                    )
                  );
                })}
              </ul>
            </div>

            {/* Instructions */}
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-700">📖 Instructions</h2>
              <ul className="space-y-3 list-inside text-gray-700">
                {steps.map((step) => (
                  <li className="">
                    {step}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* YouTube link */}
          {recipe.strYoutube && (
            <div className="mt-8 flex justify-center">
              <a
                href={recipe.strYoutube}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full shadow-lg font-medium"
              >
                <Youtube className="w-5 h-5" /> Watch on YouTube
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RecipeDetails;
