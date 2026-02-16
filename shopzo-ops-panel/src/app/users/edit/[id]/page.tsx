"use client";
import { useParams, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { useState, useEffect, useRef } from "react";
import { User } from "@/store/types/users";
import { updateUser, setUsers } from "@/store/slices/userSlice";

import axios from "axios";
import { API_ENDPOINTS } from "@/lib/api";
import { toast } from "react-toastify";


const EditUserPage = () => {
    const { id } = useParams();
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState<User | null>(null);


    const users = useSelector((state: RootState) => state.user.users);
    const fetchedUser = users.find((user: any) => user._id === id);
    const hasFetched = useRef(false);

    useEffect(() => {
        if (fetchedUser) {
            setUser(fetchedUser);
            setFormData(fetchedUser);
        } else if (id && !hasFetched.current) {
            // If user not in Redux, fetch all users (only once)
            hasFetched.current = true;
            setIsLoading(true);
            axios.get(API_ENDPOINTS.GET_OPS_USERS, {
                withCredentials: true,
            })
            .then((response) => {
                if (response.status === 200) {
                    dispatch(setUsers(response.data.users));
                    const user = response.data.users.find((u: User) => u._id === id);
                    if (user) {
                        setUser(user);
                        setFormData(user);
                    } else {
                        setError("User not found");
                    }
                }
            })
            .catch((err: any) => {
                const errorMessage = err.response?.data?.message || "Failed to fetch user";
                setError(errorMessage);
                toast.error(errorMessage);
            })
            .finally(() => {
                setIsLoading(false);
            });
        }
    }, [id, fetchedUser, dispatch]);

    if (isLoading && !formData) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                    <p className="text-base font-medium text-gray-900">Loading user data...</p>
                </div>
            </div>
        );
    }

    if (error && !formData) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 mb-4">{error}</p>
                    <button
                        onClick={() => router.push('/users')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        Back to Users
                    </button>
                </div>
            </div>
        );
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        if (formData) {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!formData) return;
        setIsLoading(true);
        try {
            const response = await axios.put(`${API_ENDPOINTS.UPDATE_OPS_USER}/${id}`, formData, {
                withCredentials: true,
            });
            if (response.status === 200) {
                dispatch(updateUser(response.data));
                toast.success("User updated successfully");
                router.push('/users');
            }
            setError("");
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || "Failed to update user";
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }



    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-semibold text-gray-900">Edit User</h1>
                    <p className="mt-2 text-sm text-gray-600">Update user information and permissions</p>
                </div>

                {error && (
                    <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                        <p className="text-sm text-red-600">{error}</p>
                    </div>
                )}

                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                    <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                        <h2 className="text-lg font-medium text-gray-900">User Details</h2>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="p-6 space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData?.name || ''}
                                    onChange={handleInputChange}
                                    className="w-full text-gray-900 px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-colors text-sm"
                                    placeholder="Enter user name"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData?.email || ''}
                                    onChange={handleInputChange}
                                    className="w-full text-gray-900 px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-colors text-sm"
                                    placeholder="Enter email address"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Department <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="department"
                                    name="department"
                                    value={formData?.department || ''}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2.5 text-gray-900 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-colors text-sm bg-white"
                                    required
                                >
                                    <option value="">Select department</option>
                                    <option value="admin">Admin</option>
                                    <option value="support">Support</option>
                                    <option value="delivery">Delivery</option>
                                    <option value="vendor">Vendor</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Role <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="role"
                                    name="role"
                                    value={formData?.role || ''}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2.5 text-gray-900 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-colors text-sm bg-white"
                                    required
                                >
                                    <option value="">Select role</option>
                                    <option value="superadmin">Superadmin</option>
                                    <option value="manager">Manager</option>
                                    <option value="team_leader">Team Leader</option>
                                    <option value="team_member">Team Member</option>
                                </select>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => router.push('/users')}
                                    className="px-6 py-3 rounded-lg font-medium text-sm transition-all bg-gray-200 text-gray-700 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className={`flex-1 px-6 py-3 rounded-lg font-medium text-sm transition-all ${isLoading
                                            ? "bg-gray-400 text-white cursor-not-allowed"
                                            : "bg-black text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 shadow-sm"
                                        }`}
                                >
                                    {isLoading ? "Updating..." : "Update User"}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditUserPage;