import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
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
                const response = await axios.get(
                    "http://127.0.0.1:8000/api/users/get-users-by-role-name/driver",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                console.log("Drivers response:", response.data);
                if (Array.isArray(response.data.data)) {
                    setDrivers(response.data.data);
                } else {
                    console.error("Invalid drivers format", response.data);
                }
            } catch (err) {
                setError("Failed to fetch drivers");
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
            console.log("order detail response: ", response.data.data);
            setSelectedOrder(response.data.data);
        } catch (err) {
            console.error("Failed to fetch order details:", err);
        }
    };


   
    const handleStatusChange = async (orderId, status) => {
        // Optimistically update UI first
        setOrders((prevOrders) =>
            prevOrders.map((order) =>
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
            setOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order.id === orderId
                        ? { ...order, status: response.data.order.status }
                        : order
                )
            );
        } catch (err) {
            // Revert to previous status if API fails
            setOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order.id === orderId
                        ? {
                            ...order,
                            status: prevOrders.find((o) => o.id === orderId).status,
                        }
                        : order
                )
            );
            setError(err.message);
        }
    };

    // const handleDriverChange = async (orderId, driverId) => {
    //     setSelectedDrivers((prev) => ({
    //         ...prev,
    //         [orderId]: driverId,
    //     }));
    
    //     try {
    //         const response = await axios.patch(
    //             `http://127.0.0.1:8000/api/orders/assign-a-driver/${orderId}`,
    //             { driver_id: driverId },
    //             {
    //                 headers: {
    //                     Authorization: `Bearer ${token}`,
    //                 },
    //             }
    //         );
    //         // if(response){
    //             toast.success("Driver has been assigned to this order.");
    //             setOrders((prevOrders) =>
    //                 prevOrders.map((order) =>
    //                     order.id === orderId
    //                         ? {
    //                             ...order,
    //                             driver: response.data.driver || { id: driverId }, // fallback if API doesn't return driver object
    //                             status: order.status === "accepted" ? "assigning" : order.status
    //                         }
    //                         : order
    //                 )
    //             );
    //         // }
    //         // Update the order's driver and optionally change status to "assigning"
    //     } catch (err) {
    //         console.error("Failed to assign driver:", err);
    //         setError("Failed to assign driver. Please try again.");
    //     }
    // };
    const handleDriverChange = async (orderId, driverId) => {
        setSelectedDrivers((prev) => ({
            ...prev,
            [orderId]: driverId,
        }));
    
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
    
            // Find the selected driver's full object from the drivers list
            const assignedDriver = drivers.find((d) => d.id === parseInt(driverId));
    
            // Update the orders state with the full driver info
            setOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order.id === orderId
                        ? {
                            ...order,
                            driver: assignedDriver || { id: driverId }, // fallback if not found
                            status: order.status === "accepted" ? "assigning" : order.status
                        }
                        : order
                )
            );
        } catch (err) {
            console.error("Failed to assign driver:", err);
            setError("Failed to assign driver. Please try again.");
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
            case "accepted":
                return <div className="badge badge-soft badge-success">Accepted</div>;
            case "pending":
                return <div className="badge badge-soft badge-warning">Pending</div>;
            case "declined":
                return <div className="badge badge-soft badge-danger">Declined</div>;
            case "assigning":
                return (
                    <div className="badge badge-soft badge-info text-white">
                        Assigning
                    </div>
                );
            case "delivering":
                return <div className="badge badge-soft badge-primary">Delevering</div>;
            case "completed":
                return <div className="badge badge-soft badge-success">Completed</div>;
            default:
                return <div className="badge badge-soft badge-secondary">Unknown</div>;
        }
    };

    return (
        <>
            <div className="flex justify-between mt-5">
                <h2 className="text-xl font-bold">📦 Orders</h2>
            </div>

            <div className="mt-5 overflow-auto ">
                <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Order Number</th>
                                <th>Food</th>
                                <th>Customer</th>
                                <th>Quantity</th>
                                <th>Status</th>
                                <th>Set Status</th>
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
                                            {order.order_details.map((item) => item.name).join(", ")}
                                        </td>
                                        <td>{order.customer.name}</td>
                                        <td>{order.quantity}</td>
                                        <td>{orderStatus(order.status)}</td>
                                        <td>
                                            <select
                                                className="select select-bordered select-sm w-32"
                                                value={order.status}
                                                onChange={(e) =>
                                                    handleStatusChange(order.id, e.target.value)
                                                }
                                            // disabled={order.status == "assigning" || order.status === "delivering" || order.status === "completed"}
                                            >
                                                {order.status === "accepted" ? (
                                                    <>
                                                        <option value="accepted">✅ Accepted</option>
                                                    </>
                                                ) : order.status === "assigning" ? (
                                                    <>
                                                        <option value="assigning">🔄 Assigning</option>
                                                    </>
                                                ) : order.status === "delivering" ? (
                                                    <>
                                                        <option value="delivering">🚚 Delivering</option>
                                                        {/* <option value="completed">🎉 Completed</option> */}
                                                    </>
                                                ) :  order.status === "completed" ?
                                                    (
                                                        <option value="completed">🎉 Completed</option>
                                                    ):
                                                (
                                                    <>
                                                        <option value="pending">⏳ Pending</option>
                                                        <option value="accepted">✅ Accepted</option>
                                                        <option value="declined">❌ Declined</option>
                                                    </>
                                                )
                                                }
                                             
                                            </select>
                                        </td>
                                        <td className="flex">
                                            {
                                                order.status === "accepted" || order.status === "assigning" ? (
                                                        order.driver === null  ? (
                                                            <>
                                                            <select
                                                                className="select select-bordered select-sm w-32"
                                                                value={order.driver}
                                                                onChange={(e) =>
                                                                    handleDriverChange(order.id, e.target.value)
                                                                }
                                                                
                                                            >
                                                                <option>Select Driver</option>
                                                                {drivers.map((driver) => (
                                                                /* list all drivers to select */
                                                                <option key={driver.id} value={driver.id}>
                                                                    {driver.name}
                                                                </option>
                                                                ))}
                                                                </select>
                                                            </>
                                                        ) : (
                                                            <div className="badge badge-dash p-3 badge-success">
                                                                <p>{order.driver.name}</p>
                                                            </div>
                                                        )
                                                       
                                                       
                                    
                                                ) : (
                                                    <>
                                                        <div className="badge badge-soft p-2 badge-error">
                                                            <p className="text-nowrap">No driver</p>
                                                        </div>
                                                    </>
                                                )
                                            }
                                        </td>

                                        <td>{order.address?.reference}</td>
                                        <td>
                                            {new Date(order.created_at).toLocaleDateString("en-US")}
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
                            {/* <p>Customer: {selectedOrder.customer.name}</p> */}
                            {/* <p>Driver: {selectedOrder.driver?.name ?? "Not assigned"}</p> */}
                            <p>Address: {selectedOrder.address?.reference ?? "N/A"}</p>
                            <p>Status: {selectedOrder.status}</p>
                            <p>Payment: {selectedOrder.payment_method}</p>
                            <p>Total: ${selectedOrder.total}</p>
                            <p>
                                Created At:{" "}
                                {new Date(selectedOrder.created_at).toLocaleString()}
                            </p>
                            <p>
                                Updated At:{" "}
                                {new Date(selectedOrder.updated_at).toLocaleString()}
                            </p>
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
