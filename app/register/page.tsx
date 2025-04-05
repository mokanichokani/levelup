'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    collegeName: '',
    registrationNumber: '',
    email: '',
    phoneNumber: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    principalName: '',
    principalEmail: '',
    principalPhone: '',
    controllerName: '',
    controllerEmail: '',
    controllerPhone: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Registration failed');
      }

      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            College Registration
          </h2>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* College Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">College Information</h3>
              
              <div>
                <label htmlFor="collegeName" className="block text-sm font-medium text-gray-700">College Name</label>
                <input
                  type="text"
                  id="collegeName"
                  name="collegeName"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={formData.collegeName}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="registrationNumber" className="block text-sm font-medium text-gray-700">College Registration Number</label>
                <input
                  type="text"
                  id="registrationNumber"
                  name="registrationNumber"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={formData.registrationNumber}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">College Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">College Phone Number</label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">College Address</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    value={formData.city}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700">State</label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    value={formData.state}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">ZIP Code</label>
                  <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    value={formData.zipCode}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Principal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Principal Information</h3>
              
              <div>
                <label htmlFor="principalName" className="block text-sm font-medium text-gray-700">Principal Name</label>
                <input
                  type="text"
                  id="principalName"
                  name="principalName"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={formData.principalName}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="principalEmail" className="block text-sm font-medium text-gray-700">Principal Email</label>
                <input
                  type="email"
                  id="principalEmail"
                  name="principalEmail"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={formData.principalEmail}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="principalPhone" className="block text-sm font-medium text-gray-700">Principal Phone</label>
                <input
                  type="tel"
                  id="principalPhone"
                  name="principalPhone"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={formData.principalPhone}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Controller of Examination Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Controller of Examination Information</h3>
              
              <div>
                <label htmlFor="controllerName" className="block text-sm font-medium text-gray-700">Controller Name</label>
                <input
                  type="text"
                  id="controllerName"
                  name="controllerName"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={formData.controllerName}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="controllerEmail" className="block text-sm font-medium text-gray-700">Controller Email</label>
                <input
                  type="email"
                  id="controllerEmail"
                  name="controllerEmail"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={formData.controllerEmail}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="controllerPhone" className="block text-sm font-medium text-gray-700">Controller Phone</label>
                <input
                  type="tel"
                  id="controllerPhone"
                  name="controllerPhone"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={formData.controllerPhone}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Account Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Account Information</h3>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className="w-full md:w-auto px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Register College
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}