'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface StudentData {
  firstName: string;
  lastName: string;
  email: string;
  rollNumber: string;
  division: string;
  year: string;
  course: string;
}

export default function BulkCreateStudents() {
  const router = useRouter();
  const [collegeId, setCollegeId] = useState<string | null>(null);
  const [commonPassword, setCommonPassword] = useState('');
  const [students, setStudents] = useState<StudentData[]>([
    { firstName: '', lastName: '', email: '', rollNumber: '', division: '', year: '', course: '' },
  ]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedUsernames, setGeneratedUsernames] = useState<string[]>([]);

  const years = ['FY', 'SY', 'TY', 'Final'];
  const divisions = ['A', 'B', 'C', 'D', 'E', 'F'];
  const courses = ['B.Tech', 'M.Tech', 'BCA', 'MCA', 'BSc', 'MSc', 'BBA', 'MBA'];

  useEffect(() => {
    // Check if college is logged in
    const storedCollegeId = localStorage.getItem('collegeId');
    if (!storedCollegeId) {
      router.push('/login');
      return;
    }
    setCollegeId(storedCollegeId);
  }, [router]);

  const addStudentRow = () => {
    setStudents([
      ...students,
      { firstName: '', lastName: '', email: '', rollNumber: '', division: '', year: '', course: '' },
    ]);
  };

  const removeStudentRow = (index: number) => {
    if (students.length > 1) {
      const updatedStudents = [...students];
      updatedStudents.splice(index, 1);
      setStudents(updatedStudents);
    }
  };

  const handleStudentChange = (index: number, field: keyof StudentData, value: string) => {
    const updatedStudents = [...students];
    updatedStudents[index][field] = value;
    setStudents(updatedStudents);
  };

  const generateUsernames = () => {
    const usernames = students.map(student => {
      if (!student.rollNumber || !student.division || !student.year) {
        return '';
      }
      return `${student.year}${student.division}${student.rollNumber}`;
    });
    
    setGeneratedUsernames(usernames);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs
    if (!commonPassword) {
      setError('Please set a common password for all students');
      return;
    }
    
    // Check if all required fields are filled
    const isValid = students.every(student => 
      student.firstName && 
      student.lastName && 
      student.email && 
      student.rollNumber && 
      student.division && 
      student.year &&
      student.course
    );
    
    if (!isValid) {
      setError('Please fill in all required fields for all students');
      return;
    }
    
    // Generate usernames
    generateUsernames();
    
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
          students: students.map((student, index) => ({
            ...student,
            username: generatedUsernames[index] || `${student.year}${student.division}${student.rollNumber}`,
            password: commonPassword
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create student accounts');
      }

      setSuccess(`Successfully created ${data.createdCount} student accounts!`);
      setStudents([
        { firstName: '', lastName: '', email: '', rollNumber: '', division: '', year: '', course: '' },
      ]);
      setGeneratedUsernames([]);
      setCommonPassword('');
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
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Bulk Create Student Accounts
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
            <div className="mb-6">
              <label htmlFor="commonPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Common Password for All Students
              </label>
              <input
                type="password"
                id="commonPassword"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={commonPassword}
                onChange={(e) => setCommonPassword(e.target.value)}
              />
              <p className="mt-1 text-sm text-gray-500">
                This password will be applied to all student accounts created in this batch.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      First Name
                    </th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Name
                    </th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Roll Number
                    </th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Year
                    </th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Division
                    </th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Course
                    </th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Generated Username
                    </th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {students.map((student, index) => (
                    <tr key={index}>
                      <td className="px-2 py-4 whitespace-nowrap">
                        <input
                          type="text"
                          required
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          value={student.firstName}
                          onChange={(e) => handleStudentChange(index, 'firstName', e.target.value)}
                        />
                      </td>
                      <td className="px-2 py-4 whitespace-nowrap">
                        <input
                          type="text"
                          required
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          value={student.lastName}
                          onChange={(e) => handleStudentChange(index, 'lastName', e.target.value)}
                        />
                      </td>
                      <td className="px-2 py-4 whitespace-nowrap">
                        <input
                          type="email"
                          required
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          value={student.email}
                          onChange={(e) => handleStudentChange(index, 'email', e.target.value)}
                        />
                      </td>
                      <td className="px-2 py-4 whitespace-nowrap">
                        <input
                          type="text"
                          required
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          value={student.rollNumber}
                          onChange={(e) => handleStudentChange(index, 'rollNumber', e.target.value)}
                        />
                      </td>
                      <td className="px-2 py-4 whitespace-nowrap">
                        <select
                          required
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          value={student.year}
                          onChange={(e) => handleStudentChange(index, 'year', e.target.value)}
                        >
                          <option value="">Select Year</option>
                          {years.map((year) => (
                            <option key={year} value={year}>
                              {year}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-2 py-4 whitespace-nowrap">
                        <select
                          required
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          value={student.division}
                          onChange={(e) => handleStudentChange(index, 'division', e.target.value)}
                        >
                          <option value="">Select Division</option>
                          {divisions.map((division) => (
                            <option key={division} value={division}>
                              {division}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-2 py-4 whitespace-nowrap">
                        <select
                          required
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          value={student.course}
                          onChange={(e) => handleStudentChange(index, 'course', e.target.value)}
                        >
                          <option value="">Select Course</option>
                          {courses.map((course) => (
                            <option key={course} value={course}>
                              {course}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-2 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900 font-medium">
                          {generatedUsernames[index] || 
                            (student.year && student.division && student.rollNumber 
                              ? `${student.year}${student.division}${student.rollNumber}` 
                              : 'Will be generated')}
                        </span>
                      </td>
                      <td className="px-2 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          type="button"
                          className="text-red-600 hover:text-red-900"
                          onClick={() => removeStudentRow(index)}
                          disabled={students.length === 1}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={addStudentRow}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Add Another Student
              </button>

              <button
                type="button"
                onClick={generateUsernames}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Preview Usernames
              </button>

              <button
                type="submit"
                disabled={isProcessing}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                {isProcessing ? 'Processing...' : 'Create Student Accounts'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 