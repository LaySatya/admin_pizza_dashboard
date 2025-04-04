import { User } from "lucide-react";
import { useState } from "react";

import { FaBox, FaClipboardList, FaDashcube, FaLayerGroup, FaTruck } from "react-icons/fa";

const Sidebar = ({ onSelect }) => {
    const menuItems = [
        { id: "overview", name: "Overview", icon: <FaDashcube /> },
        { id: "orders", name: "Orders", icon: <FaClipboardList /> },
        { id: "products", name: "Products", icon: <FaBox /> },
        { id: "categories", name: "Categories", icon: <FaLayerGroup /> },
        { id: "users", name: "Users" , icon: <User /> },
        { id: "deliveries", name: "Deliveries", icon: <FaTruck /> },
        // { id: "setup", name: "Setup", icon: <FaCogs /> },
    ];
    const [active, setActive] = useState("overview");

    return (
        <div className="w-64 h-screen md:block hidden shadow-sm">
            <div className="flex justify-center items-center mt-5 mb-5">
                <a href="/">
                    <img className="h-22" src="https://th.bing.com/th/id/OIP.t_mRg2tyUzuNTIdw_ZkfiwHaFj?rs=1&pid=ImgDetMain" alt="" />
                </a>
            </div>
            <ul className="space-y-1">
                {menuItems.map((item) => (
                    <li
                        key={item.id}
                        onClick={() => {
                            setActive(item.id);
                            onSelect(item.id);
                        }}
                        className={`flex justify-between items-center cursor-pointer h-14 ${
                            active === item.id
                                ? "text-yellow-500 font-semibold dark:bg-slate-700"
                                : "dark:text-white"
                        }`}
                    >
                        <p className="pl-6 flex items-center gap-3">
                            {item.icon} {item.name}
                        </p>
                        {active === item.id && <div className="bg-yellow-500 w-1 rounded-md h-14"></div>}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Sidebar;