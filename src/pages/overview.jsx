import axios from "axios";
import { CassetteTape, User, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { BiCategory, BiMoney } from "react-icons/bi";
import { FaClipboardList, FaProductHunt } from "react-icons/fa6";
import { GrDashboard, GrOrderedList } from "react-icons/gr";
import { PiPizza } from "react-icons/pi";

const Dashboard = () => {
    // amount of users
    const [amountUsers, setAmountUsers] = useState([]);
    // amount of orders
    const [amountOrders, setAmountOrders] = useState();
    // amount of categories
    const [amountCategories, setAmountCategories] = useState([]);
    // amout of foods
    const [amountFoods, setAmountFoods] = useState([]);
    // loading state
    const [loading, setLoading] = useState(true);
    // error state
    const [error, setError] = useState(null);
    // get user login token
    const token = localStorage.getItem("token");

    useEffect(() => {
            // fetch amount of orders 
            const fetchAmountOfOrders = async () => {
                try {
                    const response = await axios.get("http://127.0.0.1:8000/api/orders/",{
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    setAmountOrders(response.data.data.length);
                } catch (err) {
                    setError(err.message);
                } finally {
                    setLoading(false);
                }
            };

            // fetch amount of categories
            const fetchCategories = async () => {
                try {
                    const response = await axios.get("http://127.0.0.1:8000/api/categories");
                    setAmountCategories(response.data.data);
                } catch (err) {
                    setError(err.message);
                } finally {
                    setLoading(false);
                }
            };

            // fetch amount of foods or products
            const fetchFoods = async () => {
                try {
                    const response = await axios.get("http://127.0.0.1:8000/api/foods/fetchAllFoods", {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    setAmountFoods(response.data.data);
                } catch (err) {
                    setError(err.message);
                } finally {
                    setLoading(false);
                }
            };

            // fetch amount of users 
            const fetchCustomers = async () => {
                try {
                    const response = await axios.get("http://127.0.0.1:8000/api/users", {
                        // headers: {
                        //     Authorization: `Bearer ${token}`,
                        // },
                    });
                    setAmountUsers(response.data.data);
                } catch (err) {
                    setError(err.message);
                } finally {
                    setLoading(false);
                }
            }
        
            fetchFoods();
            fetchCategories();
            fetchAmountOfOrders();
            fetchCustomers();
        }, []);
    
        if (loading) return (
            <>
            <div className="flex justify-center items-center">
                <span className="loading loading-ring loading-xs"></span>
                <span className="loading loading-ring loading-sm"></span>
                <span className="loading loading-ring loading-md"></span>
                <span className="loading loading-ring loading-lg"></span>
                <span className="loading loading-ring loading-xl"></span>
            </div>
            </>
        );
        if (error) return <p>Error: {error}</p>;
    return (
        <>
                <h2 className="text-xl font-bold mb-4 text-gray-600 flex"><GrDashboard className="mr-1.5" size={30}/> Dashboard Page</h2>
            <div className="h-96 scrollBar">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="card bg-base-100 card-sm shadow-sm">
                        <div className="card-body">
                            <h2 className="card-title text-2xl">{amountUsers.length}</h2>
                            <div className="flex justify-between">
                                <p className="text-[15px] font-medium text-gray-500">Total Customers</p>
                                <div className="w-14 h-14 rounded-full -mt-4 flex justify-center items-center text-white bg-amber-400">
                                    <Users />
                                </div>
                            </div>
                            <div className="justify-start card-actions">
                                <button className="btn btn-outline btn-warning btn-sm border-gray-100">View All</button>
                            </div>
                        </div>
                    </div>
                    <div className="card bg-base-100 card-sm shadow-sm">
                        <div className="card-body">
                            <h2 className="card-title text-2xl">$200</h2>
                            <div className="flex justify-between">
                                <p className="text-[15px] font-medium text-gray-500">Total Revenues</p>
                                <div className="w-14 h-14 rounded-full -mt-4 flex justify-center items-center text-white bg-amber-400">
                                    <BiMoney size={30}/>
                                </div>
                            </div>
                            <div className="justify-start card-actions">
                                <button className="btn btn-outline btn-warning btn-sm border-gray-100">View All</button>
                            </div>
                        </div>
                    </div>
                    <div className="card bg-base-100 card-sm shadow-sm">
                        <div className="card-body">
                            <h2 className="card-title text-2xl">{amountOrders}</h2>
                            <div className="flex justify-between">
                                <p className="text-[15px] font-medium text-gray-500">Total Orders</p>
                                <div className="w-14 h-14 rounded-full -mt-4 flex justify-center items-center text-white bg-amber-400">
                                    <FaClipboardList size={30}/>
                                </div>
                            </div>
                            <div className="justify-start card-actions">
                                <button className="btn btn-outline btn-warning btn-sm border-gray-100">View All</button>
                            </div>
                        </div>
                    </div>
                    <div className="card bg-base-100 card-sm shadow-sm">
                        <div className="card-body">
                            <h2 className="card-title text-2xl">{amountFoods.length}</h2>
                            <div className="flex justify-between">
                                <p className="text-[15px] font-medium text-gray-500">Total Foods</p>
                                <div className="w-14 h-14 rounded-full -mt-4 flex justify-center items-center text-white bg-amber-400">
                                    <PiPizza size={30}/>
                                </div>
                            </div>
                            <div className="justify-start card-actions">
                                <button className="btn btn-outline btn-warning btn-sm border-gray-100">View All</button>
                            </div>
                        </div>
                    </div>
                    <div className="card bg-base-100 card-sm shadow-sm">
                        <div className="card-body">
                            <h2 className="card-title text-2xl">{amountCategories.length}</h2>
                            <div className="flex justify-between">
                                <p className="text-[15px] font-medium text-gray-500">Total Categories</p>
                                <div className="w-14 h-14 rounded-full -mt-4 flex justify-center items-center text-white bg-amber-400">
                                    <BiCategory size={30}/>
                                </div>
                            </div>
                            <div className="justify-start card-actions">
                                <button className="btn btn-outline btn-warning btn-sm border-gray-100">View All</button>
                            </div>
                        </div>
                    </div>
                    {/* <div className="card bg-base-100 card-sm shadow-sm">
                        <div className="card-body">
                            <h2 className="card-title text-2xl">200</h2>
                            <div className="flex justify-between">
                                <p className="text-[15px] font-medium text-gray-500">Total Categories</p>
                                <div className="w-14 h-14 rounded-full -mt-4 flex justify-center items-center text-white bg-amber-400">
                                    <CassetteTape/>
                                </div>
                            </div>
                            <div className="justify-start card-actions">
                                <button className="btn btn-outline btn-warning btn-sm border-gray-100">View All</button>
                            </div>
                        </div>
                    </div> */}

                </div>
            </div>
        </>
            
    );
};

export default Dashboard;