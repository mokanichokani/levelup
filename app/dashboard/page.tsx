'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Dashboard() {
  const router = useRouter();
  const [collegeId, setCollegeId] = useState<string | null>(null);
  const [collegeName, setCollegeName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  console.log("hello world");

  useEffect(() => {
    // Check if we're in the browser before accessing localStorage
    if (typeof window !== 'undefined') {
      // Check if college is logged in
      const storedCollegeId = localStorage.getItem('collegeId');
      const storedCollegeName = localStorage.getItem('collegeName');
      
      if (!storedCollegeId) {
        router.push('/login');
        return;
      }
      
      setCollegeId(storedCollegeId);
      setCollegeName(storedCollegeName);
      setIsLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('collegeId');
    localStorage.removeItem('collegeName');
    localStorage.removeItem('collegeEmail');
    router.push('/login');
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <div className='w-full h-full'>
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-indigo-600 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-white text-xl font-bold">College Administration Portal</h1>
            </div>
            <div className="flex items-center">
              <p className="text-white mr-4">{collegeName}</p>
              <button
                onClick={handleLogout}
                className="bg-indigo-700 hover:bg-indigo-800 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Management Dashboard</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900 mb-2">Student Management</h3>
              <div className="mt-5 space-y-4">
                <Link 
                  href="/dashboard/students/bulk-create"
                  className="inline-block w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Individual Student Entries
                </Link>
                <Link 
                  href="/dashboard/students/range-create"
                  className="inline-block w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Range-Based Account Creation
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900 mb-2">Teacher Management</h3>
              <div className="mt-5 space-y-4">
                <Link 
                  href="/dashboard/teachers/add"
                  className="inline-block w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Add Teacher
                </Link>
                <Link 
                  href="/dashboard/teachers"
                  className="inline-block w-full px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-indigo-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Manage Teachers
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900 mb-2">College Administration</h3>
              <div className="mt-5 space-y-4">
                <Link 
                  href="/dashboard/settings"
                  className="inline-block w-full px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-indigo-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  College Settings
                </Link>
                <Link 
                  href="/dashboard/departments"
                  className="inline-block w-full px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-indigo-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Manage Departments
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
    // <div className='text-black'>Hi</div>
  );
} 