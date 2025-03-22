import axios from "axios";
import { useEffect, useState } from "react";

const Users = () => {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [usersRes, rolesRes] = await Promise.all([
                    axios.get("http://127.0.0.1:8000/api/users"),
                    axios.get("http://127.0.0.1:8000/api/roles"),
                ]);

                const usersData = usersRes.data.data || []; // Ensure it's an array
                const rolesData = rolesRes.data.data || []; // Ensure it's an array

                // Merge users with their role names safely
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

    const userStatus = (status) => {
        switch (status) {
            case "active":
                return <div className="badge badge-soft badge-success">Active</div>;
            case "inactive":
                return <div className="badge badge-soft badge-error">Inactive</div>;
            default:
                return <div className="badge badge-soft badge-secondary">Unknown</div>;
        }
    };




    return (
        <>
            <div className="flex justify-between">
                <h2 className="text-xl font-bold">📦 Users</h2>
            </div>

            <div className="mt-5">
                <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
                    {loading ? (
                        <p className="text-center p-4">Loading users...</p>
                    ) : error ? (
                        <p className="text-center text-red-500 p-4">{error}</p>
                    ) : (
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
                                {users.length > 0 ? (
                                    users.map((user) => (
                                        <tr key={user.id}>
                                            <td>{user.id}</td>
                                            <td>
                                                <img src={user.profile} alt="Profile" className="w-10 h-10 rounded-full" />
                                            </td>
                                            <td>{user.name}</td>
                                            <td>{user.email}</td>
                                            <td>{user.phone}</td>
                                            <td>
                                                {
                                                    userStatus(user.status)
                                                }

                                            </td>
                                            <td>{user.name}</td>
                                            <td>
                                                <select className="select select-sm w-20 cursor-pointer">
                                                    {
                                                        user.status == "active" ?  (
                                                            <>
                                                                <option>Active</option>
                                                                <option>Inactive</option>
                                                            </>
                                                        ) : 
                                                        (
                                                            <>
                                                                <option>Inactive</option>
                                                                <option>Active</option>
                                                            </>
                                                        )
                                                    }                                       
                                                </select>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={8} className="text-center p-4">
                                            No users found!
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </>
    );
};

export default Users;
