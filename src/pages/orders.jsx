import axios from "axios";
import { useEffect, useState } from "react";
import { BiDetail } from "react-icons/bi";

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null); // Store selected order details
    const [drivers, setDrivers] = useState([]);
    const [selectedDrivers, setSelectedDrivers] = useState({});

    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get(
                    "http://127.0.0.1:8000/api/orders/fetch-order-details",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setOrders(response.data.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        const fetchDrivers = async () => {
            try {
                const response= await axios.get('http://127.0.0.1:8000/api/orders/fetch-all-drivers',{
                    headers:{
                        Authorization : `Bearer ${token}`,
                    }
                    
                });
                console.log('Drivers response:', response.data);
                if (Array.isArray(response.data)) {
                    setDrivers(response.data);
                } else {
                    console.error("Invalid drivers format", response.data);
                }                // setDrivers(response.data.data) do not use this because API does not reponse with this format
            } catch (err) {
                setError('Failed to fetch drivers');
            }
        };

        fetchOrders();
        fetchDrivers();
    }, []);



    const fetchOrderDetails = async (orderId) => {
        try {
            const response = await axios.get(
                `http://127.0.0.1:8000/api/orders/fetch-order-detail-by-id/${orderId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setSelectedOrder(response.data.data);
        } catch (err) {
            console.error("Failed to fetch order details:", err);
        }
    };

    // Function to handle the accept/decline action

    // const handleStatusChange = async (orderId, status) => {
    //     try {
    //         const response = await axios.patch(
    //             `http://127.0.0.1:8000/api/orders/accept-or-declined/${orderId}`,
    //             { status },
    //             {
    //                 headers: {
    //                     Authorization: `Bearer ${token}`,
    //                 },
    //             }
    //         );
    //         // Update the local state with the new order status
    //         setOrders(prevOrders =>
    //             prevOrders.map(order =>
    //                 order.id === orderId ? { ...order, status: response.data.order.status } : order
    //             )
    //         );
    //     } catch (err) {
    //         setError(err.message);
    //     }
    // };

    const handleStatusChange = async (orderId, status) => {
        // Optimistically update UI first
        setOrders(prevOrders =>
            prevOrders.map(order =>
                order.id === orderId ? { ...order, status } : order
            )
        );

        try {
            const response = await axios.patch(
                `http://127.0.0.1:8000/api/orders/accept-or-declined/${orderId}`,
                { status },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            

            // Ensure backend status is reflected in UI
            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order.id === orderId ? { ...order, status: response.data.order.status } : order
                )
            );
        } catch (err) {
            // Revert to previous status if API fails
            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order.id === orderId ? { ...order, status: prevOrders.find(o => o.id === orderId).status } : order
                )
            );
            setError(err.message);
        }
    };
    
    const handleDriverChange = (orderId, driverId) => {
        setSelectedDrivers((prev) => ({
            ...prev,
            [orderId]: driverId,
        }));
    };
    
    const assignDriver = async (orderId) => {
        const driverId = selectedDrivers[orderId];
        if (!driverId) {
            alert("Please select a driver");
            return;
        }
    
        try {
            const response = await axios.patch(
                `http://127.0.0.1:8000/api/orders/assign-a-driver/${orderId}`,
                { driver_id: driverId },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            alert("Driver assigned successfully!");
            // Optionally update UI after assigning driver
            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order.id === orderId ? { ...order, driver: response.data.driver } : order
                )
            );
        } catch (err) {
            console.error("Failed to assign driver:", err);
            alert("Failed to assign driver");
        }
    };
    

    if (loading)
        return (
            <div className="flex justify-center items-center">
                <span className="loading loading-ring loading-lg"></span>
            </div>
        );

    if (error) return <p>Error: {error}</p>;

    const orderStatus = (status) => {
        switch (status) {
            case "success":
                return <div className="badge badge-success">Success</div>;
            case "pending":
                return <div className="badge badge-warning">Pending</div>;
            case "failed":
                return <div className="badge badge-danger">Failed</div>;
            case "processing":
                return <div className="badge badge-info">Processing</div>;
            default:
                return <div className="badge badge-secondary">Unknown</div>;
        }
    };

    return (
        <>
            <div className="flex justify-between mt-5">
                <h2 className="text-xl font-bold">📦 Orders</h2>
            </div>

            <div className="mt-5">
                <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Order Number</th>
                                <th>Food</th>
                                <th>Customer</th>
                                <th>Quantity</th>
                                <th>Status</th>
                                <th>Driver</th>
                                <th>Address</th>
                                <th>Created At</th>
                                <th>Detail</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.length > 0 ? (
                                orders.map((order) => (
                                    <tr key={order.id}>
                                        <td>{order.order_number}</td>
                                        <td>
                                            {order.order_details
                                                .map((item) => item.name)
                                                .join(", ")}
                                        </td>
                                        <td>{order.customer.name}</td>
                                        <td>{order.quantity}</td>

                                        <td>
                                            
                                            <select
                                                className="select select-bordered select-sm"
                                                value={order.status}
                                                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                disabled={order.status == "assigning" || order.status === "delivering" || order.status === "completed"}
                                            >
                                                {/* <option value="pending">🟡 Pending</option> */}
                                                <option value="accepted">✅ Accepted</option>
                                                <option value="declined">❌ Declined</option>
                                                {/* <option value="assigning">🔄 Assigning</option> */}
                                                {/* <option value="delivering">🚚 Delivering</option>
                                                <option value="completed">🎉 Completed</option> */}
                                            </select>
                                        </td>
                                        <td>
                                        <select
                                            className="select select-bordered select-sm"
                                            value={selectedDrivers[order.id] || ""}
                                            onChange={(e) => handleDriverChange(order.id, e.target.value)}
                                        >
                                            <option value="">Select Driver</option>
                                            {drivers.map((driver) => (
                                                <option key={driver.id} value={driver.id}>
                                                    {driver.name}
                                                </option>
                                            ))}
                                        </select>
                                        <button
                                            className="btn btn-primary btn-sm ml-2"
                                            onClick={() => assignDriver(order.id)}
                                        >
                                            Assign
                                        </button>
                                        </td>

                                        <td>{order.address?.reference}</td>
                                        <td>
                                            {new Date(order.created_at).toLocaleDateString(
                                                "en-US"
                                            )}
                                        </td>
                                        <td>
                                            <button
                                                className="btn btn-warning mx-1 btn-sm text-white"
                                                onClick={() => {
                                                    fetchOrderDetails(order.id);
                                                    document
                                                        .getElementById("orderDetailModal")
                                                        .showModal();
                                                }}
                                            >
                                                <BiDetail height={17} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={9} className="text-center">
                                        No orders found!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Order Detail Modal */}
            <dialog id="orderDetailModal" className="modal">
                <div className="modal-box w-11/12 max-w-5xl">
                    <h3 className="font-bold text-lg">Order Detail</h3>
                    {selectedOrder ? (
                        <div>
                            <p>Order Number: {selectedOrder.order_number}</p>
                            <p>Customer: {selectedOrder.customer.name}</p>
                            {/* <p>Driver: {selectedOrder.driver?.name ?? "Not assigned"}</p> */}
                            <p>Address: {selectedOrder.address?.reference ?? "N/A"}</p>
                            <p>Status: {selectedOrder.status}</p>
                            <p>Payment: {selectedOrder.payment_method}</p>
                            <p>Total: ${selectedOrder.total}</p>
                            <p>Created At: {new Date(selectedOrder.created_at).toLocaleString()}</p>
                            <p>Updated At: {new Date(selectedOrder.updated_at).toLocaleString()}</p>
                            <h4 className="mt-2 font-bold">Food Items:</h4>
                            <ul>
                                {selectedOrder.order_details.map((item) => (
                                    <li key={item.id}>
                                        {item.name} - {item.quantity} x ${item.price}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : (
                        <p>Loading order details...</p>
                    )}


                    <div className="modal-action">
                        <form method="dialog">
                            <button className="btn">Close</button>
                        </form>
                    </div>
                </div>
            </dialog>
        </>
    );
};

export default Orders;
