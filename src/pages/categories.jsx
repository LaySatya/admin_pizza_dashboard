import axios from "axios";
import { Edit, Plus, Trash } from "lucide-react";
import { useEffect, useState } from "react";

const Categories = () => {
    // state for storing categories data to retrieve
    const [categories, setCategories] = useState([]);
    // state for loading
    const [loading, setLoading] = useState(true);
    // state for error
    const [error, setError] = useState(null);
    // state for new category
    const [newCategory, setNewCategory] = useState(""); 
    // state for get data categories for update 
    const [editCategory, setEditCategory] = useState({ id: null, name: "" });
    // state for alert message
    const [alertMessage, setAlertMessage] = useState(""); 
    // state for toggle messsage status
    const [messageStatus, setMessageStatus] = useState(false);

    // get all categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:8000/api/categories");
                setCategories(response.data.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    // add new cateogies funciton
    const addCategory = async () => {
        if (!newCategory.trim()) {
            setAlertMessage("Category name cannot be empty!");
            setMessageStatus(false);
            return;
        }
        try {
            const response = await axios.post("http://127.0.0.1:8000/api/categories", {
                name: newCategory
            });

            // Update the UI with the new category
            setCategories([...categories, response.data.data]);
            setNewCategory(""); // Clear input field
            setAlertMessage(""); // Clear alert
            document.getElementById("add_new_category").close(); // Close modal
            setAlertMessage("Category added successfully.");
            setMessageStatus(true);
        } catch (error) {
            console.error("Error adding category:", error);
            setAlertMessage("Failed to add category!");
        }
    };

    // delete category function
    const deleteCategory = async (id) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/categories/${id}`);
            setCategories(categories.filter(category => category.id !== id));
            setAlertMessage("Category deleted successfully.");
            setMessageStatus(true);
        } catch (error) {
            setAlertMessage("Failed to delete category!");
        }
    };

    // update or edit category function
    const updateCategory = async () => {
        if (!editCategory.name.trim()) {
            setAlertMessage("Category name cannot be empty!");
            setMessageStatus(false);
            return;
        }
        try {
            // Send PUT request
            // alert(editCategory.id);
            await axios.put(`http://127.0.0.1:8000/api/categories/${editCategory.id}`, { name: editCategory.name });
    
            // Update category list after successful update
            setCategories(categories.map(category => 
                category.id === editCategory.id ? { ...category, name: editCategory.name } : category
            ));
    
            setAlertMessage("Category updated successfully.");
            setMessageStatus(true);
            
            // Close modal after updating
            document.getElementById(`edit_category${editCategory.id}`).close();
        } catch (error) {
            setAlertMessage("Failed to update category!");
        }
    };
    

    return (
        <>
            {/* Alert Message */}
            {alertMessage && (
                <div role="alert" className={messageStatus ? "alert alert-success alert-outline mt-4" : "alert alert-error alert-outline mt-4"}>
                    <span>{alertMessage}</span>
                </div>
            )}

            <div className="flex justify-between mt-5">
                <h2 className="text-xl font-bold">📦 Categories</h2>
                {/* Add category button */}
                <button
                    className="btn bg-amber-200 text-white rounded-md"
                    onClick={() => document.getElementById("add_new_category").showModal()}
                >
                    New <Plus />
                </button>
                {/* Add category dialog */}
                <dialog id="add_new_category" className="modal">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Add Category</h3>
                        <div className="mt-5">
                            <label className="floating-label">
                                <input
                                    type="text"
                                    placeholder="Category name"
                                    className="input input-md w-full"
                                    value={newCategory}
                                    onChange={(e) => setNewCategory(e.target.value)}
                                />
                                <span className="text-black">Category name</span>
                            </label>
                        </div>
                        <div className="modal-action">
                            <button className="btn mx-2" onClick={() => document.getElementById("add_new_category").close()}>
                                Close
                            </button>
                            <button className="btn btn-warning" onClick={addCategory}>Save</button>
                        </div>
                    </div>
                </dialog>
            </div>

            {/* Categories table */}
            <div className="mt-5">
                <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
                    <table className="table">
                        {/* Table head */}
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Created at</th>
                                <th>Updated at</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                            categories.length > 0 ?
                            categories.map((category) => (
                                <tr key={category.id}>
                                    <td>{category.id}</td>
                                    <td>{category.name}</td>
                                    <td>{new Date(category.created_at).toLocaleDateString("en-US")}</td>
                                    <td>{new Date(category.updated_at).toLocaleDateString("en-US")}</td>
                                    <td>
                                        {/* Delete category button */}
                                        <button className="btn btn-error mx-1 btn-sm text-white"
                                            onClick={() => document.getElementById(`delete_category${category.id}`).showModal()}>
                                            <Trash height={17} />
                                        </button>

                                        {/* Delete category dialog */}
                                        <dialog id={`delete_category${category.id}`} className="modal">
                                            <div className="modal-box">
                                                <h3 className="font-bold text-lg">Delete Category</h3>
                                                <p className="py-4 text-[16px]">Are you sure?</p>
                                                <div className="modal-action">
                                                    <button className="btn" onClick={() => document.getElementById(`delete_category${category.id}`).close()}>
                                                        Close
                                                    </button>
                                                    <button className="btn btn-error mx-1 text-white" onClick={() => deleteCategory(category.id)}>
                                                        <Trash height={17} />
                                                    </button>
                                                </div>
                                            </div>
                                        </dialog>

                                        {/* Edit category button */}
                                        <button
                                            className="btn btn-info btn-sm text-white"
                                            onClick={() => {
                                                setEditCategory({ id: category.id, name: category.name }); // ✅ Set old data before opening modal
                                                document.getElementById(`edit_category${category.id}`).showModal();
                                            }}
                                        >
                                            <Edit height={17} />
                                        </button>
                                        

                                        {/* Edit category dialog */}
                                        <dialog id={`edit_category${category.id}`} className="modal">
                                            <div className="modal-box">
                                                <h3 className="font-bold text-lg">Edit Category</h3>
                                                <div className="mt-5">
                                                    <label className="floating-label">
                                                        <input
                                                            type="text"
                                                            placeholder="Category name"
                                                            className="input input-md w-full"
                                                            value={editCategory.name}
                                                            onChange={(e) => setEditCategory({ ...editCategory, name: e.target.value })}
                                                        />
                                                        <span className="text-black">Category name</span>
                                                    </label>
                                                </div>
                                                <div className="modal-action">
                                                    <button className="btn mx-2" onClick={() => document.getElementById(`edit_category${category.id}`).close()}>
                                                        Close
                                                    </button>
                                                    <button className="btn btn-warning" onClick={updateCategory}>Update</button>
                                                </div>
                                            </div>
                                        </dialog>
                                    </td>
                                </tr>
                            )) : <tr>
                                    <td colSpan={6} className="text-center">No category found!</td>
                                </tr>}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default Categories;
