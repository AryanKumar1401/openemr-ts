'use client';

import { useQuery } from '@tanstack/react-query';
import { patientService } from '@/services/patients';
import { authService } from '@/services/auth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function DashboardPage() {
    const [searchParams, setSearchParams] = useState({
        fname: '',
        lname: '',
        status: ''
    });
    const router = useRouter();

    const { data: patients, isLoading, error } = useQuery({
        queryKey: ['patients', searchParams],
        queryFn: () => patientService.getPatients(searchParams),
    });

    const handleLogout = async () => {
        await authService.logout();
        router.push('/login');
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        // The query will automatically refetch with new search params
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center">Loading patients...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center text-red-600">Error loading patients</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <h1 className="text-3xl font-bold text-gray-900">OpenEMR Dashboard</h1>
                        <button
                            onClick={handleLogout}
                            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {/* Search Form */}
                <div className="bg-white shadow rounded-lg p-6 mb-6">
                    <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">First Name</label>
                            <input
                                type="text"
                                value={searchParams.fname}
                                onChange={(e) => setSearchParams({ ...searchParams, fname: e.target.value })}
                                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Last Name</label>
                            <input
                                type="text"
                                value={searchParams.lname}
                                onChange={(e) => setSearchParams({ ...searchParams, lname: e.target.value })}
                                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Status</label>
                            <select
                                value={searchParams.status}
                                onChange={(e) => setSearchParams({ ...searchParams, status: e.target.value })}
                                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="">All</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                                <option value="deceased">Deceased</option>
                            </select>
                        </div>
                    </form>
                </div>

                {/* Patients List */}
                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                    <ul className="divide-y divide-gray-200">
                        {patients?.map((patient: any) => (
                            <li key={patient.uuid} className="px-6 py-4 hover:bg-gray-50">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                                <span className="text-sm font-medium text-gray-700">
                                                    {patient.fname?.[0]}{patient.lname?.[0]}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">
                                                {patient.fname} {patient.lname}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                DOB: {patient.DOB} | Sex: {patient.sex} | Status: {patient.status}
                                            </div>
                                            {patient.city && patient.state && (
                                                <div className="text-sm text-gray-500">
                                                    {patient.city}, {patient.state}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">
                                            View
                                        </button>
                                        <button className="text-gray-600 hover:text-gray-900 text-sm font-medium">
                                            Edit
                                        </button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                    {patients?.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            No patients found
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
} 