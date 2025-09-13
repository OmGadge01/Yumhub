import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, X, Sparkles } from "lucide-react";

function FindRecipe() {
  const [ingredient, setIngredient] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [meals, setMeals] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const navigate = useNavigate();

  function ViewRecipe(id) {
    if (!id) return alert("Data Not Available");
    navigate(`/recipe/${id}`);
  }

  // add tag
  function addIngredient(e) {
    e.preventDefault();
    if (!ingredient.trim()) return;
    if (!ingredients.includes(ingredient.trim().toLowerCase())) {
      setIngredients([...ingredients, ingredient.trim().toLowerCase()]);
    }
    setIngredient("");
  }

  // Remove tag
  function removeIngredient(ing) {
    setIngredients(ingredients.filter((i) => i !== ing));
  }

  // Search recipes
  async function handleSearch(e) {
    e?.preventDefault();
    if (ingredients.length === 0) {
      alert("Please add at least one ingredient!");
      return;
    }

    setLoading(true);
    try {
      const first = ingredients[0];
      const res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/filter.php?i=${first}`
      );
      const data = await res.json();
      let fetchedMeals = data.meals || [];

      // Save history
      setHistory((prev) => Array.from(new Set([...prev, ...ingredients])));

      // Filter meals by checking all ingredients
      const filteredMeals = [];
      for (const meal of fetchedMeals) {
        const detailRes = await fetch(
          `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`
        );
        const detailData = await detailRes.json();
        const details = detailData.meals[0];

        const hasAll = ingredients.every((ing) =>
          Array.from({ length: 20 }).some(
            (_, i) =>
              details[`strIngredient${i + 1}`] &&
              details[`strIngredient${i + 1}`]
                .toLowerCase()
                .includes(ing.toLowerCase())
          )
        );

        if (hasAll) filteredMeals.push(meal);
      }

      setMeals(filteredMeals);
    } catch (err) {
      console.error("Error fetching recipes:", err);
    } finally {
      setLoading(false);
    }
  }

  // Random recipe
  async function fetchRandom() {
    setLoading(true);
    try {
      const res = await fetch(
        "https://www.themealdb.com/api/json/v1/1/random.php"
      );
      const data = await res.json();
      setMeals(data.meals || []);
    } catch (err) {
      console.error("Error fetching random recipe:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-100 to-blue-100 flex flex-col items-center justify-center h-full w-full">
      <h1 className="text-3xl md:text-4xl font-bold font-serif bg-gradient-to-r from-purple-400 to-red-600 bg-clip-text text-transparent leading-normal mb-6 drop-shadow">
        🍴 Find Delicious Recipes
      </h1>

      <form
        onSubmit={addIngredient}
        className="w-full max-w-lg flex items-center bg-white rounded-full shadow-lg overflow-hidden"
      >
        <input
          type="text"
          value={ingredient}
          onChange={(e) => setIngredient(e.target.value)}
          className="flex-1 px-4 py-2 text-gray-700 outline-none"
          placeholder="Add ingredients (e.g., chicken, onion)..."
        />
        <button
          type="submit"
          className="bg-purple-600 hover:bg-purple-700 cursor-pointer text-white px-4 py-2 flex items-center gap-1"
        >
          <Plus size={16} /> Add
        </button>
      </form>

      <div className="flex flex-wrap gap-2 mt-4">
        {ingredients.map((ing) => (
          <span
            key={ing}
            className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full flex items-center gap-2 shadow"
          >
            {ing}
            <button onClick={() => removeIngredient(ing)}>
              <X
                size={14}
                className="text-purple-600 hover:text-red-500 cursor-pointer"
              />
            </button>
          </span>
        ))}
      </div>

      <div className="flex gap-4 mt-6">
        <button
          onClick={handleSearch}
          className="bg-gradient-to-r cursor-pointer from-purple-500 to-red-500 text-white px-6 py-2 rounded-full shadow hover:opacity-90"
        >
          Search Recipes
        </button>
      </div>
      <div className="mt-4">
        <button
          onClick={fetchRandom}
          className="flex items-center cursor-pointer gap-2 bg-gradient-to-r from-pink-500 to-orange-400 text-white px-6 py-2 rounded-full shadow hover:opacity-90"
        >
          <Sparkles size={18} />
          Not Sure? Let’s Pick for You
        </button>
      </div>

      {/* History */}
      {/* {history.length > 0 && (
        <div className="mt-6 w-full max-w-lg">
          <h3 className="text-gray-700 font-semibold mb-2">Previous Ingredients:</h3>
          <div className="flex flex-wrap gap-2">
            {history.map((h) => (
              <button
                key={h}
                onClick={() => setIngredients([h])}
                className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-full text-sm"
              >
                {h}
              </button>
            ))}
          </div>
        </div>
      )} */}

      {loading && (
        <p className="mt-6 text-lg font-serif text-gray-600">
          Loading recipes...
        </p>
      )}

      {/* Recipes */}
      <div className="mt-8 m-6 grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {meals &&
          meals.length > 0 &&
          meals.map((meal) => (
            <div
              key={meal.idMeal}
              onClick={() => ViewRecipe(meal.idMeal)}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-transform transform hover:-translate-y-1"
            >
              <img
                src={meal.strMealThumb}
                alt={meal.strMeal}
                
                className="w-full h-48 object-cover rounded-t-2xl"
              />
              <div className="p-4 flex flex-col justify-between">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">
                  {meal.strMeal}
                </h2>
                <button
                  onClick={() => ViewRecipe(meal.idMeal)}
                  className="text-xs cursor-pointer text-red-500 font-medium hover:text-sm"
                >
                  View Recipe
                </button>
              </div>
            </div>
          ))}

        {meals && meals.length === 0 && !loading && (
          <p className="text-gray-600 font-serif text-lg col-span-full">
            No recipes found. Try another ingredient.
          </p>
        )}
      </div>
    </div>
  );
}

export default FindRecipe;
