import { useState, useEffect } from "react";
import "./App.css";
import "./index.css";
import AdminLayout from "./layout/adminLayout";
import NotFound from "./pages/404";
import Categories from "./pages/categories";
import Deliveries from "./pages/deliveries";
import Orders from "./pages/orders";
import Dashboard from "./pages/overview";
import Products from "./pages/products";
import Login from "./pages/login"; // Import the Login component
import Users from "./pages/users";

function App() {
    const [selectedPage, setSelectedPage] = useState("overview");
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // Check if the user is logged in
        const loggedInStatus = localStorage.getItem("isLoggedIn");
        setIsLoggedIn(loggedInStatus === "true");
    }, []);

    const renderPage = () => {
        switch (selectedPage) {
            case "overview":
                return <Dashboard />;
            case "orders":
                return <Orders />;
            case "products":
                return <Products />;
            case "categories":
                return <Categories />;
            case "users":
                return <Users />
            case "deliveries":
                return <Deliveries />;
            default:
                return <NotFound />;
        }
    };

    // If not logged in, show the Login page
    if (!isLoggedIn) {
        return <Login />;
    }

    return <AdminLayout onSelectPage={setSelectedPage}>{renderPage()}</AdminLayout>;
}

export default App;
