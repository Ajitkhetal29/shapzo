"use client"
import { useParams , useRouter} from "next/navigation"
import { useEffect, useState } from "react";
import { API_ENDPOINTS } from "@/lib/api";
import axios from "axios";
import { ProductVariant } from "@/store/types/product";
import { toast } from "react-toastify";
const VariantsPage = () => {

    const params = useParams();
    const router = useRouter();
    const productId = params.id;
    const [variants, setVariants] = useState<ProductVariant[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [deleteModelOpen, setDeleteModelOpen] = useState(false);
    const [variantToDelete, setVariantToDelete] = useState<string | null>(null);

    const fetchVariants = async () => {
        console.log("Fetching variants for productId:", productId);
        try {
            const response = await axios.get(`${API_ENDPOINTS.GET_PRODUCT_VARIANTS}/${productId}`);
            console.log("API response:", response.data);

            if (response.data.success) {
                setVariants(response.data.variants);
                console.log(response.data.variants);
            } else {
                console.error('Failed to fetch variants:', response.data.message);
                setError(response.data.message);
            }

        } catch (error) {
            console.error('Error fetching variants:', error);
            setError('An error occurred while fetching variants.');
        }
    };

    const deleteVariant = async (variantId: string) => {
        try {
            const response = await axios.delete(`${API_ENDPOINTS.DELETE_VARIANT}/${variantId}`);
            if (response.data.success) {
                toast.success('Variant deleted successfully', { autoClose: 3000 });
                console.log('Variant deleted successfully');
                // Refresh the list of variants after deletion
                fetchVariants();
            } else {
                console.error('Failed to delete variant:', response.data.message);
                setError(response.data.message);
            }
        } catch (error) {
            console.error('Error deleting variant:', error);
            setError('An error occurred while deleting the variant.');
        }
    };


    useEffect(() => {
        setLoading(true);
        fetchVariants();
        setLoading(false);
    }, [productId]);



    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }


    // delete modal

    if(deleteModelOpen) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-4 rounded shadow-lg">
                    <h2 className="text-xl font-semibold mb-4">Delete Variant</h2>
                    <p>Are you sure you want to delete this variant?</p>
                    <div className="mt-4 flex justify-end">
                        <button
                            className="bg-red-500 text-white px-4 py-2 rounded mr-2"
                            onClick={() => {
                                setDeleteModelOpen(false);
                                setVariantToDelete(null);
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            className="bg-green-500 text-white px-4 py-2 rounded"
                            onClick={() => {
                                if (variantToDelete) {
                                    deleteVariant(variantToDelete);
                                    setDeleteModelOpen(false);
                                    setVariantToDelete(null);
                                }
                            }}
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            </div>
        );
    }





    return (
        <div>
            <h1>Product Variants</h1>

            {variants.length === 0 ? (
                <>
                <p>No variants found for this product.</p>
                <button 
                    onClick={() => router.push(`/products/variants/add/${productId}`)}
                >
                    Add Variant
                </button>
                </>
                
            ) : (
                <div>
                    <button onClick={() => router.push(`/products/variants/add/${productId}`)}>
                        Add Variant
                    </button>


                    {variants.map((variant) => (
                        <div className="">
                            <li key={variant._id}>
                                <p>Price: {variant.price}</p>
                                <p>Color: {variant.color}</p>
                                <p>Size: {variant.size}</p>
                                <p>SKU: {variant.sku}</p>
                                <p>Stock: {variant.stock}</p>
                                <div>
                                    {variant.images.map((image, index) => (
                                        <img key={index} src={image.url} alt={`Image ${index + 1}`} width="100px" height="100px" />
                                    ))}
                                </div>

                            </li>
                            <button 
                                onClick={() => router.push(`/products/variants/edit/${variant._id}`)}
                            >
                                Edit
                            </button>
                            <button 
                                onClick={() => {
                                    setDeleteModelOpen(true);
                                    setVariantToDelete(variant._id);
                                }}>
                                Delete
                            </button>
                        </div>
                    ))}

                </div>
            )}

        </div>
    )



}

export default VariantsPage;