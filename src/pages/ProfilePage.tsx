import React, { useState, useEffect } from 'react';
import { 
  User, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  FileText,
  Download,
  Award,
  TrendingUp,
  BarChart3,
  PieChart,
  Activity,
  Target,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Swal from 'sweetalert2';

interface Application {
  id: string;
  examName: string;
  applicationDate: string;
  status: string;
  percentile?: number;
  rank?: number;
  qualified?: boolean;
  canViewCertificate?: boolean;
  examDate?: string;
  resultDate?: string;
  admitCardAvailable?: boolean;
  certificate_id?: string;
  certificate?: {
    valid: boolean;
    email: string;
    exam: string;
    rank: number;
    ipfs_url: string;
    issued_on: string;
  };
}

interface UserDetails {
  id: string;
  name: string;
  email: string;
  phone?: string;
  mobile_number?: string;
  upscId?: string;
  isVerified: boolean;
  fatherName?: string;
  motherName?: string;
  address?: string;
  city?: string;
  district?: string;
  state?: string;
  pincode?: string;
}

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [activeTab, setActiveTab] = useState('past-results');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generatingCertificates, setGeneratingCertificates] = useState<{[key: string]: boolean}>({});
  const [verifyingCertificates, setVerifyingCertificates] = useState<{[key: string]: boolean}>({});
  const [generatingAdmitCards, setGeneratingAdmitCards] = useState<{[key: string]: boolean}>({});

  // Fetch user details and applications
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        if (!token) {
          setError("No authentication token found");
          return;
        }

        // Fetch user details
        const userRes = await fetch("https://igdt.adityaexp.dev/api/user", {
          headers: { Authorization: token },
        });

        if (!userRes.ok) {
          throw new Error("Failed to fetch user details");
        }

        const userData = await userRes.json();
        setUserDetails(userData.user);

        // Fetch applications
        const appsRes = await fetch("https://igdt.adityaexp.dev/api/getApplications", {
          headers: {
            Authorization: token,
          },
        });

        if (!appsRes.ok) {
          throw new Error("Failed to fetch applications");
        }

        const appsData = await appsRes.json();
        const applications = appsData.applications || [];
        setApplications(applications);

        // Verify certificates for qualified applications
        const qualifiedApps = applications.filter(app => 
          app.qualified === true && app.certificate_id
        );
        
        for (const app of qualifiedApps) {
          await verifyCertificate(app);
        }

      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load profile data. Please try again.',
          confirmButtonText: 'OK'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Result Declared':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'Under Review':
        return <Clock className="text-yellow-500" size={20} />;
      case 'Rejected':
        return <AlertCircle className="text-red-500" size={20} />;
      default:
        return <Clock className="text-gray-400" size={20} />;
    }
  };

  const getQualificationBadge = (qualified: boolean) => {
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
        qualified 
          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
          : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
      }`}>
        {qualified ? 'Qualified' : 'Not Qualified'}
      </span>
    );
  };

  const handleLogout = () => {
    logout();
  };

  const refreshData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem("token");
      
      // Fetch user details
      const userRes = await fetch("https://igdt.adityaexp.dev/api/user", {
        headers: { Authorization: token },
      });
      const userData = await userRes.json();
      setUserDetails(userData.user);

      // Fetch applications
      const appsRes = await fetch("https://igdt.adityaexp.dev/api/getApplications", {
        headers: { Authorization: token },
      });
      const appsData = await appsRes.json();
      setApplications(appsData.applications || []);

    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const generateCertificate = async (application: Application) => {
    try {
      setGeneratingCertificates(prev => ({ ...prev, [application.id]: true }));
      
      const token = localStorage.getItem("token");
      
      const response = await fetch("https://igdt.adityaexp.dev/api/generateCertificate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token
        },
        body: JSON.stringify({
          exam: application.examName,
          rank: application.rank,
          name: userDetails?.full_name,
          certificate_id: application.certificate_id
        })
      });

      const data = await response.json();

                      // <p><strong>Certificate ID:</strong> ${data.certificate_id}</p>
                // <p><strong>IPFS CID:</strong> ${data.ipfs_cid}</p>

      if (response.ok) {
        await Swal.fire({
          icon: 'success',
          title: 'Certificate Generated!',
          html: `
            <div class="text-left">
              <p class="mb-2">Certificate has been generated and uploaded successfully!</p>
              <div class="space-y-1 text-sm">

              
              </div>
              <div class="mt-3">
                <a href="${data.ipfs_url}" target="_blank" 
                   class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Download className="h-4 w-4 mr-2" />
                  View Certificate
                </a>
              </div>
            </div>
          `,
          confirmButtonText: 'Close'
        });
      } else {
        throw new Error(data.error || 'Failed to generate certificate');
      }

    } catch (error) {
      console.error('Error generating certificate:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Certificate Generation Failed',
        text: error instanceof Error ? error.message : 'Failed to generate certificate. Please try again.',
        confirmButtonText: 'OK'
      });
    } finally {
      setGeneratingCertificates(prev => ({ ...prev, [application.id]: false }));
    }
  };

  const verifyCertificate = async (application: Application) => {
    if (!application.certificate_id) return;

    try {
      setVerifyingCertificates(prev => ({ ...prev, [application.id]: true }));
      
      const token = localStorage.getItem("token");
      
      const response = await fetch(`https://igdt.adityaexp.dev/api/verifyCertificate/${application.certificate_id}`, {
        method: "GET",
        headers: {
          "Authorization": token
        }
      });

      const data = await response.json();

      if (response.ok && data.valid) {
        // Update the application with certificate info
        setApplications(prev => prev.map(app => 
          app.id === application.id 
            ? { ...app, certificate: data }
            : app
        ));
      }

    } catch (error) {
      console.error('Error verifying certificate:', error);
    } finally {
      setVerifyingCertificates(prev => ({ ...prev, [application.id]: false }));
    }
  };

  const generateAdmitCard = async (application: Application) => {
    try {
      setGeneratingAdmitCards(prev => ({ ...prev, [application.id]: true }));
      
      const token = localStorage.getItem("token");
      
      // Prepare user data for admit card generation
      // console.log(userDetails);
      // console.log(user);
      const admitCardData = {
        full_name: userDetails?.full_name,
        father_name: userDetails?.father_name || '',
        mother_name: userDetails?.mother_name || '',
        mobile_number: userDetails?.phone || userDetails?.mobile_number || '',
        complete_address: userDetails?.complete_address || '',
        city: userDetails?.city || '',
        district: userDetails?.district || '',
        state: userDetails?.state || '',
        pincode: userDetails?.pincode || ''
      };

      const response = await fetch("https://igdt.adityaexp.dev/api/generateAdmitCard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token
        },
        body: JSON.stringify(admitCardData)
      });

      if (response.ok) {
        // Get the image blob
        const imageBlob = await response.blob();
        const imageUrl = URL.createObjectURL(imageBlob);
        
        // Create download link
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = `${userDetails?.full_name || 'admit_card'}_${application.id}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up the URL
        URL.revokeObjectURL(imageUrl);

        await Swal.fire({
          icon: 'success',
          title: 'Admit Card Generated!',
          text: 'Your admit card has been generated and downloaded successfully.',
          confirmButtonText: 'OK'
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate admit card');
      }

    } catch (error) {
      console.error('Error generating admit card:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Admit Card Generation Failed',
        text: error instanceof Error ? error.message : 'Failed to generate admit card. Please try again.',
        confirmButtonText: 'OK'
      });
    } finally {
      setGeneratingAdmitCards(prev => ({ ...prev, [application.id]: false }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Error Loading Profile</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={refreshData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Welcome, {userDetails?.full_name || user?.name}
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {userDetails?.email || user?.email}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={refreshData}
                className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title="Refresh Data"
              >
                <RefreshCw size={18} />
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('past-results')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'past-results'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Past Results
            </button>
            <button
              onClick={() => setActiveTab('current-applications')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'current-applications'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Current Applications
            </button>
            <button
              onClick={() => setActiveTab('statistics')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'statistics'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Statistics
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'past-results' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Past Results</h2>
            {applications.filter(app => app.status === 'Result Declared').length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No past results available</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {applications
                  .filter(app => app.status === 'Result Declared')
                  .map((application) => (
                    <div key={application.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            {getStatusIcon(application.status)}
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {application.examName}
                            </h3>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Application ID</p>
                              <p className="font-medium text-gray-900 dark:text-white">{application.id}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Exam Date</p>
                              <p className="font-medium text-gray-900 dark:text-white">{application.examDate}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Result Date</p>
                              <p className="font-medium text-gray-900 dark:text-white">{application.resultDate}</p>
                            </div>
                          </div>
                          {application.qualified !== null && (
                            <div className="flex items-center space-x-4">
                              {getQualificationBadge(application.qualified)}
                              {application.percentile && (
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                  Percentile: {application.percentile}%
                                </span>
                              )}
                              {application.rank && (
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                  Rank: {application.rank}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                        {application.canViewCertificate && (
                          <div className="flex flex-col space-y-2">
                            {application.certificate ? (
                              // Certificate exists - show certificate info
                              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                                <div className="flex items-center space-x-2 mb-2">
                                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                                  <span className="text-sm font-medium text-green-800 dark:text-green-300">
                                    Certificate Available
                                  </span>
                                </div>
                                <div className="space-y-1 text-sm text-green-700 dark:text-green-300">
                                  <p><strong>Issued:</strong> {new Date(application.certificate.issued_on).toLocaleDateString()}</p>
                                  <p><strong>Certificate ID:</strong> {application.certificate_id}</p>
                                </div>
                                <div className="mt-3">
                                  <a 
                                    href={application.certificate.ipfs_url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                  >
                                    <Download size={16} />
                                    <span>View Certificate</span>
                                  </a>
                                </div>
                              </div>
                            ) : (
                              // No certificate - show generate button
                              <button 
                                onClick={() => generateCertificate(application)}
                                disabled={generatingCertificates[application.id] || verifyingCertificates[application.id]}
                                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {generatingCertificates[application.id] ? (
                                  <RefreshCw size={16} className="animate-spin" />
                                ) : (
                                  <Download size={16} />
                                )}
                                <span>
                                  {generatingCertificates[application.id] ? 'Generating...' : 
                                   verifyingCertificates[application.id] ? 'Checking...' : 
                                   'Generate Certificate'}
                                </span>
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'current-applications' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Current Applications</h2>
            {applications.filter(app => app.status !== 'Result Declared').length === 0 ? (
              <div className="text-center py-12">
                <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No current applications</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {applications
                  .filter(app => app.status !== 'Result Declared')
                  .map((application) => (
                    <div key={application.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            {getStatusIcon(application.status)}
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {application.examName}
                            </h3>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Application ID</p>
                              <p className="font-medium text-gray-900 dark:text-white">{application.id}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Application Date</p>
                              <p className="font-medium text-gray-900 dark:text-white">{application.applicationDate}</p>
                            </div>
                            {application.examDate && (
                              <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Exam Date</p>
                                <p className="font-medium text-gray-900 dark:text-white">{application.examDate}</p>
                              </div>
                            )}
                          </div>
                          {application.admitCardAvailable && (
                            <button 
                              onClick={() => generateAdmitCard(application)}
                              disabled={generatingAdmitCards[application.id]}
                              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {generatingAdmitCards[application.id] ? (
                                <RefreshCw size={16} className="animate-spin" />
                              ) : (
                                <Download size={16} />
                              )}
                              <span>
                                {generatingAdmitCards[application.id] ? 'Generating...' : 'Generate Admit Card'}
                              </span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'statistics' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Applications</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{applications.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Qualified</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {applications.filter(app => app.qualified === true).length}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                    <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {applications.filter(app => app.status !== 'Result Declared').length}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <Award className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Success Rate</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {applications.length > 0 
                        ? Math.round((applications.filter(app => app.qualified === true).length / applications.length) * 100)
                        : 0}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
