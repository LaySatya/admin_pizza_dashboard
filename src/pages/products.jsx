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
    
            const response = await axios.post("http://127.0.0.1:8000/api/foods/create", formData, {
                headers: { 
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                }
            });
    
            if (response.status === 201 || response.status === 200) {
                toast.success("Product added successfully!");
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
            toast.error("Failed to add product. Check the form data!");
        }
    };

    const editFood = async () => {
        try {
            if (!foodToEdit.name || !foodToEdit.description || !foodToEdit.price || !foodToEdit.category_id) {
                toast.error("All fields are required!");
                return;
            }
    
            const formData = new FormData();
            formData.append("name", foodToEdit.name);
            formData.append("description", foodToEdit.description);
            formData.append("price", foodToEdit.price);
            formData.append("category_id", foodToEdit.category_id);
            if (foodToEdit.image) formData.append("image", foodToEdit.image);
    
            const response = await axios.post(`http://127.0.0.1:8000/api/foods/update/${foodToEdit.id}`, formData, {
                headers: { 
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                }
            });
    
            if (response.status === 200) {
                toast.success("Product updated successfully!");
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
            image: null, // This will be handled separately if you want to change the image
        });
        document.getElementById("edit_product").showModal(); // Show the edit modal
    };

    const deleteFood = async (id) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/foods/delete/${id}`,{
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            // await fetchData();
            setFoods(foods.filter(food => food.id !== id));
            toast.success("Product deleted successfully!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete product.");
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
                        <form onSubmit={(e) => { 
                            e.preventDefault(); 
                            addFood(); 
                        }}>
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
                            <button className="btn btn-warning" onClick={addFood} type="submit">Save</button>
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
                                        <td>{food.category_id}</td>
                                        <td>
                                            <button
                                                className="btn btn-error mx-1 btn-sm text-white"
                                                onClick={()=>{
                                                    setFoodIdToDelete(food.id);
                                                    document.getElementById('delete_product').showModal()
                                                }
                                                }
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
                                                            <button className="btn btn-error mx-1 text-white" 
                                                                onClick={() => {
                                                                    deleteFood(foodIdToDelete);
                                                                    document.getElementById('delete_product').close();
                                                                }}
                                                            >
                                                                <Trash height={17} /> 
                                                            </button>
                                                        </form>
                                                    </div>
                                                </div>
                                            </dialog>

                                             {/* edit product button */}
                                             <button
                                                    className="btn btn-info btn-sm text-white"
                                                    onClick={() => handleEditClick(food)}
                                                >
                                                    <Edit height={17} />
                                                </button>
                                                {/* edit product dialog */}
                                                <dialog id="edit_product" className="modal">
    <div className="modal-box">
        <h3 className="font-bold text-lg">Edit Product</h3>
        <form onSubmit={(e) => {
            e.preventDefault();
            editFood(); // Trigger the edit function on form submit
        }}>
            <div className="mt-5">
                <input
                    type="text"
                    placeholder="Product name"
                    className="input input-md w-full"
                    value={foodToEdit.name}
                    onChange={(e) => setFoodToEdit({ ...foodToEdit, name: e.target.value })}
                />
            </div>
            <div className="mt-5">
                <input
                    type="text"
                    placeholder="Description"
                    className="input input-md w-full"
                    value={foodToEdit.description}
                    onChange={(e) => setFoodToEdit({ ...foodToEdit, description: e.target.value })}
                />
            </div>
            <div className="mt-5">
                <input
                    type="text"
                    placeholder="Price"
                    className="input input-md w-full"
                    value={foodToEdit.price}
                    onChange={(e) => setFoodToEdit({ ...foodToEdit, price: e.target.value })}
                />
            </div>
            <div className="mt-5">
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
            </div>
            <div className="mt-5">
                <input 
                    type="file" 
                    className="file-input file-input-md" 
                    onChange={e => setFoodToEdit({ ...foodToEdit, image: e.target.files[0] })}
                />
            </div>
        </form>
        <div className="modal-action">
            <button className="btn mx-2" onClick={() => document.getElementById("edit_product").close()}>Close</button>
            <button className="btn btn-warning" onClick={editFood} type="submit">Save</button>
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