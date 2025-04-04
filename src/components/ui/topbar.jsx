import axios from "axios";
import { LogOut, User } from "lucide-react";
import { useEffect, useState } from "react";
import { FaBell } from "react-icons/fa";
import { MdKeyboardArrowDown } from "react-icons/md";

const deliveries = new Array(6).fill({
  id: "#001",
  status: "Ready",
  image:
    "https://theawesomedaily.com/wp-content/uploads/2016/09/pictures-of-pizza-23-1.jpg",
});




const TopBar = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [profileImg, setProfileImg] = useState("");
  const [adminName, setAdminName] = useState("");

  const [theme, setTheme] = useState(localStorage.getItem("theme") ? localStorage.getItem("theme") : "light");
  const handleToggleTheme = (e) => {
    if (e.target.checked) {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  }
  useEffect(() => {
    localStorage.setItem("theme", theme);
    const localTheme = localStorage.getItem("theme");
    document.querySelector("html").setAttribute("data-theme", localTheme);

  }, [theme]);
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user_id");
    window.location.href = "/";
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("user_id");

        if (!userId) {
          console.error("User ID not found");
          return;
        }

        const response = await axios.get(
          `http://127.0.0.1:8000/api/users/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setAdminName(response.data.data.name);
        setProfileImg(response.data.data.avatar);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="w-full dark:bg-white light:bg-gray-900 dark:text-white flex justify-between items-center p-2.5 shadow-sm px-6 relative">
      <h1 className="text-xl italic font-semibold flex dark:text-white">
        <User className="m-0.5 mr-1" /> Hello, {adminName}
      </h1>
      <div className="flex items-center gap-6">
        {/* Mode Switch */}
        <div>
          <label className="swap swap-rotate">
            {/* this hidden checkbox controls the state */}
            <input type="checkbox" checked={theme === "light" ? false : true} onClick={handleToggleTheme} className="theme-controller" value="synthwave" />

            {/* sun icon */}
            <svg
              className="swap-off h-7 w-7 fill-current"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24">
              <path
                d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
            </svg>

            {/* moon icon */}
            <svg
              className="swap-on h-7 w-7 fill-current"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24">
              <path
                d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
            </svg>
          </label>
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <div
            className="relative cursor-pointer"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <FaBell className="text-gray-500 dark:text-white text-xl" />
            {deliveries.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {deliveries.length}
              </span>
            )}
          </div>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-72 dark:bg-gray-800 shadow-lg rounded-lg p-4 z-50">
              <h2 className="text-lg font-semibold mb-2 dark:text-white">Orders</h2>
              <div className="max-h-60 overflow-y-auto dark:text-white">
                {deliveries.map((delivery, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-2 border-b border-gray-200 dark:border-gray-700"
                  >
                    <img
                      src={delivery.image}
                      alt="Order"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <span className="font-medium dark:text-white">{delivery.id}</span>
                      <p className="text-sm  dark:text-gray-400">{delivery.status}</p>
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
              src={profileImg}
              alt="User"
              className="w-10 h-10 rounded-full object-cover"
            />
            <MdKeyboardArrowDown className="text-gray-500 dark:text-gray-300 text-lg" />
          </div>

          {showProfileDropdown && (
            <div className="absolute right-0 mt-3 w-48 dark:bg-gray-800 shadow-lg rounded-lg py-2 z-50">
              <a
                href="#"
                className="flex gap-1 px-4 py-2  dark:text-gray-200 dark:hover:bg-gray-600"
              >
               <User size={20} className="m-0.5"/> Profile
              </a>
              <button
                className="flex gap-1 w-full text-left px-4 py-2 dark:text-gray-200 dark:hover:bg-gray-600"
                onClick={handleLogout}
              >
                <LogOut size={20} className="m-0.5"/> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopBar;

