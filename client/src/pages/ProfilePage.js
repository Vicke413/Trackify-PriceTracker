import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const ProfilePage = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          setError('Authentication token not found. Please login again.');
          setLoading(false);
          return;
        }
        
        const response = await axios.get('/api/users/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setUserData(prevState => ({
          ...prevState,
          name: response.data.name,
          email: response.data.email
        }));
        
        setLoading(false);
      } catch (error) {
        const errorMsg = error.response?.data?.message || 'Failed to fetch user profile';
        setError(errorMsg);
        console.error('Error fetching user profile:', error);
        setLoading(false);
      }
    };
    
    fetchUserProfile();
  }, []);
  
  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    
    // Simple validation
    if (!userData.name.trim()) {
      toast.error('Name cannot be empty');
      return;
    }
    
    try {
      setUpdateLoading(true);
      
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast.error('Authentication token not found. Please login again.');
        setUpdateLoading(false);
        return;
      }
      
      const response = await axios.put(
        '/api/users/profile',
        { name: userData.name },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      toast.success('Profile updated successfully');
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to update profile';
      toast.error(errorMsg);
      console.error('Error updating profile:', error);
    } finally {
      setUpdateLoading(false);
    }
  };
  
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    
    // Password validation
    if (!userData.currentPassword || !userData.newPassword || !userData.confirmNewPassword) {
      toast.error('All password fields are required');
      return;
    }
    
    if (userData.newPassword !== userData.confirmNewPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    if (userData.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }
    
    try {
      setUpdateLoading(true);
      
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast.error('Authentication token not found. Please login again.');
        setUpdateLoading(false);
        return;
      }
      
      const response = await axios.put(
        '/api/users/password',
        {
          currentPassword: userData.currentPassword,
          newPassword: userData.newPassword
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      // Clear password fields after successful update
      setUserData({
        ...userData,
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
      });
      
      toast.success('Password updated successfully');
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to update password';
      toast.error(errorMsg);
      console.error('Error updating password:', error);
    } finally {
      setUpdateLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 w-full max-w-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">User Profile</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Update your personal information and password
            </p>
          </div>
          
          <div className="border-t border-gray-200">
            <form onSubmit={handleProfileUpdate} className="px-4 py-5 sm:p-6">
              <div className="grid grid-cols-6 gap-6">
                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    autoComplete="name"
                    value={userData.name}
                    onChange={handleChange}
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>

                <div className="col-span-6 sm:col-span-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email address
                  </label>
                  <input
                    type="text"
                    name="email"
                    id="email"
                    autoComplete="email"
                    value={userData.email}
                    disabled
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md bg-gray-50"
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    Email cannot be changed
                  </p>
                </div>
              </div>
              
              <div className="mt-6">
                <button
                  type="submit"
                  disabled={updateLoading}
                  className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    updateLoading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {updateLoading ? 'Updating...' : 'Update Profile'}
                </button>
              </div>
            </form>
          </div>
          
          <div className="border-t border-gray-200">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Change Password</h3>
            </div>
            <form onSubmit={handlePasswordUpdate} className="px-4 py-5 sm:p-6">
              <div className="grid grid-cols-6 gap-6">
                <div className="col-span-6 sm:col-span-4">
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                    Current Password
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    id="currentPassword"
                    autoComplete="current-password"
                    value={userData.currentPassword}
                    onChange={handleChange}
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>

                <div className="col-span-6 sm:col-span-4">
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    id="newPassword"
                    autoComplete="new-password"
                    value={userData.newPassword}
                    onChange={handleChange}
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>

                <div className="col-span-6 sm:col-span-4">
                  <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirmNewPassword"
                    id="confirmNewPassword"
                    autoComplete="new-password"
                    value={userData.confirmNewPassword}
                    onChange={handleChange}
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
              
              <div className="mt-6">
                <button
                  type="submit"
                  disabled={updateLoading}
                  className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    updateLoading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {updateLoading ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 