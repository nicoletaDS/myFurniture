import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import HomeScreen from "./screens/HomeScreen";
import ProductScreen from "./screens/ProductScreen";
import CartScreen from "./screens/CartScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import ProfileScreen from "./screens/ProfileScreen";
import ShippingScreen from "./screens/ShippingScreen";
import PlaceOrderScreen from "./screens/PlaceOrderScreen";
import OrderScreen from "./screens/OrderScreen";

function App() {
  return (
    <Router>
      <Header />

      <Routes>
        <Route path="/" exact element={<HomeScreen />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/register" element={<RegisterScreen />} />
        <Route path="/profile" element={<ProfileScreen />} />
        <Route path="/products/:id" element={<ProductScreen />} />
        <Route path="/cart" element={<CartScreen />}>
          <Route path=":id" element={<CartScreen />} />
        </Route>
        <Route path="/shipping" element={<ShippingScreen />}></Route>
        <Route path="/placeorder" element={<PlaceOrderScreen />}></Route>
        <Route path="/orders/:id" element={<OrderScreen />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
