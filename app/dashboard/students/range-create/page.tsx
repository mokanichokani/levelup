'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RangeCreateStudents() {
  const router = useRouter();
  const [collegeId, setCollegeId] = useState<string | null>(null);
  const [commonPassword, setCommonPassword] = useState('');
  const [formData, setFormData] = useState({
    year: '',
    department: '',
    startRollNumber: '',
    endRollNumber: '',
    division: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedAccounts, setGeneratedAccounts] = useState<any[]>([]);
  const [previewMode, setPreviewMode] = useState(false);

  const years = ['FY', 'SY', 'TY', 'Final'];
  const divisions = ['A', 'B', 'C', 'D', 'E', 'F'];
  const departments = [
    'Computer Science', 
    'Information Technology', 
    'Electronics', 
    'Mechanical', 
    'Civil', 
    'Electrical', 
    'Physics', 
    'Chemistry', 
    'Mathematics'
  ];

  useEffect(() => {
    // Check if college is logged in
    const storedCollegeId = localStorage.getItem('collegeId');
    if (!storedCollegeId) {
      router.push('/login');
      return;
    }
    setCollegeId(storedCollegeId);
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generatePreview = () => {
    // Validate inputs
    if (!formData.year || !formData.department || !formData.startRollNumber || !formData.endRollNumber || !formData.division) {
      setError('All fields are required');
      return;
    }

    if (!commonPassword) {
      setError('Please set a common password');
      return;
    }

    const startRoll = parseInt(formData.startRollNumber);
    const endRoll = parseInt(formData.endRollNumber);

    if (isNaN(startRoll) || isNaN(endRoll)) {
      setError('Roll numbers must be numeric');
      return;
    }

    if (startRoll > endRoll) {
      setError('Start roll number must be less than or equal to end roll number');
      return;
    }

    if (endRoll - startRoll > 500) {
      setError('Maximum 500 accounts can be created at once');
      return;
    }

    // Generate preview accounts
    const accounts = [];
    for (let roll = startRoll; roll <= endRoll; roll++) {
      const rollStr = roll.toString().padStart(formData.startRollNumber.length, '0');
      const username = `${formData.year}${formData.division}${rollStr}`;
      
      accounts.push({
        firstName: 'Student',
        lastName: rollStr,
        email: `${username.toLowerCase()}@student.college.edu`,
        rollNumber: rollStr,
        division: formData.division,
        year: formData.year,
        department: formData.department,
        username: username
      });
    }

    setGeneratedAccounts(accounts);
    setError('');
    setPreviewMode(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!previewMode) {
      generatePreview();
      return;
    }
    
    if (generatedAccounts.length === 0) {
      setError('No accounts to create');
      return;
    }
    
    setIsProcessing(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/students/bulk-create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-College-ID': collegeId || '',
        },
        body: JSON.stringify({
          students: generatedAccounts.map(student => ({
            ...student,
            password: commonPassword
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create student accounts');
      }

      setSuccess(`Successfully created ${data.createdCount} student accounts!`);
      setFormData({
        year: '',
        department: '',
        startRollNumber: '',
        endRollNumber: '',
        division: ''
      });
      setCommonPassword('');
      setGeneratedAccounts([]);
      setPreviewMode(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create student accounts');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!collegeId) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Range-Based Student Account Creation
          </h2>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6" role="alert">
              <span className="block sm:inline">{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
                  Year
                </label>
                <select
                  id="year"
                  name="year"
                  required
                  disabled={previewMode}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={formData.year}
                  onChange={handleInputChange}
                >
                  <option value="">Select Year</option>
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="division" className="block text-sm font-medium text-gray-700 mb-1">
                  Division
                </label>
                <select
                  id="division"
                  name="division"
                  required
                  disabled={previewMode}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={formData.division}
                  onChange={handleInputChange}
                >
                  <option value="">Select Division</option>
                  {divisions.map((division) => (
                    <option key={division} value={division}>
                      {division}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                  Department
                </label>
                <select
                  id="department"
                  name="department"
                  required
                  disabled={previewMode}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={formData.department}
                  onChange={handleInputChange}
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="commonPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Common Password
                </label>
                <input
                  type="password"
                  id="commonPassword"
                  name="commonPassword"
                  required
                  disabled={previewMode}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={commonPassword}
                  onChange={(e) => setCommonPassword(e.target.value)}
                  placeholder="Password for all accounts"
                />
              </div>

              <div>
                <label htmlFor="startRollNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Starting Roll Number
                </label>
                <input
                  type="text"
                  id="startRollNumber"
                  name="startRollNumber"
                  required
                  disabled={previewMode}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={formData.startRollNumber}
                  onChange={handleInputChange}
                  placeholder="e.g. 001"
                />
              </div>

              <div>
                <label htmlFor="endRollNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Ending Roll Number
                </label>
                <input
                  type="text"
                  id="endRollNumber"
                  name="endRollNumber"
                  required
                  disabled={previewMode}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={formData.endRollNumber}
                  onChange={handleInputChange}
                  placeholder="e.g. 060"
                />
              </div>
            </div>

            {previewMode && generatedAccounts.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Preview: {generatedAccounts.length} accounts will be created
                </h3>
                <div className="max-h-64 overflow-y-auto border rounded-md">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Username
                        </th>
                        <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Roll Number
                        </th>
                        <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {generatedAccounts.map((account, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                            {account.username}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                            {account.rollNumber}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                            {account.email}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="flex justify-between mt-8">
              {previewMode ? (
                <>
                  <button
                    type="button"
                    onClick={() => setPreviewMode(false)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Back to Edit
                  </button>
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    {isProcessing ? 'Processing...' : `Create ${generatedAccounts.length} Accounts`}
                  </button>
                </>
              ) : (
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Preview Accounts
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 