import "./App.css";
import FindRecipe from "./Components/FindRecipe";
import RecipeDetails from "./Components/RecipeDetails";
import { BrowserRouter as Router ,Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FindRecipe />} />
        <Route path="/recipe/:id" element={<RecipeDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
