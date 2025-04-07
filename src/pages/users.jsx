import axios from "axios";
import { Plus, Users2 } from "lucide-react";
import { useEffect, useState } from "react";
import { ToastContainer, toast as notify } from "react-toastify";

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [roleFilter, setRoleFilter] = useState("");

    const [newDriver, setNewDriver] = useState({
        name: '',
        email: '',
        password: '',
        phone_number: '',
        role_id: 3,
    });
    const [profileImg, setProfileImg] = useState(null);

    const fetchData = async () => {
        try {
            const usersRes = await axios.get("http://127.0.0.1:8000/api/users");

            const usersData = usersRes.data.data || [];

            const usersWithRoles = usersData.map(user => {
                let roleName = "Unknown";
                if (user.role_id === 1) roleName = "Admin";
                else if (user.role_id === 2) roleName = "Customer";
                else if (user.role_id === 3) roleName = "Driver";
                return { ...user, role: roleName };
            });

            setUsers(usersWithRoles);
        } catch (err) {
            console.error("Error fetching data:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchData();
    }, []);

    const handleAddNewDriver = async () => {
        const { name, email, password, phone_number } = newDriver;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!name || !email || !password || !phone_number || !profileImg) {
            notify.error("All fields are required", { containerId: "when-error" });
            return;
        }

        if (!emailRegex.test(email)) {
            notify.error("Please enter a valid email address", { containerId: "when-error" });
            return;
        }

        const formData = new FormData();
        formData.append('name', newDriver.name);
        formData.append('email', newDriver.email);
        formData.append('password', newDriver.password);
        formData.append('phone_number', newDriver.phone_number);
        formData.append('role_id', newDriver.role_id);
        formData.append('profile_img', profileImg);

        try {
            await axios.post('http://127.0.0.1:8000/api/register', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            notify.success('Driver added successfully!', { containerId: 'when-error' });

            setNewDriver({
                name: '',
                email: '',
                password: '',
                phone_number: '',
                role_id: 3,
            });
            setProfileImg(null);
            document.getElementById('add_new_driver').close();
            // Refresh users
            fetchData();
        } catch (error) {
            console.error(error);
            notify.error('Failed to add driver!', { containerId: 'when-error' });
        }
    };

    const filteredUsers = users.filter(user =>
        (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (statusFilter ? user.status === statusFilter : true) &&
        (roleFilter ? user.role === roleFilter : true)
    );

    if (loading) return <div className="flex justify-center items-center">Loading...</div>;
    if (error) return <p>Error: {error}</p>;

    return (
        <>
            {/* / error form add new driver */}
            <ToastContainer containerId="when-error" autoClose={2000} />
            <div className="flex justify-between">
                <h2 className="text-xl font-bold flex pr-1"><Users2 className="m-0.5 mr-1" /> Users</h2>
                <button
                    className="btn bg-amber-200 text-white rounded-md"
                    onClick={() => document.getElementById("add_new_driver").showModal()}
                >
                    New Driver<Plus />
                </button>
            </div>

            {/* add new driver */}
            <dialog id="add_new_driver" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Add Driver</h3>
                    <form onSubmit={(e) => e.preventDefault()}>
                        <div className="mt-5">
                            <label className="floating-label">
                                <input
                                    type="text"
                                    placeholder="Driver name"
                                    className="input input-md w-full"
                                    value={newDriver.name}
                                    onChange={e => setNewDriver({ ...newDriver, name: e.target.value })}
                                />
                                <span className="">Driver name</span>
                            </label>
                        </div>
                        <div className="mt-5">
                            <label className="floating-label">
                                <input
                                    type="email"
                                    placeholder="Email"
                                    className="input input-md w-full"
                                    value={newDriver.email}
                                    onChange={e => setNewDriver({ ...newDriver, email: e.target.value })}
                                />
                                <span className="">Email</span>
                            </label>
                        </div>
                        <div className="mt-5">
                            <label className="floating-label">
                                <input
                                    type="password"
                                    placeholder="Password"
                                    className="input input-md w-full"
                                    value={newDriver.password}
                                    onChange={e => setNewDriver({ ...newDriver, password: e.target.value })}
                                />
                                <span className="">Password</span>
                            </label>
                        </div>
                        <div className="mt-5">
                            <label className="floating-label">
                                <input
                                    type="text"
                                    placeholder="Phone"
                                    className="input input-md w-full"
                                    value={newDriver.phone_number}
                                    onChange={e => setNewDriver({ ...newDriver, phone_number: e.target.value })}
                                />
                                <span className="">Phone</span>
                            </label>
                        </div>
                        <div className="mt-5">
                            <input
                                type="file"
                                className="file-input w-full"
                                onChange={(e) => setProfileImg(e.target.files[0])}
                            />
                        </div>
                        <input type="hidden" value={newDriver.role_id} readOnly />
                    </form>
                    <div className="modal-action">
                        <button className="btn mx-2" onClick={() => document.getElementById("add_new_driver").close()}>Close</button>
                        <button className="btn btn-warning" onClick={handleAddNewDriver} type="submit">Save</button>
                    </div>
                </div>
            </dialog>

            <div className="mt-8">
                <div className="flex ">
                    <label htmlFor="" className="m-2">Filter:</label>
                    <input
                        type="text"
                        placeholder="Search by name or email"
                        className="input input-bordered w-56"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <select
                        className="select select-bordered w-28 border-sky-300 mx-2"
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                    >
                        <option value="">All Roles</option>
                        <option value="Admin">Admin</option>
                        <option value="Customer">Customer</option>
                        <option value="Driver">Driver</option>
                    </select>
                    <select
                        className="select select-bordered w-28 border-amber-300"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="">All Statuses</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
            </div>

            <div className="mt-5">
                <div className="overflow-x-auto h-96 rounded-box border border-base-content/5 bg-base-100">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Profile</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Status</th>
                                <th>Role</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => (
                                    <tr key={user.id}>
                                        <td>{user.id}</td>
                                        <td>
                                            <img src={user.profile || 'default-profile.jpg'} alt="Profile" className="w-10 h-10 rounded-full" />
                                        </td>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>{user.phone}</td>
                                        <td>
                                            <span className={`badge ${user.status === "active" ? "badge-success badge-soft" : "badge-error badge-soft"}`}>{user.status}</span>
                                        </td>
                                        <td>{user.role}</td>
                                        <td>
                                            <div className="tooltip">
                                                <div className="tooltip-content">
                                                    <div className="animate-bounce text-orange-400  text-sm font-black">Change Status</div>
                                                </div>
                                                {/* <button className="btn">Hover me</button> */}
                                            <input type="checkbox" defaultChecked className="toggle toggle-info" />
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="text-center p-4">No users found!</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default Users;
