import axios from "axios";
import { useEffect, useState } from "react";

const Users = () => {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [usersRes, rolesRes] = await Promise.all([
                    axios.get("http://127.0.0.1:8000/api/users"),
                    axios.get("http://127.0.0.1:8000/api/roles"),
                ]);

                const usersData = usersRes.data.data || [];
                const rolesData = rolesRes.data.data || [];

                const mergedData = usersData.map(user => ({
                    ...user,
                    role: rolesData.find(role => role.id === user.role_id)?.name || "Unknown",
                }));

                setUsers(mergedData);
                setRoles(rolesData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const filteredUsers = users.filter(user => 
        (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (statusFilter ? user.status === statusFilter : true)
    );

    if (loading) return <div className="flex justify-center items-center">Loading...</div>;
    if (error) return <p>Error: {error}</p>;

    return (
        <>
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">📦 Users</h2>
                <div className="flex ">
                    <label htmlFor="" className="m-2">Filter:</label>
                    <input
                        type="text"
                        placeholder="Search by name or email"
                        className="input input-bordered w-56 mr-2"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
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
                <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
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
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => (
                                    <tr key={user.id}>
                                        <td>{user.id}</td>
                                        <td>
                                            <img src={user.profile} alt="Profile" className="w-10 h-10 rounded-full" />
                                        </td>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>{user.phone}</td>
                                        <td>
                                            <span className={`badge ${user.status === "active" ? "badge-success" : "badge-error"}`}>{user.status}</span>
                                        </td>
                                        <td>{user.role}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="text-center p-4">
                                        No users found!
                                    </td>
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