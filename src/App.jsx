import { Routes, Route } from "react-router-dom";
import LandingLayout from "./layout/LandingLayout";
import Landing from "./pages/Landing";
import Cart from "./pages/Cart";
import Favorites from "./pages/Favorites";
import Product from "./pages/Product";
import Collection from "./pages/Collection";
import { FavoritesProvider } from "./contexts/FavoritesContext";
import { CartProvider } from "./contexts/CartContext";
import Search from "./pages/Search";
import UserLayout from "./layout/UserLayout";
import User from "./pages/User";

function App() {
  return (
    <FavoritesProvider>
      <CartProvider>
        <Routes>
          <Route path="/" element={<LandingLayout />}>
            <Route index element={<Landing />} />
            <Route path="products" element={<Landing />} />
            <Route path="products/:permalink" element={<Product />} />
            <Route path="collection/:permalink" element={<Collection />} />
            <Route path="cart" element={<Cart />} />
            <Route path="favorites" element={<Favorites />} />
            <Route path="search" element={<Search />} />
          </Route>
          <Route path="/" element={<UserLayout />}>
            <Route path="user" element={<User />} />
          </Route>
        </Routes>
      </CartProvider>
    </FavoritesProvider>
  );
}

export default App;