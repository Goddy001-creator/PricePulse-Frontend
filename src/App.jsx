import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import { useEffect, useState } from "react";

import AppLayout from "./components/layout/AppLayout";
import SplashScreen from "./components/ui/SplashScreen";

import About from "./pages/About";
import Alerts from "./pages/Alerts";
import Analytics from "./pages/Analytics";
import Dashboard from "./pages/Dashboard";
import ProductDetails from "./pages/ProductDetails";
import Products from "./pages/Products";
import Settings from "./pages/Settings";
import Stores from "./pages/Stores";

function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const splashTimer = window.setTimeout(() => {
      setShowSplash(false);
    }, 1800);

    return () => {
      window.clearTimeout(splashTimer);
    };
  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route
            path="/"
            element={<Navigate to="/dashboard" replace />}
          />

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/products"
            element={<Products />}
          />

          <Route
            path="/products/:productId"
            element={<ProductDetails />}
          />

          <Route
            path="/analytics"
            element={<Analytics />}
          />

          <Route
            path="/stores"
            element={<Stores />}
          />

          <Route
            path="/alerts"
            element={<Alerts />}
          />

          <Route
            path="/settings"
            element={<Settings />}
          />

          <Route
            path="/about"
            element={<About />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;