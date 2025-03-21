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
    // alert message state
    // const [alertMessage, setAlertMessage] = useState(""); 
    // message toggle status
    // const [messageStatus, setMessageStatus] = useState(false);
    // get user token from api 
    const token = localStorage.getItem('token');

    // fetch orders
    useEffect(() => {
        // fetch all orders
        const fetchOrders = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:8000/api/orders/get-order-details", {
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

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    // Function to handle adding a new category

    // delete order
    // const deleteOrder = async (id) => {
    //     try {
    //         await axios.delete(`http://127.0.0.1:8000/api/orders/${id}`);
    //         setOrders(orders.filter(order => order.id !== id));
    //         setAlertMessage("Order deleted successfully.");
    //         setMessageStatus(true);
    //     } catch (error) {
    //         setAlertMessage("Failed to delete order!");
    //     }
    // };

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

    return (
        <>
            {/* Alert Message */}
            {/* {alertMessage && (
                <div role="alert" className={messageStatus ? "alert alert-success alert-outline mt-4" : "alert alert-error alert-outline mt-4"}>
                    <span>{alertMessage}</span>
                </div>
            )} */}

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
                                <th>Customer</th>
                                <th>Quantity</th>
                                <th>Status</th>
                                <th>Driver</th>
                                <th>Address</th>
                                <th>Created at</th>
                                <th>Detail</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                orders.length > 0 ?
                                    orders.map((order) => (
                                        <tr key={order.id}>
                                            <td>{order.order_number}</td>
                                            <td>{order.customer_id}</td>
                                            <td>{order.quantity}</td>
                                            <td>{orderStatus(order.status)}</td>
                                            <td>{order.driver_id}</td>
                                            <td>{order.address_id}</td>
                                            <td>{new Date(order.created_at).toLocaleDateString("en-US")}</td>
                                            <td>
                                                {/* Order detail button */}
                                                <button className="btn btn-error mx-1 btn-sm text-white"
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
                                            <td>
                                               

                                            </td>
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
