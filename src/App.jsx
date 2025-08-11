import { Routes, Route } from "react-router-dom";
import LandingLayout from "./layout/LandingLayout";
import Landing from "./pages/Landing";
import Cart from "./pages/Cart";
import Favorites from "./pages/Favorites";
import Product from "./pages/Product";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingLayout />}>
        <Route index element={<Landing />} />
        <Route path="/products" element={<Landing />} />
        <Route path="products/:permalink" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/favorites" element={<Favorites />} />
      </Route>
    </Routes>
  );
}

export default App;
