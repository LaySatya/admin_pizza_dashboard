import { useState } from "react";
import { FaBell } from "react-icons/fa";
import { MdKeyboardArrowDown } from "react-icons/md";

const deliveries = new Array(6).fill({
  id: "#001",
  status: "Ready",
  image: "https://theawesomedaily.com/wp-content/uploads/2016/09/pictures-of-pizza-23-1.jpg",
});

const TopBar = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  return (
    <div className="w-full h-16 bg-white flex justify-between items-center shadow shadow-sm px-6 relative">
      <h1 className="text-2xl font-semibold">Hello, Pich!</h1>
      <div className="flex items-center gap-6">
        {/* Notification Bell */} 
        <div className="relative">
          <div
            className="relative cursor-pointer"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <FaBell className="text-gray-500 text-xl" />
            {deliveries.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {deliveries.length}
              </span>
            )}
          </div>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-72 bg-white shadow-lg rounded-lg p-4 z-50">
              <h2 className="text-lg font-semibold mb-2">Orders</h2>
              <div className="max-h-60 overflow-y-auto">
                {deliveries.map((delivery, index) => (
                  <div key={index} className="flex items-center gap-3 p-2 border-b">
                    <img
                      src={delivery.image}
                      alt="Order"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <span className="font-medium">{delivery.id}</span>
                      <p className="text-sm text-gray-600">{delivery.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
          >
            <img
              src="https://randomuser.me/api/portraits/men/32.jpg"
              alt="User"
              className="w-10 h-10 rounded-full object-cover"
            />
            <MdKeyboardArrowDown className="text-gray-500 text-lg" />
          </div>

          {showProfileDropdown && (
            <div className="absolute right-0 mt-3 w-48 bg-white shadow-lg rounded-lg py-2 z-50">
              <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                Profile
              </a>
              <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                Logout
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopBar;