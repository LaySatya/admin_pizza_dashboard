import axios from "axios";
import { Edit, Plus, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { AiFillProduct } from "react-icons/ai";
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css"; // Import CSS

const Products = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [foods, setFoods] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newFood, setNewFood] = useState({
        name: "",
        description: "",
        price: "",
        category_id: "",
        image: null
    });
    const [foodToEdit, setFoodToEdit] = useState({
        id: null,
        name: "",
        description: "",
        price: "",
        category_id: "",
        image: null
    });

    //added this because we are working with modal, we need to pass the food id to the modal
    const [foodIdToDelete, setFoodIdToDelete] = useState(null);
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch foods and categories in parallel
                const [foodRes, categoryRes] = await Promise.all([
                    axios.get("http://127.0.0.1:8000/api/foods/fetchAllFoods", {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }),
                    axios.get("http://127.0.0.1:8000/api/categories", {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }),
                ]);

                const foodData = foodRes.data.data;
                const categoryData = categoryRes.data.data;

                // Merge foods with their category names
                const mergedData = foodData.map(food => ({
                    ...food,
                    category: categoryData.find(cat => cat.id === food.category_id) || { name: "Unknown" }
                }));

                setFoods(mergedData);
                setCategories(categoryData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const addFood = async () => {
        try {
            if (!newFood.name || !newFood.description || !newFood.price || !newFood.category_id || !newFood.image) {
                toast.error("All fields are required!", { containerId: "when-error" });
                return;
            }

            const formData = new FormData();
            formData.append("name", newFood.name);
            formData.append("description", newFood.description);
            formData.append("price", newFood.price);
            formData.append("category_id", newFood.category_id);
            if (newFood.image) formData.append("img", newFood.image);

            const response = await axios.post("http://127.0.0.1:8000/api/foods/create", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                }
            });

            if (response.status === 201 || response.status === 200) {
                toast.success("Food created successfully!", { containerId: "when-success" });
                document.getElementById("add_new_product").close();
                // Reset newFood state
                setNewFood({
                    name: "",
                    description: "",
                    price: "",
                    category_id: "",
                    image: null
                });

                setFoods(foods => [...foods, response.data.data]);
            } else {
                // throw new Error("Unexpected response from server");
                console.log("Unexpected response:", response);
            }
        } catch (error) {
            console.log(error);
            toast.error("Failed to add product. Check the form data!", { containerId: "when-error" });
        }
    };

    const editFood = async () => {
        try {
            // if (!foodToEdit.name || !foodToEdit.description || !foodToEdit.price || !foodToEdit.category_id) {
            //     toast.error("All fields are required!");
            //     return;
            // }

            const formData = new FormData();
            formData.append("name", foodToEdit.name);
            formData.append("description", foodToEdit.description);
            formData.append("price", foodToEdit.price);
            formData.append("category_id", foodToEdit.category_id);
            if (foodToEdit.image) formData.append("img", foodToEdit.image);

            const response = await axios.post(`http://127.0.0.1:8000/api/foods/update/${foodToEdit.id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                }
            });

            if (response.status === 200) {
                toast.success("Product updated successfully!", { containerId: "when-success" });
                document.getElementById("edit_product").close();
                setFoods(foods.map(food => food.id === foodToEdit.id ? response.data.data : food));
                setFoodToEdit({
                    id: null,
                    name: "",
                    description: "",
                    price: "",
                    category_id: "",
                    image: null
                });
            }
        } catch (error) {
            console.log(error);
            toast.error("Failed to update product.");
        }
    };

    const handleEditClick = (food) => {
        setFoodToEdit({
            id: food.id,
            name: food.name,
            description: food.description,
            price: food.price,
            category_id: food.category_id,
            image: food.image// This will be handled separately if you want to change the image
        });
        document.getElementById("edit_product").showModal(); // Show the edit modal
    };

    const deleteFood = async (id) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/foods/delete/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            // await fetchData();
            setFoods(foods.filter(food => food.id !== id));
            toast.success("Product deleted successfully!", { containerId: "when-success" });
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete product.");
        }
    };

    const handleCloseModal = () => {
        document.getElementById("add_new_product").close();
        setNewFood({
            name: "",
            description: "",
            price: "",
            category_id: "",
            image: null
        });  // Reset state when modal closes
    };

    // search function
    const filteredFoods = foods.filter((food) =>
        food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        food.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        food.category.name.toLowerCase().includes(searchQuery.toLowerCase())
    );


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
            <div className="flex justify-between">
                <h2 className="text-xl font-bold flex text-gray-600"> <AiFillProduct className="mr-1" size={30} /> Products</h2>
                <button
                    className="btn bg-amber-200 text-white rounded-md"
                    onClick={() => document.getElementById("add_new_product").showModal()}
                >
                    New <Plus />
                </button>
            </div>

            {/* search box */}
            <div className="mt-5">
                <label className="input">
                    <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
                            <circle cx="11" cy="11" r="8"></circle>
                            <path d="m21 21-4.3-4.3"></path>
                        </g>
                    </svg>
                    <input
                        type="search"
                        placeholder="Search by name, description..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </label>
            </div>

            {/* add new product */}
            <dialog id="add_new_product" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Add Product</h3>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        addFood();
                    }}>
                        <div className="mt-5">
                            <label className="floating-label">
                                <input
                                    type="text"
                                    placeholder="Product name"
                                    className="input input-md w-full"
                                    value={newFood.name}
                                    onChange={e => setNewFood({ ...newFood, name: e.target.value })}
                                />
                                <span className="text-black">Product name</span>
                            </label>
                        </div>
                        <div className="mt-5">
                            <label className="floating-label">
                                <input
                                    type="text"
                                    placeholder="Description"
                                    className="input input-md w-full"
                                    value={newFood.description}
                                    onChange={e => setNewFood({ ...newFood, description: e.target.value })}
                                />
                                <span className="text-black">Description</span>
                            </label>
                        </div>
                        <div className="mt-5">
                            <label className="floating-label">
                                <input
                                    type="text"
                                    placeholder="Price"
                                    className="input input-md w-full"
                                    value={newFood.price}
                                    onChange={e => setNewFood({ ...newFood, price: e.target.value })}
                                />
                                <span className="text-black">Price</span>
                            </label>
                        </div>
                        <div className="mt-5">
                            <label className="floating-label">
                                <select
                                    className="select select-md w-full"
                                    value={newFood.category_id}
                                    onChange={e => setNewFood({ ...newFood, category_id: e.target.value })}
                                >
                                    <option disabled>Choose category</option>
                                    {categories.map(category => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                                <span className="text-black">Category</span>
                            </label>
                        </div>
                        <div className="mt-5">
                            <label className="floating-label">
                                <input
                                    type="file"
                                    className="file-input file-input-md"
                                    onChange={e => setNewFood({ ...newFood, image: e.target.files[0] })}
                                />
                                <span className="text-black">Product Image</span>
                            </label>
                        </div>
                    </form>
                    <div className="modal-action">
                        <ToastContainer containerId="when-error" autoClose={2000} />
                        <button className="btn mx-2" onClick={handleCloseModal}>Close</button>
                        <button className="btn btn-warning" onClick={addFood} type="submit">Save</button>
                    </div>
                </div>
            </dialog>

            <ToastContainer containerId="when-success" autoClose={2000} />

            {/* edit product dialog */}
            <dialog id="edit_product" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Edit Product</h3>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        editFood(); // Trigger the edit function on form submit
                    }}>
                        <div className="mt-5">
                            <label className="floating-label">
                                <input
                                    type="text"
                                    placeholder="Product name"
                                    className="input input-md w-full"
                                    value={foodToEdit.name}
                                    onChange={(e) => setFoodToEdit({ ...foodToEdit, name: e.target.value })}
                                />
                                <span className="text-black">Product name</span>
                            </label>
                        </div>
                        <div className="mt-5">
                            <label className="floating-label">
                                <input
                                    type="text"
                                    placeholder="Description"
                                    className="input input-md w-full"
                                    value={foodToEdit.description}
                                    onChange={(e) => setFoodToEdit({ ...foodToEdit, description: e.target.value })}
                                />
                                <span className="text-black">Description</span>
                            </label>
                        </div>
                        <div className="mt-5">
                            <label className="floating-label">
                                <input
                                    type="text"
                                    placeholder="Price"
                                    className="input input-md w-full"
                                    value={foodToEdit.price}
                                    onChange={(e) => setFoodToEdit({ ...foodToEdit, price: e.target.value })}
                                />
                                <span className="text-black">Price</span>
                            </label>
                        </div>
                        <div className="mt-5">
                            <label className="floating-label">
                                <select
                                    className="select select-md w-full"
                                    value={foodToEdit.category_id}
                                    onChange={(e) => setFoodToEdit({ ...foodToEdit, category_id: e.target.value })}
                                >
                                    <option disabled>Choose category</option>
                                    {categories.map(category => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                                <span className="text-black">Category</span>
                            </label>
                        </div>
                        <div className="mt-5">
                            <label className="floating-label">
                                <input
                                    type="file"
                                    className="file-input file-input-md"
                                    onChange={e => setFoodToEdit({ ...foodToEdit, image: e.target.files[0] })}

                                />
                                <span className="text-black">Product Image</span>
                            </label>
                        </div>
                        <ToastContainer containerId="when-error" autoClose={2000} />
                        <div className="modal-action">
                            <button className="btn mx-2" onClick={() => document.getElementById("edit_product").close()}>Close</button>
                            <button className="btn btn-warning" type="submit">Save</button>
                        </div>
                    </form>
                </div>
            </dialog>

            {/* delete product dialog */}
            <dialog id="delete_product" className="modal">
                <div className="modal-box">
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                            ✕
                        </button>
                    </form>
                    <h3 className="font-bold text-lg">Delete Product</h3>
                    <p className="py-4 text-[16px]">Are you sure?</p>
                    <div className="modal-action">
                        <form method="dialog">
                            <button className="btn">Close</button>

                            <button
                                className="btn btn-error mx-1 text-white"
                                onClick={() => {
                                    deleteFood(foodIdToDelete);
                                    document.getElementById("delete_product").close();
                                }}
                            >
                                <Trash height={17} />
                            </button>
                        </form>
                    </div>
                </div>
            </dialog>

            <div className="mt-5">
                <div className="hover:overflow-auto h-96 rounded-box border border-base-content/5 bg-base-100">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Price</th>
                                <th>Image</th>
                                <th>Category</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredFoods.length > 0 ? (
                                filteredFoods.map((food) => (
                                    <tr key={food.id}>
                                        <th>{food.id}</th>
                                        <td>{food.name}</td>
                                        {/* <td className="tooltip" data-tip={food.description}>
                                            {food.description.slice(0, 30)}

                                        </td> */}
                    
                                        <td>${food.price}</td>
                                        <td>
                                            {food.image && food.image.startsWith("http://127.0.0.1:8000") ? (
                                                <img src={food.image} alt={food.name} className="h-14" />
                                            ) : (
                                                <img
                                                    className="h-14"
                                                    src="https://th.bing.com/th/id/OIP.HXOh5qUfUbzCGR_lzgMWHQHaHa?rs=1&pid=ImgDetMain"
                                                    alt="Placeholder"
                                                />
                                            )}
                                        </td>
                                        {/* {console.log(food.image)} */}
                                        {/* when using food.category.name, it will cause error when creating new food. */}
                                        {/* <td>{food.category.name}</td> */}
                                        {/* so now use food.category for testing first. Will fix that error later */}
                                        <td>{food.category_id}</td>
                                        <td className="flex">
                                            <button
                                                className="btn btn-error mx-1 btn-sm text-white"
                                                onClick={() => {
                                                    setFoodIdToDelete(food.id);
                                                    document.getElementById('delete_product').showModal()
                                                }
                                                }
                                            >
                                                <Trash height={17} />
                                            </button>
                                            <button
                                                className="btn btn-info btn-sm text-white"
                                                onClick={() => handleEditClick(food)}
                                            >
                                                <Edit height={17} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="text-center">No matching products found</td>
                                </tr>
                            )}

                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default Products;