"use client";

import React, { use, useEffect, useState } from "react";
import { API_ENDPOINTS } from "@/lib/api";
import axios from "axios";
import { toast } from "react-toastify";
import { UseSelector } from "react-redux";
import { RootState } from "@/store";
import { useSelector } from "react-redux";

type User = {
    _id: string;
    name: string;
    email: string;
   
    department: {
        _id: string;
        name: string;
    };
    role: {
        _id: string;
        name: string;
        level: number;
    };
};


type Reporting = {
    _id: string;
    user: {
        name: string;
        email: string;
    };
    reportingTo: {
        name: string;
        email: string;
    };
    department: string;
};



const userReportingPage = () => {


    const departments = useSelector((state: RootState) => state.general.departments);

    const [userReporting, setUserReporting] = useState<Reporting[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
    })

    const [totalReportings, setTotalReportings] = useState(0)
    const [formData, setFormData] = useState({
        userId: '',
        reportingToId: '',
        department: '',
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const [users, setUsers] = useState<User[]>([])

    const [reportsTo, setReportsTo] = useState<User[]>([])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${API_ENDPOINTS.CREATE_REPORTING}`, formData, {
                withCredentials: true,
            })
            if (res.data.success) {
                toast.success(res.data.message)
                setFormData({
                    userId: '',
                    reportingToId: '',
                    department: '',
                })
                fetchUserReporting()
            }
            else {
                toast.error(res.data.message)
            }
        } catch (error) {
            console.error(error)
            toast.error('failed to add user reporting')
        }
    }


    const fetchUsersForReporting = async (departmentId : string) => {
        try {
            
            const res = await axios.get(`${API_ENDPOINTS.GET_ALL_USERS_WITH_ROLE_AND_DEPARTMENT}`, {
                withCredentials: true,
                params: { departmentId}
            })
            if (res.data.success) {
                setUsers(res.data.users)
            }
            else {
                toast.error(res.data.message)
            }

        } catch (error) {
            console.error(error)
            toast.error('failed to fetch users for reporting')
        }
    }



    useEffect(() => {
        fetchUserReporting()
    }, [pagination.page, pagination.limit])





    const fetchUserReporting = async () => {

        setLoading(true)

        try {

            const res = await axios.get(`${API_ENDPOINTS.GET_REPORTING}`, {
                withCredentials: true,
                params: {
                    page: pagination.page,
                    limit: pagination.limit
                }
            }
            )

            if (res.data.success) {
                setUserReporting(res.data.userReporting)
                setTotalReportings(res.data.total)
                setLoading(false)
            }
            else {
                toast.error(res.data.message)
            }

        } catch (error) {
            console.error(error)
            setError('failed to fetch user reporting')
        }
        finally {
            setLoading(false)
        }

    }


    const filterReportsTo = (level: number) => {
        const filtered = users.filter(user => user.role.level < level);
        setReportsTo(filtered);
    };




    if (loading) {
        return <div>Loading...</div>
    }

    if (error) {
        return <div>{error}</div>
    }




    return (
        <div>
            <h1>User Reporting</h1>


            <div>

                <h2 className="text-lg font-medium mb-4">Add User Reporting</h2>

                <form onSubmit={handleSubmit} className="space-y-4 mb-6">

                    <div>

                        <label htmlFor="department" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Department <span className="text-red-500">*</span>
                        </label>


                        <select name="department" id="department" onChange={(e)=>{
                            const departmentId = e.target.value;
                            setFormData(prev => ({
                                ...prev,
                                department: departmentId,
                                userId: '',
                                reportingToId: ''
                            }));
                            setReportsTo([]);
                            if (departmentId) {
                                fetchUsersForReporting(departmentId);
                            } else {
                                setUsers([]);
                            }
                        }} >
                            <option value="">Select Department</option>
                            {departments.map((dept) => (
                                <option key={dept._id} value={dept._id}>{dept.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>

                        <label htmlFor="userId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            User <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="userId"
                            name="userId"
                            value={formData.userId}
                            onChange={(e)=>{
                                const userId = e.target.value;
                                setFormData(prev => ({
                                    ...prev,
                                    userId: userId,
                                    reportingToId: ''
                                }));
                                const selectedUser = users.find(user => user._id === userId);
                                if (selectedUser) {
                                    filterReportsTo(selectedUser.role.level);
                                } else {
                                    setReportsTo([]);
                                }
                            }}
                            className="w-full px-4 py-2.5 text-gray-900 dark:text-white bg-white dark:bg-slate- 700 border border-gray-300 dark:border-slate-60 0 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-black dark:focus:border-white transition-colors text-sm"
                            required
                        >
                            <option value="">Select user</option>
                            {users.map((user) => (
                                <option key={user._id} value={user._id}>{user.name} , {user.role.level}</option>
                            ))}
                        </select>
                    </div>


                    <div>
                        <label htmlFor="reportingToId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Reporting To <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="reportingToId"
                            name="reportingToId"
                            value={formData.reportingToId}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2.5 text-gray-900 dark:text-white bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-black dark:focus:border-white transition-colors text-sm"
                            required
                        >
                            <option value="">Select reporting to</option>
                            {reportsTo.map((user) => (
                                <option key={user._id} value={user._id}>{user.name}, {user.role.level}</option>
                            ))}
                        </select>

                    </div>

                    <button type="submit">Add Reporting</button>


                </form>


            </div>

            {!userReporting || userReporting.length === 0 ? (
                <div>No user reporting found.</div>
            ) : (<div>
                <table className="table">
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Reporting</th>
                            <th>DepartMent</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {userReporting.map((report) => (
                            <tr key={report._id}>
                                <td>{report.user.name} ({report.user.email})</td>
                                <td>{report.reportingTo.name} ({report.reportingTo.email})</td>
                                <td>{report.department}</td>
                                <td>
                                    <button className="btn btn-danger">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="px-6 py-3 bg-gray-50 dark:bg-slate-700 flex items-center justify-between">
                    <div className="text-sm text-gray-700 dark:text-gray-400">
                        Showing {(pagination.page - 1) * pagination.limit + 1} to {Math.min(pagination.page * pagination.limit, totalReportings)} of {totalReportings} users
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setPagination(prev => ({ ...prev, page: Math.max(prev.page - 1, 1) }))}
                            disabled={pagination.page === 1}
                            className={`px-3 py-1 rounded-md text-sm font-medium ${pagination.page === 1 ? 'bg-gray-300 dark:bg-slate-600 text-gray-500 dark:text-gray-400 cursor-not-allowed' : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors'}`}
                        >
                            Previous
                        </button>

                        <div>
                            {Array.from({ length: 5 }, (_, i) => {
                                const pageNum = pagination.page - 2 + i;

                                if (pageNum <= 0 || pageNum > Math.ceil(totalReportings / pagination.limit)) {
                                    return null;
                                }

                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => setPagination(prev => ({ ...prev, page: pageNum }))}
                                        className={`mx-1 px-3 py-1 rounded-md text-sm font-medium ${pagination.page === pageNum
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors'
                                            }`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}

                        </div>

                        <button
                            onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                            disabled={pagination.page * pagination.limit >= totalReportings}
                            className={`px-3 py-1 rounded-md text-sm font-medium ${pagination.page * pagination.limit >= totalReportings ? 'bg-gray-300 dark:bg-slate-600 text-gray-500 dark:text-gray-400 cursor-not-allowed' : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors'}`}
                        >
                            Next
                        </button>


                    </div>

                    <div>
                        <select
                            value={pagination.limit}
                            onChange={(e) => setPagination(prev => ({ ...prev, limit: parseInt(e.target.value) }))}
                            className="ml-3 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        >

                            <option value={10}>10 </option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                        </select>
                    </div>

                </div>
            </div>)}


        </div>
    );






};

export default userReportingPage;
