import axios from "axios";
import { Edit, Plus, Save, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from 'react-hot-toast';

const Products = () => {
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

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch foods and categories in parallel
                const [foodRes, categoryRes] = await Promise.all([
                    axios.get("http://127.0.0.1:8000/api/foods/getAllFoods"),
                    axios.get("http://127.0.0.1:8000/api/categories"),
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
            if (!newFood.name || !newFood.description || !newFood.price || !newFood.category_id) {
                toast.error("All fields are required!");
                return;
            }
    
            const formData = new FormData();
            formData.append("name", newFood.name);
            formData.append("description", newFood.description);
            formData.append("price", newFood.price);
            formData.append("category_id", newFood.category_id);
            if (newFood.image) formData.append("image", newFood.image);
    
            const response = await axios.post("http://127.0.0.1:8000/api/create", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
    
            if (response.status === 201 || response.status === 200) {
                toast.success("Product added successfully!");
                // Refresh product list
                await fetchData();
                document.getElementById("add_new_product").close();
                // Reset newFood state
                setNewFood({
                    name: "",
                    description: "",
                    price: "",
                    category_id: "",
                    image: null
                });
            } else {
                throw new Error("Unexpected response from server");
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to add product. Check the form data!");
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <>
            <div className="flex justify-between">
                <h2 className="text-xl font-bold">📦Products</h2>
                <button
                    className="btn bg-amber-200 text-white rounded-md"
                    onClick={() => document.getElementById("add_new_product").showModal()}
                >
                    New <Plus />
                </button>
                <dialog id="add_new_product" className="modal">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Add Product</h3>
                        <form onSubmit={(e) => { e.preventDefault(); addFood(); }}>
                            <div className="mt-5">
                                <input 
                                    type="text" 
                                    placeholder="Product name" 
                                    className="input input-md w-full"
                                    value={newFood.name}
                                    onChange={e => setNewFood({ ...newFood, name: e.target.value })}
                                />
                            </div>
                            <div className="mt-5">
                                <input 
                                    type="text" 
                                    placeholder="Description" 
                                    className="input input-md w-full"
                                    value={newFood.description}
                                    onChange={e => setNewFood({ ...newFood, description: e.target.value })}
                                />
                            </div>
                            <div className="mt-5">
                                <input 
                                    type="text" 
                                    placeholder="Price" 
                                    className="input input-md w-full"
                                    value={newFood.price}
                                    onChange={e => setNewFood({ ...newFood, price: e.target.value })}
                                />
                            </div>
                            <div className="mt-5">
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
                            </div>
                            <div className="mt-5">
                                <input 
                                    type="file" 
                                    className="file-input file-input-md" 
                                    onChange={e => setNewFood({ ...newFood, image: e.target.files[0] })}
                                />
                            </div>
                        </form>
                        <div className="modal-action">
                            <button className="btn mx-2" onClick={() => document.getElementById("add_new_product").close()}>Close</button>
                            <button className="btn btn-warning">Save</button>
                        </div>
                    </div>
                </dialog>
            </div>

            <div className="mt-5">
                <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
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
                            {foods.length > 0 ? (
                                foods.map((food) => (
                                    <tr key={food.id}>
                                        <th>{food.id}</th>
                                        <td>{food.name}</td>
                                        <td>{food.description}</td>
                                        <td>${food.price}</td>
                                        <td>
                                            {food.image ? (
                                                <img src={food.image} alt={food.name} className="h-14" />
                                            ) : (
                                                <img
                                                    className="h-14"
                                                    src="https://th.bing.com/th/id/OIP.HXOh5qUfUbzCGR_lzgMWHQHaHa?rs=1&pid=ImgDetMain"
                                                    alt="Placeholder"
                                                />
                                            )}
                                        </td>
                                        <td>{food.category.name}</td>
                                        <td>
                                            <button
                                                className="btn btn-error mx-1 btn-sm text-white"
                                                onClick={() => document.getElementById('delete_product').showModal()}
                                            >
                                                <Trash height={17} />
                                            </button>
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
                                                            <button className="btn btn-error mx-1 text-white">
                                                                <Trash height={17} />
                                                            </button>
                                                        </form>
                                                    </div>
                                                </div>
                                            </dialog>
                                             {/* add product button */}
                                             <button
                                                    className="btn btn-info btn-sm text-white"
                                                    onClick={() => document.getElementById("edit_product").showModal()}
                                                >
                                                    <Edit height={17} />
                                                </button>
                                                {/* edit product dialog */}
                                                <dialog id="edit_product" className="modal">
                                                    <div className="modal-box">
                                                        <h3 className="font-bold text-lg">Edit Product</h3>
                                                        <form action="">
                                                            <div className="mt-5">
                                                                <label className="floating-label">
                                                                    <input type="text" placeholder="Product name" className="input input-md w-full" />
                                                                    <span className="text-black">Product name</span>
                                                                </label>
                                                            </div>
                                                            <div className="mt-5">
                                                                <label className="floating-label">
                                                                    <input type="text" placeholder="Description" className="input input-md w-full" />
                                                                    <span className="text-black">Description</span>
                                                                </label>
                                                            </div>
                                                            <div className="mt-5">
                                                                <label className="floating-label">
                                                                    <input type="text" placeholder="Price" className="input input-md w-full" />
                                                                    <span className="text-black">Price</span>
                                                                </label>
                                                            </div>
                                                            <div className="mt-5">
                                                                <label className="floating-label">
                                                                    <select defaultValue="Pick a category" className="select select-md w-full">
                                                                        <option disabled={true}>Choose category</option>
                                                                        <option>Pizza1</option>
                                                                        <option>Pizza2</option>
                                                                        <option>Pizza3</option>
                                                                    </select>
                                                                    {/* <span className="text-black">Category</span> */}
                                                                </label>
                                                            </div>
                                                            <div className="mt-5">
                                                                <label className="floating-label">
                                                                    <input type="file" className="file-input file-input-md" />
                                                                </label>
                                                            </div>

                                                        </form>
                                                        <div className="modal-action">
                                                            <form method="dialog">
                                                                {/* if there is a button, it will close the modal */}
                                                                <button className="btn mx-2">Close</button>
                                                                <button className="btn btn-warning"><Save height={15} /> Edit</button>
                                                            </form>
                                                        </div>
                                                    </div>
                                                </dialog>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="text-center">
                                        No foods found!
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

export default Products;