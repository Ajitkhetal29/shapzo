import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { API_ENDPOINTS } from '@/lib/api';
import axios from 'axios';
import { updateWarehouse } from '@/store/slices/warehouseSlice';
import { Warehouse } from '@/store/types/warehouse';


const EditWarehousePage = ({ }) => {
    const params = useParams();
    const id = params.id;

    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const warehouse = useSelector((state: RootState) =>
        state.warehouse.warehouses.find(w => w._id === id)
    );
    const [formData, setFormData] = useState<Warehouse | null>(null);

    useEffect(() => {
        if (warehouse) {
            setFormData(warehouse);
        }
    }, [warehouse]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (formData) {
            setFormData({
                ...formData,
                [e.target.name]: e.target.value,
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData) return;
        setLoading(true);
        try {
            const response = await axios.put(`${API_ENDPOINTS.UPDATE_WAREHOUSES}/${id}`, formData, {
                withCredentials: true,
            });

            if (response.status === 200) {
                dispatch(updateWarehouse(response.data));
            }
           
            setError("");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }


    return (
        <div>
            <h1>Edit Warehouse</h1>

        <form action="">
            <div className="mb-6">  

                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Warehouse Name</label>
                <input type="text" id="name" name='name' value={formData?.name || ''} onChange={handleInputChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Warehouse Name" required />

                <label htmlFor="location" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Warehouse Location</label>
                <input disabled type="text" id="location" name='location' value={formData?.location.lat || ''} onChange={handleInputChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Warehouse Location lat" required /> 
                <input disabled type="text" id="location" name='location' value={formData?.location.lng || ''} onChange={handleInputChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Warehouse Location lng" required /> 

                {/* contactNumber */}
                <label htmlFor="contactNumber" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Contact Number</label>
                <input type="text" id="contactNumber" name='contactNumber' value={formData?.contactNumber || ''} onChange={handleInputChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Contact Number" required />
            
                {/* adrees */}
            
            <label htmlFor="FoormatedAddres" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Formated Address</label>
            <input disabled type="text" id="formattedAddress" name='formattedAddress' value={formData?.address.formatted || ''} onChange={handleInputChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Address" required />


            <label htmlFor="city" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">City</label>
            <input disabled type="text" id="city" name='city' value={formData?.address.city || ''} onChange={handleInputChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="City" required />      

            <label htmlFor="state" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">State</label>
            <input disabled type="text" id="state" name='state' value={formData?.address.state || ''} onChange={handleInputChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="State" required />

            <label htmlFor="pincode" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Pincode</label>
            <input disabled type="text" id="pincode" name='pincode' value={formData?.address.pincode || ''} onChange={handleInputChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Pincode" required />  

            <label htmlFor="landmark" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Landmark</label>
            <input disabled type="text" id="landmark" name='landmark' value={formData?.address.landmark || ''} onChange={handleInputChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Landmark" required />  


            <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Update Warehouse</button>
            
            </div>
        </form>


        </div>
    )
}

export default EditWarehousePage;