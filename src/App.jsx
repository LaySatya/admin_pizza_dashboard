import { Users } from "lucide-react";
import { useState } from "react";
import "./App.css";
import "./index.css";
import AdminLayout from "./layout/adminLayout";
import NotFound from "./pages/404";
import Categories from "./pages/categories";
import Deliveries from "./pages/deliveries";
import Orders from "./pages/orders";
import Dashboard from "./pages/overview";
import Products from "./pages/products";


function App() {
    const [selectedPage, setSelectedPage] = useState("overview");

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

    return <AdminLayout onSelectPage={setSelectedPage}>{renderPage()}</AdminLayout>;
}

export default App;