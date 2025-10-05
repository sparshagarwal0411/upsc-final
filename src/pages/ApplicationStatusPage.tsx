import React, { useState } from 'react';
import { Search, FileText, CheckCircle, Clock, AlertCircle, Download, Eye } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from '../components/AuthModal';

const ApplicationStatusPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [registrationId, setRegistrationId] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [showStatus, setShowStatus] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Fake database with application numbers and dates of birth
  const fakeDatabase = {
    'UPSC240123456': {
      dateOfBirth: '1995-03-15',
      candidateName: 'Priya Sharma',
      examName: 'Civil Services (Preliminary) Examination 2024',
      applicationDate: '2024-02-15',
      status: 'Result Declared',
      percentile: 97.68757,
      rank: 156,
      canViewCertificate: true,
      stages: [
        { name: 'Application Submitted', status: 'completed', date: '2024-02-15' },
        { name: 'Payment Confirmed', status: 'completed', date: '2024-02-15' },
        { name: 'Document Verification', status: 'completed', date: '2024-02-18' },
        { name: 'Admit Card Generated', status: 'completed', date: '2024-04-15' },
        { name: 'Exam Conducted', status: 'completed', date: '2024-05-26' },
        { name: 'Result Declared', status: 'completed', date: '2024-07-15' },
      ],
      examDetails: {
        date: '2024-05-26',
        time: '09:30 AM - 12:30 PM',
        center: 'Delhi - Examination Center 42',
        address: 'Government School, Connaught Place, New Delhi',
      },
    },
    'UPSC240789012': {
      dateOfBirth: '1993-08-22',
      candidateName: 'Rajesh Kumar',
      examName: 'Civil Services (Preliminary) Examination 2024',
      applicationDate: '2024-02-18',
      status: 'Result Declared',
      percentile: 95.2341,
      rank: 1247,
      canViewCertificate: false,
      stages: [
        { name: 'Application Submitted', status: 'completed', date: '2024-02-18' },
        { name: 'Payment Confirmed', status: 'completed', date: '2024-02-18' },
        { name: 'Document Verification', status: 'completed', date: '2024-02-21' },
        { name: 'Admit Card Generated', status: 'completed', date: '2024-04-15' },
        { name: 'Exam Conducted', status: 'completed', date: '2024-05-26' },
        { name: 'Result Declared', status: 'completed', date: '2024-07-15' },
      ],
      examDetails: {
        date: '2024-05-26',
        time: '09:30 AM - 12:30 PM',
        center: 'Mumbai - Examination Center 15',
        address: 'St. Xavier\'s College, Fort, Mumbai',
      },
    },
  };

  // Get application data based on input
  const getApplicationData = () => {
    const data = fakeDatabase[registrationId as keyof typeof fakeDatabase];
    if (data && data.dateOfBirth === dateOfBirth) {
      return data;
    }
    return null;
  };

  const applicationData = getApplicationData();

  const handleStatusCheck = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    
    if (registrationId && dateOfBirth) {
      const data = getApplicationData();
      if (data) {
        setShowStatus(true);
      } else {
        alert('Invalid Registration ID or Date of Birth. Please check your credentials.');
      }
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'pending':
        return <Clock className="text-yellow-500" size={20} />;
      case 'failed':
        return <AlertCircle className="text-red-500" size={20} />;
      default:
        return <Clock className="text-gray-400" size={20} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Application Status</h1>
        <p className="text-gray-600 dark:text-gray-300">Check your application status and download admit card</p>
      </div>

      {/* Status Check Form */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Check Application Status</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Registration ID / Roll Number
            </label>
            <input
              type="text"
              value={registrationId}
              onChange={(e) => setRegistrationId(e.target.value)}
              placeholder="Enter your registration ID"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Date of Birth
            </label>
            <input
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
        
        <button
          onClick={handleStatusCheck}
          disabled={!registrationId || !dateOfBirth}
          className="mt-6 flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Search size={20} className="mr-2" />
          {isAuthenticated ? 'Check Status' : 'Login to Check Status'}
        </button>
      </div>

      {/* Application Status */}
      {showStatus && applicationData && (
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Application Information</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Registration ID</span>
                  <p className="font-semibold text-gray-900 dark:text-white">{registrationId}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Candidate Name</span>
                  <p className="font-semibold text-gray-900 dark:text-white">{applicationData.candidateName}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Examination</span>
                  <p className="font-semibold text-gray-900 dark:text-white">{applicationData.examName}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Current Status</span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 ml-2">
                    {applicationData.status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Result Information */}
          {applicationData.status === 'Result Declared' && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Result Information</h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{applicationData.percentile}%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Percentile</div>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">#{applicationData.rank}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">All India Rank</div>
                </div>
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {applicationData.percentile >= 97 ? 'Qualified' : 'Not Qualified'}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Status</div>
                </div>
              </div>
            </div>
          )}

          {/* Application Progress */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Application Progress</h2>
            
            <div className="space-y-4">
              {applicationData.stages.map((stage, index) => (
                <div key={index} className="flex items-center space-x-4">
                  {getStatusIcon(stage.status)}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className={`font-medium ${
                        stage.status === 'completed' ? 'text-gray-900 dark:text-white' : 
                        stage.status === 'pending' ? 'text-yellow-600 dark:text-yellow-400' : 
                        'text-gray-500 dark:text-gray-400'
                      }`}>
                        {stage.name}
                      </span>
                      {stage.date && (
                        <span className="text-sm text-gray-600 dark:text-gray-400">{stage.date}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Exam Details & Admit Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Exam Details</h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Exam Date</span>
                  <p className="font-semibold text-gray-900 dark:text-white">{applicationData.examDetails.date}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Exam Time</span>
                  <p className="font-semibold text-gray-900 dark:text-white">{applicationData.examDetails.time}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Exam Center</span>
                  <p className="font-semibold text-gray-900 dark:text-white">{applicationData.examDetails.center}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Address</span>
                  <p className="font-semibold text-gray-900 dark:text-white">{applicationData.examDetails.address}</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              {applicationData.status === 'Result Declared' ? (
                <>
                  <button className="flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    <Download size={20} className="mr-2" />
                    Download Result
                  </button>
                  <button className="flex items-center px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <Eye size={20} className="mr-2" />
                    Preview Result
                  </button>
                  {applicationData.canViewCertificate && (
                    <button className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      <FileText size={20} className="mr-2" />
                      View Certificate
                    </button>
                  )}
                  <button className="flex items-center px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <FileText size={20} className="mr-2" />
                    Print Instructions
                  </button>
                </>
              ) : (
                <>
                  <button className="flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    <Download size={20} className="mr-2" />
                    Download Admit Card
                  </button>
                  <button className="flex items-center px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <Eye size={20} className="mr-2" />
                    Preview Admit Card
                  </button>
                  <button className="flex items-center px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <FileText size={20} className="mr-2" />
                    Print Instructions
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Important Instructions */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-6 border border-yellow-200 dark:border-yellow-800">
            <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-3">
              {applicationData.status === 'Result Declared' ? 'Result Information' : 'Important Instructions'}
            </h3>
            <ul className="space-y-2 text-sm text-yellow-700 dark:text-yellow-300">
              {applicationData.status === 'Result Declared' ? (
                <>
                  <li>• Your result has been declared and is available for download</li>
                  <li>• Keep a copy of your result for future reference</li>
                  <li>• If qualified, prepare for the next stage of examination</li>
                  <li>• Contact UPSC helpline for any result-related queries</li>
                  <li>• Certificate will be available only for qualified candidates</li>
                </>
              ) : (
                <>
                  <li>• Carry your admit card and valid photo ID to the exam center</li>
                  <li>• Report to the exam center 30 minutes before the scheduled time</li>
                  <li>• Mobile phones and electronic devices are strictly prohibited</li>
                  <li>• Bring your own pen and pencil (blue/black ink only)</li>
                  <li>• Check the exam center address and plan your route in advance</li>
                </>
              )}
            </ul>
          </div>
        </div>
      )}

      {/* Authentication Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        message="Please login to check your application status. You need to be authenticated to access your personal application information."
      />
    </div>
  );
};

export default ApplicationStatusPage;