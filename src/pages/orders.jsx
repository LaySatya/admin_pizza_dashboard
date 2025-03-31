import axios from "axios";
import { useEffect, useState } from "react";
import { BiDetail } from "react-icons/bi";

const Orders = () => {
    // orders data
    const [orders, setOrders] = useState([]);
    // loading state
    const [loading, setLoading] = useState(true);
    // error state
    const [error, setError] = useState(null);
    // get user token from api
    const token = localStorage.getItem('token');

    // fetch orders
    useEffect(() => {
        // fetch all orders
        const fetchOrders = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:8000/api/orders/fetch-order-details", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setOrders(response.data.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    // fetch order details and show in alert
    const fetchOrderDetails = async (orderId) => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/orders/fetch-order-detail-by-id/${orderId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const order = response.data.data;
            const foodItems = order.order_details.map(item => `${item.name} - Quantity: ${item.quantity} - Price: $${item.price}`).join("\n");
            const orderDetail = `
                Order Number: ${order.order_number}
                Customer ID: ${order.customer_id}
                Driver ID: ${order.driver_id}
                Address ID: ${order.address_id}
                Status: ${order.status}
                Quantity: ${order.quantity}
                Total: $${order.total}
                Delivery Fee: $${order.delivery_fee}
                Tax: $${order.tax}
                Discount: $${order.discount}
                Payment Method: ${order.payment_method}
                Estimated Delivery Time: ${order.estimated_delivery_time ? order.estimated_delivery_time : "N/A"}
                Created At: ${new Date(order.created_at).toLocaleString()}
                Updated At: ${new Date(order.updated_at).toLocaleString()}
                Food Items:
                ${foodItems}
            `;
            console.log(orderDetail);
        } catch (err) {
            console.error("Failed to fetch order details:", err);
        }
    };
    
    

    if (loading) return (
        <div className="flex justify-center items-center">
            <span className="loading loading-ring loading-xs"></span>
            <span className="loading loading-ring loading-sm"></span>
            <span className="loading loading-ring loading-md"></span>
            <span className="loading loading-ring loading-lg"></span>
            <span className="loading loading-ring loading-xl"></span>
        </div>
    );
    if (error) return <p>Error: {error}</p>;

    const orderStatus = (status) => {
        switch (status) {
          case "success":
            return <div className="badge badge-soft badge-success">Success</div>;
          case "pending":
            return <div className="badge badge-soft badge-warning">Pending</div>;
          case "failed":
            return <div className="badge badge-soft badge-danger">Failed</div>;
          case "processing":
            return <div className="badge badge-soft badge-info">Processing</div>;
          default:
            return <div className="badge badge-soft badge-secondary">Unknown</div>;
        }
    };

      // Function to handle the accept/decline action

    const handleStatusChange = async (orderId, status) => {
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
            // Update the local state with the new order status
            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order.id === orderId ? { ...order, status: response.data.order.status } : order
                )
            );
        } catch (err) {
            setError(err.message);
        }
    };
    

    return (
        <>
            <div className="flex justify-between mt-5">
                <h2 className="text-xl font-bold">📦 Orders</h2>
            </div>

            {/* Categories table */}
            <div className="mt-5">
                <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
                    <table className="table">
                        {/* Table head */}
                        <thead>
                            <tr>
                                <th>Order number</th>
                                <th>Food</th>
                                <th>Customer</th>
                                <th>Quantity</th>
                                <th>Status</th>
                                <th>Driver</th>
                                <th>Address</th>
                                <th>Created at</th>
                                <th>Detail</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                orders.length > 0 ?
                                    orders.map((order) => (
                                        <tr key={order.id}>
                                            <td>{order.order_number}</td>
                                            <td></td>
                                            <td>{order.customer_id}</td>
                                            <td>{order.quantity}</td>
                                            <td>{orderStatus(order.status)}</td>
                                            <td>{order.driver_id}</td>
                                            <td>{order.address_id}</td>
                                            <td>{new Date(order.created_at).toLocaleDateString("en-US")}</td>
                                            <td>
                                                {/* Order detail button */}
                                                <button className="btn btn-warning mx-1 btn-sm text-white"
                                                    onClick={() => document.getElementById(`order_detail${order.id}`).showModal()}>
                                                    <BiDetail height={17} />
                                                </button>
                                                {/* Order detail dialog */}
                                                <dialog id={`order_detail${order.id}`} className="modal">
                                                    <div className="modal-box w-11/12 max-w-5xl">
                                                        <h3 className="font-bold text-lg">Order Detail</h3>
                                                        <p className="py-4"></p>
                                                        <div className="modal-action">
                                                            <form method="dialog">
                                                                {/* if there is a button, it will close the modal */}
                                                                <button className="btn">Close</button>
                                                            </form>
                                                        </div>
                                                    </div>
                                                </dialog>
                                            </td>
                                            {/* <td>
                                               

                                            </td> */}
                                        </tr>
                                    )) : <tr>
                                        <td colSpan={9} className="text-center">No orders found!</td>
                                    </tr>}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default Orders;
