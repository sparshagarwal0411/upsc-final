import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Save, 
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Swal from 'sweetalert2';

interface UserDetails {
  id: string;
  name: string;
  email: string;
  phone?: string;
  upscId?: string;
  isVerified: boolean;
}

const SettingsPage: React.FC = () => {
  const { user, refreshAuthState } = useAuth();
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    newEmail: '',
    newPhone: '',
    currentPassword: ''
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  // Fetch user details on component mount
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        if (!token) {
          setErrors({ general: "No authentication token found" });
          return;
        }

        const userRes = await fetch("https://igdt.adityaexp.dev/api/user", {
          headers: { Authorization: token },
        });

        if (!userRes.ok) {
          throw new Error("Failed to fetch user details");
        }

        const userData = await userRes.json();
        setUserDetails(userData.user);
        
        // Set current values as placeholders
        setFormData(prev => ({
          ...prev,
          newEmail: userData.user.email || '',
          newPhone: userData.user.phone || userData.user.mobile_number || ''
        }));

      } catch (err) {
        console.error("Error fetching user details:", err);
        setErrors({ general: err instanceof Error ? err.message : "An error occurred" });
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    // Email validation
    if (formData.newEmail && formData.newEmail !== userDetails?.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.newEmail)) {
        newErrors.newEmail = 'Please enter a valid email address';
      }
    }

    // Phone validation
    if (formData.newPhone && formData.newPhone !== userDetails?.phone) {
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      if (!phoneRegex.test(formData.newPhone.replace(/\s/g, ''))) {
        newErrors.newPhone = 'Please enter a valid phone number';
      }
    }

    // Check if at least one field is being updated
    const emailChanged = formData.newEmail && formData.newEmail !== userDetails?.email;
    const phoneChanged = formData.newPhone && formData.newPhone !== userDetails?.phone;
    
    if (!emailChanged && !phoneChanged) {
      newErrors.general = 'Please provide at least one field to update';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSaving(true);
    
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        throw new Error("No authentication token found");
      }

      // Prepare data for API
      const updateData: {newEmail?: string; newPhone?: string} = {};
      
      if (formData.newEmail && formData.newEmail !== userDetails?.email) {
        updateData.newEmail = formData.newEmail;
      }
      
      if (formData.newPhone && formData.newPhone !== userDetails?.phone) {
        updateData.newPhone = formData.newPhone;
      }

      const response = await fetch("https://igdt.adityaexp.dev/api/updateContact", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token,
        },
        body: JSON.stringify(updateData),
      });

      const result = await response.json();

      if (response.ok) {
        // If email was updated and we got a new token, update it
        if (result.newToken) {
          localStorage.setItem('token', result.newToken);
          // Update user data in localStorage
          const updatedUserData = {
            ...userDetails,
            email: formData.newEmail || userDetails?.email,
            phone: formData.newPhone || userDetails?.phone
          };
          localStorage.setItem('user', JSON.stringify(updatedUserData));
          // Refresh auth state
          refreshAuthState();
        }

        await Swal.fire({
          icon: 'success',
          title: 'Settings Updated!',
          text: result.message || 'Your contact information has been updated successfully.',
          confirmButtonText: 'OK'
        });

        // Update local state
        setUserDetails(prev => prev ? {
          ...prev,
          email: formData.newEmail || prev.email,
          phone: formData.newPhone || prev.phone
        } : null);

      } else {
        throw new Error(result.error || 'Failed to update contact information');
      }

    } catch (error) {
      console.error('Error updating contact:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: error instanceof Error ? error.message : 'Failed to update contact information. Please try again.',
        confirmButtonText: 'OK'
      });
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setFormData({
      newEmail: userDetails?.email || '',
      newPhone: userDetails?.phone || '',
      currentPassword: ''
    });
    setErrors({});
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-6">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="text-white" size={24} />
            </div>
            <div className="ml-4">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
              <p className="text-gray-600 dark:text-gray-400">Manage your account information</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Contact Information</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">Update your email address and phone number</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* General Error */}
            {errors.general && (
              <div className="flex items-center space-x-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <p className="text-sm text-red-700 dark:text-red-300">{errors.general}</p>
              </div>
            )}

            {/* Current Information Display */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Current Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Email:</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{userDetails?.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Phone:</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{userDetails?.phone || 'Not provided'}</span>
                </div>
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="newEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                New Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  id="newEmail"
                  name="newEmail"
                  value={formData.newEmail}
                  onChange={handleInputChange}
                  placeholder={userDetails?.email || "Enter your email address"}
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                    errors.newEmail 
                      ? 'border-red-300 dark:border-red-600' 
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                  autoComplete="email"
                  inputMode="email"
                />
              </div>
              {errors.newEmail && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.newEmail}</p>
              )}
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Leave empty to keep current email address
              </p>
            </div>

            {/* Phone Field */}
            <div>
              <label htmlFor="newPhone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                New Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="tel"
                  id="newPhone"
                  name="newPhone"
                  value={formData.newPhone}
                  onChange={handleInputChange}
                  placeholder={userDetails?.phone || "Enter your phone number"}
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                    errors.newPhone 
                      ? 'border-red-300 dark:border-red-600' 
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                  autoComplete="tel"
                  inputMode="tel"
                  pattern="[\+]?[1-9][\d]{0,15}"
                />
              </div>
              {errors.newPhone && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.newPhone}</p>
              )}
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Leave empty to keep current phone number
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Reset
              </button>
              
              <div className="flex items-center space-x-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Additional Settings Sections */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Account Security */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Account Security</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Your account is secure</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Email Verified</span>
                <span className="text-sm font-medium text-green-600 dark:text-green-400">✓ Verified</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Account Status</span>
                <span className="text-sm font-medium text-green-600 dark:text-green-400">Active</span>
              </div>
            </div>
          </div>

          {/* Profile Information */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Profile Info</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Basic account details</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Name</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{userDetails?.full_name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">User ID</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{userDetails?.upscId || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
