import axios from "axios";
import { Truck } from "lucide-react";
import { useEffect, useState } from "react";
// import NoDataIMG from "./images/no-data.png";

const Deliveries = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchDeliveringOrders = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:8000/api/orders/fetch-delivering-orders",{
                    headers: {
                        // "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`,
                    }
                });
                setOrders(response.data.data); // Assuming the orders are inside `data.data`
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDeliveringOrders();
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
            <h2 className="text-xl font-bold flex gap-1"><Truck  className="m-0.5"/> Delivering</h2>
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {orders.length > 0 ? (
                    orders.map(order => (
                        <div key={order.id} className="card bg-base-100 w-80 shadow-sm">
                            <figure>
                                <img
                                    src={order.image || "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"}
                                    alt="Order Image"
                                />
                            </figure>
                            <div className="card-body">
                                <h2 className="card-title">
                                    Order #{order.id}
                                    <div className={`badge ${order.status === "delivering" ? "badge-success badge-dash" : "badge-secondary badge-dash"}`}>
                                        {order.status.toUpperCase()}
                                    </div>
                                </h2>
                                <p>Customer: {order.customer || "Unknown"}</p>
                                <p>Delivery Address: {order.address}</p>
                                <div className="card-actions justify-end">
                                    <div className="badge badge-outline">Detail</div>
                                    <div className="badge badge-outline badge-success">Track</div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <img className="" src="https://static.vecteezy.com/system/resources/previews/006/229/257/large_2x/businessman-adds-file-to-big-folder-storage-and-indexing-of-information-businessman-holds-paper-document-user-and-data-archive-vector.jpg" alt="" srcset="" />
                )}
            </div>
        </>
    );
};

export default Deliveries;
